"""Replay source-specific corrections for the explicitly reviewed batch 40.
Produces drafts plus review records only; does not publish.
"""
import json,pathlib,re,hashlib
import argparse
ap=argparse.ArgumentParser();ap.add_argument('--raw',type=pathlib.Path,required=True);ap.add_argument('--output',type=pathlib.Path,required=True);args=ap.parse_args();out=args.output;(out/'drafts').mkdir(parents=True,exist_ok=True)
rep=json.load(open(args.raw/'report.json'));reviews=[]
expected={r['job']:r for r in json.load(open(pathlib.Path(__file__).resolve().parents[1]/'import/word-batch-40/source-review.json'))}
for r in rep:
 if r['status']!='draft'or r['job']=='p3-what-is-history':continue
 id=r['job']
 if id not in expected:continue
 d=json.load(open(args.raw/(id+'.json')));v=expected[id]
 assert d['sources'][0]['sha256']==v['wordHash'] and d['sources'][1]['sha256']==v['sourceHash'],'Source fingerprint changed; review required'
 fix=[]
 def replace(a,b):
  nonlocal_dummy=None
  def walk(x):
   if isinstance(x,str):return x.replace(a,b)
   if isinstance(x,list):return [walk(y)for y in x]
   if isinstance(x,dict):return{k:walk(v)for k,v in x.items()}
   return x
  nonlocal_d=None
  nd=walk(d);d.clear();d.update(nd);fix.append([a,b])
 def split_at(index,starts):
  p=d['paragraphs'][index];t=p['text'];pos=[t.index(s)for s in starts];assert pos==sorted(pos)
  d['paragraphs'][index:index+1]=[{'text':t[a:pos[i+1]if i+1<len(pos)else len(t)].strip()}for i,a in enumerate(pos)];fix.append('Restored source paragraph breaks: '+', '.join(starts[1:]))
 if id=='p1-city-transport-uneven-progress':
  d['title']='CITY TRANSPORT: UNEVEN PROGRESS';d['groups'][0]['sourceInstructions']=d['groups'][0]['sourceInstructions'].replace('Reading Passage 3','Reading Passage 1');d['groups'][0]['sourcePages']=[1];d['groups'][1]['sourcePages']=[4];fix+=['Source title capitalization; example A xii kept fixed, absent from draggable bank']
 elif id=='p2-dominance-in-social-insects':
  d['paragraphs'][3].pop('blocks',None);replace('workers o related Insect species','workers o related Insect species')
  # Original image says "workers o related" only due to the Word typo; restore the visible source.
  replace('workers o related Insect species','workers of related insect species')
  d['footnotes']=["* pupa: a protective case inside which one stage of an insect’s development takes place",'** oligarchy: control by a small group'];d['groups'][0]['sourcePages']=[1]
  for g in d['groups'][1:]:g['sourcePages']=[4]
  fix+=['Joined page/line wraps inside D; restored two separate source footnotes']
 elif id=='p2-paternity-leave':
  g=d['groups'][0];g.update(headingUnit='sections');g['sourceInstructions']=g['sourceInstructions'].replace('six paragraphs','six sections').replace('each paragraph','each section');g['sourcePages']=[1]
  for g in d['groups'][1:]:g['sourcePages']=[4]
  replace('may be effected.','may be affected.');replace('Sharing children in this way','Sharing childcare in this way');replace('Lance Somefield','Lance Somerfeld');replace('Lances Somefield','Lance Somerfeld');replace('Though it published','Though it publishes');replace('market reduce women','market reduces women');replace('junior position.','junior positions.');replace('But pressure related','But pressures related');replace('women may','Women may');replace("women's chances","Women’s chances");replace("women's pay","Women’s pay")
  s=d['groups'][-1]['content'][0];at=s.index('Some countries, such as Chile');d['groups'][-1]['content']=[s[:at].strip(),s[at:]];fix+=['Used six sections from PDF, not six paragraphs from Word; kept B/E/F internal paragraphs']
 elif id=='p2-a-great-leap-forward':
  replace('Write the correct letter, A-I, in boxes 20-24','Write the correct letter, A-G, in boxes 20-24');replace('Maud Island frogs or pakeha','Maud Island frogs or pakeka');replace('a frost night','a forest night')
  for i,g in enumerate(d['groups']):g['sourcePages']=[3 if i<2 else 4]
 elif id=='p2-playing-with-science':
  for i,g in enumerate(d['groups']):g['sourcePages']=[3 if i<2 else 4]
  s=d['groups'][-1]['content'][0];at=s.index('The {{25}}');d['groups'][-1]['content']=[s[:at].strip(),s[at:]]
 elif id=='p2-the-alps-2-ocean-cycle-trail':
  d['groups'][0]['sourcePages']=[3]
  for g in d['groups'][1:]:g['sourcePages']=[4]
 elif id=='p2-are-artists-liars':
  d['footnotes']=['* libel: the act of writing or printing untrue statements about someone'];d['groups'][0]['sourcePages']=[1]
  for g in d['groups'][1:]:g['sourcePages']=[4]
 elif id=='p2-early-approaches-to-organisational-design':
  d['title']='Early approaches to organisational design';replace('and managers luce the challenge','and managers face the challenge');replace('lowerl evel','lower-level');replace('They also wrote that','They also argued that');replace('Likert based on model','Likert based a model')
  for p in d['paragraphs']:
   if p['text'].startswith(('The Classical Approach','Criticism of the Classical Approach','The Neoclassical Approach','Criticisms of the Neoclassical Approach')):
    p['heading']=True;p['text']=p['text'].replace('Criticism of the Classical Approach','Criticisms of the Classical Approach')
  for i,g in enumerate(d['groups']):g['sourcePages']=[3 if i<3 else 4]
  fix+=['Preserved four bold reading subsection headings, not plain body text']
 elif id=='p2-flood-control-in-the-usa':
  d['title']='Flood control in the USA';g=d['groups'][0];g['sourceInstructions']=g['sourceInstructions'].replace('seven paragraphs','six paragraphs');g.update(headingCount=6,sourcePages=[1]);d['footnotes']=['* runoff: water that flows off the land into rivers','** floodplain: low-lying ground next to a river where flooding is common']
  for g in d['groups'][1:]:g['sourcePages']=[4]
 elif id=='p2-the-legacy-of-stanislavsky':
  d['groups'][0]['sourcePages']=[3];d['groups'][1]['sourcePages']=[3];d['groups'][2]['sourcePages']=[4]
 elif id=='p2-follow-your-nose':
  replace('a systemic review','a systematic review');replace('an overlapping redline','something related');d['title']='Follow your nose';d['subtitle']=' '.join(p['text']for p in d['paragraphs'][:2]);d['paragraphs']=d['paragraphs'][2:];g=d['groups'][0]
  for q in g['questions']:q['paragraph']-=2
  for e in g['examples']:e['paragraph']-=2
  g['sourcePages']=[1]
  for g in d['groups'][1:]:g['sourcePages']=[4]
  fix+=['Joined two Word subtitle fragments and removed them from reading; remapped heading/example indices']
 elif id=='p3-the-digital-revolution-in-studying-history':
  d['groups'][0]['sourcePages']=[3]
  for g in d['groups'][1:]:g['sourcePages']=[4]
 elif id=='p3-rating-female-leaders':
  for g,pg in zip(d['groups'],[[3],[3,4],[4]]):g['sourcePages']=pg
 elif id=='p3-motivating-employees':
  d['groups'][0]['sourcePages']=[3]
  for g in d['groups'][1:]:g['sourcePages']=[4]
 elif id=='p3-the-search-for-extra-terrestrial-life':
  for g,pg in zip(d['groups'],[[],[3],[4]]):g['sourcePages']=pg
  # Q27–30 are fully present in the Word document; both PDF versions omit that page.
  d['groups'][0]['sourcePages']=[3];d['groups'][0]['sourceDocument']='word';d['groups'][0]['sourceNote']='Original PDF omits Questions 27–30; these four complete questions are retained from the Word source.'
  replace('{{38}} temperatures','{{38}} in temperatures');fix+=['Word supplies complete Q27–30; both PDF versions omit the corresponding page, not invented']
 elif id=='p1-why-good-ideas-fail':
  replace('a fiction retail giant','a fictional retail giant');replace('Feedback from expert','Feedback from experts');replace('Feedback from expertss','Feedback from experts');replace('0X0','OXO');replace('offer that appeal','offer products that appeal')
  for i in [0,3,4,8]:d['paragraphs'][i]['heading']=True
  for g,pg in zip(d['groups'],[[3],[4]]):g['sourcePages']=pg
 elif id=='p1-reef-life-on-the-yongala':
  d['footnotes']=['* algae: very simple plants that grow in or near water and do not have ordinary leaves or roots']
  for g,pg in zip(d['groups'],[[3],[4]]):g['sourcePages']=pg
 elif id=='p1-the-new-zealand-national-archives':
  for i in [5,3]:
   p=d['paragraphs'];p[i:i+2]=[{'text':p[i]['text']+' '+p[i+1]['text']}]
  for g,pg in zip(d['groups'],[[3],[4]]):g['sourcePages']=pg
  fix+=['Joined two soft Word breaks in the reading; restored missing detective bullet and removed duplicate Question 10 from Word notes']
 elif id=='p1-minds-of-their-own':
  for i,starts in [(14,["'Don't try to be smart,","Many of Alex's cognitive skills"]),(7,['It sounded a bit mad',"'He has to hear the words"]),(6,["'Some people actually called",'Under Pepperberg',"'I'm sure he already knows"])]:split_at(i,starts)
  for g,pg in zip(d['groups'],[[3],[3],[4]]):g['sourcePages']=pg
 elif id=='p1-the-history-of-the-chicken':
  for g,pg in zip(d['groups'],[[3],[4]]):g['sourcePages']=pg
 elif id=='p1-the-iditarod':
  replace('development of to routes','development of two routes')
  for g,pg in zip(d['groups'],[[3],[4]]):g['sourcePages']=pg
 elif id=='p1-deserts-and-desert-life':
  split_at(6,['Many desert animals','Common characteristics'])
  for g,pg in zip(d['groups'],[[3],[4]]):g['sourcePages']=pg
 for g in d['groups']:
  if g.get('noteLayout'):g['noteLayout']['sourceVerified']=True
 d['conversion']['sourceParagraphCount']=len(d['paragraphs']);d['conversion']['review']={'sourceText':True,'titleSubtitle':True,'taskPages':True,'footnotes':True,'date':'2026-10-19'}
 (out/'drafts'/(id+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 reviews.append({'job':id,'wordId':d['sources'][0]['id'],'wordHash':d['sources'][0]['sha256'],'sourceId':d['sources'][1]['id'],'sourceHash':d['sources'][1]['sha256'],'allReadingParagraphs':True,'allTaskPages':True,'titleSubtitle':True,'footnotes':True,'notesSourceLayout':bool(any(g.get('noteLayout')for g in d['groups'])),'corrections':fix,'reviewed':True})
(out/'source-review.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n');print('Reviewed',len(reviews))
