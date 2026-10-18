import importlib.util,json,pathlib,sys,tempfile,unittest
ROOT=pathlib.Path(__file__).resolve().parents[2];sys.dont_write_bytecode=True
spec=importlib.util.spec_from_file_location('converter_parser',ROOT/'scripts/parse-practice.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class ConverterTests(unittest.TestCase):
 def test_blank_final_sheet_is_not_a_scanned_task(self):
  import fitz
  for label in ['','BLANK PAGE']:
   doc=fitz.open();page=doc.new_page();page.insert_text((40,60),'Blank sheet passage',fontsize=18);page.insert_textbox((40,100,550,600),'A complete reading paragraph. '*15,fontsize=12)
   page=doc.new_page();page.insert_textbox((40,60,550,600),'Questions 1-13\nComplete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1-13 on your answer sheet.',fontsize=12)
   page=doc.new_page();page.insert_text((280,25),'6');page.insert_text((40,60),label)
   title,paras,chunks,_,_=m.collect(doc,{'title':'Blank sheet passage.pdf'})
   self.assertEqual(title,'Blank sheet passage');self.assertEqual(len(chunks),1);self.assertTrue(paras)
 def test_image_only_final_page_still_requires_review(self):
  import fitz
  doc=fitz.open();page=doc.new_page();pix=fitz.Pixmap(fitz.csRGB,fitz.IRect(0,0,5,5),False);page.insert_image((40,40,500,700),pixmap=pix)
  with self.assertRaises(m.Hold) as error:m.collect(doc,{'title':'Scanned task.pdf'})
  self.assertEqual(error.exception.code,'scan-review')
 def test_late_pdf_title_is_moved_before_body(self):
  import fitz
  doc=fitz.open();page=doc.new_page();page.insert_textbox((40,120,550,650),'A source paragraph with enough native text. '*20,fontsize=12);page.insert_text((40,60),'Late native title',fontsize=18)
  page=doc.new_page();page.insert_textbox((40,60,550,650),'Questions 1-13\nComplete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1-13 on your answer sheet.',fontsize=12)
  title,paras,_,_,_=m.collect(doc,{'title':'Late native title.pdf'})
  self.assertEqual(title,'Late native title');self.assertTrue(paras[0]['text'].startswith('A source paragraph'))
 def test_detached_letters_attach_by_baseline(self):
  def block(text,x,y):return {'bbox':[x,y,x+100,y+14],'lines':[{'bbox':[x,y,x+100,y+14],'spans':[{'text':text}]}]}
  label=block('A',40,100);label['lines'][0]['bbox'][2]=48
  body=block('First paragraph.',75,100)
  out=m.reading_blocks([label,body],'Unrelated title')
  self.assertEqual(len(out),1);self.assertEqual(''.join(s['text'] for s in out[0]['lines'][0]['spans']),'A  First paragraph.')
 def test_summary_bank_restricted_to_named_sections(self):
  text='Questions 37-38\nComplete the summary of sections E and F using the list of words, A-C, below.\nWrite the correct letter, A-C, in boxes 37-38 on your answer sheet.\nSome 37 ........ prefer 38 ........ .\nA first\nB second\nC third'
  g=m.parse_group({'start':37,'end':38,'text':text,'page':0},[],None)
  self.assertEqual(g['type'],'summary-drag');self.assertEqual(g['summaryScope'],'sections E and F')
 def test_classification_bank_before_answer_sheet_line(self):
  text='Questions 19-20\nClassify the following information as referring to\nA\nfirst category\nB\nsecond category\nC\nthird category\nWrite the correct letter, A, B or C, in boxes 19-20 on your answer sheet.\nNB You may use any letter more than once.\n19 First statement\n20 Second statement'
  g=m.parse_group({'start':19,'end':20,'text':text,'page':0},[],None)
  self.assertEqual(g['type'],'matching-features');self.assertTrue(g['reuse'])
  self.assertEqual([o['text'] for o in g['bank']],['first category','second category','third category'])
 def test_heading_example_is_not_an_answerable_question(self):
  text='Questions 27-28\nReading Passage 3 has three paragraphs, A-C.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number in boxes 27-28 on your answer sheet.\nList of Headings\ni\nFirst heading\nii\nExample heading\niii\nLast heading\n27 Paragraph A\nExample\nParagraph B\nii\n28 Paragraph C'
  g=m.parse_group({'start':27,'end':28,'text':text,'page':0},[{'label':c,'text':'Text'} for c in 'ABC'],None)
  self.assertEqual(g['examples'],[{'paragraph':1,'value':'ii'}]);self.assertEqual([q['paragraph'] for q in g['questions']],[0,2])
 def test_source_heading_scope_and_wrapped_matching_targets(self):
  base='Questions 14-15\nReading Passage 2 has seven sections, A-G.\nChoose the correct heading for each section from the list of headings below.\nWrite the correct number in boxes 14-15 on your answer sheet.\nList of Headings\ni\nFirst\nii\nSecond\n14 Section A\n15 Section B'
  g=m.parse_group({'start':14,'end':15,'text':base,'page':0},[{'label':c,'text':'Text'}for c in 'AB'],None)
  self.assertEqual(g['headingCount'],7);self.assertEqual(g['headingUnit'],'sections')
  with self.assertRaises(m.Hold):m.parse_group({'start':14,'end':15,'text':base.replace('Reading Passage 2 has seven sections, A-G.\n',''),'page':0},[{'label':c,'text':'Text'}for c in 'AB'],None)
  for target in ['business person','sleep expert','historical period']:
   text='Questions 14-15\nMatch each statement with the correct '+target.replace(' ','\n')+', A-B.\nWrite the correct letter in boxes 14-15 on your answer sheet.\n14 First statement\n15 Second statement\nList of Choices\nA Choice Alpha\nB Choice Beta'
   group=m.parse_group({'start':14,'end':15,'text':text,'page':0},[],None);self.assertEqual(group['targetName'],target)
 def test_answer_these_questions_wording(self):
  text='Questions 33-34\nAnswer these questions below\nChoose NO MORE THAN THREE WORDS from the passage for each answer.\nWrite your answers in boxes 33-34 on your answer sheet.\n33 First question?\n34 Second question?'
  g=m.parse_group({'start':33,'end':34,'text':text,'page':0},[],None)
  self.assertEqual(g['type'],'short-answer');self.assertEqual(len(g['questions']),2)
 def test_turn_over_footer_is_not_reading(self):
  def line(text):return {'spans':[{'text':text}],'bbox':[40,750,200,765]}
  self.assertEqual(m.source_page_lines([line('Turn over ▶'),line('Real text')],800),[line('Real text')])
 def test_multiline_title_in_introductory_block(self):
  import fitz
  doc=fitz.open();p=doc.new_page()
  p.insert_textbox((40,40,550,300),'You should spend about 20 minutes on Questions 1-13.\nA long source title:\na review of the literature',fontsize=12)
  p.insert_textbox((40,350,550,700),'This is the first reading paragraph. '*12,fontsize=12)
  p=doc.new_page();p.insert_textbox((40,40,550,700),'Questions 1-13\nComplete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1-13 on your answer sheet.',fontsize=12)
  title,paras,_,_,_=m.collect(doc,{'title':'A long source title: a review of the literature.pdf'})
  self.assertEqual(title,'A long source title: a review of the literature')
  self.assertTrue(paras[0]['text'].startswith('This is the first'))
 def test_inline_multi_column_word_bank_requires_complete_sequence(self):
  text='A authoritarianism  B competence\nC emergence\nD learning  E observation\nF personality'
  self.assertEqual([o['text'] for o in m.options(text,expected=list('ABCDEF'))],['authoritarianism','competence','emergence','learning','observation','personality'])
  with self.assertRaises(m.Hold):m.options(text.replace('E observation','G observation'),expected=list('ABCDEF'))
 def test_heading_prelude_does_not_capture_reading_continuation(self):
  import fitz
  doc=fitz.open();p=doc.new_page()
  p.insert_textbox((40,40,550,700),'Questions 1-2\nChoose the correct heading for each paragraph from the list below.\nWrite the correct number in boxes 1-2 on your answer sheet.\nList of Headings\ni First\nii Second\n1 Paragraph A\n2 Paragraph B',fontsize=12)
  p=doc.new_page();p.insert_text((40,40),'Prelude passage',fontsize=18)
  p.insert_textbox((40,80,550,700),'A  First paragraph. '+('Reading text. '*20),fontsize=12)
  p=doc.new_page();p.insert_textbox((40,80,550,700),'B  Second paragraph. '+('More reading text. '*20),fontsize=12)
  _,paras,chunks,_,_=m.collect(doc,{'title':'Prelude passage.pdf'})
  self.assertEqual([p.get('label') for p in paras],['A','B'])
  self.assertNotIn('More reading text',chunks[0]['text'])
 def test_questions_continue_before_next_page_header(self):
  import fitz
  doc=fitz.open();p=doc.new_page();p.insert_text((40,40),'Continuation passage',fontsize=18)
  p.insert_textbox((40,80,550,400),'A source paragraph about reading and research. '*12,fontsize=12)
  p=doc.new_page();p.insert_textbox((40,40,550,700),'Questions 27-28\nChoose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27-28 on your answer sheet.\n27 First prompt\nA  Alpha\nB  Beta\nC  Gamma\nD  Delta',fontsize=12)
  p=doc.new_page();p.insert_textbox((40,40,550,700),'28 Second prompt\nA  Alpha\nB  Beta\nC  Gamma\nD  Delta\nQuestions 29-30\nDo the following statements agree with the views of the writer?\nIn boxes 29-30 on your answer sheet, write\nYES agrees\nNO contradicts\nNOT GIVEN absent\n29 First statement\n30 Second statement',fontsize=12)
  title,paras,chunks,_,_=m.collect(doc,{'title':'Continuation passage.pdf'})
  group=m.parse_group(chunks[0],paras,doc)
  self.assertEqual([q['n'] for q in group['questions']],[27,28])
  self.assertEqual(group['sourcePages'],[2,3])
  self.assertNotIn('Second prompt',' '.join(p['text'] for p in paras))
 def test_two_columns_keep_indented_paragraphs_inside_one_block(self):
  import fitz
  doc=fitz.open();page=doc.new_page(width=600,height=800)
  page.insert_text((50,70),'Two column passage',fontsize=18)
  for x,prefix in [(50,'Left'),(320,'Right')]:
   for y,text in [(120,prefix+' first paragraph starts.'),(134,'This sentence finishes here.'),(148,'      '+prefix+' second paragraph starts.'),(162,'This is another complete sentence.')]:page.insert_text((x,y),text,fontsize=12)
  page=doc.new_page(width=600,height=800);page.insert_text((50,70),'Questions 1-13',fontsize=14);page.insert_text((50,90),'Complete the notes below. Choose ONE WORD ONLY for each answer.',fontsize=12);page.insert_text((50,110),'Write your answers in boxes 1-13 on your answer sheet.',fontsize=12)
  title,paras,_,_,_=m.collect(doc,{'title':'Two column passage'})
  self.assertEqual(len(paras),4)
  self.assertEqual([p['text'].split()[:2] for p in paras],[['Left','first'],['Left','second'],['Right','first'],['Right','second']])

 def test_letter_label_is_not_subtitle_and_long_subtitle_is_retained(self):
  label={'spans':[{'text':'A','size':14,'flags':16,'font':'ArialBold'}]}
  self.assertFalse(m.subtitle_line(label,12))
  subtitle={'spans':[{'text':'A '+('long subtitle ' * 35),'size':12,'flags':2,'font':'ArialItalic'}]}
  body={'spans':[{'text':'Actual reading paragraph.','size':12,'flags':0,'font':'Arial'}]}
  prefix,rest=m.leading_subtitle([subtitle,body],12)
  self.assertTrue(prefix[0].startswith('A long subtitle'));self.assertEqual(rest,['Actual reading paragraph.'])
 def test_inline_source_labels_and_grammatical_a(self):
  import fitz
  for labelled in [False,True]:
   doc=fitz.open();page=doc.new_page(width=600,height=800);page.insert_text((50,70),'Sample passage',fontsize=18)
   page.insert_text((50,120),('A First labelled paragraph.' if labelled else 'First ordinary paragraph.')+' This reading passage contains enough native text to test label detection.',fontsize=12)
   page.insert_text((50,160),'B Second labelled paragraph.' if labelled else 'A third method is available.',fontsize=12)
   page=doc.new_page();page.insert_text((50,70),'Questions 1-13',fontsize=14);page.insert_text((50,100),'Complete the notes below. Choose ONE WORD ONLY for each answer.',fontsize=12);page.insert_text((50,125),'Write your answers in boxes 1-13 on your answer sheet.',fontsize=12)
   title,paras,_,_,_=m.collect(doc,{'title':'Sample passage.pdf'})
   if labelled:self.assertEqual([p.get('label') for p in paras],['A','B'])
   else:self.assertTrue(paras[0]['text'].startswith('First ordinary'));self.assertEqual(paras[1]['text'],'A third method is available.');self.assertTrue(all('label' not in p for p in paras))
 def test_subtitle_without_pdf_italic_flags(self):
  def line(text,size):return {'spans':[{'text':text,'size':size,'font':'Tahoma','flags':0}]}
  source=[line('The history of an iconic brand',16.1),line('The first bars of soap rolled off the line.',12)]
  prefix,body=m.leading_subtitle(source,12)
  self.assertEqual(prefix,['The history of an iconic brand'])
  self.assertEqual(body,['The first bars of soap rolled off the line.'])
  self.assertEqual(m.leading_subtitle([line('A normal first paragraph.',12)],12),([],['A normal first paragraph.']))
 def test_page_numbers_inside_native_body_blocks(self):
  def line(text,y):return {'spans':[{'text':text}],'bbox':[40,y,200,y+14]}
  source=[line('3',22),line('A paragraph continues here.',100),line('1877',400),line('5',790)]
  self.assertEqual(m.source_page_lines(source,800),source[1:3])
 def test_footnotes_preserve_markers_without_requiring_colon(self):
  self.assertEqual(m.source_footnote('* LED light-emitting diode, a type of light-source'),'* LED light-emitting diode, a type of light-source')
  self.assertEqual(m.source_footnote('** transgenes: genetic material\nfrom another organism'),'** transgenes: genetic material from another organism')
  self.assertIsNone(m.source_footnote('Spawning* occurs in fish.'))
  self.assertEqual(m.source_footnote('_________________\n* spawn: lay eggs'),'* spawn: lay eggs')
 def test_mixed_inline_and_stacked_option_codes(self):
  text='A first\nB\nsecond\nC  third\nD\nfourth'
  self.assertEqual([o['value'] for o in m.options(text,expected=list('ABCD'))],list('ABCD'))
  self.assertEqual([o['text'] for o in m.options(text,expected=list('ABCD'))],['first','second','third','fourth'])
 def test_singular_mc_header_owns_the_question_number(self):
  text='Question 40\nChoose the correct letter, A, B, C or D.\nWrite the correct letter in box 40 on your answer sheet.\nWhich outcome is most likely?\nA\nAlpha\nB\nBeta\nC\nGamma\nD\nDelta\n'
  g=m.parse_group({'start':40,'end':40,'text':text,'page':0},[],None)
  self.assertEqual(g['questions'][0]['n'],40)
  self.assertEqual(g['questions'][0]['prompt'],'Which outcome is most likely?')
  self.assertEqual([o['text'] for o in g['questions'][0]['options']],['Alpha','Beta','Gamma','Delta'])
 def test_summary_bank_starts_with_inline_first_option(self):
  text='Questions 36–37\nComplete the summary using the list of phrases, A-D, below.\nWrite the correct letter, A-D, in boxes 36-37 on your answer sheet.\nPeople prefer 36 ........ and 37 ........ .\nA first phrase\nB\nsecond phrase\nC third phrase\nD\nfourth phrase\n'
  g=m.parse_group({'start':36,'end':37,'text':text,'page':0},[],None)
  self.assertEqual([o['value'] for o in g['bank']],list('ABCD'))
  self.assertEqual(g['bank'][0]['text'],'first phrase')
  self.assertNotIn('first phrase',' '.join(g['content']))
 def test_mc_inline_first_option_does_not_enter_prompt(self):
  text='Questions 27–28\nChoose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27-28 on your answer sheet.\n27 Main reason?\nA first\nB\nsecond\nC third\nD\nfourth\n28 Main result?\nA first\nB\nsecond\nC third\nD\nfourth\n'
  g=m.parse_group({'start':27,'end':28,'text':text,'page':0},[],None)
  self.assertEqual(g['questions'][0]['prompt'],'Main reason?')
  self.assertEqual(len(g['questions'][1]['options']),4)
 def test_duplicate_source_prompts_are_held(self):
  with self.assertRaises(m.Hold) as error:
   m.check_duplicate_prompts([{'questions':[{'n':35,'prompt':'Radiometric analysis'},{'n':36,'prompt':'Radiometric analysis'}]}])
  self.assertEqual(error.exception.code,'duplicate-question')
  m.check_duplicate_prompts([{'questions':[{'n':35},{'n':36}]}])
 def test_numbered_acronym_footnote(self):
  self.assertEqual(m.source_footnote('1 UCLA: University of California at Los Angeles'),'1 UCLA: University of California at Los Angeles')
  self.assertIsNone(m.source_footnote('1 What is the main reason?'))
 def test_separate_footnote_entries_not_soft_wraps(self):
  self.assertEqual(m.split_source_footnotes('* NASA: space agency\ncontinued definition ** Kuiper Belt: beyond Neptune'),['* NASA: space agency continued definition','** Kuiper Belt: beyond Neptune'])
  self.assertEqual(m.split_source_footnotes('† one definition ‡ another definition'),['† one definition','‡ another definition'])
 def test_italic_font_metadata_on_entire_body(self):
  line={'spans':[{'text':'An ordinary first paragraph.','size':12,'flags':22,'font':'OptimaBoldItalic'}]}
  self.assertEqual(m.leading_subtitle([line],12,True),([],['An ordinary first paragraph.']))
 def test_heading_paragraph_letters_are_internal(self):
  self.assertFalse(m.paragraph_labels_visible([{'type':'matching-headings'},{'type':'matching-features'}]))
  self.assertTrue(m.paragraph_labels_visible([{'type':'matching-info'}]))
 def test_subtitle_pdf_line_breaks(self):
  text='The well-known pearl.\r\nYet its creation\n is complex.'
  self.assertEqual(m.normalize_subtitle(text),'The well-known pearl. Yet its creation is complex.')
  self.assertEqual(m.normalize_subtitle('One sentence\ncontinued'),'One sentence continued')
 def test_inline_code_and_grammatical_a(self):
  text='A\nA faster way to weave\nB\nscarcity\nC  proof\nD. welfare\n'
  self.assertEqual([o['text'] for o in m.options(text,expected=list('ABCD'))],['A faster way to weave','scarcity','proof','welfare'])
 def test_missing_first_middle_last_and_duplicates(self):
  for text in ['B\nbeta\nC\ngamma','A\nalpha\nC\ngamma','A\nalpha\nB\nbeta','A\nalpha\nB\nbeta\nB\nagain']:
   with self.subTest(text=text),self.assertRaises(m.Hold):m.options(text,expected=list('ABC'))
 def test_inline_numbering_and_no_extra_prompt(self):
  self.assertEqual(m.statements('14 First statement\ncontinued\n15. Second statement',14,15),[{'n':14,'prompt':'First statement continued'},{'n':15,'prompt':'Second statement'}])
  with self.assertRaises(m.Hold):m.statements('14 First\n16 Third',14,16)
 def test_truth_task_uses_actual_labels(self):
  text='Questions 1–2\nDo the following statements agree with the views of the writer?\nIn boxes 1–2 on your answer sheet, write\nTRUE if it agrees\nFALSE if it contradicts\nNOT GIVEN if absent\n1\nFirst statement\n2\nSecond statement\n'
  g=m.parse_group({'start':1,'end':2,'text':text,'page':0},[{'text':'Text'}],None)
  self.assertEqual(g['type'],'tfng') # Never infer YES/NO merely from the word "views".
  self.assertIn('TRUE',g['sourceInstructions']);self.assertNotIn('First statement',g['sourceInstructions'])
 def test_reuse_and_target_come_from_source(self):
  for permission in ['', 'NB You may use any letter more than once.\n']:
   text='Questions 14–15\nMatch each statement with the correct organisation, A-B.\nWrite the correct letter in boxes 14-15 on your answer sheet.\n'+permission+'14\nFirst statement\n15\nSecond statement\nList of Organisations\nA\nInstitute Alpha\nB  Institute Beta\n'
   g=m.parse_group({'start':14,'end':15,'text':text,'page':0},[],None)
   self.assertEqual(g['targetName'],'organisation');self.assertEqual(g['reuse'],bool(permission));self.assertEqual(g['bank'][1]['text'],'Institute Beta')
 def test_matching_information_section_source_wording(self):
  for phrase in ['Which section contains','Which sections contain']:
   text='Questions 14–15\nReading Passage 2 has two sections, A-B.\n'+phrase+' the following information?\nWrite the correct letter in boxes 14-15 on your answer sheet.\n14\nFirst statement\n15\nSecond statement\n'
   g=m.parse_group({'start':14,'end':15,'text':text,'page':0},[{'label':'A','text':'Alpha'},{'label':'B','text':'Beta'}],None)
   self.assertEqual(g['type'],'matching-info');self.assertFalse(g['reuse'])
 def test_reuse_source_typo_one_is_preserved(self):
  for permission in ['', 'NB You may use any letter more than one\n']:
   text='Questions 14–15\nReading Passage 2 has two paragraphs, A-B.\nWhich paragraph contains the following information?\nWrite the correct letter in boxes 14-15 on your answer sheet.\n'+permission+'14\nFirst statement\n15\nSecond statement\n'
   g=m.parse_group({'start':14,'end':15,'text':text,'page':0},[{'label':'A','text':'Alpha'},{'label':'B','text':'Beta'}],None)
   self.assertEqual(g['reuse'],bool(permission))
   if permission:self.assertIn('more than one',g['sourceInstructions'])
   self.assertEqual(g['questions'][0]['prompt'],'First statement')
 def test_matching_variants_preserve_reuse_and_target(self):
  for task,target in [('finding','research organisation'),('description','date'),('researcher','view'),('behaviour','bird'),('vegetable','description')]:
   text='Questions 14–15\nMatch each '+task+' with correct '+target+', A-B.\nWrite the correct letter in boxes 14-15 on your answer sheet.\nNB You can use any letter more than once\n14\nFirst statement\n15\nSecond statement\nList of Choices\nA\nChoice Alpha\nB\nChoice Beta\n'
   g=m.parse_group({'start':14,'end':15,'text':text,'page':0},[],None)
   self.assertEqual(g['targetName'],target);self.assertTrue(g['reuse']);self.assertIn('You can use',g['sourceInstructions']);self.assertEqual(g['bank'][1]['text'],'Choice Beta')
 def test_inline_option_bank_requires_complete_source_codes(self):
  self.assertEqual(m.expected_letters('Write the correct letter, A, B, or C, in boxes.'),list('ABC'))
  self.assertEqual([o['text'] for o in m.options('A Professor Alpha\nB Professor Beta\nC Doctor Gamma',expected=list('ABC'))],['Professor Alpha','Professor Beta','Doctor Gamma'])
  for bad in ['A Professor Alpha\nC Doctor Gamma','A Professor Alpha\nB Professor Beta\nB Duplicate']:
   with self.assertRaises(m.Hold):m.options(bad,expected=list('ABC'))
 def test_matching_feature_technique_and_people(self):
  for task,target in [('feature','location'),('technique','use'),('people','statement')]:
   text='Questions 14–15\nMatch each '+task+' with the correct '+target+', A-B.\nWrite the correct letter, A-B, in boxes 14-15 on your answer sheet.\n14\nFirst prompt\n15\nSecond prompt\nList of Choices\nA\nFirst choice\nB\nSecond choice\n'
   g=m.parse_group({'start':14,'end':15,'text':text,'page':0},[],None)
   self.assertEqual(g['type'],'matching-features');self.assertEqual(g['targetName'],target);self.assertFalse(g['reuse'])
 def test_choose_three_and_source_paragraph_restrictions(self):
  text='Questions 1–3\nChoose THREE letters, A-F.\nWrite the correct letters in boxes 1-3 on your answer sheet.\nWhich THREE are mentioned?\nA\nAlpha\nB\nBeta\nC\nGamma\nD\nDelta\nE\nEpsilon\nF\nZeta\n'
  g=m.parse_group({'start':1,'end':3,'text':text,'page':0},[],None)
  self.assertEqual(g['selectionCount'],3);self.assertEqual(g['numbers'],[1,2,3]);self.assertEqual(len(g['options']),6)
  self.assertEqual(m.completion_scope('Choose TWO WORDS from paragraphs C, D and E for each answer.'),{'sourceParagraphs':['C','D','E'],'sourceParagraphJoiner':'and'})
  self.assertEqual(m.completion_scope('Write ONE WORD from paragraphs D or E for each answer.'),{'sourceParagraphs':['D','E'],'sourceParagraphJoiner':'or'})
  self.assertEqual(m.completion_scope('Write ONE WORD from the passage for each answer.'),{})
 def test_multiple_blanks_share_one_question(self):
  text='Questions 24–26\nComplete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 24-26 on your answer sheet.\n24\nIt is ………… and ………… .\n25\nIt behaves like a ………… .\n26\nIt can ………… .\n'
  g=m.parse_group({'start':24,'end':26,'text':text,'page':0},[],None)
  self.assertEqual(g['questions'][0],{'n':24,'slots':2});self.assertIn('{{24:1}}',g['content'][0]);self.assertEqual(len(g['questions']),3)
 def test_word_and_number_limit(self):
  for limit in ['ONE WORD ONLY','NO MORE THAN TWO WORDS','NO MORE THAN TWO WORDS AND/OR A NUMBER']:
   self.assertEqual(m.word_limit('Choose '+limit+' from the passage for each answer.'),limit)
 def test_source_paragraph_range(self):
  text='Questions 14–15\nThe passage has three paragraphs, A-C.\nWhich paragraph contains the following information?\nWrite the correct letter in boxes 14-15 on your answer sheet.\n14\nFirst statement\n15\nSecond statement\n'
  with self.assertRaises(m.Hold):m.parse_group({'start':14,'end':15,'text':text,'page':0},[{'label':'A','text':'A'},{'label':'B','text':'B'}],None)
 def test_diagrams_are_held_not_flattened(self):
  text='Questions 8–13\nLabel the diagram below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 8-13 on your answer sheet.\nTitle\n8 ............\n'
  with self.assertRaises(m.Hold) as exc:m.parse_group({'start':8,'end':13,'text':text,'page':0},[],None)
  self.assertEqual(exc.exception.code,'diagram-review')
if __name__=='__main__':unittest.main()
