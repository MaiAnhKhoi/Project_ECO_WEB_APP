import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";

export default function NotificationsScreen() {
  const router = useRouter();
  const colors = useAppColors();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View
        className="flex-row items-center border-b px-2 py-3"
        style={{ borderColor: colors.border }}
      >
        <CustomIconButton
          onPress={() => navLockRun(() => router.back())}
          accessibilityLabel="Trở lại"
        >
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>
      </View>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold" style={{ color: colors.text }}>
          Thông báo
        </Text>
      </View>
    </SafeAreaView>
  );
}
