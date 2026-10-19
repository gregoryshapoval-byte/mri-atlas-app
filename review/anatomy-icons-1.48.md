# Anatomy drawer illustrations — 1.48

Based on 1.47 (`f7ef1d0`). Replaces the drawer's mixed legacy raster pictures with an original, locally embedded schematic SVG symbol system. Main menu artwork and hierarchy are unchanged.

## Coverage and design

235 source and active-overlay groups map to 91 semantic keys / 83 distinct illustrations. Related groups can share an illustration. Brain groups include separate highlighted lobes, insula, sulci, gyri, ventricles, basal nuclei, limbic structures, brainstem levels, cerebellar hemispheres/vermis, commissures, association fibres, optic pathway and vascular groups. Other modules have dedicated symbols for fascia, bursae/recesses, capsule, ligaments, tendon insertions, labrum, TFCC, nodes, urinary/digestive/reproductive organs, pelvic floor, spine and face/neck structures.

Original vector paths use a consistent 96×96 dark rounded tile, 40px display size and familiar anatomical category colours. These are simplified navigation symbols, not anatomical teaching diagrams or representations of the MRI dataset. They contain no diagnostic claims, labels or patient-specific contours. Generic region symbols are intentionally limited to general/other-region groups.

## Implementation

`anatomy-icons.js` supplies deterministic SVG data URIs with per-symbol caching. No network, font, generated bitmap, image slicing or extra image decoding library is required at runtime. No edits to source image manifests, filter definitions, structure names/coordinates, storage keys, overlay data, gesture handling or group selection logic. Only the icon source in `.groupOpen` is replaced; decorative images retain empty alt text beside the original accessible group name. All artwork is bundled with the app and scales without raster blur.

`review/anatomy-icons-1.48.json` inventories every group and selected semantic key. Unit checks validate coverage, immutable input definitions, bounded self-contained SVG markup and important brain/hip mappings. Browser checks decode every visible icon in all 11 MRI modules at three viewport sizes with external networking blocked; they exercise nested navigation and group toggles. CI retains phone screenshots and a complete symbol sheet for visual review. Prior MRI and anatomy regression checks remain in the build.
