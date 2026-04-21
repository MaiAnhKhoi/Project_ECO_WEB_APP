import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import type { ProductColor } from "@/types/product";
import { resolveAssetUrl } from "@/utils/assetUrl";
import { resolveColorHexFlexible } from "@/utils/color";
import { cn } from "@/utils/cn";

const THUMB_SIZE = 68;

type Props = {
  colors: ProductColor[];
  activeLabel: string;
  onSelect: (label: string) => void;
};

function isLightHex(hex: string): boolean {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return false;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.85;
}

export function ProductColorPicker({ colors, activeLabel, onSelect }: Props) {
  const appColors = useAppColors();
  if (colors.length === 0) return null;

  const hasImages = colors.some((c) => c.img);

  return (
    <View className="mt-5 px-4">
      <View className="mb-2.5 flex-row items-baseline">
        <Text className="text-sm font-semibold text-app-fg dark:text-neutral-100">Màu sắc:</Text>
        <Text className="ml-1.5 text-sm font-medium" style={{ color: appColors.tint }}>
          {activeLabel}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2.5">
          {colors.map((c, idx) => {
            const hex = resolveColorHexFlexible({
              hex: c.colorHex ?? c.hex ?? null,
              cssClass: c.value ?? c.colorCssClass ?? null,
              fallbackName: c.label,
            });
            const active = activeLabel === c.label;
            const outline = isLightHex(hex) || (c.value ?? c.colorCssClass) === "bg-white";
            const imgUri = c.img ? (resolveAssetUrl(c.img) ?? c.img) : null;

            return (
              <Pressable
                key={`${c.label}-${idx}`}
                onPress={() => onSelect(c.label)}
                accessibilityRole="button"
                accessibilityLabel={`Màu ${c.label}`}
                accessibilityState={{ selected: active }}
                className="items-center"
                style={{ width: THUMB_SIZE + 4 }}
              >
                <View
                  className="overflow-hidden rounded-xl bg-app-surface dark:bg-neutral-800"
                  style={{
                    width: THUMB_SIZE,
                    height: THUMB_SIZE,
                    borderWidth: active ? 2.5 : 1,
                    borderColor: active
                      ? appColors.tint
                      : outline
                        ? "rgba(0,0,0,0.18)"
                        : "rgba(0,0,0,0.08)",
                  }}
                >
                  {hasImages && imgUri ? (
                    <Image
                      source={{ uri: imgUri }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <View
                      className="flex-1 items-center justify-center"
                      style={{ backgroundColor: hex }}
                    >
                      {active ? (
                        <AppIcon
                          name="check"
                          size={22}
                          color={isLightHex(hex) ? "#111827" : "#fff"}
                        />
                      ) : null}
                    </View>
                  )}

                  {hasImages && imgUri && active ? (
                    <View
                      className="absolute bottom-1 right-1 h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: appColors.tint }}
                    >
                      <AppIcon name="check" size={13} color="#fff" />
                    </View>
                  ) : null}
                </View>

                <View className="mt-1.5 flex-row items-center gap-1">
                  <View
                    className={cn("h-2 w-2 rounded-full", outline && "border border-black/20")}
                    style={{ backgroundColor: hex }}
                  />
                  <Text
                    numberOfLines={1}
                    className={cn(
                      "max-w-[58px] text-[11px]",
                      active ? "font-semibold" : "font-normal"
                    )}
                    style={{ color: active ? appColors.tint : appColors.mutedText }}
                  >
                    {c.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
