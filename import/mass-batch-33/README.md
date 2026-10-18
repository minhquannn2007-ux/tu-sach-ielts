# Batch 33 — priority diagram lessons

16 lessons: Passage 1 ×10, Passage 2 ×2, Passage 3 ×4. Original diagram artwork
and arrows retained, text labels in HTML, source-specific word limits and task
forms retained. Practice mode only; no invented answer keys. Termite duplicates
merged. Original PAPER sources repair Olympic bank G and Termite reading omissions.
Source layout manifests: ../diagram-layouts.json. Adapter: ../../scripts/repair-diagram-batch.py.

Source pages and final diagram artwork were inspected; DOM checks cover all
answers, finish behaviour and diagram bank/multiple-slot controls. Browser visual
QA is unavailable in this session; no browser screenshot verification is claimed.

## Current artwork revision — original raster, 2026-10-15

The user rejected the SVG reconstruction. All sixteen published diagrams use
source-derived transparent PNGs (`-source-v2.png`). Neither the SVGs nor the AI-generated
Olympic Torch preview are deployed. Do not restore either without checking the
current user direction and source fidelity.

Run `scripts/refine-diagram-assets.py --cache <PDF-cache>`, then
`scripts/layout-reviewed-diagrams.py --lessons <drafts>`. The latter verifies each
PNG hash against `../diagram-refinement-audit.json`, preserves source crop geometry
and records source-raster-v2 metadata. These are illumination normalization, tonal
contrast, sharpening and reviewed caption masks on original pixels, never redraws
or inferred details. Original paper/shading quality remains a real limitation.

Labels and editable answer gaps remain HTML; Lake's two requested labels remain
source raster. The cleaner alternate original PAPER is used for Olympic Torch,
with projective photo rectification through its panel corners and protected
original arrow pixels; its two panel headers also stay in the source image. Measured canvas spacing, centred title containers and Tikopia's
wrapped lower caption are retained. Pump labels and the Torch valve label have
extra space from their original leader starts.

Full figure/text composites inspected for sixteen assets; practice and Full Test
DOM checks apply. Browser visual QA is unavailable. Reproduce figure composites
with `python scripts/layout-reviewed-diagrams.py --qa <directory>` using Pillow.

Paper-reference normalization uses row/column bright percentiles to avoid the
old sliding-window artifact that bleached broad dark objects such as the coaster
motor. No super-resolution details are invented. Low-resolution sources remain
limited by the original information available.

## Four user-supplied replacement images — 2026-10-15

Treadle Pump, Olympic Torch, Termite Mounds and Ancient Greek Coins use the
explicit uploads 130634.png through 130637.png. Originals and source hashes are
retained in `../diagram-upload-sources/` and `../diagram-upload-overrides.json`.
This override takes priority in both the raster processor and layout adapter,
so later bulk conversions cannot revert these four to the blurry PDF crops.
Native pixels are retained: near-white paper becomes transparent, caption text
is masked for HTML and protected source arrow pixels are restored. No drawing,
resampling, perspective correction or sharpening is applied to these new assets.
Olympic panel headers stay in the image. Greek's duplicate raster title is cropped
out because the existing centred HTML title remains. All leader endpoints,
including Greek's Question 9, follow the supplied image unchanged.

## Three further supplied replacements — 2026-10-15

Movement Underwater (130650.png), Roller Coaster (130649.png) and Tikopia
(130653.png) now have native-resolution uploaded PNG replacements, retained with
source hashes in the upload override manifest. Use the latest Tikopia image with
the full chisel handle and supplied Question 9 arrow, not the earlier 130645.png.
Its grey photographed paper is normalized before masking captions, then converted
to alpha. Spatial positions and all source arrows are unchanged. HTML keeps the
source-reviewed question sequence 5–9: the uploaded top-left “6” duplicates the
right-side 6, and “hand” is a typo for the previously checked “hard”. Neither typo
is copied into the exercise.

Pigment production remains the centred bold HTML diagram heading; Chisel is a
centred bold 18px HTML subheading. Caption title metadata is measured with bold
font metrics and rendered with an explicit important font so shared caption CSS
cannot turn it back to normal weight. DOM coverage checks this and both Q5/Q9
inputs. Avoid retaining duplicate raster titles under the HTML headings.
