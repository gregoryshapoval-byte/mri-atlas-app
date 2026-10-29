# MRI Atlas 2.63 — knee tendon labels

The adductor magnus landmark existed only on sagittal/coronal PD slices in overlay149. The axial series shown by the user had no such marker. knee-tendons263.js adds five individually inspected axial source-pixel landmarks to both T1 and PD-SPIR (10 markers total), retaining approximate presentation. Existing six landmarks receive an explicit tendon name, without moving them. The guide and search aliases identify adductor magnus; ten source tendon components receive attachment/course notes. No source point or image is overwritten.

References: https://pmc.ncbi.nlm.nih.gov/articles/PMC9365470/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7954158/ . Coordinates remain educational approximate landmarks, not segmentation or an independent expert validation of all knee labels.

## Latest payload recovery

Main was 2.60 while the user had 2.62. Runtime files recovered directly from the Library APK 2.62, SHA256 50ca17b7666db6ad75867b8c49ac301846c737876e8ea2b8b52ca683211d66c8. All retained assets compared byte-for-byte. Includes pelvic261 and peritoneum262. Search generator now includes their 36 explicit destinations (761 total); recovered module-specific data remain scoped to their own pages.

## Validation

- tests/knee-tendons263.mjs: all 228 frames; original points and regions retained; 694 tendon/attachment instances across 25 structures; selected marker label available at three layout sizes.
- tests/hip-knee149.mjs and tests/viewer-fit159.mjs passed.
- tests/essence260.mjs passed with current 84-page baseline.
- release metadata and search --check passed; 761 search destinations retained.
- Current protocol data: 72 profiles / 65 pages, labels and group mapping complete, runtime links present. Historical tests/protocol257.mjs is a 2.57 migration snapshot test with fixed 70/63/721 counts and pre-migration HTML assumptions, so it is not a current regression test and fails on already-shipped 2.61 data.
- Signed APK v2/v3 verified against the same certificate as 2.62. ZIP, all 9822 assets, unchanged executable/resource payload and four-byte alignment of stored entries verified. Only four existing assets changed, one new JS asset.
- Browser rendering was not tested: Chromium download returned an invalid archive. No physical Android execution.

See knee-tendons-2.63-build-info.json for the final artifact hash.
