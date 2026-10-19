"""Fail closed: only verified direct children of the user's three Word folders."""
import json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
POLICY=json.loads((ROOT/'import/word-source-policy.json').read_text())
def allowed_word(word,part):
 return word.get('part')==part and bool(word.get('parentVerifiedAt')) and POLICY['folders'][str(part)] in word.get('parent_ids',[])
def require_word(word,part):
 index=json.loads((ROOT/'import/word-source-index.json').read_text())
 verified=next((w for w in index if w['id']==word['id'] and allowed_word(w,part)),None)
 if not verified:raise ValueError('Word source lacks verified direct parent in approved p1/p2/p3 folder: '+word['id'])
 return verified
