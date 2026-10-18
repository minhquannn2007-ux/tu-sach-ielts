#!/usr/bin/env python3
"""Recover logical note items and native typography without PDF-width line breaks."""
import re,fitz,json,statistics
from pathlib import Path
MARKER=re.compile(r'^([•●▪◦˗–—−\uf0b7-])\s*')
GAP=re.compile(r'(\d+)\s*(?:[.\u2026]{3,}|_{3,})')

def normalize_table_cell(text):
 text=re.sub(r'(?<=\w)-\s*\n\s*(?=\w)','-',text)
 return re.sub(r'(?<!\n)\n(?!\n)(?!\s*[•●▪◦˗–—−\uf0b7-])',' ',text)

def _raw_lines(page):
 out=[]
 for block in page.get_text('rawdict')['blocks']:
  for line in block.get('lines',[]):
   chars=[]
   for span in line['spans']:
    bold=bool('Bold' in span['font'] or span.get('flags',0)&16)
    italic=bool('Italic' in span['font'] or span.get('flags',0)&2)
    for char in span['chars']:chars.append({**char,'bold':bold,'italic':italic,'size':span['size']})
   if not any(c['c'].strip() for c in chars):continue
   text=''.join(c['c'] for c in chars).strip()
   if text.isdigit() and (line['bbox'][1]<page.rect.height*.09 or line['bbox'][1]>page.rect.height*.95):continue
   out.append({'chars':chars,'y':line['bbox'][1]})
 out.sort(key=lambda l:l['y']);merged=[]
 for line in out:
  if merged and abs(line['y']-merged[-1]['y'])<3:merged[-1]['chars'].extend(line['chars'])
  else:merged.append({'chars':line['chars'][:],'y':line['y']})
 for line in merged:
  line['chars'].sort(key=lambda c:c['bbox'][0])
  while line['chars'] and not line['chars'][0]['c'].strip():line['chars'].pop(0)
  while line['chars'] and not line['chars'][-1]['c'].strip():line['chars'].pop()
  line['text']=''.join(c['c'] for c in line['chars'])
  line['x']=line['chars'][0]['bbox'][0];line['right']=line['chars'][-1]['bbox'][2]
 return merged

def _runs(chars,start,end):
 text=''.join(c['c'] for c in chars);replaced={}
 for m in GAP.finditer(text):
  if start<=int(m[1])<=end:replaced[m.start()]=m
 out=[];i=0
 def add(text,style):
  if out and {k:v for k,v in out[-1].items() if k!='text'}==style:out[-1]['text']+=text
  else:out.append({'text':text,**style})
 while i<len(chars):
  if i in replaced:
   m=replaced[i];add('{{'+m[1]+'}}',{});i=m.end();continue
  c=chars[i];style={k:True for k in ['bold','italic'] if c[k]}
  # PDF alignment spaces are geometry, not literal padding in the answer pane.
  if c['c'].isspace():
   if out and not out[-1]['text'].endswith(' '):add(' ',style)
  else:add(c['c'],style)
  i+=1
 return [r for r in out if r['text']]

def _append_runs(target,runs):
 if target and runs:
  last=target[-1]['text'].rstrip();first=runs[0]['text'].lstrip()
  space='' if (last.endswith('-') and first[:1].islower()) or first[:1] in ',.;:!?)' else ' '
  target[-1]['text']=last
  if space:target.append({'text':space})
  runs[0]['text']=first
 target.extend(runs)

def logical_notes(lines,base,font,width,start,end):
 out=[];previous=None
 for line in lines:
  chars=line['chars'];text=line['text'];marker=MARKER.match(text)
  content=chars[marker.end():] if marker else chars
  if not content:continue
  bold=all(c['bold'] for c in content if c['c'].strip()) and not GAP.search(text)
  center=(line['x']+line['right'])/2
  centered=bold and abs(center-width/2)<35 and (line['x']>base+font*2 or max(c['size'] for c in content)>font*1.1)
  x=content[0]['bbox'][0];run=_runs(content,start,end)
  gap=line['y']-previous['y'] if previous else font*1.75
  # Only an aligned unmarked continuation can join an existing item.
  # Every bullet, including the mathematical minus glyph, begins its own row.
  continuation=bool(out and not marker and not centered and not bold and not out[-1].get('_heading') and gap<=font*2 and abs(x-out[-1]['_contentX'])<=font*1.1)
  if continuation:
   row=out[-1];_append_runs(row['runs'],run);row['_contentX']=x
   if row.get('marker'):
    row['hanging']=round((x-row['_markerX'])/font,3)
    row['firstLine']=round((row['_firstX']-x)/font,3)
  else:
   row={'runs':run,'indent':0 if centered else max(0,round((line['x']-base)/font,3)), 'spaceBefore':max(0,round((gap-font*1.75)/font,2)), '_contentX':x,'_firstX':x,'_markerX':line['x'],'_heading':bold}
   if centered:row['align']='center'
   if marker:row.update(marker=('•' if marker[1]=='\uf0b7' else marker[1]),hanging=max(.5,round((x-line['x'])/font,3)),firstLine=0)
   out.append(row)
  previous=line
 for row in out:
  for key in [k for k in row if k.startswith('_')]:del row[key]
 return out

def extract_notes(doc,start,end):
 pattern=re.compile(r'Questions?\s+'+str(start)+(r'\s*[–—-]\s*'+str(end) if start!=end else r'\b'))
 rows=[];base=None;width=None
 for page in doc:
  lines=_raw_lines(page);match=next((i for i,l in enumerate(lines) if pattern.search(l['text'])),None)
  if match is None:continue
  sheet=next((i for i,l in enumerate(lines[match:],match) if 'answer sheet' in l['text']),None)
  if sheet is None:raise ValueError('Note source boundary missing')
  base=lines[match]['x'];width=page.rect.width
  for line in lines[sheet+1:]:
   if re.match(r'^Questions?\s+\d+\b',line['text']):break
   if re.match(r'^(Turn over|©|Copyright)',line['text']):continue
   rows.append(line)
  break
 if not rows:raise ValueError('Native note layout missing; hold for visual transcription')
 if any(re.search(r'[•●▪]',row['text']) and not MARKER.match(row['text']) for row in rows):raise ValueError('Parallel note columns need source-specific layout review')
 sizes=[c['size'] for l in rows for c in l['chars'] if c['c'].strip() and not c['bold']]
 font=statistics.median(sizes) if sizes else 12
 # Merge a centered title spanning more than one source line.
 first=rows[0];bold=all(c['bold'] for c in first['chars'] if c['c'].strip());center=(first['x']+first['right'])/2
 is_title=bold and (max(c['size'] for c in first['chars'])>font*1.1 or abs(center-width/2)<35) and not GAP.search(first['text'])
 title=None;align='left'
 if is_title:
  title=rows.pop(0)['text'];align='center' if abs(center-width/2)<35 else 'left';last=first
  while rows:
   nxt=rows[0];nc=(nxt['x']+nxt['right'])/2
   if not (align=='center' and all(c['bold'] for c in nxt['chars'] if c['c'].strip()) and abs(nc-width/2)<35 and nxt['y']-last['y']<=max(c['size'] for c in last['chars'])*1.6):break
   title+=' '+rows.pop(0)['text'];last=nxt
 return {'title':title,'titleAlign':align,'rows':logical_notes(rows,base,font,width,start,end),'sourceVerified':False,'layoutVersion':2}

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--cache',type=Path,required=True);p.add_argument('--lessons',type=Path,required=True);a=p.parse_args()
 for path in a.lessons.glob('*.json'):
  d=json.loads(path.read_text());changed=False
  for g in d['groups']:
   if g['type']!='notes' or g.get('table'):continue
   with fitz.open(a.cache/(d['sources'][0]['id']+'.pdf')) as doc:
    ns=[q['n'] for q in g['questions']];layout=extract_notes(doc,min(ns),max(ns))
   g['noteLayout']=layout;g['title']=layout['title'];g['content']=[''.join(r['text'] for r in row['runs']) for row in layout['rows']];changed=True
   found=[int(n) for n in re.findall(r'\{\{(\d+)\}\}', ' '.join(g['content']))]
   if found!=ns:raise ValueError('Source note gap mismatch '+d['id'])
  if changed:path.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print('LAYOUT',d['id'])
