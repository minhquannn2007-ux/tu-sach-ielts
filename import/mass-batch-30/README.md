# Batch 30: reviewed practice lessons and bulk OCR preparation

Published allowlist: two Passage 2 lessons (War of the Plants; Australian Sports Guidelines) and six Passage 3 lessons (The role of accidents in business; Look who was talking; Sign, baby, sign!; Reading Greek; Studying the history of medieval Britain; The value of literary prizes). 110 questions in practice mode; no inferred answer keys.

All original reading/task pages for these eight sources were rendered and visually inspected. Source-specific corrections, original hashes and question counts are in source-review.json; reproducible adapters are in scripts/repair-batch30.py. Full corrected reading spans are asserted to survive paragraph splitting. Pay particular attention to the two-column paragraph C heading in Sign, baby, sign!, its two separate footnotes, the cross-page footnote in Reading Greek, and the seven internal heading mappings in Australian Sports Guidelines. Preserve the source's unusual numerical claims and historical dates; do not rewrite them based on outside knowledge.

## Bulk preparation, not automatic publication

ocr-source-selection.json records one grounded PDF source per 158 pending jobs. ocr-preparation.json records the resulting 604 pages and source hashes: six PDFs opened with zero pages; 47 sources had a zero-page, short-text or low-confidence warning (including those six); 111 had no such heuristic warning. This does not establish text completeness or accuracy. Only four of these newly prepared sources entered the separately reviewed publication allowlist above. All raw transcripts and word boxes are persisted under import/prepared, with other priority-source transcripts also retained there. No page PNGs or original Drive files were copied into the website.

Extractor version 3 adds explicit quality flags. Every OCR transcript still requires visual review, even with high average confidence. Zero-page files and high-confidence fragments are flagged. Version 2 cached OCR is upgraded without re-running OCR or changing its text. Six zero-page sources need alternate PDFs. The triage script now also considers short text and low confidence before placing a source into transcript review candidates. Re-run scripts/triage-backlog.py after changing job status.

## Validation

Eight lessons pass source-hash, duplicate, data-schema and sequential-numbering gates. All eight were exercised and submitted in the real exam engine through Happy DOM. CBT instructions and three-frame full-test persistence/submission checks pass. Python suite: 57 tests. Source PDFs were visually inspected; browser visual QA was unavailable.

The site now contains 483 lessons: Passage 1 169, Passage 2 169, Passage 3 145. To reproduce a draft, pass the original PDF cache plus --prepared import/prepared to repair-batch30.py. The publisher uses an exact allowlist and never approves other OCR automatically.
