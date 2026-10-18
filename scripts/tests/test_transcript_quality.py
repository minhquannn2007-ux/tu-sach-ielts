import importlib.util,unittest,tempfile,json,hashlib
from pathlib import Path
from unittest.mock import patch
s=importlib.util.spec_from_file_location('ocr',Path(__file__).resolve().parents[1]/'bulk-import.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
class QualityTests(unittest.TestCase):
 def test_zero_pages_is_not_clean(self):
  self.assertTrue(m.transcript_quality([])['needsRepair'])
 def test_high_confidence_fragment_still_needs_repair(self):
  q=m.transcript_quality([{'page':1,'text':'BLANK PAGE','method':'ocr','confidence':99}]);self.assertEqual(q['shortTextPages'],[1]);self.assertTrue(q['needsRepair'])
 def test_high_confidence_ocr_still_requires_visual_review(self):
  q=m.transcript_quality([{'page':1,'text':'a'*150,'method':'ocr','confidence':99}]);self.assertFalse(q['needsRepair']);self.assertTrue(q['requiresVisualReview'])
 def test_v2_cache_upgrade_does_not_run_ocr_or_change_text(self):
  with tempfile.TemporaryDirectory() as tmp:
   p=Path(tmp);(p/'x.pdf').write_bytes(b'cached source');sha=hashlib.sha256(b'cached source').hexdigest();pages=[{'page':1,'text':'original transcript '*30,'method':'ocr','confidence':96}]
   (p/'x.json').write_text(json.dumps({'id':'x','sha256':sha,'extractor_version':2,'pages':pages}))
   with patch.object(m.fitz,'open',side_effect=AssertionError('Must not OCR cached source')):m.extract({'id':'x'},p,p)
   d=json.loads((p/'x.json').read_text());self.assertEqual(d['pages'],pages);self.assertEqual(d['extractor_version'],3);self.assertTrue(d['requires_review'])
if __name__=='__main__':unittest.main()
