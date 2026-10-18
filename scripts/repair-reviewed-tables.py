import json,fitz,re,hashlib,importlib.util
from pathlib import Path
import argparse
a=argparse.ArgumentParser(description='Source-reviewed adapters for repair batch 9 only');a.add_argument('--cache',type=Path,required=True);a.add_argument('--output',type=Path,required=True);args=a.parse_args()
root=Path(__file__).resolve().parents[1];cache=args.cache;out=args.output;(out/'drafts').mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('parser',root/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
for j in json.load(open(root/'import/repair-batch-9/jobs.json')):
 source=next(s for s in j['sources'] if (cache/(s['id']+'.pdf')).exists());path=cache/(source['id']+'.pdf');doc=fitz.open(path);src={**source,'title':j['title']+'.pdf'};title,paras,chunks,sub,foot=m.collect(doc,src);groups=[]
 for c in chunks:
  inst=m.source_instructions(c['text'],c['start'],c['end']);g={'sourceInstructions':inst,'sourcePages':[c['page']+1],'questions':[{'n':n} for n in range(c['start'],c['end']+1)]}
  if j['id']=='p3-travel-writing' and c['start']==29:
   g.update(type='notes',task='table',wordLimit=m.word_limit(inst),title='Travellers and their purposes',tableHeader=True,columnWidths=[14,22,25,39],table=[['Time','Traveller','Destination','Purpose of journey'],['classical','Greek','Egypt and Anatolia','to investigate the causes of the {{29}}'],['','Chinese','Central Asia','to look for {{30}}'],['','Hellenistic/Roman','Mediterranean region','to put together collections of {{31}}'],['post-classical','Muslim','Eastern Hemisphere','to go on trade expeditions or on a {{32}}'],['','Chinese','Southeast Asia and India',''],['early modern','European','Eastern Hemisphere, Americas, Oceania','Americas, Oceaniato discover trade routes and establish {{33}}'],['19th century','European','Africa and Americas','to explore interior areas of the countries'],['','Asian','Europe and the United States','to do research into {{34}}'],['20th century','people from {{35}}','Worldwide','to tour foreign countries']],tableSpans=[{'row':1,'col':0,'rows':3,'cols':1},{'row':4,'col':0,'rows':2,'cols':1},{'row':4,'col':3,'rows':2,'cols':1},{'row':7,'col':0,'rows':2,'cols':1}])
  elif 'complete the table' in inst.lower() and j['id']!='p2-childrens-literature':
   g.update(type='notes',task='table',wordLimit=m.word_limit(inst),tableHeader=True)
   if j['id']=='p1-pluto-seen-up-close-for-the-first-time':
    layout=m.notes_module.extract_notes(doc,c['start'],c['end']);g.pop('task');g.pop('tableHeader');g.update(noteLayout=layout,title=layout['title'],content=[''.join(r['text'] for r in row['runs']) for row in layout['rows']])
   elif j['id']=='p3-what-count-as-knowledge':
    g.update(columnWidths=[31,69],title=None,table=[['Argument','Examples/evidence'],['Knowledge can come from various sources','These include:\n\n• personal experience (e.g. a {{27}} and continuous tiredness)\n\n• scientific evidence (e.g. measurement of {{28}})\n\n• doctor’s medical {{29}} coming from professional experience and training'],['Knowledge is ‘socially produced’','Ideas about illness may depend on:\n\n• popular culture (e.g. illnesses connected with {{30}} )\n\n• common sense (e.g. remarks made by {{31}} and {{31:1}} )\n\n• alternative or complementary approaches to health care (e.g. {{32}} )']]);next(q for q in g['questions'] if q['n']==31)['slots']=2
   else:
    ts=doc[c['page']].find_tables().tables;tab=next(t for t in ts if any(word in str(t.extract()) for word in ['Date','Style','Argument']));rr=tab.extract();header=next(i for i,row in enumerate(rr) if row[0] in ['Date','Style','Argument']);ncols=3 if j['id']=='p1-australian-rock' else 2;rows=rr[header:];assert all(row[k] is not None for row in rows for k in range(ncols));g['table']=[[m.notes_module.normalize_table_cell(m.slots(str(cell))).strip() for cell in row[:ncols]] for row in rows];g['columnWidths']=[17,83] if ncols==2 else [15,34,51];g['title']='Painting Styles in the Kimberley' if ncols==3 else None
    if j['id']=='p1-australian-rock':g['table'][1][1]=g['table'][1][1].replace('before Ice Age beginning','before Ice Age\n\nbeginning')
    if j['id']=='p3-what-count-as-knowledge':
     cell=g['table'][2][1];assert re.search(r'and\s*[.\u2026]{3,}',cell);g['table'][2][1]=re.sub(r'(and\s*)[.\u2026]{3,}',r'\1{{31:1}}',cell);next(q for q in g['questions'] if q['n']==31)['slots']=2;g['columnWidths']=[31,69]
  else:g=m.parse_group(c,paras,doc)
  if j['id']=='p2-childrens-literature' and c['start']==14:g['tableHeader']=True;g['tableCellItalicText']=[{'row':2,'col':3,'text':'A Little Pretty Pocket Book'}]
  groups.append(g)
 d={'id':f'p{j["part"]}-{m.slug(title)}','part':j['part'],'title':title,'mode':'practice','status':'draft','paragraphs':paras,'groups':groups,'sources':[{'id':source['id'],'name':source['title'],'role':'passage-and-questions','sha256':hashlib.sha256(path.read_bytes()).hexdigest()}],'conversion':{'version':m.VERSION,'jobId':j['id'],'sourceParagraphCount':len(paras),'method':'native-pdf-with-reviewed-table-adapter','requiresReview':True},'displayParagraphLabels':m.paragraph_labels_visible(groups)}
 if sub:d['subtitle']=m.normalize_subtitle(' '.join(sub))
 if foot:d['footnotes']=foot
 (out/'drafts'/(j['id']+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2));print(j['id'],d['id'])
