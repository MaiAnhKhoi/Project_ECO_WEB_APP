import React, { useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { ORDER_TABS, type OrderTabKey } from "@/types/order";

type Props = {
  active: OrderTabKey;
  onChange: (key: OrderTabKey) => void;
  /** Số đơn theo tab (badge đỏ, giống Shopee) — không truyền "all" */
  counts?: Partial<Record<OrderTabKey, number>>;
};

function formatTabBadge(n: number): string {
  if (n > 99) return "99+";
  return String(n);
}

export function OrderFilterTabs({ active, onChange, counts }: Props) {
  const colors = useAppColors();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {ORDER_TABS.map((tab) => {
          const isActive = active === tab.key;
          const cnt =
            tab.key === "all" ? undefined : counts?.[tab.key];
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                position: "relative",
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? "600" : "400",
                    color: isActive ? colors.tint : colors.mutedText,
                  }}
                >
                  {tab.label}
                </Text>
                {typeof cnt === "number" && cnt > 0 ? (
                  <View
                    style={{
                      marginLeft: 6,
                      minWidth: 18,
                      height: 18,
                      paddingHorizontal: cnt > 9 ? 5 : 0,
                      borderRadius: 99,
                      backgroundColor: "#EF4444",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      {formatTabBadge(cnt)}
                    </Text>
                  </View>
                ) : null}
              </View>
              {isActive ? (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 16,
                    right: 16,
                    height: 2,
                    borderRadius: 99,
                    backgroundColor: colors.tint,
                  }}
                />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
