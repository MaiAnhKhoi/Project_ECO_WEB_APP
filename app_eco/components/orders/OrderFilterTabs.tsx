import React, { memo, useCallback, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { ORDER_TABS, type OrderTabKey } from "@/types/order";

type Props = {
  active: OrderTabKey;
  onChange: (key: OrderTabKey) => void;
  /** Số đơn theo tab (badge đỏ, giống Shopee) — không truyền "all" */
  counts?: Partial<Record<OrderTabKey, number>>;
};

function formatTabBadge(n: number): string {
  return n > 99 ? "99+" : String(n);
}

type TabItemProps = {
  tabKey: OrderTabKey;
  label: string;
  isActive: boolean;
  count: number | undefined;
  onChange: (key: OrderTabKey) => void;
  activeColor: string;
  mutedColor: string;
  tintColor: string;
};

const TabItem = memo(function TabItem({
  tabKey,
  label,
  isActive,
  count,
  onChange,
  activeColor,
  mutedColor,
  tintColor,
}: TabItemProps) {
  const handlePress = useCallback(() => onChange(tabKey), [onChange, tabKey]);
  return (
    <Pressable
      onPress={handlePress}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <View style={styles.tabInner}>
        <Text
          style={[
            styles.tabLabel,
            { color: isActive ? activeColor : mutedColor, fontWeight: isActive ? "600" : "400" },
          ]}
        >
          {label}
        </Text>
        {typeof count === "number" && count > 0 ? (
          <View
            style={[
              styles.badge,
              { paddingHorizontal: count > 9 ? 5 : 0 },
            ]}
          >
            <Text style={styles.badgeText}>{formatTabBadge(count)}</Text>
          </View>
        ) : null}
      </View>
      {isActive ? (
        <View style={[styles.indicator, { backgroundColor: tintColor }]} />
      ) : null}
    </Pressable>
  );
});

function OrderFilterTabsInner({ active, onChange, counts }: Props) {
  const colors = useAppColors();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: colors.border, backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ORDER_TABS.map((tab) => (
          <TabItem
            key={tab.key}
            tabKey={tab.key}
            label={tab.label}
            isActive={active === tab.key}
            count={tab.key === "all" ? undefined : counts?.[tab.key]}
            onChange={onChange}
            activeColor={colors.tint}
            mutedColor={colors.mutedText}
            tintColor={colors.tint}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export const OrderFilterTabs = memo(OrderFilterTabsInner);

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1 },
  scrollContent: { paddingHorizontal: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 12, position: "relative" },
  tabInner: { flexDirection: "row", alignItems: "center" },
  tabLabel: { fontSize: 14 },
  badge: {
    marginLeft: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 99,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 99,
  },
});
