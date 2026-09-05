import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Field from "../../components/Field";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { getDrop } from "../../api/drops";
import { FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "EnterCode">;

export default function EnterCodeScreen({ navigation }: Props) {
  const { setDrop, setSelectedGift } = useDrop();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleView() {
    const shareCode = code.trim().toLowerCase();
    if (!shareCode) return;
    setLoading(true);
    try {
      const drop = await getDrop(shareCode);
      setDrop(drop);
      setSelectedGift(drop.selected_gift ?? null);
      navigation.navigate("Greeting");
    } catch (err) {
      Alert.alert("Code not found", "Double-check the code and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: "#0E0916" }]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>GOT A SURPRISE?</Text>
        <Text style={styles.title}>Enter your code</Text>
        <Text style={styles.subtitle}>Whoever made your BirthdayBash drop sent you a code.</Text>

        <Field label="Share code">
          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.slice(0, 6))}
            placeholder="e.g. MCDZDD"
            placeholderTextColor="rgba(253,246,236,0.35)"
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
          />
        </Field>

        <PrimaryButton accent="#FF4FA0" onPress={handleView} disabled={!code.trim()} loading={loading}>
          View my surprise
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  eyebrow: { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: "#FF4FA0", marginBottom: 8 },
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 28, color: "#FDF6EC", marginBottom: 6 },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: "rgba(253,246,236,0.55)",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FDF6EC",
    fontSize: 16,
    fontFamily: FONTS.monoBold,
    letterSpacing: 4,
    textAlign: "center",
  },
});
