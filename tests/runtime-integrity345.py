"""Reject an unregistered runtime mutation and malformed manifest input."""
import sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from runtime_current import CONFIG, manifest, validate_assets
from apk_manifest import info
class Integrity(unittest.TestCase):
 def test_prepared_snapshot(self):
  result=validate_assets()
  self.assertEqual(result['assets'], len(manifest()['assets']) + len(CONFIG['additions']))
  self.assertLessEqual(set(result['changed_assets']), set(CONFIG['overrides'] + CONFIG['generated']))
  if CONFIG['version'] == CONFIG['base']['version'] and not (CONFIG['overrides'] or CONFIG['additions']):
   self.assertEqual(result['changed_assets'], [])
 def test_reject_lost_files(self):
  with tempfile.TemporaryDirectory() as directory:
   with self.assertRaisesRegex(ValueError,'file set differs'):validate_assets(Path(directory))
 def test_reject_native_garbage(self):
  with self.assertRaises(Exception):info(b'not an Android manifest')
if __name__=='__main__':unittest.main()
