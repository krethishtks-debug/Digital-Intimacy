import { createContext } from 'react'

// When true, zones render as a flat, fully-expanded document (Teacher / print
// view): every research card is inline, no animations, no click-to-reveal.
// Kept in its own module so component files stay Fast-Refresh compatible.
export const StaticViewContext = createContext(false)
