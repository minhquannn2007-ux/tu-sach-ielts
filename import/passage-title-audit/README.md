# Printed title review

`title` is the catalog/search label. `passageTitle` is the heading actually printed above the reading: use the exact source wording, or `null` when no heading is printed. Never display “No title”, a filename, an inferred topic, or a rewritten catalog label inside an untitled passage.

Before publishing a new lesson, inspect the reading's opening page (which may follow a question page), plus every task page. OCR and Word can omit image headings; a missing text match is not proof that a title is absent. Record `review.printedTitleChecked: true` and `review.printedTitleSource` with the source SHA-256, one-based PDF page, and finding. If the source is cropped, masked, missing, or a different question version, hold the title decision and report the issue instead of guessing. The same rule applies to group titles and note/flow/diagram headings.

The dated audit inventories all 798 published lessons and all 497 structured group titles. It explicitly retains 20 lessons whose original source was not recovered, and 11 group titles whose matching complete task page was unavailable. These are unresolved, not certified clean. Source-text matches establish title presence, not an exact typography audit. The follow-up recovered clear matching sources for both previously masked passage headers.

The audit removes six source-absent passage headings, restores two plural words, and preserves Goya's existing user-approved title. The previous Goya title edit was withdrawn because its source is explicitly excluded by the project instructions. Catalog IDs, labels, paragraphs, questions, and answer keys remain unchanged. The renderer supports explicit printed titles in both single-passage and Full Test modes; it retains compatibility for pre-audit lessons.

Run:

- `node scripts/check-reviewed-data.mjs` (includes the publication title gate)
- `HAPPY_DOM_MODULE=/path/to/happy-dom/lib/index.js node scripts/tests/passage-titles-dom.mjs`
- `node scripts/check-reviewed-answer-keys.mjs`

Follow-up: seven pending group headings are confirmed in matching complete sources and retained. Optimism and Health now has a verified source. The pencil-manufacturing source mapping is corrected to the matching text and question version. No question or answer data changed.
