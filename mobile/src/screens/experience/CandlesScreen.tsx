import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ExperienceLayout from "../../components/ExperienceLayout";
import CandleFlame from "../../components/CandleFlame";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Candles">;

export default function CandlesScreen({ navigation }: Props) {
  const { drop, reset } = useDrop();
  const candleCount = drop ? Math.min(Math.max(1, drop.age), 12) : 1;
  const [lit, setLit] = useState<boolean[]>(Array(candleCount).fill(true));

  useEffect(() => {
    setLit(Array(candleCount).fill(true));
  }, [candleCount]);

  if (!drop) return null;
  const theme = THEMES[drop.theme_key];
  const remaining = lit.filter(Boolean).length;

  function blow(i: number) {
    setLit((prev) => {
      const next = [...prev];
      next[i] = false;
      if (next.every((v) => !v)) {
        setTimeout(() => navigation.navigate("CakeSmash"), 650);
      }
      return next;
    });
  }

  const rows: { v: boolean; idx: number }[][] = [];
  for (let i = 0; i < lit.length; i += 6) {
    rows.push(lit.slice(i, i + 6).map((v, j) => ({ v, idx: i + j })));
  }

  return (
    <ExperienceLayout theme={theme} step="Candles" onRestart={() => { reset(); navigation.popToTop(); }}>
      <View style={styles.center}>
        <Text style={styles.title}>Make a wish, {drop.name}</Text>
        <Text style={styles.subtitle}>Tap each candle to blow it out</Text>

        <View style={styles.rows}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map(({ v, idx }) => (
                <Pressable key={idx} onPress={() => v && blow(idx)} style={styles.candle}>
                  <CandleFlame lit={v} accent={theme.accent} />
                  <View style={[styles.stick, { backgroundColor: theme.accent2 }]} />
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <Text style={[styles.status, { color: remaining ? "rgba(253,246,236,0.5)" : theme.accent }]}>
          {remaining > 0 ? `${remaining} candle${remaining > 1 ? "s" : ""} left` : "Wish locked in ✓"}
        </Text>
      </View>
    </ExperienceLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 22, color: "#FDF6EC", marginBottom: 4, textAlign: "center" },
  subtitle: { fontFamily: FONTS.body, fontSize: 13, color: "rgba(253,246,236,0.55)", marginBottom: 26, textAlign: "center" },
  rows: { gap: 10, marginBottom: 22 },
  row: { flexDirection: "row", gap: 10, justifyContent: "center" },
  candle: { alignItems: "center", padding: 4 },
  stick: { width: 10, height: 26, borderRadius: 2, marginTop: -2 },
  status: { fontFamily: FONTS.bodyMedium, fontSize: 13 },
});
