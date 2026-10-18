# Reviewed scan batch 29

Ten Passage 1 lessons, 130 questions, practice mode without inferred answer keys. Original source IDs and hashes are recorded in each lesson and source-review.json. All original reading and task pages were rendered and inspected. Unmodified OCR is retained in prepared/. The source-specific adapter preserves full corrected reading spans and asserts no text is lost during paragraph splitting.

Source-specific repairs include four separate longevity footnotes; philanthropy footnote removal from the column continuation; Māori macrons; missing note gap numbers; nested dash/open-circle bullets; currency sign and ONE WORD AND/OR A NUMBER for Sydney; eleven adolescence paragraphs and five returnable endings.

Checks: source hashes, duplicate gate, schema, 13 sequential question numbers, all ten lessons exercised through the exam DOM and submitted without scores; global CBT instructions; full-test frames, persistence and submission. Python suite 53 passing. No browser visual QA was available; source PDF layout was visually checked and rendered note structure was checked through the DOM.

Commands: repair-batch29.py with --cache and --output, then publish-batch29.mjs with output/cache, publish-reviewed-lessons.mjs. The publisher has an exact ten-job allowlist; it does not automatically approve arbitrary OCR.
