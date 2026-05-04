import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";

const ACTIONS = [
  { label: "Chat AI", a11y: "Chat AI", icon: "message-circle" as const, href: "/ai-chat" },
  { label: "Tạo outfit", a11y: "Tạo outfit", icon: "layers" as const, href: "/ai-stylist" },
  {
    label: "Phong cách",
    a11y: "Phân tích phong cách",
    icon: "camera" as const,
    href: "/ai-style-analysis",
  },
];

function AIQuickActionTripletInner() {
  const router = useRouter();
  const colors = useAppColors();

  return (
    <View style={styles.row}>
      {ACTIONS.map((a) => (
        <Pressable
          key={a.href}
          accessibilityRole="button"
          accessibilityLabel={a.a11y}
          onPress={() => navLockRun(() => router.push(a.href as any))}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}>
            <AppIcon name={a.icon} size={22} color={colors.tint} />
          </View>
          <View style={styles.labelWrap}>
            <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
              {a.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export const AIQuickActionTriplet = memo(AIQuickActionTripletInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignSelf: "stretch",
    width: "100%",
    justifyContent: "space-between",
    gap: 6,
  },
  card: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  labelWrap: {
    minHeight: 18,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
});
