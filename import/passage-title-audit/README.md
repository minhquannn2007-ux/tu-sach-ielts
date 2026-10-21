# Printed title review

`title` is the catalog/search label. `passageTitle` is the heading actually printed above the reading: use the exact source wording, or `null` when no heading is printed. Never display “No title”, a filename, an inferred topic, or a rewritten catalog label inside an untitled passage.

Before publishing a new lesson, inspect the reading's opening page (which may follow a question page), plus every task page. OCR and Word can omit image headings; a missing text match is not proof that a title is absent. Record `review.printedTitleChecked: true` and `review.printedTitleSource` with the source SHA-256, one-based PDF page, and finding. If the source is cropped, masked, missing, or a different question version, hold the title decision and report the issue instead of guessing. The same rule applies to group titles and note/flow/diagram headings.

The dated audit inventories all 798 published lessons and all 497 structured group titles. It explicitly retains 21 lessons whose original source was not recovered, and 18 group titles whose matching complete task page was unavailable or unreadable. These are unresolved, not certified clean. Source-text matches establish title presence, not an exact typography audit. Two masked passage headers establish that a title exists but still require clearer originals for exact wording.

The audit removes six source-absent passage headings, restores two plural words, and restores Goya's full printed title. Catalog IDs, labels, paragraphs, questions, and answer keys remain unchanged. The renderer supports explicit printed titles in both single-passage and Full Test modes; it retains compatibility for pre-audit lessons.

Run:

- `node scripts/check-reviewed-data.mjs` (includes the publication title gate)
- `HAPPY_DOM_MODULE=/path/to/happy-dom/lib/index.js node scripts/tests/passage-titles-dom.mjs`
- `node scripts/check-reviewed-answer-keys.mjs`
