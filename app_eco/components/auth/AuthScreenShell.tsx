import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { useRouter } from "expo-router";
import { navLockRun } from "@/utils/navLock";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  canGoBack?: boolean;
};

export function AuthScreenShell({ title, subtitle, children, canGoBack = true }: Props) {
  const colors = useAppColors();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            <View className="mb-2">
              {canGoBack ? (
                <CustomIconButton
                  onPress={() =>
                    navLockRun(() => {
                      if ((router as any).canGoBack?.()) router.back();
                      else router.replace("/(tabs)" as any);
                    })
                  }
                  accessibilityLabel="Trở lại"
                >
                  <AppIcon name="chevron-left" size={22} color={colors.text} />
                </CustomIconButton>
              ) : null}
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text className="text-center text-2xl font-bold" style={{ color: colors.text }}>
                {title}
              </Text>
              {subtitle ? (
                <Text className="mt-2 text-center text-sm" style={{ color: colors.mutedText }}>
                  {subtitle}
                </Text>
              ) : null}
              <View className="mt-6">{children}</View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

