// Swiper types
import type { NavigationOptions } from "swiper/types";

export interface SwiperNavigationConfig {
  clickable: boolean;
  nextEl: string;
  prevEl: string;
}

// Type guard to check if navigation is our custom config
export function isCustomNavigationConfig(
  nav: boolean | NavigationOptions | SwiperNavigationConfig | undefined
): nav is SwiperNavigationConfig {
  return (
    typeof nav === "object" &&
    nav !== null &&
    "clickable" in nav &&
    "nextEl" in nav &&
    "prevEl" in nav
  );
}

