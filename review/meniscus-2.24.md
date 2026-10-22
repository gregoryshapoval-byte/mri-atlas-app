# MRIAtlas 2.24 — existing meniscus module revision

Base: 2.23, `003af89797638c9b98488a7169de959cee85d960`, branch `work/orads-simplify-1-83`.

The old knee.html primarily offered eight 3D morphology choices. The same menu item now opens a six-tab clinical guide with 15 original numbered SVG diagrams, a six-row scanning guide, seven reporting checks and eight copyable drafts. The complete previous 3D page is retained as knee-model.html with a return link; knee.js, meniscus-geometry.js, all MRI images, coordinates and overlays are unchanged. No additional main-menu item or region was created.

## Medical source review, 22 October 2026

- SSR 2026, *Standardized MRI nomenclature for knee meniscal lesions*, PMC13424353: descriptive reporting; numeric extrusion and reference level; root-zone caveat; discoid morphology; surgical suitability and stability limitations. Numerical signal grades are secondary reference material, not the report's conclusion.
- ESSR 2024, DOI 10.1007/s00330-024-10706-7: three planes; preferably ≤3 mm, 4 mm acceptable; T1 in the knee examination. The module does not claim a ready-made GE protocol or arbitrary TR/TE.
- De Smet and Tuite 2006, PMID16985134: repeated surfacing signal increases diagnostic confidence; not an absolute exclusion rule for a morphological defect.
- LaPrade 2015, PMID25451789: original arthroscopic I–V classification; 2A 0–<3, 2B 3–<6, 2C 6–9 mm. Stability is determined with probing; classifications and broader 1 cm terminology are distinguished.
- MenIN 2024, PMID38606565: extrusion measurement and variable definitions. A single >3 mm threshold does not diagnose a root tear.
- Zappia et al. 2021, PMC8292249; Arner et al. 2017, PMID28343325: posteromedial capsular and meniscotibial injury, diagnostic limits of MRI for ramp lesions.
- Kijowski et al. 2017, PMC5709159: repeat-tear findings in partially resected menisci, importance of baseline comparison and displaced fragment; generalization to repaired menisci is explicitly limited.
- Stoller et al. 1987, PMID3575724: signal 0–III terminology, kept in a folded explanatory section.
- Existing retained morphology descriptions and additional anatomic review: Chien et al. 2020, PMC7571514.

All illustrations are newly drawn vectors, not copied journal figures or actual patient scans. Schemes are explicitly not to scale or literal MRI signal. The superior-view arc depicts one meniscus without prescribing patient R/L. Wedge diagrams show a section, not the complete tear trajectory. Numbered legends accompany every drawing. The previous rotatable model remains the spatial anatomy reference. These reviews are source checks and a visual engineering review, not independent clinician validation.

## Preservation and checks

Local: all 99 commands from the previous bone223 source/data suite passed, plus the meniscus224 preservation/content check; 15 new XML diagrams parsed. All 4264 previous tracked assets outside the three approved replacements (knee.html, catalogue, version footer) have identical git hashes. All 5088 packed offline media were restored by existing materializers with digest checks.

Historical catalogue assertions were updated only to normalize the intentionally changed description/type of the existing knee.html item. New meniscus224 checks compare the entire catalogue against 2.23 with only those two fields allowed to change. The former knee.html and new knee-model.html compare byte-for-byte after reversing the documented return-link/explanatory-text change.

Local browser launch failed because the environment disallows a required Unix socket. One targeted remote workflow performs the browser checks and signed release. Browser script covers all 15 selections and zoom, six tabs and keyboard operation, all eight clipboard templates and denied-clipboard fallback, four viewport sizes, return routes, both menisci and all eight retained 3D choices. Existing menu/branding/bone/sacroiliitis/osteonecrosis/disc/Schizas regressions also run.

All substantive CI steps passed in run 39813303272, job 119945073432, commit eab9dabb14e43ff43618da5c6d42d0f19012d3d8. Mobile screenshots inspected: 320 px full page, 393 px extrusion/ramp zoom, complete scanning table, retained 3D page; all 15 original diagrams inspected on contact sheets. No clipping in the new clinical module. UI artifact: 12441745683.

Signed artifact 12441366411, APK 139001193 bytes; SHA256 cbd4b2d602df2eb1988c079d7af2a47ced2493f678ab0bb4737566d1811c3a45. Native version124/2.24, same package/label and prior certificate cb7d43e1eb8ff4c1eee663e918b5413b70fb9d6f8221790075f83c7e153624fe. v2/v3 verified by apksigner in CI. Downloaded CRC/hash/size/version/commit and all9374 assets checked locally; a separate local apksigner run was not performed. Saved APK identity libfile_ee1a20c80d0c8191942508d39b3ce84d (version0; metadata applied). Physical Android and independent medical review have not been performed.
