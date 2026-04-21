import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useAppColors } from "@/hooks/use-app-colors";

const HORIZONTAL = 16;
const RADIUS = 16;
const MIN_H = 180;

type Props = {
  /** Khi gọi API lỗi — nhấn để thử lại */
  onRetry?: () => void;
  showRetryHint?: boolean;
};

/**
 * Placeholder kiểu feed hiện đại: nền xám + lớp blur nhẹ + nhấp nháy,
 * gợi ý nội dung đang tải (tương tự skeleton Facebook).
 */
export function BannerSkeleton({ onRetry, showRetryHint }: Props) {
  const colors = useAppColors();
  const { width: winW } = useWindowDimensions();
  const cardW = winW - HORIZONTAL * 2;
  const pulse = useSharedValue(0.65);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900 }),
        withTiming(0.65, { duration: 900 })
      ),
      -1,
      true
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <View
      style={{
        paddingHorizontal: HORIZONTAL,
        paddingVertical: HORIZONTAL,
        marginBottom: 8,
      }}
    >
      <Pressable
        onPress={showRetryHint ? onRetry : undefined}
        disabled={!onRetry}
        accessibilityRole={onRetry ? "button" : "none"}
        accessibilityLabel={
          onRetry ? "Banner đang tải hoặc lỗi, nhấn để thử lại" : undefined
        }
      >
        <Animated.View style={[pulseStyle, { borderRadius: RADIUS, overflow: "hidden" }]}>
          <View
            style={[
              styles.base,
              {
                width: cardW,
                minHeight: MIN_H,
                backgroundColor: colors.surfaceMuted,
              },
            ]}
          >
            <BlurView
              intensity={55}
              tint={colors.scheme === "dark" ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(255,255,255,0.12)" },
              ]}
            />
            <View style={styles.lines}>
              <View
                style={[
                  styles.line,
                  {
                    width: "58%",
                    backgroundColor: "rgba(255,255,255,0.45)",
                  },
                ]}
              />
              <View
                style={[
                  styles.line,
                  {
                    width: "42%",
                    marginTop: 10,
                    backgroundColor: "rgba(255,255,255,0.28)",
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: "flex-end",
  },
  lines: {
    padding: 16,
    paddingBottom: 20,
  },
  line: {
    height: 11,
    borderRadius: 5,
  },
});
