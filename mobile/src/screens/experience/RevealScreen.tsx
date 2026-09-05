import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Sparkles } from "lucide-react-native";
import ExperienceLayout from "../../components/ExperienceLayout";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Reveal">;

export default function RevealScreen({ navigation }: Props) {
  const { drop, reset, selectedGift } = useDrop();
  if (!drop) return null;
  const theme = THEMES[drop.theme_key];

  return (
    <ExperienceLayout theme={theme} step="Reveal" onRestart={() => { reset(); navigation.popToTop(); }}>
      <View style={styles.center}>
        <Sparkles size={30} color={theme.accent} style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Just kidding!</Text>
        <Text style={styles.subtitle}>
          You really thought I'd get you {selectedGift ? `a ${selectedGift.name}` : "that"}? Real wish
          coming right up.
        </Text>
        <PrimaryButton accent={theme.accent} onPress={() => navigation.navigate("Message")}>
          See your real gift
        </PrimaryButton>
      </View>
    </ExperienceLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 30, color: "#FDF6EC", marginBottom: 10 },
  subtitle: {
    fontFamily: FONTS.body, color: "rgba(253,246,236,0.65)", fontSize: 14, textAlign: "center",
    marginBottom: 30, maxWidth: 260,
  },
});
