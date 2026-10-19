# Hip tendon insertions and acetabular labrum — 1.47

Based on 1.46 (`ab09106`). Separate `hip-mri-anatomy147.json` augments only the three PD series (126 images), with 90 approximate teaching landmarks on 37 frames. Original JPEGs, source manifests, annotations, names, T1 and 3D remain unchanged.

## Content

Two independently selectable groups: tendon insertions and labrum. Seven insertional regions: gluteus medius lateral and superoposterior facets, gluteus minimus anterior facet, iliopsoas at lesser trochanter, piriformis, conjoined obturator internus/gemelli, obturator externus in the trochanteric fossa. Each insertion has three explicit adjacent frames in each PD plane. Greater trochanter labels are not used for gluteus maximus, whose main insertion is elsewhere.

Labral sectors are labelled anterior/posterior on axial and sagittal control frames, superior on coronal frames. Base, free edge and chondrolabral transition are educational topographic targets on three coronal frames. No unsupported clock-face mapping or separate inferior transverse-ligament junction is asserted. Small neighbouring points can be selected in points mode or by the guide.

## Review and uncertainty

Source PD contact sheets were inspected across all 126 frames, with native-resolution coordinate grids at insertional and labral control levels. Added-marker contact sheets were reviewed in all three planes. Insertion locations are selected at the tendon–cortex interface; this is not segmentation of an enthesis. Facet boundaries, separate conjoined fibres and fine labral transitions are not independently established by this dataset. Every addition is approximate, with outlined markers, dashed lines and explicit explanations. No independent radiologist verification has been performed.

`tools/hip_anatomy147.py` preserves per-frame coordinates and produces the overlay plus `review/hip-1.47.json`, including source hashes, frame hashes and coverage. Existing course landmarks are suppressed only on edited PD frames where the insertion/sector replaces them; all other original points are retained. Iliac crest inner/outer lips are not treated as acetabular labrum.

Anatomical references are listed in the in-app guide: Pfirrmann et al. 2001 (PMID 11687692); RadioGraphics pelvic tendon review 2022 (10.1148/rg.220055); hip capsulolabral review 2024 (10.1148/rg.230144). They support anatomy, not patient-specific placement.

## Validation

`tests/hip147.mjs` verifies source hashes, overlay integration, bounds, duplicate identities, categories, suppression, adjacent-slice coverage and absence of T1/3D changes. `tests/browser-hip147.mjs` exercises every PD frame in 393×852, 360×640 and 852×393 viewports with external requests blocked, group switches, modes, popups, zoom and fullscreen. CI retains screenshots for visual review. Existing menu/viewer and anatomy regression checks remain in the build workflow. Automated checks do not establish anatomical accuracy or physical-device performance.
