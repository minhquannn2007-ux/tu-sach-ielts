import importlib.util, unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('triage',Path(__file__).resolve().parents[1]/'triage-backlog.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class TriageTests(unittest.TestCase):
 def test_partition_stable_and_never_approved(self):
  a=m.build();self.assertEqual(a,m.build());self.assertEqual(len(a),len({r['key'] for r in a}));self.assertTrue(all(not r['approved'] for r in a))
 def test_source_conflict_precedes_transcript(self):
  j={'holdReason':'Missing question 13','sources':[{'id':'x'}]};p={'x':{'pages':[{'text':'a'*200}]}}
  self.assertEqual(m.classify(j,[],p),'source-conflict')
 def test_partial_transcript_is_not_complete(self):
  j={'sources':[{'id':'x'}]};p={'x':{'pages':[{'text':'a'*200},{'text':''}]}}
  self.assertEqual(m.classify(j,[],p),'ocr-repair-or-alternate')
 def test_published_match_precedes_everything(self):
  self.assertEqual(m.classify({'holdReason':'scan','sources':[]},['published'],{}),'published-match-check')
if __name__=='__main__':unittest.main()
