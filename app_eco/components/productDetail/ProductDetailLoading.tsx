import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductDetailTopBar } from "@/components/productDetail/ProductDetailTopBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CAROUSEL_HEIGHT } from "@/components/productDetail/ProductImageCarousel";

type Props = {
  tint: string;
};

function PulseBlock({ className, style }: { className?: string; style?: object }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={[{ opacity }, style]}
    />
  );
}

export function ProductDetailLoading({ tint }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-app-bg dark:bg-neutral-950">
      <ProductDetailTopBar solid />

      <View style={{ paddingTop: insets.top }}>
        <PulseBlock
          className="w-full bg-neutral-300 dark:bg-neutral-800"
          style={{ height: CAROUSEL_HEIGHT }}
        />
      </View>

      <View
        className="-mt-7 flex-1 rounded-t-[28px] bg-white px-4 pt-4 dark:bg-neutral-900"
        style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
      >
        <PulseBlock className="mb-3 h-1 w-10 self-center rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <PulseBlock
          className="mb-2 h-6 rounded-md bg-neutral-200 dark:bg-neutral-700"
          style={{ width: "75%" }}
        />
        <PulseBlock
          className="mb-4 h-4 rounded-md bg-neutral-200 dark:bg-neutral-700"
          style={{ width: "50%" }}
        />
        <PulseBlock className="mb-3 h-10 w-full rounded-xl bg-neutral-200 dark:bg-neutral-700" />
        <PulseBlock className="h-24 w-full rounded-xl bg-neutral-200 dark:bg-neutral-700" />

        <View className="mt-10 items-center">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 bg-white shadow-md dark:border-primary/50 dark:bg-neutral-900">
            <LoadingSpinner
              visible
              inline
              message=""
              indicatorColor={tint}
              indicatorSize="large"
            />
          </View>
          <Text className="text-base font-semibold text-app-fg dark:text-neutral-100">
            Đang tải sản phẩm
          </Text>
          <Text className="mt-1 text-center text-sm text-app-muted dark:text-neutral-400">
            Vui lòng chờ trong giây lát
          </Text>
        </View>
      </View>
    </View>
  );
}
