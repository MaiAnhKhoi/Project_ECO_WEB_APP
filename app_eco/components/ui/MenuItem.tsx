import React from "react";
import { View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { AppIcon } from "./AppIcon";
import { CustomButton } from "./CustomButton";

type Props = {
  label: string;
  icon: React.ComponentProps<typeof AppIcon>["name"];
  onPress: () => void;
  /** Viền dưới giữa các dòng */
  showDivider?: boolean;
};

export function MenuItem({
  label,
  icon,
  onPress,
  showDivider = true,
}: Props) {
  const colors = useAppColors();

  return (
    <View>
      <CustomButton
        title={label}
        variant="secondary"
        onPress={onPress}
        accessibilityLabel={label}
        leftIcon={<AppIcon name={icon} size={22} />}
        rightIcon={<AppIcon name="chevron-right" size={18} color={colors.mutedText} />}
        titleStyle={{ fontSize: 16, fontWeight: "500" }}
        style={{
          borderRadius: 0,
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: "transparent",
          borderWidth: 0,
        }}
      />
      {showDivider ? (
        <View
          className="ml-4 mr-0"
          style={{
            height: 1,
            backgroundColor: colors.divider,
          }}
        />
      ) : null}
    </View>
  );
}
