import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../theme/themes";

export default function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "rgba(253,246,236,0.55)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
});
