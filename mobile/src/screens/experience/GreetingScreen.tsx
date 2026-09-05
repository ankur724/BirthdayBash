import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ExperienceLayout from "../../components/ExperienceLayout";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Greeting">;

export default function GreetingScreen({ navigation }: Props) {
  const { drop, reset } = useDrop();
  if (!drop) return null;
  const theme = THEMES[drop.theme_key];

  return (
    <ExperienceLayout theme={theme} step="Greeting" onRestart={() => { reset(); navigation.popToTop(); }}>
      <View style={styles.center}>
        <Text style={[styles.eyebrow, { color: theme.accent }]}>A SURPRISE FOR YOU</Text>
        <Text style={styles.title}>
          It's {drop.name}'s{"\n"}big day
        </Text>
        <Text style={styles.subtitle}>
          Turning {drop.age} · someone made you something silly
        </Text>
        <PrimaryButton accent={theme.accent} onPress={() => navigation.navigate("Candles")}>
          Open your surprise
        </PrimaryButton>
      </View>
    </ExperienceLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  eyebrow: { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 2, marginBottom: 8, fontWeight: "600" },
  title: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 28,
    color: "#FDF6EC",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONTS.body,
    color: "rgba(253,246,236,0.6)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,
  },
});
