export type ThemeKey = "classic" | "star" | "rock" | "floral" | "roast";

export interface Theme {
  key: ThemeKey;
  name: string;
  vibe: string;
  bg: string;
  card: string;
  accent: string;
  accent2: string;
  glow: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  classic: { key: "classic", name: "Classic cake", vibe: "Warm & traditional", bg: "#2A1533", card: "#3B1F45", accent: "#FFC94A", accent2: "#FF7A59", glow: "#4A2452" },
  star: { key: "star", name: "Star party", vibe: "Purple & gold", bg: "#181235", card: "#241A4D", accent: "#FFD966", accent2: "#B283FF", glow: "#2A1F5C" },
  rock: { key: "rock", name: "Rock on", vibe: "Dark & edgy", bg: "#141414", card: "#1F1F1F", accent: "#FF3B3B", accent2: "#9A9A9A", glow: "#262626" },
  floral: { key: "floral", name: "Floral", vibe: "Soft pink & green", bg: "#2B1E2A", card: "#3A2839", accent: "#FF9EC4", accent2: "#8FD9A8", glow: "#402B3E" },
  roast: { key: "roast", name: "Roast mode", vibe: "Red & brutal", bg: "#26100F", card: "#391613", accent: "#FF5A36", accent2: "#FFB238", glow: "#3E1A16" },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export const FONTS = {
  heading: "Baloo2_700Bold",
  headingExtraBold: "Baloo2_800ExtraBold",
  headingSemiBold: "Baloo2_600SemiBold",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodyBold: "DMSans_700Bold",
  script: "Caveat_600SemiBold",
  scriptBold: "Caveat_700Bold",
  mono: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_600SemiBold",
};
