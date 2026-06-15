export const THEMES = [
  { id: "default", label: "Default Navy & Teal" },
  { id: "bert", label: "Bert Dark Cyan" },
  { id: "desert", label: "Desert Sun & Dark Blue" },
  { id: "pieces", label: "In Pieces Crimson" },
  { id: "curve", label: "The Curve Sage" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && THEMES.some((t) => t.id === v);
}
