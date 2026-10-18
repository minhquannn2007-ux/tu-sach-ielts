#!/usr/bin/env python3
"""Source-first CBT draft converter. Never invent answers or publish drafts.
Native PDFs retain structure; scans and ambiguous diagrams go to review.
"""
import argparse, hashlib, importlib.util, json, re, sys, unicodedata
from collections import Counter
from pathlib import Path
import fitz
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[1]
VERSION='3.22'
_spec=importlib.util.spec_from_file_location('source_notes',ROOT/'scripts/source-notes.py')
notes_module=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(notes_module)
HEADER=re.compile(r'(?m)^[ \t]*Questions?[ \t]+(\d+)(?:[ \t]*(?:[–—-]|and|&)\s*(\d+))?[ \t]*[.:]?[ \t]*$')
WORD_LIMIT=re.compile(r'(?:Choose|Write|Use)\s+((?:NO MORE THAN|ONE|TWO|THREE|FOUR)[A-Z /0-9-]*?(?:WORDS?|NUMBER|ONLY)(?:\s+AND/OR\s+A\s+NUMBER)?)\s+(?:from|for)',re.I)
class Hold(ValueError):
 def __init__(self,code,message):self.code=code;super().__init__(message)
def clean(s):return re.sub(r'\s+',' ',re.sub(r'(?<=\w)-\s*\n\s*(?=\w)','-',s)).strip()
def paragraph_labels_visible(groups):return not any(g['type']=='matching-headings' for g in groups)
def normalize_subtitle(s):return re.sub(r'\s+',' ',s).strip()
def list_title(s):return 'List of '+re.sub(r'^list\s+of\s+','',clean(s),flags=re.I).title()
def norm(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
def slug(s):return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')
def slots(s):return re.sub(r'(?<!\w)(\d+)\s*(?:[.\u2026]{3,}|_{3,})',lambda m:'{{'+m[1]+'}}',s)
def code_matches(text,roman=False):
 # First code needs explicit syntax. A grammatical "A faster..." is not a code.
 letters=r'[ivx]+' if roman else r'[A-Z]'
 pattern=rf'(?m)^[ \t]*({letters})(?:[ \t]*$|[.)][ \t]+|[ \t]{{2,}}(?=\S))'
 return list(re.finditer(pattern,text))
def bank_matches(text,roman=False,expected=None):
 matches=code_matches(text,roman)
 if expected and [m[1] for m in matches]!=expected:
  letters=r'[ivx]+' if roman else r'[A-Z]'
  candidates=list(re.finditer(rf'(?m)^[ \t]*({letters})[ \t]+(?=\S)',text))
  combined=sorted({m.start():m for m in [*matches,*candidates]}.values(),key=lambda m:m.start())
  if [m[1] for m in combined]==expected:matches=combined
  if [m[1] for m in matches]!=expected and not roman:
   # Native PDFs may place several options on one row. Accept inline markers
   # only when the complete declared sequence occurs exactly once, in order.
   inline=list(re.finditer(r'(?<!\S)([A-Z])(?:[ \t]+(?=\S)|[ \t]*\n)',text))
   if [m[1] for m in inline]==expected:matches=inline
 return matches
def options(text,roman=False,expected=None):
 matches=bank_matches(text,roman,expected)
 if not matches:raise Hold('option-bank','No unambiguous option markers')
 vals=[m[1] for m in matches]
 wanted=expected or (['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'][:len(vals)] if roman else [chr(65+i) for i in range(len(vals))])
 if vals!=wanted:raise Hold('option-bank',f'Missing, duplicate or out-of-order option codes: {vals}; expected {wanted}')
 out=[{'value':m[1],'text':clean(text[m.end():matches[i+1].start() if i+1<len(matches) else len(text)])} for i,m in enumerate(matches)]
 if any(not o['text'] for o in out):raise Hold('option-bank','An option has no content')
 return out

def statement_matches(text,start,end):
 # Inline numbers must be followed by an actual prompt, never a completion gap.
 p=re.compile(r'(?m)^[ \t]*(\d+)(?:[ \t]*$|[.)]?[ \t]+(?=[^\s.\u2026_]))')
 return [m for m in p.finditer(text) if start<=int(m[1])<=end]
def statements(text,start,end):
 matches=statement_matches(text,start,end)
 if [int(m[1]) for m in matches]!=list(range(start,end+1)):raise Hold('question-numbering','Missing, duplicate or unordered numbered prompts')
 out=[{'n':int(m[1]),'prompt':clean(text[m.end():matches[i+1].start() if i+1<len(matches) else len(text)])} for i,m in enumerate(matches)]
 if any(not q['prompt'] for q in out):raise Hold('question-content','Empty question prompt')
 return out

def body_after_instructions(text):
 if 'do the following statements agree' in text.lower():
  h=HEADER.search(text)
  if h:
   matches=statement_matches(text,int(h[1]),int(h[2] or h[1]))
   if matches:return text[matches[0].start():].strip()
 m=re.search(r'Write[^\n]*answer sheet[^\n]*\n',text,re.I)
 if not m:raise Hold('instructions','Answer-sheet boundary is unclear')
 rest=text[m.end():].strip()
 rest=re.sub(r'^\s*(?:NB\s*)?You (?:may|can) [^\n]*more than (?:once|one)\.?\s*\n','',rest,flags=re.I)
 return rest

def source_instructions(text,start,end):
 body=body_after_instructions(text)
 pos=text.find(body)
 if 'do the following statements agree' in text.lower():
  matches=statement_matches(text,start,end)
  if matches:pos=matches[0].start()
 inst=text[:pos]
 # The source instruction is separate from the question content and word bank.
 return clean(inst)
def word_limit(text):
 m=WORD_LIMIT.search(text)
 if not m:raise Hold('word-limit','Missing or unsupported source word/number limit')
 return clean(m[1]).upper()
def completion_scope(instruction):
 match=re.search(r'from (?:the )?paragraphs?\s+([A-Z](?:\s*[-–]\s*[A-Z]|(?:\s*,\s*|\s+(?:and|or)\s+)[A-Z])*)',instruction)
 if not match:return {}
 text=match[1];letters=re.findall(r'[A-Z]',text)
 if re.search(r'[-–]',text) and len(letters)==2:letters=[chr(c) for c in range(ord(letters[0]),ord(letters[1])+1)]
 return {'sourceParagraphs':letters,'sourceParagraphJoiner':'or' if re.search(r'\bor\b',text) else 'and'}

def expected_letters(text):
 direct=re.search(r'choose (?:two|three) (?:letters|answers)[^A-Z]*A\s*[-–—]\s*([A-Z])',text,re.I)
 if direct:return [chr(c) for c in range(65,ord(direct[1].upper())+1)]
 listed=re.search(r'correct letter[^A-Z]*\b(A\s*,\s*B(?:\s*,\s*[A-Z])*(?:\s*,?\s*(?:or|and)\s*[A-Z])?)',text)
 if listed:return re.findall(r'\b[A-Z]\b',listed[1])
 m=re.search(r'(?:list of words|correct [a-z -]+|ending)[^\n]*?\bA\s*[-–—]\s*([A-Z])',text,re.I)
 return [chr(c) for c in range(65,ord(m[1].upper())+1)] if m else None

def strip_page_number(page):
 lines=page.get_text('text').splitlines();nonstr=[i for i,l in enumerate(lines) if l.strip()]
 lines=['' if re.fullmatch(r'\s*Turn over\s*[▶►]?\s*',line) else line for line in lines]
 if nonstr and lines[nonstr[0]].strip().isdigit():lines[nonstr[0]]=''
 # Only remove a numeric footer if physically at the page edge.
 for word in page.get_text('words'):
  if re.fullmatch(r'\d+',word[4]) and word[1]>page.rect.height-30:
   if nonstr and lines[nonstr[-1]].strip()==word[4]:lines[nonstr[-1]]=''
 return '\n'.join(lines)+'\n'

def source_page_lines(lines,page_height):
 return [line for line in lines if not (''.join(span['text'] for span in line['spans']).strip().isdigit() and (line['bbox'][1]<page_height*.09 or line['bbox'][1]>page_height*.95)) and not re.fullmatch(r'\s*Turn over\s*[▶►]?\s*',''.join(span['text'] for span in line['spans']))]

def reading_blocks(blocks,title_hint):
 # Editors may append a visually topmost title after the body in the PDF stream.
 # Move only the exact title block, without reordering two-column body text.
 title=next((b for b in blocks if norm(' '.join(s['text'] for l in b['lines'] for s in l['spans']))==norm(title_hint)),None)
 if title:
  blocks=[b for b in blocks if b is not title]
  def top(block):return min((line['bbox'][1] for line in block['lines'] if any(s['text'].strip() for s in line['spans'])),default=block['bbox'][1])
  index=next((i for i,b in enumerate(blocks) if top(b)>=top(title)),len(blocks));blocks.insert(index,title)
 # Some PDFs store paragraph letters in a separate narrow text frame. Attach
 # each only to one body line on the same baseline, to its right.
 for block in list(blocks):
  text=clean(' '.join(s['text'] for l in block['lines'] for s in l['spans']))
  if not re.fullmatch(r'(?:[A-Z]\s*)+',text):continue
  retained=[]
  for label in block['lines']:
   letter=clean(''.join(s['text'] for s in label['spans']))
   if not re.fullmatch(r'[A-Z]',letter):retained.append(label);continue
   targets=[l for b in blocks if b is not block for l in b['lines'] if l['bbox'][0]>label['bbox'][2] and abs(l['bbox'][1]-label['bbox'][1])<4 and len(clean(''.join(s['text'] for s in l['spans'])))>1]
   if len(targets)!=1:retained.append(label);continue
   targets[0]['spans']=[{**label['spans'][0],'text':letter+'  '},*targets[0]['spans']]
  block['lines']=retained
 return [b for b in blocks if b['lines']]

def source_footnote(text):
 text=re.sub(r'^(?:[_─━—-]{3,}\s*)+','',clean(text))
 return text if (re.match(r'^[*†‡]+\s*[A-Za-z]',text) or re.match(r'^\d{1,2}\s+[A-Z][A-Za-z ]{1,40}:',text)) and len(text.split())<120 else None

def split_source_footnotes(text):
 # Split entry markers, not PDF soft wraps inside a definition.
 return [clean(t) for t in re.split(r'\s+(?=[*†‡]+\s*[A-Za-z])',text) if clean(t)]

def subtitle_line(line,body_size,body_italic=False):
 spans=[s for s in line['spans'] if s['text'].strip()]
 if not spans:return False
 if re.fullmatch(r'[A-Z]',clean(''.join(s['text'] for s in spans))):return False
 italic=all(s.get('flags',0)&2 or 'Italic' in s['font'] for s in spans)
 enlarged=all(s['size']>body_size*1.08 for s in spans)
 return (italic and not body_italic) or enlarged

def leading_subtitle(lines,body_size,body_italic=False):
 prefix=[];rest=[];body_started=False
 for line in lines:
  text=''.join(s['text'] for s in line['spans'])
  if not body_started and (not text.strip() or subtitle_line(line,body_size,body_italic)):
   if text.strip():prefix.append(text)
  else:body_started=True;rest.append(text)
 if prefix and len(' '.join(prefix).split())<120:return prefix,rest
 return [],[''.join(s['text'] for s in line['spans']) for line in lines]

def collect(doc,source):
 title_hint=re.sub(r'\.pdf$','',source.get('title',''),flags=re.I);passage=[];chunks=[];found=False;pending='';subtitle=[];footnotes=[];title='';title_size=0;questions_started=False
 for pn,page in enumerate(doc):
  raw=strip_page_number(page)
  # Blank paper-test end sheets may contain only a page number or BLANK PAGE.
  # Never skip image-only pages, which can contain a complete scanned task.
  if pn==len(doc)-1 and not page.get_images() and not re.sub(r'\bBLANK PAGE\b','',raw,flags=re.I).strip():continue
  if len(raw.strip())<100:raise Hold('scan-review','Image/scan pages need OCR and visual source review')
  headers=list(HEADER.finditer(raw))
  question_continuation=bool(found and questions_started)
  if headers:
   pre=raw[:headers[0].start()]
   if question_continuation and pre.strip():
    chunks[-1]['text']+='\n'+pre
    chunks[-1].setdefault('pages',[chunks[-1]['page']]).append(pn)
   if 'READING PASSAGE' not in pre and pre.strip() and not passage:
    pass # Heading list can precede the reading text on a separate page.
   for i,m in enumerate(headers):chunks.append({'start':int(m[1]),'end':int(m[2] or m[1]),'text':raw[m.start():headers[i+1].start() if i+1<len(headers) else len(raw)],'page':pn})
   # A mixed passage-and-questions page is supported when the title comes first.
   body_limit=headers[0].start()
  else:body_limit=len(raw)
  if not headers and chunks and not found and 'READING PASSAGE' not in raw:
   # No passage has begun; don't mistake question continuation for its title.
   pass
  if not headers and found and questions_started:
   if not chunks:raise Hold('question-continuation','Question continuation has no preceding group')
   chunks[-1]['text']+='\n'+raw;chunks[-1].setdefault('pages',[chunks[-1]['page']]).append(pn);continue
  if headers and question_continuation:continue
  blocks=[]
  for block in page.get_text('dict')['blocks']:
   lines=source_page_lines(block.get('lines',[]),page.rect.height)
   if lines:blocks.append({**block,'lines':lines})
  blocks=reading_blocks(blocks,title_hint)
  size_counts=Counter();style_counts=Counter()
  for block in blocks:
   for line in block['lines']:
    for span in line['spans']:
     size_counts[round(span['size'],1)]+=len(span['text'].strip())
     style_counts[bool(span.get('flags',0)&2 or 'Italic' in span['font'])]+=len(span['text'].strip())
  body_italic=style_counts[True]>style_counts[False]
  body_size=size_counts.most_common(1)[0][0] if size_counts else 12
  # Some old paper scans render only the title as artwork. A title transcribed
  # during visual review may explicitly establish the passage boundary; this
  # field is never inferred by the batch converter.
  if not found and source.get('visualTitle') and 'READING PASSAGE' in raw:
   title=clean(source['visualTitle']);found=True
  for b in blocks:
   spans=[s for l in b['lines'] for s in l['spans']];text='\n'.join(''.join(s['text'] for s in l['spans']) for l in b['lines']);t=clean(text)
   if not t or t.isdigit() or t.startswith('READING PASSAGE'):continue
   if not found and t.startswith('You should spend'):
    # A title can be appended to the introductory instruction's PDF block.
    matched_at=None
    for index,line in enumerate(b['lines']):
     leading=[]
     for candidate_line in b['lines'][index:]:
      leading.append(''.join(s['text'] for s in candidate_line['spans']))
      candidate=norm(' '.join(leading))
      if candidate and candidate==norm(title_hint):matched_at=index;break
      if candidate and not norm(title_hint).startswith(candidate):break
     if matched_at is not None:break
    if matched_at is None:continue
    b={**b,'lines':b['lines'][matched_at:]};spans=[s for line in b['lines'] for s in line['spans']]
    text='\n'.join(''.join(s['text'] for s in line['spans']) for line in b['lines']);t=clean(text)
   elif t.startswith('You should spend'):
    continue
   if headers and raw.find(text.strip().split('\n')[0].strip())>=body_limit:continue
   embedded_header=HEADER.search(text)
   if embedded_header:text=text[:embedded_header.start()];t=clean(text)
   if not found:
    if source_footnote(t):footnotes.extend(split_source_footnotes(source_footnote(t)));continue
    # A native PDF can store a title and its italic subtitle in one text block.
    # Match a complete leading line sequence before testing the whole block.
    leading=[];matched_at=None
    for index,line in enumerate(b['lines']):
     leading.append(''.join(s['text'] for s in line['spans']))
     if norm(' '.join(leading))==norm(title_hint):matched_at=index;break
    if matched_at is not None:
     used=b['lines'][:matched_at+1];title=clean(' '.join(leading));found=True
     title_size=max(s['size'] for line in used for s in line['spans'])
     remaining=b['lines'][matched_at+1:]
     if not remaining:continue
     b={**b,'lines':remaining};spans=[s for line in remaining for s in line['spans']]
     text='\n'.join(''.join(s['text'] for s in line['spans']) for line in remaining);t=clean(text)
    if found:
     pass
    else:
     candidate=clean(pending+' '+t)
     if norm(title_hint).startswith(norm(candidate)) and norm(candidate):pending=candidate
     else:pending=''
     if norm(candidate)==norm(title_hint) and norm(candidate):title=candidate;found=True;title_size=max(s['size'] for s in spans);continue
     # Generic filenames such as PDF/PAPER use an actual enlarged title, not the filename.
     nonblank=[s for s in spans if s['text'].strip()]
     generic=True # Enlarged bold source title; every draft still requires visual source review.
     if generic and len(t.split())>=2 and len(t.split())<=25 and nonblank and max(s['size'] for s in nonblank)>=16 and all((s.get('flags',0)&16 or 'Bold' in s['font']) and (body_italic or not (s.get('flags',0)&2 or 'Italic' in s['font'])) for s in nonblank):title=t;found=True;title_size=max(s['size'] for s in spans);continue
     continue
   nonblank=[s for s in spans if s['text'].strip()]
   if not passage and not subtitle and title_size>=16:
    continuation=[]
    for line in b['lines']:
     ss=[span for span in line['spans'] if span['text'].strip()]
     if ss and all((span.get('flags',0)&16 or 'Bold' in span['font']) and not (span.get('flags',0)&2 or 'Italic' in span['font']) and span['size']>=max(16,title_size*.9) for span in ss):continuation.append(line)
     else:break
    if continuation and len(' '.join(span['text'] for line in continuation for span in line['spans']).split())<15:
     title=clean(title+' '+ ' '.join(span['text'] for line in continuation for span in line['spans']))
     if len(continuation)==len(b['lines']):continue
     b={**b,'lines':b['lines'][len(continuation):]}
     text='\n'.join(''.join(span['text'] for span in line['spans']) for line in b['lines']);t=clean(text)
   if source_footnote(t):footnotes.extend(split_source_footnotes(source_footnote(t)));continue
   nonblank=[s for s in spans if s['text'].strip()]
   if not passage:
    prefix,rest=leading_subtitle(b['lines'],body_size,body_italic)
    if prefix:
     subtitle.append(normalize_subtitle(' '.join(prefix)))
     if not any(line.strip() for line in rest):continue
     text='\n'.join(rest)
   # Preserve paragraph first-line indents even when a PDF puts a whole column in one block.
   lines=b['lines'];cols={}
   for line in lines:
    if ''.join(s['text'] for s in line['spans']).strip():
     col=int(line['bbox'][0]>page.rect.width*.45);cols[col]=min(cols.get(col,line['bbox'][0]),line['bbox'][0])
   arranged=[];last=''
   for line in lines:
    lt=''.join(s['text'] for s in line['spans']);col=int(line['bbox'][0]>page.rect.width*.45)
    if (line['bbox'][0]-cols.get(col,line['bbox'][0])>=8 or len(lt)-len(lt.lstrip())>=3) and re.match(r'^[A-Z‘“]',lt.strip()) and re.search(r'[.!?][’\"\']?\s*$',last):arranged.append('')
    arranged.append(lt);last=lt
   if text=='\n'.join(''.join(s['text'] for s in line['spans']) for line in lines):text='\n'.join(arranged)
   passage.extend(p.strip() for p in re.split(r'\n[ \t]*\n',text) if p.strip())
  if headers and found:questions_started=True
 if not found or not passage:raise Hold('passage-title','Actual source title/passage boundary requires review')
 if not chunks:raise Hold('question-headers','No unambiguous question headers')
 joined='\n\n'.join(passage)
 label=re.compile(r'(?:^|\n)[ \t]*([A-Z])(?:[ \t]*\n|[ \t]+(?=\S))')
 markers=[m for m in label.finditer(joined) if m.start()==0 or joined[max(0,m.start()-1):m.start()+1]=='\n\n' or re.match(r'[ \t]*\n|[ \t]{2,}',joined[m.end(1):])]
 markers=[m for i,m in enumerate(markers) if i==0 or m[1]!='A' or re.match(r'[ \t]*\n|[ \t]{2,}',joined[m.end(1):])]
 if len(markers)>1 and markers[0][1]=='A' and not joined[:markers[0].start()].strip():
  letters=[m[1] for m in markers]
  if letters!=[chr(65+i) for i in range(len(letters))]:raise Hold('paragraph-labels','Missing or repeated paragraph labels')
  paras=[{'label':m[1],'text':clean(joined[m.end():markers[i+1].start() if i+1<len(markers) else len(joined)])} for i,m in enumerate(markers)]
 else:
  paras=[]
  for p in passage:
   t=clean(p)
   if paras and (t[:1].islower() or not re.search(r'[.!?\u2019\u201d\'\"]$',paras[-1]['text'])):paras[-1]['text']+=' '+t
   else:paras.append({'text':t})
 # A bank printed after a later question group must have exactly one source owner.
 for group in chunks:
  if not re.search(r'complete the summary using the list of (?:words(?: and phrases)?|phrases)',group['text'],re.I) or bank_matches(body_after_instructions(group['text']),expected=expected_letters(group['text'])):continue
  want=expected_letters(group['text'])
  owners=[]
  for other in chunks:
   if other is group or other['page']!=group['page']:continue
   codes=bank_matches(other['text'],expected=want)
   if codes and want and [c[1] for c in codes]==want:owners.append((other,codes[0].start()))
  if len(owners)!=1:raise Hold('detached-bank','Word bank is separated from its task and cannot be assigned safely')
  owner,pos=owners[0];group['text']+='\n'+owner['text'][pos:];owner['text']=owner['text'][:pos]
 return title,paras,chunks,subtitle,footnotes

def printed_summary_title(doc,page_number,body):
 first=clean(body.split('\n',1)[0])
 if not first or '{{' in slots(first):return None
 for b in doc[page_number].get_text('dict')['blocks']:
  for line in b.get('lines',[]):
   spans=[s for s in line['spans'] if s['text'].strip()]
   if clean(''.join(s['text'] for s in line['spans']))==first and spans:
    if all(s.get('flags',0)&16 or 'Bold' in s['font'] for s in spans):return first
 return None

def parse_group(chunk,paras,doc):
 start,end,text=chunk['start'],chunk['end'],chunk['text'];ns=list(range(start,end+1));instruction=source_instructions(text,start,end);low=instruction.lower();body=body_after_instructions(text)
 g={'sourceInstructions':instruction,'sourcePages':sorted({p+1 for p in chunk.get('pages',[chunk['page']])}),'questions':[{'n':n} for n in ns]};reuse=bool(re.search(r'you (?:may|can) [^.\n]*more than once',instruction,re.I) or re.search(r'you may (?:use|choose) any letter more than one\b',instruction,re.I))
 if 'label the diagram' in low or 'flow-chart' in low or 'flow chart' in low:raise Hold('diagram-review','Diagram/flow-chart arrows and label positions require a checked visual layout')
 if 'do the following statements agree' in low:
  truth=all(re.search(r'\b'+v+r'\b',instruction) for v in ['TRUE','FALSE','NOT GIVEN']);yn=all(re.search(r'\b'+v+r'\b',instruction) for v in ['YES','NO','NOT GIVEN'])
  if truth==yn:raise Hold('stance','TRUE/FALSE and YES/NO source labels are unclear')
  g.update(type='tfng' if truth else 'ynng',questions=statements(body,start,end))
 elif re.search(r'which (?:paragraph|sections?) contains?',low):
  letters=[p.get('label') for p in paras]
  declared=re.search(r'(?:paragraphs?|sections?)[^\n]*?\bA\s*[-–—]\s*([A-Z])',instruction)
  if declared and letters!=[chr(c) for c in range(65,ord(declared[1])+1)]:raise Hold('paragraph-labels','Source paragraph range differs from extracted text')
  if not all(letters):raise Hold('paragraph-labels','Matching Information requires source paragraph labels')
  g.update(type='matching-info',questions=statements(body,start,end),letters=letters,paragraphCount=len(paras),reuse=reuse)
 elif re.search(r'choose\s+(?:two|three)\s+(?:letters|answers)',low):
  matches=bank_matches(body,expected=expected_letters(instruction) or list('ABCDE'))
  if not matches:raise Hold('option-bank','Multiple-answer bank missing')
  count=3 if re.search(r'choose\s+three\s+(?:letters|answers)',low) else 2
  opts=options(body[matches[0].start():],expected=expected_letters(instruction) or list('ABCDE'))
  if len(ns)!=count:raise Hold('question-numbering','Selected-answer count differs from source question numbers')
  g.pop('questions');g.update(type='mc-two',selectionCount=count,numbers=ns,prompt=clean(body[:matches[0].start()]),options=opts)
 elif re.search(r'classify the following',low):
  codes=expected_letters(instruction)
  boundary=re.search(r'(?im)^\s*Write\b',text)
  pre=text[:boundary.start()] if boundary else ''
  marks=bank_matches(pre,expected=codes)
  if not codes or not marks or not boundary:raise Hold('matching-bank','Classification bank is unclear')
  bank=options(pre[marks[0].start():],expected=codes)
  g.update(type='matching-features',questions=statements(body,start,end),bank=bank,targetName='category',listTitle='List of Categories',reuse=reuse)
 elif 'choose the correct heading' in low:
  marker=re.search(r'List of Headings',body,re.I)
  if not marker:raise Hold('heading-bank','Heading list missing')
  qtext=body[marker.end():]
  # Printed worked examples are fixed guidance, not numbered questions or
  # additional bank entries. Preserve their paragraph and heading separately.
  # The CBT renderer prints the heading directly above its paragraph, without
  # an Example label or an additional draggable option. Keep the original bank
  # in source data so the example's exact text remains available for rendering.
  examples=[]
  def remove_example(match):
   indices=[i for i,p in enumerate(paras) if p.get('label')==match[1]]
   if len(indices)!=1:raise Hold('heading-questions','Example paragraph is ambiguous')
   examples.append({'paragraph':indices[0],'value':match[2]})
   return '\n'
  qtext=re.sub(r'\bExample\s+(?:Paragraph|Section)\s+([A-Z])\s+([ivx]+)\s*(?=\n|$)',remove_example,qtext)
  qmarkers=statement_matches(qtext,start,end)
  if not qmarkers:raise Hold('heading-questions','Heading-to-paragraph mapping missing')
  bank=options(qtext[:qmarkers[0].start()],roman=True);mapped=statements(qtext[qmarkers[0].start():],start,end)
  questions=[]
  for q in mapped:
   m=re.fullmatch(r'(?:Paragraph|Section)\s+([A-Z])',q['prompt'],re.I)
   indices=[i for i,p in enumerate(paras) if m and p.get('label')==m[1].upper()]
   if len(indices)!=1:raise Hold('heading-questions','Heading paragraph mapping is ambiguous')
   questions.append({'n':q['n'],'paragraph':indices[0]})
  g.update(type='matching-headings',questions=questions,bank=bank,reuse=False)
  if examples:
   if any(e['value'] not in [o['value'] for o in bank] or e['paragraph'] in [q['paragraph'] for q in questions] for e in examples):raise Hold('heading-questions','Invalid worked example')
   g['examples']=examples
 elif 'complete the table' in low:
  page=doc[chunk['page']];tables=page.find_tables().tables
  # Only consider source tables below this group's printed header and before the next.
  tabs=[t for t in tables if any(str(n) in str(t.extract()) for n in ns)]
  if len(tabs)!=1:raise Hold('table-layout','Table grid/merged cells require visual transcription')
  t=tabs[0];rawrows=t.extract()
  if any(c is None for row in rawrows for c in row):raise Hold('table-layout','Merged table cells require reviewed layout')
  rows=[[notes_module.normalize_table_cell(slots(re.sub(r'\s*\n\s*(?=•)','\n\n',str(c)).strip())) for c in row] for row in rawrows]
  title=clean(body.split('\n',1)[0]);first=clean(' '.join(rawrows[0]));header=bool(re.search(r'features|findings|characteristics|description',first,re.I))
  widths=[round(100*(cell[2]-cell[0])/(t.bbox[2]-t.bbox[0]),2) for cell in t.rows[0].cells]
  g.update(type='notes',task='table',wordLimit=word_limit(instruction),table=rows,tableHeader=header,columnWidths=widths,title=title)
 elif 'choose the correct letter' in low:
  qs=[]
  marks=statement_matches(body,start,end)
  # A singular "Question 40" header already owns the number, so the body may
  # begin directly with the prompt instead of printing 40 a second time.
  if start==end and not marks:
   opts=bank_matches(body,expected=list('ABCD'))
   if not opts:raise Hold('option-bank','MC options missing')
   qs=[{'n':start,'prompt':clean(body[:opts[0].start()]),'options':options(body[opts[0].start():],expected=list('ABCD'))}]
  for i,m in enumerate(marks):
   qt=body[m.end():marks[i+1].start() if i+1<len(marks) else len(body)];opts=bank_matches(qt,expected=list('ABCD'))
   if not opts:raise Hold('option-bank','MC options missing')
   qs.append({'n':int(m[1]),'prompt':clean(qt[:opts[0].start()]),'options':options(qt[opts[0].start():],expected=list('ABCD'))})
  g.update(type='mc-one',questions=qs)
 elif re.search(r'match each [a-z -]+ with (?:the )?(?:correct|coffect)',low):
  match=re.search(r'(?m)^[ \t]*(?:List of[^\n]+|Types of[^\n]+)\n',body,re.I)
  target=re.search(r'with (?:the )?(?:correct|coffect) ([a-z]+(?:\(s\))?(?: [a-z]+)*?)(?=,|\.|\n|$)',instruction,re.I)
  if not match or not target:raise Hold('matching-bank','Matching target/list title missing')
  g.update(type='matching-features',questions=statements(body[:match.start()],start,end),bank=options(body[match.end():],expected=expected_letters(instruction)),targetName=target[1].lower().replace('(s)',''),listTitle=list_title(re.sub(r'^Types of','List of',match[0],flags=re.I)),reuse=reuse)
 elif 'complete each sentence with the correct ending' in low:
  markers=bank_matches(body,expected=expected_letters(instruction))
  if not markers:raise Hold('ending-bank','Ending bank missing')
  g.update(type='matching-endings',questions=statements(body[:markers[0].start()],start,end),bank=options(body[markers[0].start():],expected=expected_letters(instruction)),reuse=reuse)
 elif re.search(r'complete the summary(?: of sections? [a-z ,and-]+)? using the list of (?:words(?: and phrases)?|phrases)',low):
  markers=bank_matches(body,expected=expected_letters(instruction))
  if not markers:raise Hold('option-bank','Summary word bank missing')
  summary=body[:markers[0].start()].strip();g.update(type='summary-drag',bank=options(body[markers[0].start():],expected=expected_letters(instruction)),reuse=reuse)
  scope=re.search(r'complete the summary of ((?:sections?|paragraphs?) [A-Z](?:\s*(?:,|and|or|[-–])\s*[A-Z])*)\s+using',instruction,re.I)
  if scope:g['summaryScope']=clean(scope[1])
  lines=summary.splitlines();g['title']=printed_summary_title(doc,chunk['page'],summary)
  if g['title']:summary='\n'.join(lines[1:])
  g['content']=[slots(clean(p)) for p in re.split(r'\n\s*\n',summary) if p.strip()]
 elif 'complete the notes' in low:
  layout=notes_module.extract_notes(doc,start,end);layout['sourceVerified']=False
  g.update(type='notes',wordLimit=word_limit(instruction),noteLayout=layout,title=layout.get('title'),content=[''.join(r['text'] for r in row['runs']) for row in layout['rows']])
 elif re.search(r'answer (?:the|these) questions',low):
  g.update(type='short-answer',wordLimit=word_limit(instruction),questions=statements(body,start,end))
 elif re.search(r'complete the (?:summary|sentences)',low):
  task='sentences' if 'complete the sentences' in low else 'summary';content=body
  if task=='sentences':
   qs=statements(body,start,end);content=[]
   for q in qs:
    gaps=list(re.finditer(r'[.\u2026]{3,}|_{3,}',q['prompt']))
    if not gaps:raise Hold('gap-numbering','Sentence has no source blank')
    index=[0]
    def blank(m):
     i=index[0];index[0]+=1;return '{{'+str(q['n'])+((':'+str(i)) if i else '')+'}}'
    content.append(re.sub(r'[.\u2026]{3,}|_{3,}',blank,q['prompt']));q['slots']=len(gaps);q.pop('prompt')
   g['questions']=qs
  if task=='summary':
   first=printed_summary_title(doc,chunk['page'],body)
   if first:g['title']=first;content=body.split('\n',1)[1]
  g.update(type='summary-input',task=task,wordLimit=word_limit(instruction),content=content if isinstance(content,list) else [slots(clean(p)) for p in re.split(r'\n\s*\n',content) if p.strip()])
 else:raise Hold('unsupported-task','Unknown source task wording; needs reviewed adapter')
 if g['type'] in ['summary-input','summary-drag','notes','short-answer','diagram','flow-chart']:g.update(completion_scope(instruction))
 if g['type'] in ['summary-input','summary-drag','notes']:
  fields=g.get('content') or [c for row in g.get('table',[]) for c in row]
  found=[int(n) for n in re.findall(r'\{\{(\d+)(?::\d+)?\}\}',' '.join(fields))]
  expected=[q['n'] for q in g['questions'] for _ in range(q.get('slots',1))]
  if sorted(found)!=expected:raise Hold('gap-numbering',f'Expected one control per source gap {ns}, found {found}')
 return g

def check_duplicate_prompts(groups):
 for g in groups:
  seen={}
  for q in g.get('questions',[]):
   prompt=norm(q.get('prompt',''))
   if prompt and prompt in seen:
    raise Hold('duplicate-question',f"Questions {seen[prompt]} and {q['n']} repeat the same source prompt; compare source versions")
   if prompt:seen[prompt]=q['n']

def parse(source,part,cache):
 path=cache/(source['id']+'.pdf')
 with fitz.open(path) as doc:
  title,paras,chunks,subtitle,footnotes=collect(doc,source)
  groups=[parse_group(c,paras,doc) for c in chunks]
  check_duplicate_prompts(groups)
  start={1:1,2:14,3:27}[part];count=14 if part==3 else 13
  ns=[n for g in groups for n in (g.get('numbers') or [q['n'] for q in g['questions']])]
  if sorted(ns)!=list(range(start,start+count)) or len(ns)!=len(set(ns)):raise Hold('question-numbering',f'Passage {part} requires {count} unique source questions')
  if sum(len(p['text'].split()) for p in paras)<200:raise Hold('passage-content','Passage text appears incomplete')
  data={'id':f'p{part}-{slug(title)}','part':part,'title':title,'mode':'practice','status':'draft','paragraphs':paras,'groups':groups,'sources':[{'id':source['id'],'role':'passage-and-questions','sha256':hashlib.sha256(path.read_bytes()).hexdigest()}],'conversion':{'version':VERSION,'sourceParagraphCount':len(paras),'method':'native-pdf','requiresReview':True,'checks':['numbering','option-codes','gap-count','source-rules']}}
  data['displayParagraphLabels']=paragraph_labels_visible(groups)
  if subtitle:data['subtitle']=normalize_subtitle(' '.join(subtitle))
  if footnotes:data['footnotes']=footnotes
  return data
if __name__=='__main__':
 import subprocess
 raise SystemExit(subprocess.call([sys.executable,str(ROOT/'scripts/convert-batch.py'),*sys.argv[1:]]))
