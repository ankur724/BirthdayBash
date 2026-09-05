import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PartyPopper, RotateCcw, Sparkles } from "lucide-react-native";
import ExperienceLayout from "../../components/ExperienceLayout";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Fireworks">;

const SETS = [
  { colors: ["#FFD966", "#FFC94A", "#FFF3C4"], label: "Gold" },
  { colors: ["#FF4FA0", "#FF9EC4", "#FFB3D9"], label: "Pink" },
  { colors: ["#B283FF", "#8F6FE0", "#D6C4FF"], label: "Purple" },
];

interface Burst {
  id: number;
  x: number;
  pieces: { id: number; color: string; dx: number; dy: number; anim: Animated.Value }[];
}

export default function FireworksScreen({ navigation }: Props) {
  const { drop, reset } = useDrop();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);

  if (!drop) return null;
  const theme = THEMES[drop.theme_key];

  function spawn(colors: string[]) {
    const id = idRef.current++;
    const pieces = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      dx: Math.random() * 200 - 100,
      dy: -(80 + Math.random() * 150),
      anim: new Animated.Value(0),
    }));
    const x = 15 + Math.random() * 60;
    setBursts((b) => [...b, { id, x, pieces }]);
    Animated.parallel(
      pieces.map((p) =>
        Animated.timing(p.anim, { toValue: 1, duration: 1100, useNativeDriver: true })
      )
    ).start(() => setBursts((b) => b.filter((burst) => burst.id !== id)));
  }

  function restart() {
    reset();
    navigation.popToTop();
  }

  return (
    <ExperienceLayout theme={theme} step="Fireworks" onRestart={restart}>
      <View style={styles.center}>
        <PartyPopper size={28} color={theme.accent} style={{ marginBottom: 8 }} />
        <Text style={styles.title}>Happy birthday!</Text>
        <Text style={styles.subtitle}>Tap for fireworks</Text>

        <View style={styles.buttons}>
          {SETS.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => spawn(s.colors)}
              style={[styles.fireworkBtn, { backgroundColor: s.colors[1] }]}
            >
              <Sparkles size={22} color="#2A1533" />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={restart} style={styles.restart}>
          <RotateCcw size={13} color="rgba(253,246,236,0.7)" />
          <Text style={styles.restartLabel}>Restart experience</Text>
        </Pressable>
      </View>

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {bursts.map((b) => (
          <View key={b.id} style={{ position: "absolute", left: `${b.x}%`, bottom: 160 }}>
            {b.pieces.map((p) => (
              <Animated.View
                key={p.id}
                style={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  borderRadius: 2,
                  backgroundColor: p.color,
                  opacity: p.anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
                  transform: [
                    { translateX: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
                    { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.dy] }) },
                  ],
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </ExperienceLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 22, color: "#FDF6EC", marginBottom: 6 },
  subtitle: { fontFamily: FONTS.body, fontSize: 13, color: "rgba(253,246,236,0.55)", marginBottom: 26 },
  buttons: { flexDirection: "row", gap: 16, marginBottom: 30 },
  fireworkBtn: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
  restart: {
    flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999,
  },
  restartLabel: { fontFamily: FONTS.body, fontSize: 12.5, color: "rgba(253,246,236,0.7)" },
});
