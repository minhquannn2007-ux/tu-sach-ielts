#!/usr/bin/env python3
"""Match pending original Drive jobs to Word metadata. Candidates only, never deduplicate by title alone."""
import argparse,json,pathlib,re,unicodedata
root=pathlib.Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--index',type=pathlib.Path,default=root/'import/word-source-index.json');ap.add_argument('--output',type=pathlib.Path,required=True);args=ap.parse_args()
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',re.sub(r'\.docx?$','',s,flags=re.I)).encode('ascii','ignore').decode().lower())
words=json.load(open(args.index));jobs=json.load(open(root/'import/jobs.json'));catalog=json.load(open(root/'dist/lesson-catalog.json'));published={x['id']for x in catalog};matches=[]
for j in jobs:
 if j['status']=='reviewed'or j.get('lesson_id',j['id'])in published:continue
 found=[w for w in words if w['part']==j['part']and norm(w['title'])==norm(j['title'])]
 if found:matches.append({'job':j,'words':found,'requiresVersionReview':True})
args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(matches,ensure_ascii=False,indent=2)+'\n');print(f'{len(matches)} candidates; all require source-version review')
