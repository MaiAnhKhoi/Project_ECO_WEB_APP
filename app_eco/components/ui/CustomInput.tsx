import React from "react";
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  ViewStyle,
} from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

export type CustomInputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export const CustomInput = React.forwardRef<TextInput, CustomInputProps>(
  function CustomInput({ label, error, containerStyle, style, ...inputProps }, ref) {
    const colors = useAppColors();

    return (
      <View style={containerStyle} className="w-full">
        {label ? (
          <Text
            className="mb-1.5 text-sm font-medium"
            style={{ color: colors.text }}
          >
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.mutedText}
          className="rounded-xl border px-4 py-3.5 text-base"
          style={[
            {
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: error ? colors.danger : colors.border,
              borderWidth: 1,
            },
            style,
          ]}
          {...inputProps}
        />
        {error ? (
          <Text className="mt-1 text-sm" style={{ color: colors.danger }}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
);
