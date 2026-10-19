// Original navigation pictograms; all local SVG, one palette and frame.
export const homeIconIds=["brain", "spine", "face-neck", "shoulder", "elbow", "wrist", "knee", "hip", "pelvis", "foot", "upper-limb", "lower-limb", "abdomen"];
export function homeIcon(id){if(!homeIconIds.includes(id))throw Error("Missing home icon: "+id);return "home-icons/"+id+".svg"}
