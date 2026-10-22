# MRIAtlas 2.25 — ПКС после пластики

Base:2.24/98fbdc4038e243d7b83e9edd3c1628c2c4e6fde2;branch work/orads-simplify-1-83. User explicitly chose postoperative ACL reconstruction rather than native tears or operative technique.

New knee route acl-postop.html, five tabs, 15 original numbered SVG schemes, six scanning rows, seven reporting checks, nine copyable templates with denied-clipboard fallback. Existing meniscus guide, its 3D model, native ligament model, MRI data and all other sections retained.

## Medical review — 22 October 2026

Primary studies / consensus sources: ESSKA 2022 diagnosis and planning (PMID36322180) and surgical strategy (10.1007/s00167-023-07550-5); Waltz2014 (PMID24821755) for limitations of MRI graft integrity in failed reconstructions; Bouguennec2021 (PMC8384440), Lutz2021/2022 (PMID34739559) and 2021 hamstring/QT study (PMID34541010) for variable signal and poor equivalence to functional stability; Howell1991 (PMID2027966) for roof impingement; Bernard1997 (PMID9051173) for the quadrant method; Facchetti2017 (PMID27986989) and Gohil2013 (PMID23572043) for imaging cyclops versus clinical syndrome; Sanders2002 (PMID12218830) and Deie2000 (PMID11121700) for tunnel fluid and pretibial cysts; ESSKA/EBJIS2023 (PMID37019288/37243789) for suspected infection; ESSR2024 (10.1007/s00330-024-10706-7) for routine knee imaging; Lu2009/Koch2009 (PMID19267347/19165901) for metal artifact reduction techniques.

No single postoperative month defines a normal graft signal. Increased signal is not equated with tear, graft continuity is not equated with functional competence or return-to-sport readiness. Partial tears require morphology and multiple planes; no purported reliable percentage threshold is used. Cyclops on MRI does not automatically imply cyclops syndrome. Tunnel diameters are perpendicular measurements with reference level; 12–15 mm is not an automatic two-stage revision criterion. CT is distinguished from MRI for precise bony tunnel geometry; infection requires clinical/laboratory/aspiration assessment and MRI does not establish a pathogen.

Original schematic bones and tunnels are not patient imaging or precise surgical geometry. SAG anterior is left, posterior is right, no patient R/L. The femoral example is COR and explicitly labelled; lateral/medial compartments are identified. The widening figure is an orthogonal cross section. No normative clockface, angle or quadrant-percentage calculator is supplied. Impingement drawing deliberately places the tibial opening anterior to the projected roof line, rather than marking an arbitrary near-contact point. Independently validated operative navigation is outside scope.

## Preservation / validation

Local source suite inherited from meniscus224 completed after updating the one route-count fixture to include the new clinical route. ACL225 checks compare the entire catalogue against 2.24, allowing exactly one new item following ligaments.html, and hash all 4284 other prior tracked assets outside catalogue/footer. All new SVG XML parse. The shared viewers, MRI and overlays are unchanged. Historical snapshot comparisons explicitly exclude only the new route; prior meniscus metadata normalization remains intact.

Local browser is unavailable because the previously attempted launch was denied a required Unix socket in this environment; the targeted ACL225 CI performs mobile/browser verification and signs the APK using the existing certificate. Pending browser screenshots, signed package and final hash; see top of CONTINUE.md for final status. No physical Android or independent clinician validation has been performed.
