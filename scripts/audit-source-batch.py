#!/usr/bin/env python3
"""Read-only source comparisons and PDF contact sheets; never approves lessons."""
import argparse,json,re,unicodedata,fitz,importlib.util
from pathlib import Path
from PIL import Image,ImageDraw
p=argparse.ArgumentParser();p.add_argument('--batch',type=Path,required=True);p.add_argument('--cache',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--selection',type=Path);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True)
root=Path(__file__).resolve().parents[1];s=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
norm=lambda t:re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',t).encode('ascii','ignore').decode().lower())
aud=[];tasks=[];titles=[]
for r in (json.load(open(a.selection)) if a.selection else json.load(open(a.batch/'batch-report.json'))['results']):
 if r['status']!='ready-for-review':continue
 d=json.load(open(a.batch/r['draft']));doc=fitz.open(a.cache/(r['sourceId']+'.pdf'));raw='\n'.join(m.strip_page_number(p) for p in doc);nr=norm(raw);reading_nr=norm('\n'.join(line for line in raw.splitlines() if norm(line)!=norm(d['title'])));issues=[]
 for footnote in d.get('footnotes',[]):reading_nr=reading_nr.replace(norm(footnote),'')
 for para in d['paragraphs']:
  if norm(para['text']) not in reading_nr:issues.append('reading text')
 for t in [d['title'],d.get('subtitle',''),*d.get('footnotes',[])]:
  if t and norm(t) not in nr:issues.append('title/subtitle/footnote')
 for g in d['groups']:
  for q in g.get('questions',[]):
   if q.get('prompt') and norm(q['prompt']) not in nr:issues.append('question '+str(q['n']))
  banks=[g.get('bank',[]),g.get('options',[])]+[q.get('options',[]) for q in g.get('questions',[])]
  for bank in banks:
   for o in bank:
    if norm(o['text']) not in nr:issues.append('option '+o['value'])
  for t in [g.get('title') or '',*g.get('content',[]),*[c for row in g.get('table',[]) for c in row]]:
   clean=re.sub(r'\{\{\d+(?::\d+)?\}\}','',t)
   if clean and norm(clean) not in norm(re.sub(r'(?<!\w)\d+\s*[.\u2026_]{3,}','',raw)):issues.append('completion')
  if g.get('noteLayout'):
   for row in g['noteLayout']['rows']:
    text=''.join(run['text'] for run in row.get('labelRuns',[])+row['runs'])
    text=re.sub(r'\{\{\d+(?::\d+)?\}\}','',text)
    if text and norm(text) not in norm(re.sub(r'(?<!\w)\d+\s*[.\u2026_]{3,}','',raw)):issues.append('note layout text')
 for n in sorted({n for g in d['groups'] for n in g['sourcePages']}):
  pix=doc[n-1].get_pixmap(matrix=fitz.Matrix(1,1));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.thumbnail((580,830));tasks.append((d['title']+' p'+str(n),im))
 pn=next((i for i,p in enumerate(doc) if norm(d['paragraphs'][0]['text'][:60]) in norm(p.get_text())),0);page=doc[pn];pix=page.get_pixmap(matrix=fitz.Matrix(1,1),clip=fitz.Rect(20,35,page.rect.width-20,min(page.rect.height,440)));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.thumbnail((580,430));titles.append((d['title'],im));aud.append({'job':r['job'],'sourceEquivalent':not issues,'issues':issues})
for tag,items,w,h in [('tasks',tasks,600,870),('titles',titles,600,465)]:
 for i in range(0,len(items),4):
  can=Image.new('RGB',(w*2,h*2),'#eee');draw=ImageDraw.Draw(can)
  for j,(name,im) in enumerate(items[i:i+4]):x=j%2*w;y=j//2*h;draw.text((x+5,y+4),name[:92],fill='black');can.paste(im,(x+5,y+25))
  can.save(a.output/(tag+'-'+str(i//4)+'.jpg'),quality=95)
(a.batch/'source-audit.json').write_text(json.dumps(aud,indent=2));print('Source reviews',len(aud),'failures',[x for x in aud if x['issues']]);print('Task sheets',(len(tasks)+3)//4)
