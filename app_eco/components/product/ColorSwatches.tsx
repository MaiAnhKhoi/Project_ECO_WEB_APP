import React from "react";
import { Pressable, View } from "react-native";

import type { ProductColor } from "@/types/product";
import { useAppColors } from "@/hooks/use-app-colors";
import { resolveColorHex } from "@/utils/color";

type Props = {
  colors: ProductColor[];
  activeLabel?: string;
  onSelect: (color: ProductColor) => void;
  maxVisible?: number;
};

function isLightHex(hex: string): boolean {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return false;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luma > 0.85;
}

export function ColorSwatches({
  colors,
  activeLabel,
  onSelect,
  maxVisible = 4,
}: Props) {
  const appColors = useAppColors();
  const visible = colors.slice(0, maxVisible);

  return (
    <View className="mt-2 flex-row items-center">
      {visible.map((c, idx) => {
        const hex = resolveColorHex(c);
        const isActive = (activeLabel || "") === c.label;
        const outline =
          (hex && isLightHex(hex)) || (c.value ?? c.colorCssClass) === "bg-white";

        return (
          <Pressable
            key={`${c.label}-${idx}`}
            onPress={() => onSelect(c)}
            hitSlop={8}
            className="mr-1.5 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={`Chọn màu ${c.label}`}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: hex ?? appColors.surfaceMuted,
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive
                  ? appColors.tint
                  : outline
                    ? "rgba(0,0,0,0.20)"
                    : "rgba(0,0,0,0.08)",
              }}
            />
          </Pressable>
        );
      })}
      {colors.length > maxVisible ? (
        <View
          className="ml-0.5"
          style={{
            paddingHorizontal: 6,
            height: 18,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: appColors.surfaceMuted,
          }}
        >
          <View
            style={{
              width: 2,
              height: 2,
              borderRadius: 999,
              backgroundColor: appColors.mutedText,
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

