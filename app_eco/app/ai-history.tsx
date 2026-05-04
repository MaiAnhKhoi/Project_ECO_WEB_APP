import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import "@/global.css";
import { ProductCardSmall } from "@/components/home/ProductCardSmall";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import {
  fetchAIChatHistory,
  fetchAIOutfitHistory,
  fetchAIStyleHistory,
} from "@/services/aiApi";
import { useAuthStore } from "@/store/authStore";
import type {
  ConversationSummary,
  RecommendationHistory,
  StyleAnalysisHistoryItem,
} from "@/types/ai";
import { navLockRun } from "@/utils/navLock";
import { productSuggestionToProduct } from "@/utils/productSuggestionToProduct";
import { AI_QUERY_KEYS } from "@/queries/aiQueries";

type TabId = "style" | "chat" | "outfits";

const GENDER_LABEL: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  UNISEX: "Unisex",
  UNKNOWN: "Chưa xác định",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AiHistoryScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const bootstrapping = useAuthStore((s) => s.bootstrapping);
  const token = useAuthStore((s) => s.accessToken);
  const [tab, setTab] = useState<TabId>("style");

  useEffect(() => {
    if (bootstrapping) return;
    if (!token) {
      router.replace({
        pathname: "/auth/login",
        params: { next: "/ai-history" },
      } as any);
    }
  }, [bootstrapping, token, router]);

  const ready = !bootstrapping && !!token;

  const styleQ = useQuery({
    queryKey: AI_QUERY_KEYS.styleHistory(0),
    queryFn: () => fetchAIStyleHistory(0, 20),
    enabled: ready && tab === "style",
  });

  const chatQ = useQuery({
    queryKey: AI_QUERY_KEYS.chatHistory(0),
    queryFn: () => fetchAIChatHistory(0, 20),
    enabled: ready && tab === "chat",
  });

  const outfitQ = useQuery({
    queryKey: AI_QUERY_KEYS.outfitHistory(0),
    queryFn: () => fetchAIOutfitHistory(0, 20),
    enabled: ready && tab === "outfits",
  });

  if (bootstrapping || !token) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <LoadingSpinner visible fullscreen={false} message="Đang tải…" />
      </SafeAreaView>
    );
  }

  const activeQuery =
    tab === "style" ? styleQ : tab === "chat" ? chatQ : outfitQ;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.divider,
            backgroundColor: colors.background,
          },
        ]}
      >
        <CustomIconButton
          onPress={() => navLockRun(() => router.back())}
          accessibilityLabel="Quay lại"
        >
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>

        <View style={styles.headerCenter}>
          <Text style={[styles.breadcrumb, { color: colors.mutedText }]}>
            Trang chủ
          </Text>
          <AppIcon name="chevron-right" size={12} color={colors.mutedText} />
          <Text style={[styles.breadcrumbActive, { color: colors.text }]}>
            Lịch sử AI
          </Text>
        </View>

        <CustomIconButton
          onPress={() => navLockRun(() => router.push("/(tabs)" as any))}
          accessibilityLabel="Về trang chủ"
        >
          <AppIcon name="home" size={20} color={colors.mutedText} />
        </CustomIconButton>
      </View>

      <View style={styles.tabRow}>
        {(
          [
            { id: "style" as const, label: "Style", icon: "camera" as const },
            { id: "chat" as const, label: "Chat", icon: "message-circle" as const },
            { id: "outfits" as const, label: "Outfit", icon: "shopping-bag" as const },
          ]
        ).map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: active ? colors.tint : colors.surfaceMuted,
                  borderColor: colors.border,
                },
              ]}
              className="active:opacity-85"
            >
              <AppIcon
                name={t.icon}
                size={16}
                color={active ? "#fff" : colors.icon}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: active ? "#fff" : colors.text },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {activeQuery.isLoading ? (
          <LoadingSpinner
            visible
            fullscreen={false}
            message="Đang tải lịch sử…"
          />
        ) : null}

        {tab === "style" && styleQ.data
          ? renderStyleTab(styleQ.data.content, colors, router)
          : null}
        {tab === "chat" && chatQ.data
          ? renderChatTab(chatQ.data.content, colors, router)
          : null}
        {tab === "outfits" && outfitQ.data
          ? renderOutfitTab(outfitQ.data.content, colors, router)
          : null}

        {activeQuery.isSuccess &&
        activeQuery.data &&
        !activeQuery.data.content?.length ? (
          <View style={styles.empty}>
            <AppIcon name="inbox" size={40} color={colors.mutedText} />
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              {tab === "style"
                ? "Chưa có lịch sử phân tích phong cách."
                : tab === "chat"
                  ? "Chưa có cuộc trò chuyện."
                  : "Chưa có outfit do AI tạo. Hãy dùng Tạo outfit trên trang chủ."}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function renderStyleTab(
  items: StyleAnalysisHistoryItem[],
  colors: ReturnType<typeof useAppColors>,
  router: ReturnType<typeof useRouter>
) {
  if (!items.length) return null;
  return (
    <View style={styles.section}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() =>
            navLockRun(() =>
              router.push(`/ai-style-analysis?historyId=${item.id}` as any)
            )
          }
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImg}
              contentFit="cover"
            />
          ) : null}
          <View style={styles.cardBody}>
            <View style={styles.tagRow}>
              {item.gender && item.gender !== "UNKNOWN" ? (
                <Text style={[styles.tag, { color: colors.text }]}>
                  {GENDER_LABEL[item.gender] ?? item.gender}
                </Text>
              ) : null}
              {item.bodyType ? (
                <Text style={[styles.tag, { color: colors.text }]}>
                  {item.bodyType}
                </Text>
              ) : null}
              {item.skinTone ? (
                <Text style={[styles.tag, { color: colors.text }]}>
                  {item.skinTone}
                </Text>
              ) : null}
            </View>
            <Text style={[styles.styleTitle, { color: colors.text }]}>
              {item.recommendedStyle}
            </Text>
            <Text style={[styles.date, { color: colors.mutedText }]}>
              {formatDate(item.createdAt)}
            </Text>
            {item.products?.length ? (
              <>
                <Text style={[styles.subTitle, { color: colors.mutedText }]}>
                  Sản phẩm gợi ý
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productsRow}
                >
                  {item.products.slice(0, 8).map((p) => (
                    <ProductCardSmall
                      key={p.id}
                      product={productSuggestionToProduct(p)}
                    />
                  ))}
                </ScrollView>
              </>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function renderChatTab(
  items: ConversationSummary[],
  colors: ReturnType<typeof useAppColors>,
  router: ReturnType<typeof useRouter>
) {
  if (!items.length) return null;
  return (
    <View style={styles.section}>
      {items.map((item) => (
        <Pressable
          key={item.conversationId}
          onPress={() =>
            navLockRun(() =>
              router.push(`/ai-chat?conversationId=${item.conversationId}` as any)
            )
          }
          style={({ pressed }) => [
            styles.historyItemFrame,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.historyCard,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            {/* left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: colors.tint }]} />

            <View style={[styles.historyIconCircle, { backgroundColor: "rgba(10,126,164,0.10)" }]}>
              <AppIcon name="message-circle" size={20} color={colors.tint} />
            </View>

            <View style={styles.listBody}>
              <Text style={[styles.cardTypeLabel, { color: colors.mutedText }]}>Chat AI</Text>
              <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title ?? "Cuộc trò chuyện"}
              </Text>
              <View style={styles.cardFooterRow}>
                <View
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: colors.scheme === "dark" ? "#2D3238" : "#F9FAFB",
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <AppIcon name="clock" size={11} color={colors.mutedText} />
                  <Text style={[styles.dateChipText, { color: colors.mutedText }]}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
                <View style={[styles.ctaChip, { backgroundColor: "rgba(10,126,164,0.10)" }]}>
                  <Text style={[styles.ctaChipText, { color: colors.tint }]}>Tiếp tục →</Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const OUTFIT_ACCENT = "#7c3aed";

function renderOutfitTab(
  items: RecommendationHistory[],
  colors: ReturnType<typeof useAppColors>,
  router: ReturnType<typeof useRouter>
) {
  if (!items.length) return null;
  return (
    <View style={styles.section}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() =>
            navLockRun(() => router.push(`/ai-outfit/${item.id}` as any))
          }
          style={({ pressed }) => [
            styles.historyItemFrame,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.historyCard,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            {/* left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: OUTFIT_ACCENT }]} />

            <View style={[styles.historyIconCircle, { backgroundColor: "rgba(124,58,237,0.10)" }]}>
              <AppIcon name="layers" size={20} color={OUTFIT_ACCENT} />
            </View>

            <View style={styles.listBody}>
              <Text style={[styles.cardTypeLabel, { color: colors.mutedText }]}>Outfit AI</Text>
              <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={2}>
                {item.userPrompt ? `"${item.userPrompt}"` : "Tạo outfit"}
              </Text>
              <View style={styles.metaRow}>
                {item.cacheHit ? (
                  <View style={styles.pillCache}>
                    <Text style={styles.pillCacheText}>⚡ Từ đệm AI</Text>
                  </View>
                ) : null}
                {item.tokensUsed != null ? (
                  <View style={[styles.pill, { backgroundColor: colors.surfaceMuted }]}>
                    <Text style={[styles.pillText, { color: colors.mutedText }]}>
                      {item.tokensUsed} token
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.cardFooterRow}>
                <View
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: colors.scheme === "dark" ? "#2D3238" : "#F9FAFB",
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <AppIcon name="clock" size={11} color={colors.mutedText} />
                  <Text style={[styles.dateChipText, { color: colors.mutedText }]}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
                <View style={[styles.ctaChip, { backgroundColor: "rgba(124,58,237,0.10)" }]}>
                  <Text style={[styles.ctaChipText, { color: OUTFIT_ACCENT }]}>Xem outfit →</Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  breadcrumb: { fontSize: 13 },
  breadcrumbActive: { fontSize: 13, fontWeight: "600" },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabLabel: { fontSize: 13, fontWeight: "600" },
  body: { flex: 1 },
  bodyContent: { paddingBottom: 32 },
  section: { paddingHorizontal: 16, gap: 12, paddingTop: 4 },
  /** Viền nền xám bao quanh từng item chat / outfit. */
  historyItemFrame: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  cardImg: { width: "100%", height: 180 },
  cardBody: { padding: 14 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  tag: { fontSize: 12, fontWeight: "600" },
  styleTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  subTitle: { fontSize: 12, marginTop: 10, marginBottom: 6 },
  date: { fontSize: 12 },
  productsRow: { gap: 0, paddingRight: 8, flexDirection: "row" },
  listBody: { flex: 1, minWidth: 0 },
  listTitle: { fontSize: 15, fontWeight: "600", marginBottom: 6, lineHeight: 20 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 6 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pillText: { fontSize: 11, fontWeight: "600" },
  hintChip: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 0,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  accentBar: {
    width: 4,
    alignSelf: "stretch",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    marginRight: 2,
    flexShrink: 0,
  },
  historyIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTypeLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 8,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateChipText: { fontSize: 11 },
  ctaChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ctaChipText: { fontSize: 11, fontWeight: "700" },
  pillCache: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(16,185,129,0.12)",
  },
  pillCacheText: { fontSize: 11, fontWeight: "600", color: "#047857" },
  empty: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: { fontSize: 14, textAlign: "center", paddingHorizontal: 24 },
});
