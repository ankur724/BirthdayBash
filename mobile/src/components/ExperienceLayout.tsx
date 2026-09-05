import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RotateCcw } from "lucide-react-native";
import Dots from "./Dots";
import { EXPERIENCE_STEPS } from "../navigation/types";
import type { Theme } from "../theme/themes";
import type { RootStackParamList } from "../navigation/types";

interface Props {
  theme: Theme;
  step: keyof RootStackParamList;
  onRestart: () => void;
  children: React.ReactNode;
}

export default function ExperienceLayout({ theme, step, onRestart, children }: Props) {
  const current = EXPERIENCE_STEPS.indexOf(step);
  return (
    <View style={[styles.fill, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={styles.fill}>
        <View style={styles.topBar}>
          <Dots total={EXPERIENCE_STEPS.length} current={current} accent={theme.accent} />
          <Pressable onPress={onRestart} style={styles.restartBtn} hitSlop={10}>
            <RotateCcw size={14} color="rgba(255,255,255,0.5)" />
          </Pressable>
        </View>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  restartBtn: { position: "absolute", right: 20, top: 10 },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
});
