# Batch 41 — original PDF + Word review, 19 October 2026

13 practice lessons: 1 Passage 1, 7 Passage 2, 5 Passage 3. No answer keys.

`source-review.json` pins reviewed sources and corrections; `drafts/` remains unapproved. Published copies are in `dist/lessons/`. `selection.json` includes 29 inspected candidates, not 29 published lessons. `parser-report.json` records initial extraction outcomes, not review approval.

Not published: Grimms’ Fairy Tales Word is a different reading version from its paired scan; Canal Discovered declares six A–F but prints seven A–G; incomplete-numbered Word/PDF sources and diagram/table/note adapters remain pending. Do not use title-only matching to approve them. Group Behaviour uses the complete original PDF because Word omits Q40; the PDF’s own small transcription typos are retained, not reconstructed. Word title/paragraph/word-limit errors are corrected only against the inspected original. Matching Information now preserves the source paragraph/section unit; existing lessons default to paragraphs.

Four reviewed reading adapters can be replayed with `scripts/prepare-word-batch41.py WORKSPACE`, using the paired source hashes. This produces drafts only. Source-specific paragraph-block mapping and title/subtitle fixes must never become guesses for unrelated lessons.
