#!/usr/bin/env python3
"""Match pending original Drive jobs to Word metadata. Candidates only, never deduplicate by title alone."""
import argparse,json,pathlib,re,unicodedata
from word_source_scope import allowed_word
root=pathlib.Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--index',type=pathlib.Path,default=root/'import/word-source-index.json');ap.add_argument('--output',type=pathlib.Path,required=True);ap.add_argument('--name-variants',action='store_true',help='Also propose names with trailing source-edit annotations or passage numbers; never approves a match');args=ap.parse_args()
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',re.sub(r'\.docx?$','',s,flags=re.I)).encode('ascii','ignore').decode().lower())
def variant(s):
 s=re.sub(r'\.(?:docx?|pdf)$','',s,flags=re.I)
 # Remove only a trailing editorial annotation, never an arbitrary subtitle.
 s=re.sub(r'\s*\((?=[^)]*(?:chưa|chua|rep|thiếu|thieu|đoạn|doan|italic|no pdf))[^)]*\)\s*$','',s,flags=re.I)
 return norm(re.sub(r'\s+(?:p[123]|[123])$','',s,flags=re.I))
words=json.load(open(args.index));jobs=json.load(open(root/'import/jobs.json'));catalog=json.load(open(root/'dist/lesson-catalog.json'));published={x['id']for x in catalog};matches=[]
for j in jobs:
 if j.get('publicationBlocked')or j['status']=='reviewed'or j.get('lesson_id',j['id'])in published:continue
 found=[w for w in words if allowed_word(w,j['part'])and norm(w['title'])==norm(j['title'])]
 kind='exact'
 if not found and args.name_variants:
  found=[w for w in words if allowed_word(w,j['part'])and variant(w['title'])==variant(j['title'])];kind='name-variant'
 if found:
  possible=[c['id']for c in catalog if c['part']==j['part']and any(norm(c['title'])==variant(w['title'])for w in found)]
  matches.append({'job':j,'words':found,'requiresVersionReview':True,'matchKind':kind,'possiblePublishedTitleMatches':possible})
args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(matches,ensure_ascii=False,indent=2)+'\n');print(f'{len(matches)} candidates; all require source-version review')
