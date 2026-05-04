import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "@/global.css";
import { AIQuickActionTriplet } from "@/components/ai/AIQuickActionTriplet";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAuthStore } from "@/store/authStore";
import { navLockRun } from "@/utils/navLock";

export default function AiHubScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);

  const goHistory = () => {
    navLockRun(() => {
      if (!token) {
        router.push({ pathname: "/auth/login", params: { next: "/ai-history" } } as any);
        return;
      }
      router.push("/ai-history" as any);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <CustomIconButton onPress={() => navLockRun(() => router.back())} accessibilityLabel="Quay lại">
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>
        <Text style={[styles.title, { color: colors.text }]}>Trung tâm AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: colors.tint }]}>Khám phá cùng AI</Text>
        <Text style={[styles.headline, { color: colors.text }]}>
          Công cụ AI mua sắm & phong cách
        </Text>
        <Text style={[styles.desc, { color: colors.mutedText }]}>
          Chat tư vấn, tạo bộ outfit theo prompt, hoặc phân tích phong cách từ ảnh — đồng bộ trên web và app.
        </Text>

        <View style={styles.tripletWrap}>
          <AIQuickActionTriplet />
        </View>

        <CustomButton
          title="Lịch sử AI"
          variant="secondary"
          onPress={goHistory}
          leftIcon={<AppIcon name="clock" size={18} color={colors.text} />}
          style={styles.historyBtn}
        />
      </ScrollView>
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
  title: { fontSize: 16, fontWeight: "700" },
  body: { padding: 16, paddingBottom: 40 },
  kicker: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  headline: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 21, marginBottom: 20 },
  tripletWrap: { marginBottom: 16 },
  historyBtn: { paddingVertical: 14, borderRadius: 14 },
});
