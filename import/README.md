# Free bulk import checkpoint

Batch 35 (2026-10-18): Added the second distinct Passage 3 version titled **The Voynich Manuscript** as practice-only lesson `p3-the-voynich-manuscript-alt`. Its native PDF and scanned PAPER version were checked against the published Voynich passage and against each other; the reading and Questions 27–40 are distinct. The scan was visually reviewed. The lesson has no answer key. Manifest: `mass-published-35.json`. The clean P1/P2 text-prepared jobs remain held because their flow-chart/diagram arrows and label positions need visual reconstruction.

Batch 36 (2026-10-18): Added **Forgotten forests** (`p1-forgotten-forests`) from the P1 Drive folder. The two scanned PDF/PAPER versions were OCR-transcribed and visually cross-checked page by page, including the eight-step flow-chart. It is practice-only with no answer key. Manifest: `mass-published-36.json`.

Current total: 511 structured lessons plus 11 legacy HTML lessons (522 total): P1 180, P2 177, P3 165.

Batch 18 (2026-10-15): 10 held native Passage 3 PDFs re-fetched through Drive;
6 source-reviewed practice lessons added (manifest `mass-published-18.json`).
Converter 3.18 keeps question continuations before a new header on the next page
and records all source pages. These prefixes must not enter reading paragraphs.
Ted Hughes's two-line source title is joined, including its footnote marker;
the source footnote is retained. Four other PDFs stay held for incorrect printed
question ranges or duplicate printed numbers. No numbering was guessed.
Total 381 pages: P1 133, P2 144, P3 104 (370 structured + 11 legacy).
Interface and tablet compatibility files are unchanged.

Tablet compatibility (2026-10-14): shared zoom layout now keeps two independent
panes from 600 CSS px upward; smaller phones retain the single-column layout.
Touch/pen divider resizing uses pointer capture, handles cancellation and ignores
secondary fingers. Existing desktop mouse resizing remains in place; keyboard
Left/Right/Home also works. Browser text autosizing is fixed at 100%. Bundled
Liberation Sans regular/bold/italic/bold-italic provides an Arial-metric fallback
on Android; genuine local Arial is preferred when present. This is not a licensed
Microsoft Arial webfont and cannot guarantee identical glyph rasterization across
devices. Font license accompanies assets. Shared files cover sample, legacy pages
and generated exam frames; the Full Test shell also loads the font stylesheet.
Verification: tablet-resize.mjs, full-test-core.mjs and 364 real-data gates passed.
Physical tablet/Safari visual QA was unavailable.

Batch 17 (2026-10-14): 14 source-reviewed Passage 3 practice lessons added from
converter 3.17 drafts. Re-fetched 16 exact PDF source versions through connected
Drive; 14 hashes matched and their title/subtitle/task-page layouts and source
text were checked. The Digital Revolution in Studying History and The hazards of
multitasking have changed source hashes and damaged font/text objects; held.
Manifest: `mass-published-17.json`; source audit: `converter-3.17/source-audit.json`.
Total 375 pages (364 structured + 11 legacy): P1 133, P2 144, P3 98.
Interface files remain exactly the restored pre-Inspera-upload version.

The authenticated Drive connector supplied `drive-inventory.json`: 799 outer
items, 398 lesson folders and 1,148 sources, grouped into 779 candidate jobs by
passage and exact normalized title. Grouping by title is provisional, not proof
that two files contain the same version. Never publish a renamed folder as a
separate lesson without checking its contents.

`jobs.json` is the resumable queue. The first 15 jobs have 18 source files prepared
under `prepared/`; the reviewed subset is represented by `dist/lessons/*.json`.
No API keys, paid calls or Drive access credentials are used or stored.

1. Read source metadata and fetch through the connected Drive plugin. Use its
   authenticated `file_uri` to materialize a local file as `<file-id>.pdf` in a
   scratch cache; never store expiring bearer URLs.
2. Run `python scripts/bulk-import.py extract --cache <cache> --output <scratch-output> --workers 6`.
   Text extraction is attempted first; scanned pages use local Tesseract. Hashes
   and extractor versions make restarts skip completed work. OCR includes page
   word boxes and confidence; its result is not a publishable lesson or answer key.
3. Compare PDF/PAPER versions, especially flagged or low-confidence sources.
   Transcribe source tasks and rules before adapting CBT instructions. Do not
   repair unclear text by guessing. For graded lessons, each question needs an answer, explanation and evidence.
   New practice lessons omit grading and require source-faithful content and layout.
4. Put only reviewed lesson data in `dist/lessons/`. `exam.html` and
   `exam-engine.js` own the shared interface and interactions. Canonical question
   styling remains `reading-sample.html`. Diagram assets/coordinates require
   individual source inspection; do not publish raw OCR approximations.
5. Run `node scripts/publish-reviewed-lessons.mjs`, then template synchronization,
   functional checks, and the supported Sites publication workflow.

This queue does not process itself after the assistant turn ends. New batches
must be run during an active session. Source/layout review
remains the bottleneck; free local OCR does not solve those tasks automatically.

Current user choice: omit answer keys for new batches. Practice lessons require only faithful passage, questions, source rules and controls. Use `mode: "practice"` and no `key` field. Seven additional practice-only lessons were created by the text-PDF parser; source/content quality gates still apply. This removes answer authoring from the critical path.

Second published batch: seven additional practice lessons, including source-faithful notes and table rows, Matching Names/Organisations, headings and Choose TWO. Seventeen Drive lessons are now reviewed. `source-notes.py` retains native font emphasis and note indentation; unsupported flow charts, diagrams and ambiguous source layouts stay held for visual handling.


The production batch workflow is now documented in [CONVERTER.md](CONVERTER.md). `convert-batch.py` has no seven-lesson cap, runs PDF jobs in six separate processes, resumes from source/code fingerprints, tries cached source variants and validates every draft with the website schema. Download selection is saved separately; scans/diagrams remain review jobs.


Mass batch on 12 October: 100 newly fetched sources plus 10 previously held jobs were processed. Thirty-nine lessons passed source text comparison, source layout review, shared schema and practice-mode functional checks and were added together. Imported lesson total: 56. Seventy-one jobs stay held; no held draft was published. Source paragraphs, subtitles and split titles were corrected during review; the Health in the Wild source note table and Brassicas merged cell keep their table structure.


Batch on 13 October: fetched 100 additional source PDFs through the connected Drive plugin. Converter v3.9 produced 22 native drafts; 78 sources remain held. Source text, title/subtitle, task-page, instruction, note-layout and footnote reviews approved 20 lessons (1 P1, 19 P2). Moon Search is held because source Questions 21–23 were copied from another passage; Creative Problem-Solving is held because its malformed “more than one” reuse instruction needs explicit adaptation. 150 structured lessons are now indexed. Full Test and homepage title search automatically include the approved additions. Browser visual QA was unavailable; functional controls and shared data gates were tested.


Batch on 13 October (mass-5): fetched 100 additional Drive PDFs. 45 native drafts passed structural conversion; 41 new Passage 2 lessons passed source text, title/subtitle, task-page, instruction, note-layout and footnote reviews. Two native candidates duplicate existing Goya/Seeing in the Sea HTML and were not added; Australia's Artistic Heritage has an interrupted source paragraph, and Children's Literature needs table-cell typography preservation. 191 structured lessons are indexed. Matching Information instructions now spell paragraph counts in English, use “The text has”, preserve bold paragraph ranges, and place the prompt and optional “You may choose any letter more than once.” in a single continuous paragraph without forced breaks. Shared renderer, sample and six legacy pages are updated. Homepage sorts all original and imported cards together A–Z after asynchronous load; manual selection and the catalog also sort by title. Functional tests cover these regressions; browser visual QA remains unavailable.


Batch mass-6 on 13 October: fetched another 100 Drive source PDFs (13 P2 and 87 P3 candidates). Native conversion produced 21 drafts and held 79. Source content, subtitle, instructions, option-bank and note-layout reviews approved 19 lessons: 4 P2 and 15 P3. Photography is held for damaged subtitle text and a paragraph-specific word-source restriction needing explicit CBT adaptation. Reducing Exposure to Indoor Air Pollution in Developing Countries is held for flattened bold reading subheadings. Moon Search remains unpublished by user instruction. 210 structured lessons are indexed. New lesson controls, submission, source rules, homepage sorting/search and Full Test integration were tested; browser visual QA unavailable.


Batch mass-7 on 13 October: fetched 100 more Passage 3 sources. 101 candidate jobs were considered because one source title had a duplicate queue entry. Native conversion produced 28 drafts; 26 source-reviewed Passage 3 lessons were approved. Two candidates remain held: A Closer Examination of a Study on Verbal and Non-Verbal Messages needs separate reading subsection headings; Travel Writing needs merged table cells preserved. Leatherback Turtles notes stop before the following singular Question 40; the converter now recognizes singular/plural question headers, with a regression test. The Intuitive Geologists note table was explicitly rebuilt from its source rows; Why Societies Collapse keeps its two separate summary subheadings. 236 structured lessons are indexed. Source rules, notes, question controls and submission were tested; browser visual QA unavailable. Moon Search stays unpublished.


Batch mass-8 on 13 October: fetched 41 previously unprocessed Passage 3 sources, excluding queue items with recorded hold reasons. Eight source-reviewed lessons were added after source text, title/subtitle, task-page, instruction, note/table and functional checks; 33 remain held. The Science of Sleep retains separate symbol-font bullet items and two input slots for Question 33. Conformity preserves the bold Compliance table label and separate summary paragraphs. 244 structured lessons are indexed (255 including the 11 legacy HTML pages). Converter regressions, new lesson controls/submission, homepage search/sort and Full Test passed. Browser visual QA unavailable. Moon Search remains unpublished.

## Source-reviewed repair batch 9 (2026-10-13)
Seven native PDF lessons published in practice mode (3 P1, 2 P2, 2 P3). Total 251 structured lessons plus 11 legacy pages = 262 (P1 108, P2 95, P3 59). Source audits and manifest: `repair-batch-9/`, `repair-published-9.json`. Reproduce these exact source adapters with `python scripts/repair-reviewed-tables.py --cache <PDF-cache> --output <draft-directory>`; outputs remain drafts, never auto-approved. Preserves table merged cells, partial italic text, source note indentation, and paired blanks. The explicit source typo "You may use any letter more than one" is retained verbatim and interpreted as reuse permission; never infer permission where absent. 110 remaining cached native attempts are held, recorded with reasons; Moon Search stays unpublished. Browser visual QA unavailable; source-page inspection, source text comparisons and DOM controls were checked.

## Converter 3.10 / batch 10 (2026-10-13)
Footnotes: each source entry is its own array item and italic paragraph. Split distinct *, **, †, ‡ entry markers inside one PDF block; join only soft wraps within the same definition. Fixed Pluto’s two merged entries and audited existing data; schema rejects joined footnote entries. Regression: `scripts/tests/footnotes-dom.mjs`, Python split test. Long definitions may naturally wrap at narrow widths; never force nowrap/overflow. Matching Information also recognizes source "Which section contains" / "Which sections contain" while keeping paragraph ranges and reuse permissions checked. Four P2 source-reviewed practice additions, no answers: Antarctic architecture: Halley VI, Jellyfish – The Dominant Species, Methods of increasing fish production, Technology and the Future Workforce in the US. Manifest/audits: `mass-published-10.json`, `mass-batch-10/`. Total 266 pages: P1 108, P2 99, P3 59 (255 structured + 11 legacy). Source-page visual review and DOM controls passed; browser visual QA unavailable.

## Converter 3.11 / batch 11 (2026-10-13)
Grouped re-conversion of 94 cached native sources: 18 structural drafts, 10 source-reviewed practice lessons published (7 P1, 3 P2). Remaining drafts stay held for missing reading, footer contamination, source mismatches or typography review. Matching Features recognizes finding/description/researcher/behaviour/vegetable and the source typo persom; target names can be multiword and the source can omit "the". Explicit "You can use any letter more than once" is retained and adapted as reuse permission. Never add reuse when absent. Picnic reviewed subheadings retain source underline via `run.underline`; Studies source reading headings are separate heading paragraphs. Reviewed drafts, source comparisons and manifest: `mass-batch-11/`, `mass-published-11.json`. Total 276 pages (P1 115, P2 102, P3 59), 265 structured plus 11 legacy. Regression controls: `HAPPY_DOM_MODULE=<happy-dom-module> node scripts/tests/batch-practice-dom.mjs [manifest]`. Source images reviewed, DOM inputs/drag returns/submission passed; browser visual QA unavailable.

## Converter 3.12 / batch 12 (2026-10-13)
84 cached native sources reprocessed by grouped label/title fixes. 19 structural drafts, 10 source-reviewed practice additions published (9 P1, 1 P2); remaining candidates are held for source-title/subtitle errors, missing reading, footer contamination, or source comparisons. Actual enlarged source titles may differ from annotated filenames and always require visual verification. Single-letter A is never a subtitle. Inline paragraph labels require a complete sequential series starting at the beginning of the reading; grammatical A inside a normal paragraph is retained. Longer source italic subtitles are preserved as one continuous subtitle. Dyes note subheadings retain five source underlines. Audits/manifest/reviewed drafts: `mass-batch-12/`, `mass-published-12.json`. Total 286 pages: P1 124, P2 103, P3 59 (275 structured + 11 legacy). Python converter and all 10 new practice DOM controls/submission passed. Source-page visual inspection performed; browser visual QA unavailable.

## Converter 3.13 / batch 13 (2026-10-13)
Restored canonical Site source after temporary-workspace maintenance; original PDFs fetched again through connected Drive. 24 sources processed; 10 structural drafts, 8 source-reviewed practice lessons selected (6 P2, 2 P3). Complete explicit A/B/or C source ranges allow single-space inline banks; incomplete/repeated banks stay held. Matching Features also recognizes feature/people/technique. Shoppers target typo "researcher" adapted to the actual List of Technologies. The power of music held: Q23-26 concern multitasking, not music. Sea Change for Salinity held: Q35/Q36 duplicate Radiometric analysis without distinction. Moon Search remains held. Source comparisons and all question/title pages reviewed; browser visual QA unavailable. Audits/manifest: `mass-batch-13/`, `mass-published-13.json`. Reusable source audit/contact-sheet utility: `scripts/audit-source-batch.py --batch <batch> --cache <PDF-cache> --output <contact-sheets>`. Total 294 pages: P1 124, P2 109, P3 61 (283 structured + 11 legacy). No answer keys added.

## Converter 3.14 / large batch 14 (2026-10-13)
Processed 193 pending native-priority jobs together (208 cached source associations), created 54 structural drafts, published 36 source-reviewed practice lessons (3 P1, 25 P2, 8 P3). Remaining drafts remain held for source mismatches, incomplete reading, source examples/layout, diagram review or legacy duplicates. Total 330 pages: P1 127, P2 134, P3 69 (319 structured + 11 legacy). Internal mc-two family now supports explicit selectionCount 2 or 3 with complete source bank ranges; limits, restore, numbering and instructions use the source count, and homepage labels say Choose THREE where appropriate. Unannotated legacy Choose TWO retains its five-option schema. Matching Features recognizes arbitrary source nouns in the same "Match each ... with the correct ..." structure, optional researcher(s), and source Types of ... banks. Single-space option fallback still requires a complete exact code sequence. Completion sourceParagraphs/sourceParagraphJoiner preserve restrictions such as paragraphs C, D and E or D or E; validator rejects missing/altered restrictions. Reviewed source repairs: actual title Controversies in Australian Prehistory (Mungo folder), full earlier reading and secondary Mungo subheading restored; Work and Family subheadings separated; Energy summary bullets/indents rendered through source note layout while retaining Summary Completion labels. William Gilbert held: paragraph A is copied from Crowding and Density. Of horses teeth and regulation held: Q20/Q21 duplicate prompts. Source report/audits/selected drafts and published manifest: `mass-batch-14/`, `mass-published-14.json`. Replay title/subheading fixes with `scripts/repair-large-batch.py --batch <batch> --cache <PDF-cache>`; this never approves drafts. Checks: 30 Python converter regressions; 319 real-data validation; all 36 new practice controls/submission; explicit Choose THREE cap/reselect/restore and paragraph restrictions; homepage/manual-set and 3-frame full-test regressions. Source title/task-page visual inspections performed; browser visual QA unavailable. Original PDFs are unchanged on Drive. Scan/photograph jobs remain a separate OCR plus visual review queue; do not mark them published merely because OCR is available.

## Alternate-source batch 15 (2026-10-13)
Fetched 200 additional source PDF variants through authenticated Drive; 190 candidate job reports yielded 20 structurally valid drafts. Published 17 newly source-reviewed practice lessons (6 P1, 10 P2, 1 P3), excluding existing John Ray/Why Good Food Tastes Good versions and the mismatched The power of music questions. Total 347 pages: P1 133, P2 144, P3 70 (336 structured plus 11 legacy). Copy Your Neighbour has a raster title, manually checked on the PDF; its real subtitle is preserved separately. Source note subheadings/bullets checked for Lichens, Saving the kiwi and Heritage Gardens. The car industry keeps bold dates in an aligned first column, including empty date cells on continuation rows. A closer examination keeps four reading subheadings, the numbered UCLA footnote and separate source quotation paragraphs. Replay exact reviewed repairs with `scripts/repair-variant-batch.py --batch <batch>`; this never approves drafts. Converter 3.15 recognizes numbered acronym definitions, and source audits remove checked footnote entries from reading comparisons across PDF page breaks while still verifying each footnote itself. 31 converter regressions, all 17 practice control/submission tests, 336 data gates, homepage/manual-set and Full Test regression checks. Source-page visual review performed; browser visual QA unavailable. No answers added. Reports, private drafts, source audits and manifest: `mass-batch-15/`, `mass-published-15.json`.

## Passage 3 batch 16 (2026-10-13)
Fetched every previously uncached Passage 3 PDF variant in one authenticated Drive pass and processed all 171 pending Passage 3 jobs together. Converter 3.16 produced 15 ordinary structural drafts; 11 non-duplicate, source-consistent lessons were approved. Three additional native sources were recovered with reviewed title handling, for 14 published Passage 3 lessons total. A title and italic subtitle stored in one PDF block are now separated; an artwork-only title can be supplied only through an explicit `visualTitle` field after visual inspection; a singular `Question 40` header may own the MCQ number without repeating it in the body. Mixed inline/stacked answer-bank letters are supported only when they form the complete expected sequence. Reducing exposure to indoor air pollution retains its full two-line title, continuous subtitle and six separate bold reading subheadings. Group Behaviour remains held because its source begins mid-passage; Sea Change for Salinity remains held because source Questions 35 and 36 duplicate “Radiometric analysis”; existing Green Fingers and Why Good Food versions were not duplicated. Reports, reviewed drafts, source comparisons and manifest: `mass-batch-16/`, `mass-published-16.json`. Total 361 pages: P1 133, P2 144, P3 84 (350 structured plus 11 legacy). All 14 practice controls/submission, 350 real-data gates, homepage/manual selection and Full Test passed. No answers were added.

## Forgotten forests — follow-up review, 2026-10-18
Rechecked all five pages of source 1js_oi60gzAhCJt3o3kLy0z4zz9Tj_1av (same SHA-256 as the published lesson). The original 11 reading paragraphs, subtitle and all 13 question texts were confirmed. Corrected Q6–9 from diagram to an eight-stage linear flow-chart: proper CBT instruction, four inline numbered inputs, responsive HTML boxes, seven original raster arrows extracted from the PDF instead of a redrawn SVG. Source note heading rows now retain their bullet markers without invented bold. No answers or grading added. Details/crop/hash: forgotten-forests-review.json. New linear flow rendering is isolated from the earlier branching flow-chart; both paths tested, plus all controls, restore/submission and Full Test. Catalog remains 522 lessons (511 structured +11 legacy). Browser screenshot QA unavailable; PDF pages and raster extraction inspected.

## Word-assisted batch 40 — 19 October 2026
Added 22 practice lessons: 8 P1, 10 P2, 4 P3. Catalog: 554 structured +11 legacy =565 total (P1 193, P2 195, P3 177). Original Drive job first, corresponding Word second; both source fingerprints retained. Inspected 38 paired candidates, selected only 22. Seven note layouts explicitly transcribed from original PDFs. Restored four missing footnote groups, source paragraphs, subtitle and example-heading indices, and corrected Word-only instruction/content errors. What is history remains held for a missing source phrase. UI files are unchanged. See CONTENT_AUTHORING.md and word-batch-40/source-review.json for continuation.

## Source-reviewed scan batch 44 — 19 October 2026
Eight practice lessons added (5 P2, 3 P3), with no answer keys: Boring buildings; The discovery of a baby mammoth; The Coastal Archaeology of Britain; Why do singers lose their voices?; Management Brains; Inside the mind of a fan; How have humans changed?; Book Review: The Discovery of Slowness. Total 596 structured +11 legacy =607 (P1 200, P2 214, P3 193). Original Drive PDF downloads matched all eight cached OCR source SHA-256 values. All four pages per source were visually reviewed; severely damaged OCR sections were transcribed from readable page images. Retained Boring buildings B/E and Singers C/E/F internal paragraph blocks, Mammoth's separate Pleistocene footnote, Humans' nine two-column paragraphs and two summary paragraphs, and Slowness' original raster map. Source sections vs paragraphs, researcher/person target nouns, explicit reuse and all word/selection limits were checked. No shared UI/engine changes.

Replay exact adapters with `python scripts/review-batch44.py --cache <PDF-cache> --output <draft-directory>`; outputs remain drafts. `mass-batch-44/approved.json` pins the eight reviewed source and draft fingerprints and original map crop. `scripts/publish-batch44.mjs <PDF-cache>` only accepts that allowlist, rejects changed sources/drafts and duplicates, then regenerating the catalog is required. The original scan queue was not treated as automatically approved. Manifest: `mass-published-44.json`; audits/drafts and exact manually transcribed P3 reading text: `mass-batch-44/`.

## Word-assisted batch 45 — 19 October 2026
Added six practice lessons (1 P1, 5 P2), all paired with Word transcriptions and visually checked original Drive PDFs: Living walls – a successful environmental project; Bristlecone Pines; Understanding climate change; The advantages of being bilingual; Children's comprehension of television advertising; The many benefits of mangroves. Total 602 structured +11 legacy =613 (P1 201, P2 219, P3 193). No answer keys or shared interface changes. Explicit note adapters preserve source bold/underline/italic headings, bullets and indentation. Bristlecone restores two separate footnotes and sentences missing from Word. Children restores the missing B ending and original 4-or-5 age thresholds. Climate retains its Year table and two summary paragraphs. Living walls uses the original PDF raster arrow and five HTML flow stages; Mangroves retains all seven heading targets and two summary paragraphs.

Two Word filenames required explicit original-source title matching (successful/succesful and a filename asterisk; plural mangroves versus an annotated singular job name). Carnivorous Plants was reviewed but excluded as an existing published lesson; no existing lesson was overwritten. These are reviewed candidate mappings, never automatic fuzzy approvals. Replay `scripts/review-word-batch45.py --workspace <paired-cache-workspace> --output <draft-directory>` to produce unapproved drafts. `word-batch-45/approved.json` pins exact draft and Word/PDF hashes; `publish-word-batch45.mjs` rejects changed bytes, duplicates and existing source-content hard holds. Source records and layout evidence remain in `word-batch-45/`; manifest is `mass-published-45.json`. Candidates with missing questions/options or contradictory source ranges remain unpublished, including the existing Our Sense of Smell hold.
