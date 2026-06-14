// Shared scroll-choreography constants.
//
// DIVE_AT — page-scroll fraction where the camera leaves the yacht's rail
// and plunges into the water. Depth/pressure readouts stay at 0 m until
// then: the hero and the Introduction both happen aboard, at the surface.
export const DIVE_AT = 0.155

export const diveProgress = sp =>
  Math.max(0, Math.min(1, (sp - DIVE_AT) / (1 - DIVE_AT)))
