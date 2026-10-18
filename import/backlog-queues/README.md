# Backlog scheduling

Regenerate with `python3 scripts/triage-backlog.py`. These queues partition all non-reviewed jobs, including duplicate source variants. Counts describe jobs, not unique unpublished passages.

This is metadata/transcript triage, not a visual audit or publication approval. Every row remains `approved: false`; `import/jobs.json` and published lessons are untouched. Matching published titles/source IDs are comparison candidates, not automatic deletions. Stable source-based keys preserve jobs sharing an ID.

## Processing order

1. Inspect `transcript-review-candidates.json` against original pages in larger batches. Confirm full reading, subtitle, paragraph boundaries, instructions, all numbered prompts, notes indentation and footnotes. An OCR page having enough text does not prove it is correct or complete.
2. Run native preflight for `preflight-needed.json`; inspect existing reports before downloading another source.
3. OCR `ocr-needed.json` in parallel with the free extractor. Keep transcripts cached by source hash and review separately. Prefer alternate complete sources for `ocr-repair-or-alternate.json`.
4. Work on adapter, visual-layout, source-comparison and source-conflict queues separately so one difficult source does not block an otherwise reviewed batch.
5. Compare published/version matches before creating any additional lesson.

Never relax parser/validator gates to increase batch size. Only source-reviewed lessons enter the existing publisher. Re-run triage after publication so completed jobs leave the backlog. This change adds scheduling only; the website now has 500 lessons after reviewed batch 32.
