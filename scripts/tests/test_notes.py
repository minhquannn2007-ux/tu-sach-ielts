import importlib.util,pathlib,unittest
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('source_notes_test',ROOT/'scripts/source-notes.py');notes=importlib.util.module_from_spec(spec);spec.loader.exec_module(notes)
def line(text,x,y,bold=False,size=12):
 chars=[{'c':c,'bbox':[x+i*4,y,x+(i+1)*4,y+size],'bold':bold,'italic':False,'size':size} for i,c in enumerate(text)]
 return {'text':text,'chars':chars,'x':x,'right':x+len(text)*4,'y':y}
class NoteLayoutTests(unittest.TestCase):
 def test_note_stops_before_singular_next_question(self):
  from unittest.mock import patch
  class Page:
   class Rect:width=600
   rect=Rect()
  lines=[line('Questions 35 – 39',50,10),line('Write your answers on your answer sheet.',50,30),line('Notes',250,50,True,16),line('• Setting lines with 35.....',50,80),line('Question 40',50,120),line('Choose the correct letter.',50,140),line('40 Which subtitle?',50,160)]
  with patch.object(notes,'_raw_lines',return_value=lines):layout=notes.extract_notes([Page()],35,39)
  text=' '.join(r['text'] for row in layout['rows'] for r in row['runs'])
  self.assertIn('{{35}}',text);self.assertNotIn('40',text);self.assertNotIn('Choose',text)
 def test_symbol_font_bullets_stay_separate(self):
  rows=notes.logical_notes([line('\uf0b7 First 33.....',68,100),line('\uf0b7 Second',68,120)],50,12,600,33,33)
  self.assertEqual(len(rows),2);self.assertEqual([r['marker'] for r in rows],['•','•'])
 def test_nested_minus_stays_an_item_and_soft_wrap_joins(self):
  rows=notes.logical_notes([line('• Parent:',68,100),line('− child 7.....',104,122),line('continued',112,143),line('• Next',68,170)],50,12,600,7,7)
  self.assertEqual([r['marker'] for r in rows],['•','−','•'])
  self.assertEqual(''.join(r['text'] for r in rows[1]['runs']),'child {{7}} continued')
  self.assertGreater(rows[1]['indent'],rows[0]['indent'])
 def test_centered_subheading_has_no_fake_left_indent(self):
  rows=notes.logical_notes([line('Coffee break',276,100,True,16)],50,12,600,7,7)
  self.assertEqual(rows[0]['align'],'center');self.assertEqual(rows[0]['indent'],0)
 def test_table_soft_wrap_preserves_distinct_bullets(self):
  self.assertEqual(notes.normalize_table_cell('• one wrapped\nitem\n\n• another\nitem'),'• one wrapped item\n\n• another item')
  self.assertEqual(notes.normalize_table_cell('Other\nobservations'),'Other observations')
if __name__=='__main__':unittest.main()
