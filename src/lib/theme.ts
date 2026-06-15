export const THEMES = [
  { id: "default", label: "Default — Navy & Teal" },
  { id: "ocean", label: "Ocean — Deep Blue & Cyan" },
  { id: "sunset", label: "Sunset — Coral & Amber" },
  { id: "forest", label: "Forest — Green & Sage" },
  { id: "midnight", label: "Midnight — Dark & Violet" },
  { id: "rose", label: "Rose — Burgundy & Blush" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && THEMES.some((t) => t.id === v);
}
