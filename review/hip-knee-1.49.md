# Hip and knee tendons; restored knee spaces — 1.49

Base: 1.48 (`0c1f172`). Source MRI images, manifests, source annotations and all earlier overlay files stay byte-identical. Two new overlay files activate the revision.

## Hip

Rename group 14701 to **Сухожилия**. Ten existing source tendon identities are displayed in this group, in all available series, retaining their names, coordinates, point identifiers and inherited confidence: iliopsoas, rectus femoris, gluteus medius/minimus, obturator internus/externus, semimembranosus, semitendinosus, long head of biceps femoris and adductor magnus. Source course labels are distinguished from manual insertion/origin targets.

Keep all 90 previous PD landmarks and labral labels. Add 60 approximate PD landmarks for 11 origin/insertion/aponeurotic regions: rectus femoris direct/reflected origins, hamstring conjoint and semimembranosus origins, adductor longus, gracilis, adductor magnus, sartorius, TFL, gluteus maximus and pectineus. Coverage varies with the visible field; no propagation between planes. Short mainly muscular attachments are not relabelled as isolated tendons. Long distal attachments outside the hip scan are explained, not invented.

## Knee

Keep all 28 reviewed 1.45 ribbons. Restore the seven missing types with 29 explicitly positioned short PD ribbons: posterior femoral recess, popliteus recess, prepatellar bursa, deep and superficial infrapatellar bursae, gastrocnemius–semimembranosus bursa and pes anserinus bursa. The result is **57 ribbons across all 10 original knee spaces**, including the retained suprapatellar and medial/lateral parapatellar recesses. None is a segmentation or assertion of fluid. The old rejected contours are not copied back.

Add 54 approximate PD landmarks for quadriceps insertion, patellar ligament proximal/distal attachment and course, distal biceps femoris, pes anserinus insertional area, semimembranosus direct/reflected regions, popliteus tendon, gastrocnemius origins, expected plantaris transition and distal adductor magnus. Original quadriceps and hamstring course points stay; the iliotibial tract is available with the tendon/aponeurotic group and explicitly described as fascia, not a free tendon. Its distal footprint is not independently segmented.

## Confidence and review

Source contact sheets were inspected throughout the PD volumes, with native-resolution pixel grids at control levels and added-marker sheets in all planes. Enlarged insertional crops informed corrections near the fibular head and ischial border. All newly drawn points and ribbons are approximate; hollow circles/dashed edges and explanatory notes remain. Collapsed spaces can blend with capsule/fat. Facet boundaries, small tendon branches and plantaris are not established independently. No independent radiologist validation was performed.

Anatomy references are included in the guides: proximal hamstring and adductor magnus cadaveric studies, direct/reflected rectus femoris origins, distal semimembranosus MR/cadaver correlation, popliteal hiatus anatomy and pes anserinus bursa anatomy. References inform expected anatomy, not precise placement in this individual image set.

## Implementation and validation

`pointPresentation` is a whitelist of filter/category presentation changes. `annotationSlice` ignores any attempted coordinate/name changes in that map. The guide now uses the same merged slice as the viewer, so source tendon entries enable the correct group when jumping. Migration preserves old selection state and enables updated default groups.

`tools/hip_knee149.py` writes the overlays and per-frame hash/coverage record. Unit checks validate 114 new landmarks, 29 restored paths, original coordinates/names, old landmarks/ribbons, every source image manifest and all 10 space identities. Browser checks cover all 240 hip/knee PD frames at three viewport sizes, hollow markers, original tendon filtering, guide jumps, modes, zoom and fullscreen. Older regression checks remain; the 1.47 unit fixture explicitly exercises its historical overlay, while the current runtime is covered by 1.49 tests. Knee ribbon browser regression reads the active 1.49 overlay. CI retains screenshots for visual review. These tests do not establish anatomical certainty or physical-device performance.
