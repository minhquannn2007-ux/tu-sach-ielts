"""Recover source italics without rewriting reading text. No OCR style guessing.
PDF native font flags and Word inherited run styles only. Character offsets are
UTF-16 to match browser strings. Context alignment requires >=95% exact words.
"""
import re,unicodedata,difflib
WORD=re.compile(r"[^\W_]+(?:[’'][^\W_]+)*",re.UNICODE)
def words(text):
 return [(unicodedata.normalize('NFKD',m.group()).encode('ascii','ignore').decode().lower().replace('’',"'").replace("'",''),m.start(),m.end())for m in WORD.finditer(text)]
def pdf_source(doc):
 # PDF BaseFont names can lie: some Optima files call normal, bold and italic
 # subsets the SAME name. Resolve each font resource's embedded style instead.
 import io,logging
 from pypdf import PdfReader
 from fontTools.ttLib import TTFont
 logging.getLogger('fontTools').setLevel(logging.ERROR)
 reader=PdfReader(io.BytesIO(doc.tobytes()));text=[];styles=[];cache={}
 def italic(font):
  if font is None:return False
  key=str(font.get('/BaseFont',''))+str(font.get('/FontDescriptor',''))
  if key in cache:return cache[key]
  fd=font.get('/FontDescriptor')
  if fd is None and font.get('/DescendantFonts'):fd=font['/DescendantFonts'][0].get_object().get('/FontDescriptor')
  fd=fd.get_object()if fd is not None else None
  value=None
  if fd is not None and fd.get('/FontFile2'):
   try:
    ttf=TTFont(io.BytesIO(fd['/FontFile2'].get_object().get_data()))
    value=bool(ttf['head'].macStyle&2 or ('OS/2'in ttf and ttf['OS/2'].fsSelection&1))
   except Exception:pass
  if value is None:value=bool(fd is not None and float(fd.get('/ItalicAngle',0))!=0 or re.search(r'italic|oblique',str(font.get('/BaseFont','')),re.I))
  cache[key]=value;return value
 def visit(s,cm,tm,font,size):
  text.extend(s);styles.extend([italic(font)]*len(s))
 for page in reader.pages:
  page.extract_text(visitor_text=visit);text.append('\n');styles.append(False)
 return ''.join(text),styles

def inherited_italic(run,paragraph):
 if run.italic is not None:return bool(run.italic)
 for initial in [run.style,paragraph.style]:
  seen=set();style=initial
  while style is not None and style.style_id not in seen:
   seen.add(style.style_id)
   if style.font.italic is not None:return bool(style.font.italic)
   style=style.base_style
 return False

def word_source(doc):
 from docx.text.paragraph import Paragraph
 from docx.oxml.ns import qn
 text=[];styles=[]
 for e in doc.element.body.iter():
  if e.tag!=qn('w:p'):continue
  p=Paragraph(e,doc)
  for r in p.runs:
   text.extend(r.text);styles.extend([inherited_italic(r,p)]*len(r.text))
  text.append('\n');styles.append(False)
 return ''.join(text),styles

def source_index(text,styles):
 ws=words(text);seq=[w[0]for w in ws];italic=[sum(styles[a:b])>=(b-a)/2 for _,a,b in ws];anchors={}
 for i in range(len(seq)-7):anchors.setdefault(tuple(seq[i:i+8]),[]).append(i)
 return {'text':text,'seq':seq,'italic':italic,'anchors':anchors}

def align(text,source):
 target=words(text);ts=[w[0]for w in target];ss=source['seq']
 if len(ts)<3:return None
 starts=set()
 for j in range(max(1,len(ts)-7)):
  for at in source['anchors'].get(tuple(ts[j:j+8]),[]):starts.add(max(0,at-j-8))
 if not starts:return None
 best=None
 for start in sorted(starts):
  window=ss[start:start+len(ts)+32];m=difflib.SequenceMatcher(None,ts,window,autojunk=False);blocks=[b for b in m.get_matching_blocks()if b.size>=3];score=sum(b.size for b in blocks)/len(ts)
  if best is None or score>best[0]:best=(score,start,blocks)
 if not best or best[0]<.95:return None
 score,start,blocks=best;selected=[]
 for block in blocks:
  for i in range(block.size):
   if source['italic'][start+block.b+i]:selected.append(block.a+i)
 ranges=[]
 for i in selected:
  a,b=target[i][1:]
  if ranges and not re.search(r'\w',text[ranges[-1][1]:a]):ranges[-1][1]=b
  else:ranges.append([a,b])
 if len(selected)==len(target)and ranges:ranges=[[0,len(text)]]
 ranges=[{'start':len(text[:a].encode('utf-16-le'))//2,'end':len(text[:b].encode('utf-16-le'))//2,'quote':text[a:b]}for a,b in ranges]
 return {'coverage':round(score,4),'ranges':ranges}

def apply(paragraphs,text,styles):
 source=source_index(text,styles)
 for p in paragraphs:
  result=align(p['text'],source)
  if result and result['ranges']:p['italicRanges']=result['ranges']
 return paragraphs
