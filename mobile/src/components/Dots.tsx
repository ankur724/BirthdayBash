import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  total: number;
  current: number;
  accent: string;
}

export default function Dots({ total, current, accent }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: i === current ? 18 : 6,
              backgroundColor: i <= current ? accent : "rgba(255,255,255,0.16)",
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 5, justifyContent: "center", paddingVertical: 8 },
  dot: { height: 6, borderRadius: 999 },
});
