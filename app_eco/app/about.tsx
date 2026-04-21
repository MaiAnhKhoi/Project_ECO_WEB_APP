import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAsideStore } from "@/store/asideStore";
import { navLockRun } from "@/utils/navLock";

export default function AboutScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const openAside = useAsideStore((s) => s.openAside);
  const params = useLocalSearchParams<{ from?: string }>();
  const shopName = "UTE SHOP";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton
            onPress={() =>
              navLockRun(() => {
                if (params?.from === "aside") {
                  router.back();
                  setTimeout(() => openAside(), 0);
                  return;
                }
                router.back();
              })
            }
            accessibilityLabel="Trở lại"
          >
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-[16px] font-semibold" style={{ color: colors.text }}>
            Giới thiệu
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}>
          <Text className="text-[20px] font-bold" style={{ color: colors.text }}>
            Chào mừng đến với {shopName}
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
            Điểm đến thời trang tuyệt vời
          </Text>
          <Text className="mt-3 text-[14px] leading-6" style={{ color: colors.text }}>
            Tại {shopName}, chúng tôi mang đến cho bạn những bộ sưu tập được tuyển chọn kỹ lưỡng,
            kết hợp giữa thiết kế hiện đại với vẻ đẹp vượt thời gian. Với hơn 15 năm kinh nghiệm,
            chúng tôi phục vụ những người đam mê thời trang, những người đánh giá cao chất lượng,
            phong cách và tính linh hoạt.
          </Text>
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl" style={{ backgroundColor: colors.surfaceMuted }}>
          <Image
            source={{
              uri: "https://xdcs.cdnchinhphu.vn/446259493575335936/2023/8/22/truong-dai-hoc-su-pham-ky-thuat-tphcm-trang-tuyen-sinh-16927069628961088573361.jpg",
            }}
            style={{ width: "100%", height: 210 }}
            contentFit="cover"
          />
        </View>

        <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
          <Text className="text-[16px] font-semibold" style={{ color: colors.text }}>
            Cam kết của chúng tôi
          </Text>
          <View className="mt-3 gap-3">
            <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                Chất lượng
              </Text>
              <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
                Sản phẩm được chọn lọc kỹ, ưu tiên chất liệu và độ bền.
              </Text>
            </View>
            <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                Dịch vụ
              </Text>
              <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
                Hỗ trợ nhanh chóng, tư vấn rõ ràng, trải nghiệm mua sắm mượt mà.
              </Text>
            </View>
            <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted }}>
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                Đa dạng
              </Text>
              <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
                Nhiều phong cách, phù hợp nhiều nhu cầu từ cơ bản đến nâng cao.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
