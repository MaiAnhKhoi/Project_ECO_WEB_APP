import { Image } from "expo-image";
import * as Linking from "expo-linking";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { stripHtml } from "@/lib/html";
import type { BannerItem } from "@/types/banner";

import { CarouselPagination } from "./CarouselPagination";

const AUTOPLAY_MS = 5000;
const HORIZONTAL_INSET = 16;
const VERTICAL_INSET = 16;
const CORNER_RADIUS = 16;
const IMAGE_MIN_HEIGHT = 168;
const IMAGE_MAX_HEIGHT = 220;

type Props = {
  items: BannerItem[];
};

export function HomeBannerCarousel({ items }: Props) {
  const colors = useAppColors();
  const { width: winW } = useWindowDimensions();
  const cardWidth = winW - HORIZONTAL_INSET * 2;
  const listRef = useRef<FlatList<BannerItem>>(null);
  const [index, setIndex] = useState(0);

  const imageHeight = React.useMemo(() => {
    const first = items[0];
    if (!first?.width || !first?.height) return 200;
    const ratio = first.height / first.width;
    const h = cardWidth * ratio;
    return Math.min(IMAGE_MAX_HEIGHT, Math.max(IMAGE_MIN_HEIGHT, h));
  }, [items, cardWidth]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / winW);
      if (i >= 0 && i < items.length) setIndex(i);
    },
    [items.length, winW]
  );

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % items.length;
        listRef.current?.scrollToOffset({
          offset: next * winW,
          animated: true,
        });
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [items.length, winW]);

  const openLink = useCallback((item: BannerItem) => {
    const url = item.redirectLink?.trim();
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  }, []);

  const renderItem: ListRenderItem<BannerItem> = useCallback(
    ({ item }) => {
      const title = stripHtml(item.heading);
      return (
        <View style={{ width: winW, paddingHorizontal: HORIZONTAL_INSET }}>
          <Pressable
            onPress={() => openLink(item)}
            className="active:opacity-95"
            accessibilityRole="button"
            accessibilityLabel={title || "Banner khuyến mãi"}
          >
            <View
              style={{
                borderRadius: CORNER_RADIUS,
                overflow: "hidden",
                backgroundColor: colors.surfaceMuted,
              }}
            >
              <Image
                source={{ uri: item.imageSrc }}
                style={{ width: cardWidth, height: imageHeight }}
                contentFit="cover"
                transition={200}
              />
              {(title || (item.subText && item.subText.length > 0)) && (
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: "rgba(0,0,0,0.42)",
                  }}
                >
                  {title ? (
                    <Text
                      className="text-lg font-semibold leading-6"
                      style={{ color: "#FFFFFF" }}
                      numberOfLines={3}
                    >
                      {title}
                    </Text>
                  ) : null}
                {item.subText ? (
                  <Text
                    className="mt-1 text-sm leading-5"
                    style={{ color: "rgba(255,255,255,0.92)" }}
                    numberOfLines={2}
                  >
                    {item.subText ?? ""}
                  </Text>
                ) : null}
                </View>
              )}
            </View>
          </Pressable>
        </View>
      );
    },
    [cardWidth, colors.surfaceMuted, imageHeight, openLink, winW]
  );

  if (!items.length) return null;

  return (
    <View style={{ marginBottom: 8, paddingVertical: VERTICAL_INSET }}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item, i) =>
          item.imageSrc ? `banner-${i}-${item.imageSrc}` : `banner-${i}`
        }
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        style={{ width: winW }}
        onScroll={onScroll}
        scrollEventThrottle={32}
        removeClippedSubviews
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        getItemLayout={(_, i) => ({
          length: winW,
          offset: winW * i,
          index: i,
        })}
      />
      <CarouselPagination count={items.length} activeIndex={index} />
    </View>
  );
}
