import React from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Share">;

const APP_DOWNLOAD_URL =
  "https://expo.dev/accounts/ankur724dev/projects/birthdaybash/builds/e944851b-1c17-4da5-9977-ac09192744c5";

export default function ShareScreen({ navigation }: Props) {
  const { drop, reset } = useDrop();
  if (!drop) return null;
  const theme = THEMES[drop.theme_key];
  const deepLink = Linking.createURL(`drop/${drop.share_code}`);
  const params = new URLSearchParams({
    to: deepLink,
    code: drop.share_code.toUpperCase(),
  });
  if (APP_DOWNLOAD_URL) {
    params.set("download", APP_DOWNLOAD_URL);
  }
  const link = `https://ankur724.github.io/BirthdayBash/open.html?${params.toString()}`;
  const code = drop.share_code.toUpperCase();

  async function handleShare() {
    try {
      await Share.share({
        message:
          `I made ${drop!.name} a birthday surprise! 🎉\n\n` +
          `Open it here:\n${link}\n\n` +
          `Or open BirthdayBash, tap "Have a code?" and enter: ${code}`,
      });
    } catch {
      // user dismissed the share sheet — nothing to do
    }
  }

  function startOver() {
    reset();
    navigation.popToTop();
  }

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: "#0E0916" }]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>IT'S READY</Text>
        <Text style={styles.title}>Share it with {drop.name}</Text>
        <Text style={styles.subtitle}>
          Send them the link to open it in one tap, or just tell them the code.
        </Text>

        <View style={[styles.codeCard, { borderColor: theme.accent }]}>
          <Text style={styles.codeLabel}>YOUR LINK</Text>
          <Text style={[styles.link, { color: theme.accent }]} numberOfLines={2}>
            {link}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.codeLabel}>OR SHARE THE CODE</Text>
          <Text style={[styles.code, { color: theme.accent }]}>{code}</Text>
        </View>

        <PrimaryButton accent={theme.accent} onPress={handleShare} style={styles.shareBtn}>
          Share the surprise
        </PrimaryButton>
        <Pressable
          onPress={() => navigation.navigate("Greeting")}
          style={styles.ghostBtn}
          hitSlop={8}
        >
          <Text style={styles.ghostLabel}>Preview it myself</Text>
        </Pressable>
        <Text style={styles.startOver} onPress={startOver}>
          Start a new drop
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  eyebrow: { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: "#FF4FA0", marginBottom: 8 },
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 28, color: "#FDF6EC", marginBottom: 8 },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: "rgba(253,246,236,0.6)",
    marginBottom: 28,
    lineHeight: 20,
  },
  codeCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 28,
  },
  codeLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: "rgba(253,246,236,0.5)",
    marginBottom: 8,
  },
  link: {
    fontFamily: FONTS.monoBold,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  divider: {
    width: "60%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 16,
  },
  code: { fontFamily: FONTS.monoBold, fontSize: 26, letterSpacing: 6 },
  shareBtn: { marginBottom: 14 },
  ghostBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(253,246,236,0.18)",
    marginBottom: 22,
  },
  ghostLabel: { fontFamily: FONTS.bodyMedium, fontSize: 13.5, color: "rgba(253,246,236,0.8)" },
  startOver: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: "rgba(253,246,236,0.45)",
    textAlign: "center",
  },
});
