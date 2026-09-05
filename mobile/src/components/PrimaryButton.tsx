import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { FONTS } from "../theme/themes";

interface Props {
  children: string;
  onPress: () => void;
  accent: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({ children, onPress, accent, disabled, loading, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: accent, opacity: disabled ? 0.6 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#1A0F0A" />
      ) : (
        <Text style={styles.label}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: FONTS.headingSemiBold,
    fontSize: 16,
    color: "#1A0F0A",
  },
});
