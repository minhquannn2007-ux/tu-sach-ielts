# Free batch converter v3

## Converter 3.18: cross-page question continuations

After the reading and question groups have begun, a page prefix before the next
Question/Questions heading continues the preceding group. A page without a new
heading also continues that group. Append it to question text, never reading
paragraphs. Preserve the source-page list for review. Exact 13/14-question,
unique-number and option-bank gates still apply; incorrect printed ranges and
duplicate source numbers remain held. Regression test covers an MCQ continuing
at the top of the next page before a new task header. Batch 18 recovered six
native sources with this rule. All drafts still require source visual review.

## Converter 3.17: full-bank boundaries (2026-10-13)

Recognize a complete expected option-code sequence before locating the start of
MCQ, multiple-answer, sentence-ending or summary banks. Mixed `A word`, `B` on
its own line, and `C  word` must not cause the first inline option to enter the
prompt or summary. Exact sequence checks still reject missing/duplicate codes;
grammatical A inside a sentence is not automatically an option. Detached summary
banks now support lists of phrases and words-and-phrases as well as words.

Repeated nonempty prompts inside a question group stay held as
`duplicate-question`; empty completion prompts are not duplicates. This detects
the two identical Radiometric analysis prompts in Sea Change for Salinity.

Regression on the same 171 cached Passage 3 jobs: 15 structural drafts with the
earlier batch, 33 with 3.17 after the duplicate-source gate; no converter errors.
These counts include already published/duplicate lessons and are not counts of
new publishable lessons. All 34 pre-gate drafts passed one-way source-text
comparison; that comparison does not prove complete reading coverage or visual
layout. Drafts remain private and require source/layout review. 36 Python tests
and validation of all 350 existing website lessons pass. No website content is
added or rewritten by this converter improvement.

The website's shared sample/renderer owns controls. The converter extracts source content and rules into **private practice drafts**; it never creates keys or publishes unchecked lessons. A successful conversion is not a source-review approval.

## Run a batch

```bash
python scripts/select-download-batch.py --cache /absolute/pdf-cache --output import/next-download-batch.json --max-jobs 100
# The assistant fetches the observed canonical Drive URLs through the connected Drive plugin.
python scripts/bulk-import.py extract --cache /absolute/pdf-cache --output /absolute/source-transcripts --workers 6
python scripts/convert-batch.py --cache /absolute/pdf-cache --output /absolute/private-conversion-output --workers 6
```

There is no seven-lesson limit. Omit `--max-jobs` on conversion to process every cached unfinished job. `--include-reviewed` runs a regression batch without changing published lessons. Both the extract and convert stages use separate processes because PyMuPDF does not support simultaneous threads: https://pymupdf.readthedocs.io/en/latest/recipes-multiprocessing.html . No paid API, secret API key, account creation or ongoing server is needed.

The Drive connection belongs to the assistant: the download manifest is a metadata checkpoint, not a script that can silently access the account. Do not store temporary bearer download URLs in it.

## Outputs and gates

- `drafts/*.json`: source title/case, paragraphs, questions and controls, always `status: draft`, `mode: practice`, no key.
- `reports/*.json`: per-job reasons, selected variant, source SHA, version and source pages.
- `transcripts/*.json`: free OCR of scans with confidence information; scans stay held until typography, text and figures have been checked. Existing SHA-matched preparation is reused.
- `batch-report.json` and `review-queue.json`: resumable queue, duplicate-source warnings and counts. Cached work is reused unless source bytes, converter/schema code, title/flags change, or `--force` is given. Failed revisions remove stale drafts.

Each native draft passes question count/numbering, unique option-code sequence, declared bank range, nonempty contents, exact source word limit/reuse, paragraph range and one control per question/slot. Multiple blanks under a single sentence share the same question number and have separate slot indices. Matching Names derives person/researcher/organisation/region from the actual task. TRUE/FALSE and YES/NO are selected from the printed answer labels, not inferred from wording such as “views”. Detached banks are reassigned only when exactly one task on the source page declares the matching range. The website's own structural validator is run once over the batch.

Native Note Completion preserves font emphasis, bullet nesting, hanging indentation and source spacing. Parsed typography remains `sourceVerified: false` until source review. Source titles can differ from the filename in punctuation, but absent titles are held rather than invented. Ambiguous merged tables, diagrams, flow charts, broken source content and unknown instructions stay held. This deliberate boundary prevents plain OCR from replacing arrows or flattening a diagram into a list.

## Review and publish

Compare source content/layout, resolve report warnings, and set note `sourceVerified` only after review. Add a real topic photo and its attribution. Set lesson status to `reviewed`, put the resulting data in `dist/lessons`, run the shared catalog validator, then publish the whole approved batch using the Sites workflow. Do not approve all drafts by changing a flag without checking the source. Existing graded lessons are retained.

## Verification checkpoint

The current regression batch covers 27 candidate jobs / 30 cached PDFs: 17 structured drafts pass all data gates; 10 are held (3 scan jobs, 3 diagrams/flow charts, 2 known damaged sources, 1 absent title, 1 table requiring layout review). These are **conversion test results**, not newly published lesson counts. Download, source-review, cover selection and publication time are not included in the local extraction benchmark. The second run reuses all 27 checkpoints.

Run `python -m unittest discover -s scripts/tests -v` and `node scripts/check-reviewed-data.mjs` after converter/schema changes. Actual PDF regression output is retained privately under `import/converter-v3`.

Subtitle filter: collapse source PDF line breaks and repeated whitespace into one paragraph, preserving words, hyphens, punctuation and capitalization. The reading pane wraps this paragraph naturally; publication validation rejects remaining CR/LF characters in subtitle data. This rule does not flatten passage paragraphs or note-completion layouts.

Matching Headings display: omit paragraph letters in the reading pane; the numbered heading gap identifies the target paragraph. Retain source paragraph identifiers internally for mapping and evidence. Apply the shared display rule to existing lessons and set `displayParagraphLabels: false` for newly converted heading tasks. Matching Information retains paragraph letters.

Subtitle boundary detection: before passage content begins, recognize short leading lines by italic metadata or font size greater than the dominant body font. Native PDFs may render italic text without an italic flag. Handle a subtitle sharing a PDF block with the first paragraph, keep title continuation at the same bold title size, and capture subtitle before paragraph-letter splitting. Reviewed data was audited against cached source PDFs (see `subtitle-boundary-audit.json`); no paragraph content is paraphrased.

Fast native batch: `convert-batch.py --native-only` leaves scan sources in review without repeating OCR. Its cache fingerprint includes this mode, so a later OCR-enabled run can retry them. Subtitle classification compares both dominant body size and italic metadata across the source page; a PDF using misleading italic flags for the entire body must not promote its first paragraph to subtitle.

Footnotes: preserve leading *, **, † or ‡ and exact source definitions, including those without a colon. Store separately in `footnotes` and render after the passage, italic, with a 12px gap. Keep inline reference markers. A referenced term whose definition is absent from the PDF is recorded for source review rather than invented.

Page-number filter: omit standalone numeric lines at the top/bottom page edge even when a PDF embeds them in a paragraph block. Keep dates and question numbers within the content area. Publication validation rejects empty reading paragraphs. Sources with dropped preambles, detached labels, or note layouts unsupported by the shared renderer remain in review.

Note layout v2: reconstruct PDF glyphs in x-order on a shared baseline so bullets cannot drift to the end of text. Treat the Unicode minus (−) as a nested list marker. Join only aligned, nearby continuation lines; preserve independent bullets, bold section labels and their indentation. Centered secondary titles use alignment, not a large left margin. Keep words and numbered blanks unchanged. In table cells, collapse single PDF-width line wraps while retaining blank lines and new list items. Parallel date/content columns remain held for an explicit layout adaptation.

Matching Names list titles use `List of Names`, `List of Researchers`, etc.: `List` and the noun start with uppercase letters, while `of` is lowercase. Normalize source capitalization during conversion and rendering; preserve the list subject.

Flow-chart Completion is a separate `flow-chart` group: source-checked starting node and ordered rows with left/right nodes, root branch arrows, left-chain arrows and parallel plus signs. Use editable HTML text with standard gap inputs, not raster text or a list of blanks. Unreviewed flow layouts remain held. The canonical sample now contains 14 variants.

Two-column passages: extract paragraph boundaries from the source PDF line indentation/spacing, not the column or text-block boundary. Join genuine sentence continuations across columns/pages. Record sourceParagraphCount during conversion; the shared validator rejects later accidental paragraph merging. Re-audit older imports against native PDF geometry before marking paragraph layout checked.

Matching Information CBT instructions: render “The text has seven paragraphs, <strong>A–G</strong>. Which paragraph contains the following information?” with paragraph count spelled out in English. If the source permits reuse, append “You may choose any letter more than once.” to the same instruction paragraph. No <br>, separate block or italic reuse line; natural wrapping with available pane width is allowed to prevent overflow. The same shared instruction renderer applies to all imported lessons. Retain source instructions verbatim for validation. Homepage combines all legacy and data cards in one title A–Z sort, rerun after the asynchronous catalog loads; never leave old cards appended below the alphabetized new catalog.

Note extraction must end at the next Question or Questions heading, including a single numbered question on the same source page. This prevents duplicate paper instructions, option letters and the next MCQ from being embedded inside the note body. The Leatherback Turtles source is the regression case. Native tables misclassified as note rows remain held or are rebuilt explicitly from their source rows; never approve interleaved cells as a plain note layout.

Symbol-font bullet U+F0B7 is a list marker and must normalize to •; it must never merge several note items into one line. The Science of Sleep is the source regression case. Source-verified additional unnumbered blanks in the same question use explicit slot indices (e.g. {{33:1}}) and questions[].slots, preserving one question number. Do not infer such slots without source review. For source-reviewed table emphasis, tableCellBold lists row:column coordinates; Conformity uses 0:0 for Compliance. Download selection skips recorded hold reasons to avoid repeatedly downloading known blocked sources. Held sources require a separate repair/OCR workflow.

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

## Alternate variants / converter 3.15
Download other stored PDF versions of unfinished jobs when the first version is a scan or damaged, then process them in the existing concurrent converter. Keep the source-ID/SHA provenance of the version actually converted. A raster title must be checked visually; do not accept its subtitle as the lesson title. Numbered acronym definitions such as `1 UCLA: ...` are footnotes, rendered separately in italics. Source auditing removes already checked footnote definitions when comparing reading text interrupted by a PDF page break; footnote text is independently compared to the source. Source-specific date/content notes use `labelRuns` and `labelWidthEm` in each note row to align the body while preserving bold labels; empty label arrays retain aligned continuation rows. `repair-variant-batch.py` replays only known PDF-reviewed adapters into drafts, including reading subheadings and true paragraph boundaries. Run source audits and practice controls before approval; never equate a structural draft with publication.
## Converter 3.19 — 15 October 2026

True/False/Not Given and Yes/No/Not Given CBT instructions start directly with "Choose TRUE ..." or "Choose YES ...". Omit the entire paper opening question "Do the following statements agree ...?", including variants referring to the writer's views/claims or Reading Passage numbers. Apply via the shared data renderer and sample/legacy sync. Preserve the source opening in `sourceInstructions` for parsing and provenance.

CBT instructions omit the positioning word "below" for every question type (for example, "Label the diagram", "Complete the notes", "Answer the questions", and "list of headings"). `dist/exam-data.js` applies this to every data lesson, including Full Test. `scripts/sync-question-template.mjs` removes it only inside `.sec-inst` containers in the canonical sample and legacy HTML. Run that sync after importing legacy HTML. Keep `sourceInstructions` verbatim for PDF provenance, and preserve "below" in reading text, question prompts and answer choices. Validate with `scripts/tests/cbt-instructions.mjs`.

- A headings task can precede the reading pages. Do not treat subsequent reading pages as question continuation merely because a question group already exists. Track whether questions after the reading have actually begun. Keep the 3.18 continuation fix for genuine multi-page question groups.
- Native word banks can contain multiple options per row. An inline-marker fallback is allowed only if the complete declared A–… sequence occurs exactly once in order; incomplete or duplicate sequences remain held.
- Treat generic `PAPER + PDF` names like `PDF`/`PAPER` when selecting the job title hint. Match multiline titles embedded at the end of introductory instruction blocks without including the instructions in reading text.
- Batch 19: 71 jobs reprocessed from current Drive sources and available alternatives; 14 new reviewed lessons published (4 P1, 7 P2, 3 P3). The 18 structurally successful drafts include legacy duplicates and source-content failures; they are not all approved.
- Hold Public art programs: research update: source Q20–23 describe willpower/self-control experiments unrelated to the art reading. Continue holding William Gilbert's incorrect paragraph A. Do not publish these just because schema validation passes.
- Preserve Food flavor's six reading subheadings and the parental-involvement reading's bullet list. Exact reviewed adapters are in `scripts/publish-batch19.mjs`.
- Evidence: `import/mass-batch-19/source-audit.json`, `reading-completeness.json`, and `import/mass-published-19.json`. Reading completeness compares the full normalized source span, including internal paragraph labels and separately retained footnotes, rather than only checking each extracted paragraph is a source substring.
- Validation: 40 Python tests; all 14 lesson interaction tests; catalog/data checks; full-test, home controls, and tablet-resizing regression checks. No browser visual QA was available during this batch; original PDF task pages and title pages were inspected.

## Converter 3.20 / batch 20 — 15 October 2026

- Processed 31 unfinished jobs from 42 freshly fetched source variants. Approved 14 practice lessons: 7 P1, 3 P2, 4 P3; total 409 including 11 legacy pages. Manifest: `mass-published-20.json`; private source audit and full reading-span checks: `mass-batch-20/`.
- Classification tasks can print their A/B/C bank before the answer-sheet instruction. Adapt them to Matching Features with a checked List of Categories and preserve the original reuse permission.
- Preserve worked heading examples as `examples: [{paragraph, value}]`. Print the exact heading in bold directly above its paragraph, with no “Example:” label, border, background, number or answer gap. Omit this heading from the visible draggable bank entirely. Retain the complete source bank only in data for provenance and lookup. Exclude examples from question numbering and keep other answers returnable. Validate examples refer to real paragraphs and bank values. Never concatenate examples into adjacent numbered prompts.
- Accept “Answer these questions” as Short Answer Questions. Recognize the source OCR typo “coffect” in the Brains trust instructions without altering sourceInstructions.
- Remove standalone “Turn over ▶” page furniture from reading/question extraction; never include it in a paragraph or note. Batch 20 fixes TEMPERATURE RISING's artwork title, subtitle and repeated running heading through an explicit source-reviewed adapter.
- Corrected temporary title hints for Sweet Trouble and The fascinating world of attine ants exclude internal folder annotations. Include job title in converter cache fingerprints, so corrected hints invalidate stale reports. The publisher retains original job/source identity.
- Hold The Life of Louis Braille: its source note heading incorrectly says “The characteristics of the camel”. Still hold missing options, ambiguous heading mappings, diagram layouts and broken source numbering rather than inventing replacements.
- Validation: 44 Python tests, 14 practice interaction tests, fixed-example/returnable-heading tests, shared instructions, full-test and home controls. Source PDF title/task pages inspected; browser visual QA unavailable. No answer keys added. Existing no-below and direct Choose TRUE/YES instruction rules remain active.

## Converter 3.21 / batch 21 — 15 October 2026

Heading-example display correction: shared renderer and canonical HTML sample now follow the supplied computer-test screenshot. `passage-example-heading` is plain bold heading text above the paragraph; the example heading is absent from the option bank. Applied to all five published lessons with examples: A Digital Cinema of the Mind?, Changes to the Soviet Union's working week, How should reading be taught?, Saving languages, The Accidental Scientist. `heading-examples-dom.mjs` discovers all affected lessons and checks placement, exact text, omission from the bank, returnable answers and unchanged question count. This rule applies automatically to future converted lessons; source example metadata is preserved.

- Published 11 reviewed practice lessons (4 P1, 4 P2, 3 P3), total 420 including 11 legacy pages. Reprocessed 25 pending jobs using 36 source variants, reusing current PDFs from batch 20 and fetching 27 remaining variants through connected Drive.
- `reading_blocks` moves only an exact native title to its visual position when it was appended after body text in the PDF object stream. Use nonblank line positions so subtitle blocks with large leading blank areas do not precede the title. Never globally sort two-column reading blocks.
- Attach detached single-letter paragraph labels to exactly one body line on the same baseline, to their right. This restores missing/shifted A/B content in Scottish brochs and Japanese Bizen. Ambiguous labels remain held.
- Summary word banks may say “Complete the summary of sections E and F using ...”. Parse as Summary Completion with a word bank and preserve the exact restriction as `summaryScope` in CBT instructions. Existing paragraph-source restrictions remain separate.
- Replay explicit checked table regions, guitar date rowspan, table bold/italic text, dental/houseplant subtitles and label grouping using `scripts/repair-batch21.py --batch <batch> --cache <PDF-cache> --jobs <jobs>`. It creates drafts only. Dental matching instructions name the bank's professionals despite the source's reversed wording.
- Railroad's Early Developments and Modern Train Systems are reading subheadings. Preserve them as headings rather than joining them to body paragraphs. Keep separate italic footnotes in Scottish brochs and Digital Cinema.
- Source audit omits standalone native title lines when checking body continuity: some titles occur after body text in PDF extraction order. Title content is still independently checked. Source completeness compares the entire normalized reading span after removing separate source labels/title furniture and separately retained footnotes.
- Evidence: `mass-batch-21/source-audit.json`, `reading-completeness.json`, `mass-published-21.json`. Checks: 47 Python tests, all 11 new practice interactions, data/catalog validation, CBT instructions, and full-test/home-controls regression. Source PDF title/task pages visually inspected; browser QA unavailable.

## Converter 3.22 / batch 22 — 15 October 2026

- Processed 30 pending jobs from 30 freshly fetched native-priority PDFs; 24 structural drafts, 23 source-reviewed lessons published (3 P1, 3 P2, 17 P3). Total 443 lessons including 11 legacy pages: P1 151, P2 161, P3 131.
- Important false scan gate: many native paper PDFs end with an extra page containing only a page number or “BLANK PAGE”. Ignore that final sheet only after page-number removal leaves no content (or only BLANK PAGE), and only if it has no raster images. Image-only pages still require OCR/source review. Never skip a short question page. All normal numbering/content checks remain in force.
- A source that passes text extraction can still render corrupt fonts. Hold “What kind of structure will make living in space comfortable for us?”: PDF question pages have broken font/xref objects and unreadable visual text. Do not publish merely because native text/schema succeeds. Two image-only source jobs also remain held.
- `publish-batch22.mjs` explicitly selects the 23 reviewed jobs, preserves date-based note typography and source footnotes, restores five reading subheadings in Manage Your Energy, Not Your Time, and uses the visually verified singular title The cost of brand loyalty. Do not infer the visible title solely from filename or hidden native text.
- Audits/manifest: `mass-batch-22/source-audit.json`, `reading-completeness.json`, `mass-published-22.json`. All 23 complete reading spans checked, all source title/task pages inspected, 49 Python tests, 23 practice interaction tests, CBT instructions, example headings, full-test and home controls passed. Browser visual QA unavailable. No answer keys added; no interface redesign.

## Batch 23 — 15 October 2026

- Downloaded and tested 43 small PDF variants across 41 pending jobs. These are image-only scans; the blank-final-sheet fix cannot recover their text. No scan was published from structural guesses. A title-boundary error on the empty native Yawning source is also an OCR requirement, not proof of readable text.
- Published two additional native sources with explicit adapters: Undergraduate students: Guidelines to students on literature courses (P1), and Travelling Plants (P3). Total 445 including 11 legacy pages: P1 152, P2 161, P3 132.
- `repair-batch23.py` creates drafts only. Undergraduate uses the visually checked table rows 6–10, excluding instruction rows incorrectly detected as merged table cells. Both title lines form its title. Travelling Plants associates the detached A–D option labels with exactly one text line to the right on the same baseline; the printed MCQ was checked visually. Do not apply this source adapter to arbitrary PDFs.
- Hold Coins – the first form of money: instructions request paragraph G but the printed reading stops at F with an unlabelled final paragraph. Hold Our Sense of Smell: heading instructions say 14–19 while printed prompts include 20. Do not silently repair source inconsistencies.
- Evidence: `mass-batch-23/source-audit.json`, `reading-completeness.json`, `mass-published-23.json`. Both full reading spans and all title/task pages checked. Data/catalog, new practice interactions, CBT instruction rules, home controls and full-test tests passed. Browser visual QA unavailable; no shared interface changes or answer keys.

## Batch 24 — reviewed scan imports, 15 October 2026

- Ran the free Tesseract pipeline for all 43 small PDF variants retained from batch 23, using eight single-thread OCR workers. Reusable unmodified OCR JSON, text and source hashes are saved in `mass-batch-24/prepared/`. Reuse them; do not fetch or OCR these variants again unless the source hash changes. Zero-page PDFs, missing question pages and low-quality OCR remain held. Confidence scores alone do not approve a lesson.
- Published four scan-based practice lessons: Advertising needs attention, Bondi, Using video diaries to collect research data from children (P1), and Child’s Play in Medieval England (P3). Total 449 including 11 legacy pages: P1 155, P2 161, P3 133.
- `repair-batch24.py` contains only explicit source-reviewed adapters. It retains two-column reading order and page continuations, uses checked paragraph boundaries, records OCR corrections, restores missing printed question numbers, and preserves the video diary notes' bold section headings, centered title and indented bullets. Child’s Play retains eight paragraphs A–H and its ten event options; there is no reuse instruction in the source. Paragraphs damaged by OCR were transcribed from the visible scan, not inferred.
- Original scan hashes and unmodified OCR remain separate from corrections. See `mass-batch-24/source-review.json` for every reviewed source page and correction list. All 14 scan pages were visually checked, including complete reading text and task content. `publish-batch24.mjs` checks the exact selected jobs, source hash and lesson schema before any catalog mutation. Do not apply the adapter's approval to other scans.
- Data/catalog, all four practice interactions, CBT instruction rules, home filters/manual full test, and full-test engine tests passed. No answer keys or shared interface changes. Browser visual QA unavailable.

## Batch 25 — 15 October 2026

- Reused the persisted OCR sidecars from batch 24. Reviewed all 20 printed pages of five sources. Published four new practice lessons: Australia’s cane toad problem and The world’s first cities (P1), The conquest of malaria in Italy (P2), Images and Places (P3). Total 453 including 11 legacy pages: P1 157, P2 162, P3 134.
- Duplicate detection found the misspelled queued job `p1-the-baobaps-of-madagascar` already exists as `p1-the-baobabs-of-madagascar`. Do not count it as a new lesson. Existing body/questions retained; restored its missing separate italic Malagasy footnote and reference mark, with the scanned source recorded as footnote evidence. Job links to the existing lesson and carries `duplicate_of`.
- `repair-batch25.py` explicitly transcribes damaged OCR regions from the reviewed scans, keeps nested note bullets/headings and word limits, and restores the five reading subheadings in The world’s first cities. They are body section headings, not a subtitle. Cane toad cover is the original source photograph extracted from its page, with source attribution.
- Images and Places has six sections but eight body paragraphs: sections B and E each have a continuation paragraph. Heading question indices are 0, 1, 3, 4, 5, 7; do not flatten the internal paragraphs or add extra heading gaps. Visible A–F reading labels remain hidden in Matching Headings mode. Preserve source bank text and no extra reuse permission.
- Malaria has eight labelled paragraphs A–H. Its printed Matching Information instructions do not allow repeated letters. OCR lost the labels and scrambled paragraph D's lines; both were restored from print. Summary blank 16 was misread as 216 by OCR and checked against source.
- `mass-batch-25/source-review.json` records page coverage and corrections; raw OCR and hashes remain in batch 24. `mass-published-25.json` separates four new `lessons` from one `updatedLessons` entry. Publisher checks source hashes, schema and expected duplicates before mutation. All new practice interaction tests, catalog/data, shared CBT instructions, home filters/manual full test and full-test engine passed. Browser visual QA unavailable. No answer keys or shared interface changes.

## Batch 26 — 15 October 2026

- Reused OCR already saved in batch 24, without new downloads. All 17 pages of four selected scans visually reviewed. Published Building a New Future and Sleep Study on Modern-Day Hunter-Gatherers Dispels Popular Notions (P1), Multi-tasking and the brain and New Technology in New Zealand’s Health Service (P2). Total 457 including 11 legacy pages: P1 159, P2 164, P3 134.
- New `reviewed-ocr.py` shares hash verification, numbered question groups, exact note rows, source-review records and draft serialization for explicitly reviewed adapters. It does not infer layouts, approve arbitrary OCR, or publish. `repair-batch26.py` contains the checked corrections and transcriptions for only these four sources. Earlier batch adapters remain reproducible.
- Multi-tasking: choose the complete alternate source `1XkfsqLWLojCxqQ8wuw30sY4YxiZOF0GT`. Six sections contain seven body paragraphs because B has two paragraphs. Heading indices 0, 1, 3, 4, 5, 6; no extra gap at B continuation. E continues onto the following page. Original bank researcher names and repeated-letter permission retained.
- New Technology: five paragraphs A–E. Both Matching Information and Matching Names explicitly allow repeated letters. Do not carry the no-reuse rule from the previous batch into this source. Corrected paragraph D's damaged OCR from print; full title and summary retained.
- Building: six original paragraphs. Remove map labels from OCR prose; they are source illustration labels. Page-edge text, factory dates and refrigeration details restored from print. Notes retain three bold headings and source bullets.
- Sleep: nine original paragraphs. OCR omitted entire napping/circadian passages and note rows, so those were transcribed from visible source. Preserve the full printed title. Question 1 says 10,000 years, not OCR's 40,000. All nine note gaps 5–13 and three bold note headings checked.
- `publish-batch26.mjs` rejects duplicate IDs and normalized titles within the same passage as well as changed source hashes before any mutation. Evidence: `mass-batch-26/source-review.json`, `mass-published-26.json`. All four practice interactions, data/catalog, CBT instructions, home/manual test and full-test engine tests passed. Browser visual QA unavailable. No answer keys or shared interface changes.

## Batch 27 — 15 October 2026

- Reused persisted scan OCR; visually checked all 15 source pages. Published How deserts are formed, Memory in plants, The history of the Celtic language (P2), and The origin of language (P3). Total 461 including 11 legacy pages: P1 159, P2 167, P3 135.
- `repair-batch27.py` restores explicit source text lost to page curvature and skew. Deserts retains nine paragraphs A–I and no repeated-letter permission. Memory retains six paragraphs A–F, permits repeated letters only in Matching Information, and restores the complete Matching Names group 20–22 omitted by OCR. Its two summary paragraphs remain separate.
- Celtic retains seven paragraphs A–G, including E's cross-page continuation. Matching Information does not permit reuse; the researcher group does. Proper names, dates and sentence gaps checked directly against the source. Do not infer reuse from another group or another lesson.
- Origin has eight body paragraphs and a separate italic Neanderthals footnote with its reference mark. Printed MCQ range is 27–31, misread by OCR as 27–37; this is an OCR correction, not a source inconsistency. Endings 32–37 retain all eight options; questions 38–40 select THREE from seven options, stored as `mc-two` with `selectionCount:3` and internal A–G codes. No option letters appear in visible CBT options.
- Shared reviewed-OCR helper now accepts multiple summary paragraphs, optional separate footnotes, and multiple-answer question counts. It still creates drafts only. Exact source review evidence is `mass-batch-27/source-review.json`; publication manifest is `mass-published-27.json`.
- Data/catalog, all four practice interactions, CBT instructions, home/manual test and full-test engine passed. An additional DOM check verified the three-answer limit, deselect/reselect, returnable endings, and separate footnote. Browser visual QA unavailable. No answer keys or shared interface changes.

## Batch 28 — 15 October 2026

- Fetched eight small native-priority sources through connected Drive. Published four P3 practice lessons: A New Voyage Round the World, Rights for apes, No title – Charles Darwin, No title – Mirrors. Total 465 including 11 legacy pages: P1 159, P2 167, P3 139.
- `repair-batch28.py` uses a read-only PageProxy for two exact reviewed native PDFs. In their PDF text-object streams, summary banks occur after later question groups, although they are visually next to their summaries. Assert every code and bank text against the checked lists, then move the plain-text bank before the following task header. Original PDFs, styled source blocks and source auditing remain unchanged. This is not a generic detached-bank bypass.
- A New Voyage retains all nine paragraphs in column order; its A–I word bank belongs to summary 32–35. Rights for apes retains seven paragraphs; its A–J word bank belongs to summary 27–31, not MCQ 32–36. No visible option letters in CBT banks.
- The Charles Darwin and mirror sources genuinely have no printed title. Both ask the candidate to choose a suitable title. Use neutral UI labels rather than an answer option or inferred correct title. Stable IDs remain `p3-no-title-charles-darwin` and `p3-psychological-responses-to-mirror-images`. `sourceTitleAbsent` and explicit neutral-label verification mark this decision. Full body/question comparisons still pass; native source audit reports only the intentionally non-source UI title for these two. The publisher accepts only that exact discrepancy for the two explicit jobs, not other title/subtitle/footnote errors.
- Green Fingers and Green Thoughts is already a legacy page; do not add another card despite its current structural parse succeeding. Hold Flower Power, The lost animals of Australia and REFRACTION for printed instruction ranges inconsistent with the actual numbered rows/gaps; detailed reasons now recorded in jobs.json.
- Evidence: `mass-batch-28/source-audit.json`, `source-review.json`, `reading-completeness.json`, `mass-published-28.json`. All 16 published source pages visually reviewed; four complete reading spans independently compared. Data/catalog, all four practice interactions, CBT instructions, home/manual test and full-test engine passed. Browser visual QA unavailable. No answer keys or shared interface changes.

## Reviewed scan batch 31
Eight additions (2 P2, 6 P3), 491 total lessons including legacy. Adapter: scripts/repair-batch31.py; source audit: import/mass-batch-31/source-review.json. Reuse the persisted OCR in import/prepared, keep source hashes and restore column/page continuations only from inspected print. Preserve summary paragraph breaks, paper option mappings internally, source-specific reuse permissions and separate footnotes. The 14 confirmed source-content/instruction holds are recorded in import/source-content-holds.json and enforced by the shared catalog publisher. Do not release these holds without reviewing a corrected source.

## Reviewed scan batch 32
Nine practice additions (4 P2, 5 P3), total 500 including 11 legacy pages. Exact source adapters: scripts/repair-batch32.py; audit: import/mass-batch-32/source-review.json. Reuse existing raw OCR, but do not trust average confidence as proof of completeness: Memory page-two blocks and five Humanities fragments needed direct transcription from print. Recover merged column fragments without moving them into the wrong paragraph (Children and Symbols C). Preserve all source summary paragraph breaks, number/word limits, matching reuse permissions, original title case and separate footnotes. All 14 source-content holds remain blocked.

## Reviewed diagram import — batch 33

`repair-diagram-batch.py` uses `diagram-layouts.json`: source IDs, exact page crops,
original arrow artwork, explicit label masks and HTML caption coordinates. It is
an adapter for these 16 reviewed sources, not automatic approval of new diagrams.
Retain original diagram arrows; mask only printed labels, preserve all fixed
wording and keep captions at their source positions. Clean tonal shading without
redrawing linework. Final canvases use measured text lines and only the space actually needed for
full-length fields; global percentage side padding is not used. Captions have
transparent backgrounds and remain in their reviewed positions.

Diagram banks use drag/drop, not typed answers or visible A–G codes. No word limit
is invented for a bank task. The shared renderer accepts `diagram.bank` and
explicit `reuse`; targets use the same return/move behaviour as summary completion.
Multiple blanks under one number use `{{13}}` and `{{13:1}}`, with `slots:2`;
the two values still represent only one answer in navigation and submission.

Reviewed cross-source repairs: The Olympic Torch retype omits G Athens Olympics
(2004), restored from its PAPER p3; Q13 has two blanks. Termite Mounds retype
omits material in E/G and corrupts F; original PAPER controls the reading text.
Its two pending variants map to one published lesson. Tikopia retype changes a
fixed diagram caption and omits “Chisel”; original PAPER wording is retained.
Wedding cakes Q7–9 is a bordered two-column note table, not one flattened list.
Cinema Q5–8 preserves all five source rows, including 1879 and 1890. Greek Coins
retains its four bold reading subheadings; Practical Action and Roller coaster
also preserve their source section headings.

Validation: `diagram-dom.mjs` checks bank return/move, two blanks for one question,
restored bank entry, invalid coordinates, and source two-column note styling.
`batch-practice-dom.mjs import/mass-published-33.json` exercises every question and
submission in all 16 lessons. Source hash checks include original PAPER copies.

## Diagram refinement correction (all 16 batch-33 lessons)

Run `refine-diagram-assets.py --cache <source-cache>` and then
`layout-reviewed-diagrams.py --lessons <lesson-or-draft-directory>`. The source
adapter now runs both before returning publishable drafts. The first preserves
original linework, removes paper shading/background to RGBA, sharpens ink, and
restores Cinema leader pixels touched by earlier broad masks. Lake Bosumtwi keeps
R/V KALINDI and CENTRAL UPLIFT in the original artwork/font.

The second uses explicit caption line breaks, 180px fields and measured 30px
line boxes in a fixed canvas. It checks all caption boxes for intersections and
fits the canvas height to artwork plus labels. Each title sits centred in the
same figure as its diagram. Imported figures must bypass the legacy Perfume/Jenny
minimum-height observer: its unrelated 710/1120 ratio created large blank gaps.
Do not reintroduce automatic caption wrapping or arbitrary 180px minimum-width
expansion on source-sized caption boxes. Horizontal figure scrolling preserves
the reviewed geometry when the question pane is narrower.

Checks: source/refinement audit, alpha channels, all 16 rendered layout composites
inspected, measured geometry validation, diagram bank/multiple-slot DOM tests,
all batch-33 practice submissions and Full Test. Composite inspection is not a
browser screenshot test; browser QA remains unavailable in this environment.
