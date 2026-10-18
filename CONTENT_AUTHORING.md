# Canonical Reading sample

`dist/reading-sample.html` is the authoritative sample for all 12 question variants. Open `/reading-sample.html` to inspect and interact with every variant in the original Goya exam scaffold: resizable passage/question panes, 3 Part footer, question navigation and answer progress. Filled headings/endings/summary gaps support pointer dragging back to their banks, dragging between matching gaps and cancellation outside valid targets. Each section is identified by `data-question-type`.

For presentation changes, edit only `<style id="ielts-question-template">` in that HTML. Rules are grouped by question type and use the existing classes and accepted original implementations. Run `node scripts/sync-question-template.mjs` before packaging every deployment. The helper generates `dist/question-template.css` and adds shared links to all lessons. Do not edit the generated CSS. Existing lessons read the same dedicated style block from the sample on load; generated CSS provides an immediate fallback when fetching is unavailable. No HTML or scripts from the sample are inserted into lesson content.

For structural or interaction changes, update the corresponding sample section and its interaction first, then adapt the matching lesson markup and handlers while preserving question IDs, content, answers, draft keys, navigation and grading. The shared loader synchronizes CSS, not arbitrary DOM replacements or sample wording. Do not claim that editing example question text changes real questions. Use the sample as the reference for new PDFs.

Diagram geometry, images, leader arrows and label coordinates remain lesson-specific. Shared styles govern font and input appearance. Match the source diagram and check for overlapping labels at the minimum canvas width.

# Adapting new IELTS PDFs

Inspect the existing lesson implementation for every question type before creating a new page. Adapt its markup, CSS, and interaction behavior; do not substitute a simpler generic control.

- Matching Information: reuse the matching grid in `dist/bai/ielts_p2_goya.html` or `seeing_in_the_sea_ielts.html`. Paragraph letters are column headers; each question is a row of radio choices. Preserve deselection, question focus, and footer progress.
- True / False / Not Given: reuse `.tfng-*` controls. Follow the custom radio structure used by `.ync-*` in the original lessons, with the correct TRUE/FALSE/NOT GIVEN text.
- Matching Headings: reuse the John Ray implementation and retain the restored original empty gap style.
- Gap filling: reuse the shared input styling and numbered placeholder.
- Diagram Labelling: sharpen and inspect the diagram, keep labels and arrows at their original relative positions, and overlay actual HTML text and inputs at the label locations. Every label, including fixed labels such as Glass Bell Jar, must be selectable HTML text rather than visible text baked into the image. Never list diagram answers underneath the figure.

Verify answer collection, restore, grading, navigation, and layout. Keep question numbering and passage content faithful to the PDF. Publish completed edits using the Sites workflow.

Use Goya's passage structure for paragraph-labelled texts: a left-aligned `.passage-sub` (18px italic, line-height 1.35), followed by `.passage-para` paragraphs with inline `.para-lbl` spans (10px right margin). Do not place paragraph letters in a separate flex column. Preserve those spans when rendering explanations. Use the existing `.sec-hdr` and `.sec-inst` presentation and adapt instructions for the on-screen interaction without answer-sheet references.

- Short Answer Questions: reuse Trail's `.me-sentence` and `.me-text` wrapping layout, replace draggable gaps with shared numbered text inputs, omit the endings bank, and state the exact word limit from the source PDF.

- CBT instructions: retain the continuous `.sec-inst` wording from existing lessons. TFNG uses “Choose TRUE ... choose FALSE ... or choose NOT GIVEN ...” as in Perfume Hunters; short answers use “Answer the questions below. Write [word limit] from the passage for each answer.” Do not convert these to paper-style definition tables. Diagram restoration must include all existing leader lines and arrowheads in the sharpened image before integrating HTML labels.

- Zoom handling: link `zoom-layout.css` and `zoom-layout.js` on every lesson and the homepage. At CSS viewport widths up to 760px use a single document column; wider views retain the draggable two-pane exam. Put matching grids in horizontal scroll regions. Diagram canvases have minimum widths (Jenny 700px, Perfume 760px) so fixed-size labels cannot overlap when the pane shrinks; their local frame scrolls horizontally. Keep browser zoom enabled, preserve text enlargement, and test viewport widths from 320 to 1920px. Do not infer a desktop browser zoom limit from mobile viewport metadata.

## Instructions for new PDF lessons

Read the source PDF instructions for every question group before authoring. The PDF is authoritative for the task, permitted answer reuse, paragraph letters/counts, numbering and exact word/number limits. Use `dist/reading-sample.html` for the computer-test layout and interaction wording, adapting it to those source rules. Replace paper-only actions (writing in answer-sheet boxes) with the actual on-screen action; do not add or remove substantive rules. Include “You may use any letter more than once” ONLY when the source instructions explicitly permit reuse. For Avalanches Q27–32, omit that sentence: it is absent from the PDF. Review the final instructions against the PDF group by group before publishing. Preserve the source passage title’s exact capitalization. Diagram inputs use the sample/Spinning Jenny width of 174px, not a shorter lesson-specific override.

## Shared data lessons and free bulk import

New reviewed lessons use `dist/exam.html?lesson=<id>` with `dist/lessons/<id>.json`. This common renderer uses the canonical question classes and copied sample drag behavior. Do not create another standalone HTML for every import. See `import/README.md` for the Drive queue, free OCR, review and publication gates. Source text, answer evidence, explicit reuse rules and source word limits are validated by `dist/exam-data.js` before the lesson opens. Run `node scripts/publish-reviewed-lessons.mjs` before packaging.

## Visible option content in CBT

For Multiple Choice (ONE/TWO), word-bank Summary Completion, Matching Sentence Endings and Matching Headings, display only the option text. A/B/C/... or roman-numeral option codes from paper tests are internal identifiers for grading and restore; never prefix the visible choice, drag token, filled gap, drag ghost or correct-answer explanation with those codes. Do not strip an actual first word such as “A faster way...” from the content. Paragraph labels and Matching Information column identifiers refer to the passage and remain part of that task. Adapt instructions to selecting/dragging content, without “Choose the correct letter” wording for these choice types.

## Practice-only bulk imports (current user requirement)

New bulk imports use `mode: "practice"`, contain no answer key, and require source/content review only. Finishing saves the user's responses and completion status (>5 answered); display those responses as option contents, not paper answer codes. Do not calculate a score, show correct/wrong marks or explanations. Existing graded lessons continue to support their prior keys. Unsupported/unclear diagrams or source errors are held for review, not published as approximate question layouts. `scripts/parse-practice.py` produces supported text-PDF drafts; inspect them before adding covers and publishing.

## Source-faithful notes and Matching Names
For Note Completion, preserve source heading weight, inline emphasis, bullet and sub-bullet nesting, hanging indents and spacing. Native PDF typography/coordinates are extracted by `scripts/source-notes.py` into `noteLayout` runs and rows; do not flatten notes into plain paragraphs. Compare the rendered source page before marking reviewed. The source controls emphasis/structure; the sample controls numbered input appearance and CBT instructions. Narrow panes naturally wrap text without losing indentation. Scans need visual transcription of this same structure before publication.

Matching Names/People/Researchers/Organisations use the reference matrix, with letter column identifiers and a separate labelled list below, as in the supplied Camouflage HTML. These identifiers are part of the matrix/list mapping; MC and drag-bank contents still omit paper option codes. `targetName`, `listTitle` and reuse permission come from the actual PDF, never assume 'researcher' or add reuse permission. This is supported centrally by `matching-features` and the thirteenth sample section.

## Annotation reference update — 18 October 2026

The shared annotation implementation in exam-behavior.js owns selection tools: Note and Highlight only, with Delete Highlight when clicking an existing highlight. Keep the popup below the selected text, with grey stacked icons and captions. Notes use a 300px right sidebar, blue quote markers (#204ccf), blue cards (#1e46be), inline bold Part label and italic quote. Clicking a marked quote reopens its saved note. Preserve source text and nested formatting when adding/removing marks. Full Test frames host their sidebars in the outer document. Notes remain session-only. Submission review shows only Wi-Fi, bell and menu icons; restore the Notes icon when returning to questions. Run annotations-dom.mjs plus footer-state-dom.mjs and full-test-dom.mjs for changes.

## Source instruction audit — 18 October 2026

All 70 published structured Matching Headings groups now carry headingCount and headingUnit from explicit declarations in their Drive source PDF. The CBT instruction is “The text has [word count] [paragraphs/sections]. Choose the correct heading for each [paragraph/section] and move it into the gap.” Never infer these from question count, answer-bank length or HTML paragraph count. Parser 3.23 holds a new heading task without a source declaration. Keep complete multiword matching targets (business person, sleep expert, historical period); line wraps must not truncate them. The source audit records two PDFs whose own matching sentence contradicts its option bank; preserve the reviewed, semantically correct target rather than copying the paper error. Note deletion must first show Cancel and Confirm deleting; Cancel restores the editor without losing text or its blue marker.

### 2026-10-18 — internal source paragraphs and exam pane states

Keep a labelled section (A/B/…) as one semantic section for heading targets and evidence indices, but preserve its real internal paragraph breaks in `paragraphs[].blocks`. Joining those strings with a single space must equal canonical `text` exactly. A label appears only on the first inner paragraph; matching headings still suppresses labels and inserts exactly one heading target before the whole section. Do not infer breaks from sentence length or question count. Use source PDF gaps/indents or verified source OCR layout and retain page/boundary evidence in the audit. Converter 3.24 preserves original blank-line blocks without changing semantic indices. Scans require explicit layout verification.

The Notes panel empty message is vertically centred. A note card is blue only while editing, white after clicking outside it (including clicks inside a Full Test iframe); Enter inserts a newline. Reopening its blue passage mark returns to editing. Notes icon has a grey hover background. Complete-answer green ticks/strips are visual states only and must never write attempted/completed history before submission. Active completed passages retain all question numbers; inactive completed Full Test passages show a tick and Part label without an “N of N” counter. Divider starts halfway and supports pointer/touch/keyboard resizing to both edges, leaving a recoverable handle; collapsed-pane content is hidden and expanded content remains readable.
