# Full Test

`full-test.html` selects one reviewed catalog lesson for each part (13 + 13 + 14 questions). Selection prefers lessons without a completed browser history; if a part's pool has all been completed, reuse that pool. Selection never writes a reservation or completion. The catalog currently contains 129 structured lessons; legacy standalone HTML files are not in this shared engine pool.

Each part runs the existing exam renderer in a same-origin frame, keeping answers, drag state and the sample-driven question styles intact when switching. Full mode suppresses single-passage drafts and histories; the parent owns one 60-minute timer, draft, submission and review. Incoming messages are checked against the origin and the exact three frame windows. Loading ends only after all three renderers and their utilities are ready. Failure offers retry and does not mark lessons used.

A normal Full Test click creates a new random set. The homepage offers an explicit continuation link for the current draft. Closing/leaving saves elapsed time and pauses; continuation restores remaining time and controls, including drag tokens. Hidden tabs still count while the page remains open. Back/forward cache restores also exclude time away.

Submission, including automatic submission at zero, records one history per lesson with a shared set ID; only more than five answered questions marks that passage completed. Set ID deduplication permits safe retries. No fabricated score is produced for unkeyed sets. Single-passage drafts remain separate.

Verification:
- `node scripts/tests/full-test-core.mjs`
- `HAPPY_DOM_MODULE=/absolute/path/to/happy-dom/lib/index.js node scripts/tests/full-test-dom.mjs`

DOM verification uses disabled frame navigation and three manually instantiated same-origin DOM windows with shared storage; it runs the actual engine and utilities, and checks answer retention, restoration, elapsed time, pause, manual/automatic submission and history ownership. It does not constitute browser visual verification.
