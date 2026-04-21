import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

import { resolveAssetUrl } from "@/utils/assetUrl";

const { width: SCREEN_W } = Dimensions.get("window");
export const CAROUSEL_HEIGHT = 420;

export type CarouselSlide = { key: string; uri: string; label?: string };

type Props = {
  slides: CarouselSlide[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  height?: number;
};

export function ProductImageCarousel({
  slides,
  activeIndex,
  onChangeIndex,
  height = CAROUSEL_HEIGHT,
}: Props) {
  const listRef = useRef<FlatList<CarouselSlide>>(null);
  const [localIndex, setLocalIndex] = useState(activeIndex);
  const isScrollingRef = useRef(false);

  const data = slides.length ? slides : [{ key: "placeholder", uri: "", label: "" }];

  useEffect(() => {
    if (
      !isScrollingRef.current &&
      activeIndex !== localIndex &&
      activeIndex >= 0 &&
      activeIndex < data.length
    ) {
      listRef.current?.scrollToOffset({
        offset: activeIndex * SCREEN_W,
        animated: true,
      });
      setLocalIndex(activeIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, data.length]);

  const onScrollBeginDrag = () => {
    isScrollingRef.current = true;
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / SCREEN_W);
    const clamped = Math.max(0, Math.min(next, data.length - 1));
    setLocalIndex(clamped);
    isScrollingRef.current = false;
    if (clamped !== activeIndex) {
      onChangeIndex(clamped);
    }
  };

  return (
    <View className="w-full" style={{ height }}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_W,
          offset: SCREEN_W * index,
          index,
        })}
        renderItem={({ item }) => (
          <View
            className="bg-neutral-100 dark:bg-neutral-900"
            style={{ width: SCREEN_W, height }}
          >
            {item.uri ? (
              <Image
                source={{ uri: resolveAssetUrl(item.uri) ?? item.uri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
                transition={300}
              />
            ) : (
              <View className="flex-1 items-center justify-center bg-app-surface dark:bg-neutral-800">
                <Text className="text-sm text-app-muted dark:text-neutral-400">
                  Không có ảnh
                </Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
