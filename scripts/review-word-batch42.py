"""Replay source-reviewed batch42 corrections; drafts only, no publication."""
import json,pathlib,argparse,hashlib
ap=argparse.ArgumentParser();ap.add_argument('--raw',type=pathlib.Path,required=True);ap.add_argument('--extra',type=pathlib.Path,required=True);ap.add_argument('--output',type=pathlib.Path,required=True);args=ap.parse_args();repo=pathlib.Path(__file__).resolve().parents[1];out=args.output;(out/'drafts').mkdir(parents=True,exist_ok=True)
ids=['p1-the-oldest-leather-shoe','p3-grimm-s-fairy-tales','p3-tick-tock-body-clock','p3-what-is-history','p2-pantomime','p2-the-rise-in-importance-of-the-domestic-chicken-2-in-5-rep-sai','p2-the-purpose-of-facial-expressions-a-thieu-em-dash','p2-the-city-of-great-zimbabwe-f-oan-2-rep-sai','p3-the-future-of-the-world-s-languages','p3-recording-history','p3-sydney-opera-house','p3-the-contradiction-of-tourism']
expected={x['job']:x for x in json.load(open(repo/'import/word-batch-42/source-review.json'))};reviews=[]
for id in ids:
 raw=args.raw if (args.raw/(id+'.json')).exists()else args.extra;d=json.load(open(raw/(id+'.json')));e=expected[id];assert d['sources']==e['draftSources'],'Source fingerprint changed; re-review required';fix=[]
 def replace(a,b):
  global d
  d=json.loads(json.dumps(d,ensure_ascii=False).replace(a,b));fix.append([a,b])
 def split_summary(index,marker):
  g=d['groups'][index];t=g['content'][0];at=t.index(marker);g['content']=[t[:at].strip(),t[at:].strip()];fix.append('Restored summary paragraphs')
 if id=='p1-the-oldest-leather-shoe':
  replace('Otzi','Ötzi');fix+=['Notes transcribed from PDF: three bold subheadings, main bullets and nested dash bullets; omitted unrelated Tel Aviv line in Word']
 elif id=='p3-grimm-s-fairy-tales':
  d['title']="Grimms’ Fairy Tales";assert d['subtitle']=='Tales for all time';fix+=['Used Word 12ApGKLj6rhZlk1byfpAllCb5R3nR0UEG, matching PDF opening In the early 19th century; other Word version not used']
 elif id=='p3-tick-tock-body-clock':
  d['title']='Tick Tock Body Clock';replace('From bacteria to bacteria','From buffalo to bacteria');replace('We may take the clock on the wall','We may curse the clock on the wall');replace('timekeeping abilities required','timekeeping activities required');d['groups'][1]['sourceInstructions']='Questions 30–35 Complete the summary using the list of words. Choose the correct answer and move it into the gap.'
 elif id=='p3-what-is-history':
  d['groups'][0]['sourceInstructions']=d['groups'][0]['sourceInstructions'].replace('claims','views')
 elif id=='p2-pantomime':d['title']='Pantomime';fix+=['Restored Pantomime spelling from PDF, not Pantomine in Word']
 elif id=='p2-the-rise-in-importance-of-the-domestic-chicken-2-in-5-rep-sai':d['id']='p2-the-rise-in-importance-of-the-domestic-chicken'
 elif id=='p2-the-purpose-of-facial-expressions-a-thieu-em-dash':
  d['id']='p2-the-purpose-of-facial-expressions';g=d['groups'][-1];g['sourceInstructions']=g['sourceInstructions'].replace('NO MORE THAN TWO WORDS','ONE WORD ONLY');g['wordLimit']='ONE WORD ONLY';fix+=['PDF ONE WORD ONLY overrides incorrect Word TWO WORDS limit']
 elif id=='p2-the-city-of-great-zimbabwe-f-oan-2-rep-sai':
  d['id']='p2-the-city-of-great-zimbabwe';d['footnotes']=['* Shona: an ethnic group native to Zimbabwe and neighbouring countries'];d['groups'][0]['paragraphUnit']='sections';d['groups'][-1]['sourceInstructions']=d['groups'][-1]['sourceInstructions'].replace('boxes 22-26','boxes 24-26');fix+=['Kept internal paragraphs in B/F/G; source seven sections and Shona footnote']
 elif id=='p3-the-future-of-the-world-s-languages':
  d['groups'][1]['sourceInstructions']=d['groups'][1]['sourceInstructions'].replace('boxes 31-35','boxes 32-35')
 elif id=='p3-recording-history':
  replace('snapchats','snapshots');d['footnotes']=['* one terabyte: approx 10¹² bytes / 1,000,000,000,000 bytes'];split_summary(-1,'The data will be copied')
 elif id=='p3-sydney-opera-house':
  d['footnotes']=['* mullion: a piece of wood separating one window from another'];fix+=['Passage3 version differs from existing Passage1 Sydney Opera House; retained complete Q27–40']
 elif id=='p3-the-contradiction-of-tourism':
  d['groups'][2]['sourceInstructions']=d['groups'][2]['sourceInstructions'].replace('boxes 31-35','boxes 36-40');split_summary(0,'Tourism may be affected');alt=e['additionalSources'][0];d['sources'].append(alt);d['groups'][2]['sourceDocument']=alt['id'];fix+=['Q36–40 verified against alternate 5-page PDF; primary 4-page PAPER ASIA omits this page']
 pages={'p1-the-oldest-leather-shoe':[[3],[4]],'p3-grimm-s-fairy-tales':[[3],[3],[4]],'p3-tick-tock-body-clock':[[1,2,3,4],[4],[5,6]],'p3-what-is-history':[[3],[4],[5]],'p2-pantomime':[[1],[4],[4]],'p2-the-rise-in-importance-of-the-domestic-chicken-2-in-5-rep-sai':[[3],[3],[4]],'p2-the-purpose-of-facial-expressions-a-thieu-em-dash':[[3],[3],[4]],'p2-the-city-of-great-zimbabwe-f-oan-2-rep-sai':[[3],[3],[4]],'p3-the-future-of-the-world-s-languages':[[3],[3],[4]],'p3-recording-history':[[3],[3,4],[4]],'p3-sydney-opera-house':[[3],[4],[4]],'p3-the-contradiction-of-tourism':[[3],[4],[5]]}[id]
 for g,p in zip(d['groups'],pages):g['sourcePages']=p
 for g in d['groups']:
  if g.get('noteLayout'):g['noteLayout']['sourceVerified']=True
 d['conversion'].update(jobId=id,sourceParagraphCount=len(d['paragraphs']),review={'sourceText':True,'titleSubtitle':True,'taskPages':True,'footnotes':True,'date':'2026-10-19'})
 (out/'drafts'/(d['id']+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');reviews.append({**e,'lessonId':d['id'],'sources':d['sources'],'allReadingParagraphs':True,'allTaskPages':True,'titleSubtitle':True,'footnotes':True,'corrections':fix,'reviewed':True})
(out/'source-review.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n');print('Reviewed',len(reviews))
