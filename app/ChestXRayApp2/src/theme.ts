import { Dimensions } from "react-native"

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window")

export const C = {
  // Backgrounds
  bg0: "#03070f",      // deepest
  bg1: "#080f1c",      // base surface
  bg2: "#0d1726",      // card
  bg3: "#111f33",      // elevated card

  // Borders
  border: "#1a2a42",
  borderLight: "#243650",

  // Accent — electric teal
  accent: "#00e5ff",
  accentDim: "rgba(0,229,255,0.12)",
  accentBorder: "rgba(0,229,255,0.25)",

  // Semantic
  ok: "#00e676",
  okDim: "rgba(0,230,118,0.10)",
  okBorder: "rgba(0,230,118,0.25)",

  warn: "#ff6b35",
  warnDim: "rgba(255,107,53,0.10)",
  warnBorder: "rgba(255,107,53,0.28)",

  amber: "#ffab40",
  amberDim: "rgba(255,171,64,0.10)",

  // Text
  t1: "#e8f0fe",   // primary
  t2: "#8fa8c8",   // secondary
  t3: "#3d5475",   // muted

  // Misc
  white5:  "rgba(255,255,255,0.05)",
  white10: "rgba(255,255,255,0.10)",
  white15: "rgba(255,255,255,0.15)",
}

export const R = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
}

export const S = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}
