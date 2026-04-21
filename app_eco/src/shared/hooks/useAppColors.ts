import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

export function useAppColors() {
  const scheme = (useColorScheme() ?? "light") as "light" | "dark";
  const c = Colors[scheme];

  return {
    scheme,
    text: c.text,
    background: c.background,
    tint: c.tint,
    icon: c.icon,
    tabIconDefault: c.tabIconDefault,
    tabIconSelected: c.tabIconSelected,
    border: scheme === "light" ? "#E5E7EB" : "#2D3238",
    divider: scheme === "light" ? "#E5E7EB" : "#2D3238",
    mutedText: scheme === "light" ? "#6B7280" : "#9CA3AF",
    surfaceMuted: scheme === "light" ? "#F3F4F6" : "#25292E",
    avatarBg: scheme === "light" ? "#C5E4ED" : "#1A4D5C",
    iconButtonBg: scheme === "light" ? "#F3F4F6" : "#2D3238",
    danger: "#DC2626",
    link: c.tint,
  };
}

