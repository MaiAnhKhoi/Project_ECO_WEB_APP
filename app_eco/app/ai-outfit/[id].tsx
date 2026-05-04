import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import "@/global.css";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { OutfitCard } from "@/components/ai/OutfitCard";
import { useAppColors } from "@/hooks/use-app-colors";
import { AI_QUERY_KEYS } from "@/queries/aiQueries";
import { fetchAIOutfitHistoryDetail } from "@/services/aiApi";
import { navLockRun } from "@/utils/navLock";

export default function AiOutfitDetailScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const logId = useMemo(() => {
    const n = idParam ? Number(idParam) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [idParam]);

  const q = useQuery({
    queryKey: logId != null ? AI_QUERY_KEYS.outfitHistoryDetail(logId) : ["ai-outfit-detail", "idle"],
    queryFn: () => fetchAIOutfitHistoryDetail(logId!),
    enabled: logId != null,
  });

  const handleAddToCart = (outfit: import("@/types/ai").Outfit) => {
    Alert.alert(
      "Giỏ hàng",
      `Chức năng thêm ${outfit.items.length} sản phẩm sẽ kết nối với giỏ hàng trong bản cập nhật tiếp theo.`,
      [{ text: "Đóng" }]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.divider, backgroundColor: colors.background },
        ]}
      >
        <CustomIconButton
          onPress={() => navLockRun(() => router.back())}
          accessibilityLabel="Quay lại"
        >
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Chi tiết outfit
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {!logId ? (
        <Text style={[styles.centered, { color: colors.mutedText }]}>
          Đường dẫn không hợp lệ.
        </Text>
      ) : null}

      {logId && q.isPending ? (
        <LoadingSpinner visible fullscreen={false} message="Đang tải outfit…" />
      ) : null}

      {logId && q.isError ? (
        <Text style={[styles.centered, { color: colors.mutedText }]}>
          Không tải được outfit từ lịch sử.
        </Text>
      ) : null}

      {logId && q.data ? (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.resultKicker, { color: colors.tint }]}>Outfit AI đã tạo</Text>
          <Text style={[styles.prompt, { color: colors.mutedText }]}>
            &ldquo;{q.data.originalPrompt}&rdquo;
          </Text>
          {q.data.fromCache ? (
            <Text style={[styles.badge, { color: colors.tint }]}>Từ bộ nhớ đệm</Text>
          ) : null}
          {!q.data.outfits.length ? (
            <Text style={[styles.emptyOutfits, { color: colors.mutedText }]}>
              Không thể hiển thị các món trong outfit. Sau khi cập nhật app/server, kéo để làm mới hoặc tạo outfit
              mới với cùng mô tả.
            </Text>
          ) : null}
          {q.data.outfits.map((outfit, idx) => (
            <OutfitCard
              key={outfit.outfitNumber}
              outfit={outfit}
              index={idx + 1}
              onAddToCart={handleAddToCart}
            />
          ))}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },
  prompt: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 20,
  },
  resultKicker: { fontSize: 12, fontWeight: "700", marginBottom: 6, textTransform: "uppercase" },
  badge: { fontSize: 12, fontWeight: "600", marginBottom: 8 },
  emptyOutfits: { fontSize: 14, lineHeight: 21, marginBottom: 16 },
  centered: { padding: 24, textAlign: "center" },
});
