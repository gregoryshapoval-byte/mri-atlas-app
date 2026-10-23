// Original flat anatomical illustrations, one palette.
export const homeIconIds=["brain", "spine", "face-neck", "shoulder", "elbow", "wrist", "knee", "hip", "pelvis", "abdomen", "foot", "upper-limb", "lower-limb", "breast"];
export function homeIcon(id){if(!homeIconIds.includes(id))throw Error("Missing home icon: "+id);return "home-icons/"+id+".svg"}
