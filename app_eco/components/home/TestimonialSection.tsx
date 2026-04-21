import { Image } from "expo-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import type { Testimonial } from "@/types/review";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  title: string;
  subtitle?: string;
  items: Testimonial[];
  loading?: boolean;
};

function TestimonialCard({ item }: { item: Testimonial }) {
  const colors = useAppColors();
  const [imageFailed, setImageFailed] = useState(false);
  const loggedRef = useRef(false);

  const resolved = useMemo(() => resolveAssetUrl(item.image), [item.image]);
  const imageUrl = resolved ?? (item.image ?? null);
  const willProxy = false;
  const proxiedImageUrl = imageUrl;
  const showImage = Boolean(imageUrl) && !imageFailed;
  const initial = item.name?.trim()?.slice(0, 1)?.toUpperCase() ?? "•";

  useEffect(() => {
    if (!__DEV__ || loggedRef.current) return;
    loggedRef.current = true;
    console.log({
      tag: "testimonial_image_debug",
      name: item.name,
      product: item.product,
      rawImage: item.image,
      resolvedImageUrl: imageUrl,
      willProxy,
      finalImageUrl: proxiedImageUrl,
    });
  }, [imageUrl, proxiedImageUrl, willProxy, item.image, item.name, item.product]);

  return (
    <View className="mr-3 w-72 rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-[12px] font-semibold" style={{ color: colors.text }}>
            {item.name}
          </Text>
          <View className="mt-0.5 flex-row items-center">
            <AppIcon name="check-circle" size={12} color={colors.tint} />
            <Text className="ml-1 text-[10px]" style={{ color: colors.mutedText }}>
              Người mua đã xác minh
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <AppIcon key={i} name="star" size={14} color="#F59E0B" />
          ))}
        </View>
      </View>

      <Text
        className="mt-2 text-[12px]"
        style={{ color: colors.mutedText }}
        numberOfLines={4}
      >
        {item.review}
      </Text>

      <View
        className="mt-3 flex-row items-center"
        style={{
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.06)",
          paddingTop: 12,
        }}
      >
        <View
          className="items-center justify-center rounded-xl"
          style={{
            width: 56,
            height: 56,
            backgroundColor: "rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginRight: 10,
          }}
        >
          {showImage ? (
            <Image
              source={{ uri: proxiedImageUrl! }}
              style={{ width: 56, height: 56 }}
              contentFit="cover"
              transition={200}
              onError={(e) => {
                if (__DEV__) {
                  console.log({
                    tag: "testimonial_image_error",
                    name: item.name,
                    product: item.product,
                    rawImage: item.image,
                    resolvedImageUrl: resolved,
                    willProxy,
                    finalImageUrl: proxiedImageUrl,
                    error: (e as any)?.error ?? e,
                  });
                }
                setImageFailed(true);
              }}
            />
          ) : (
            <Text className="text-[18px] font-semibold" style={{ color: colors.mutedText }}>
              {initial}
            </Text>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-[10px]" style={{ color: colors.mutedText }}>
            Mặt hàng đã mua:
          </Text>
          <Text
            numberOfLines={1}
            className="mt-0.5 text-[12px] font-semibold"
            style={{ color: colors.text }}
          >
            {item.product || "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function TestimonialSection({
  title,
  subtitle,
  items,
  loading = false,
}: Props) {
  const colors = useAppColors();

  if (!loading && items.length === 0) return null;

  return (
    <View className="px-4 pb-4 pt-2">
      <View className="mb-2">
        <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-[11px]" style={{ color: colors.mutedText }}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading && items.length === 0 ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <View
                key={i}
                className="mr-3 w-64 rounded-2xl p-4"
                style={{ backgroundColor: colors.surfaceMuted, height: 120 }}
              />
            ))}
          </>
        ) : (
          items
            .filter((t) => Boolean(t?.review) && Boolean(t?.name))
            .slice(0, 8)
            .map((t, idx) => <TestimonialCard key={`${t.name ?? "t"}-${idx}`} item={t} />)
        )}
      </ScrollView>
    </View>
  );
}

