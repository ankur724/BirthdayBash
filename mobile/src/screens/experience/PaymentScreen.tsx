import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CheckCircle2, ShieldCheck, X } from "lucide-react-native";
import ExperienceLayout from "../../components/ExperienceLayout";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { setDropGift } from "../../api/drops";
import { FUNNY_LINES, inr } from "../../constants/gifts";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Payment">;

export default function PaymentScreen({ navigation }: Props) {
  const { drop, reset, selectedGift, setSelectedGift } = useDrop();
  const [lineIdx, setLineIdx] = useState(0);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLineIdx((i) => (i + 1) % FUNNY_LINES.length), 2600);
    return () => clearInterval(id);
  }, []);

  if (!drop || !selectedGift) return null;
  const theme = THEMES[drop.theme_key];
  const total = selectedGift.price + 999;

  function cancel() {
    setSelectedGift(null);
    navigation.navigate("GiftPicker");
  }

  async function pay() {
    setPaying(true);
    try {
      await setDropGift(drop!.share_code, selectedGift!.id);
    } catch {
      // Non-fatal — the reveal still proceeds even if persisting the choice fails.
    }
    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
      setTimeout(() => navigation.navigate("Reveal"), 750);
    }, 950);
  }

  if (paySuccess) {
    return (
      <ExperienceLayout theme={theme} step="Payment" onRestart={() => { reset(); navigation.popToTop(); }}>
        <View style={styles.center}>
          <CheckCircle2 size={54} color={theme.accent2} strokeWidth={1.6} style={{ marginBottom: 14 }} />
          <Text style={styles.successTitle}>Payment successful</Text>
          <Text style={styles.successAmount}>{inr(total)} debited</Text>
        </View>
      </ExperienceLayout>
    );
  }

  return (
    <ExperienceLayout theme={theme} step="Payment" onRestart={() => { reset(); navigation.popToTop(); }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.logo, { backgroundColor: theme.accent }]}>
            <Text style={styles.logoLabel}>BD</Text>
          </View>
          <View>
            <Text style={styles.brand}>BirthdayDrop Pay</Text>
            <View style={styles.secureRow}>
              <ShieldCheck size={9} color="rgba(253,246,236,0.4)" />
              <Text style={styles.secureLabel}>secured checkout</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={cancel} style={styles.closeBtn}>
          <X size={13} color="rgba(253,246,236,0.7)" />
        </Pressable>
      </View>

      <View style={styles.amountBlock}>
        <Text style={styles.payingTo}>paying gifts@birthdaydrop</Text>
        <Text style={styles.amount}>{inr(total)}</Text>
      </View>

      <View style={[styles.bill, { backgroundColor: theme.card }]}>
        <Text style={styles.billHeader}>Bill details</Text>
        <Row label={selectedGift.name} value={inr(selectedGift.price)} />
        <Row label="Friendship tax" value={inr(999)} />
        <View style={styles.divider} />
        <Row label="Total" value={inr(total)} bold accent={theme.accent} />
      </View>

      <View style={[styles.lineBox, { borderColor: theme.accent + "55" }]}>
        <Text style={styles.line}>"{FUNNY_LINES[lineIdx]}"</Text>
      </View>

      <View style={{ marginTop: "auto", gap: 10 }}>
        <PrimaryButton accent={theme.accent} onPress={pay} loading={paying}>
          {paying ? "Processing…" : "Pay now — it's just money"}
        </PrimaryButton>
        <Pressable onPress={cancel}>
          <Text style={styles.rethink}>Actually... let me rethink my life</Text>
        </Pressable>
      </View>
    </ExperienceLayout>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: string }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && { fontFamily: FONTS.bodyBold, color: "#FDF6EC", fontSize: 14 }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.rowValue,
          bold && { fontSize: 14, color: accent || "#FDF6EC" },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  successTitle: { fontFamily: FONTS.headingSemiBold, fontSize: 18, color: "#FDF6EC", marginBottom: 4 },
  successAmount: { fontFamily: FONTS.mono, fontSize: 12.5, color: "rgba(253,246,236,0.5)" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  logoLabel: { fontFamily: FONTS.headingExtraBold, fontSize: 11, color: "#1A0F0A" },
  brand: { fontFamily: FONTS.headingSemiBold, fontSize: 14, color: "#FDF6EC" },
  secureRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  secureLabel: { fontFamily: FONTS.body, fontSize: 9.5, color: "rgba(253,246,236,0.4)" },
  closeBtn: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center", justifyContent: "center",
  },
  amountBlock: { alignItems: "center", paddingVertical: 12 },
  payingTo: { fontFamily: FONTS.body, fontSize: 11.5, color: "rgba(253,246,236,0.45)", marginBottom: 4 },
  amount: { fontFamily: FONTS.monoBold, fontSize: 32, color: "#FDF6EC" },
  bill: { borderRadius: 14, padding: 14, marginBottom: 12 },
  billHeader: {
    fontFamily: FONTS.bodyBold, fontSize: 10.5, letterSpacing: 0.5, color: "rgba(253,246,236,0.4)",
    marginBottom: 8, textTransform: "uppercase",
  },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  rowLabel: { fontFamily: FONTS.body, fontSize: 13, color: "rgba(253,246,236,0.65)" },
  rowValue: { fontFamily: FONTS.mono, fontSize: 13, color: "rgba(253,246,236,0.85)" },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 8 },
  lineBox: {
    backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderStyle: "dashed",
    borderRadius: 14, padding: 13, marginBottom: 16, minHeight: 50, justifyContent: "center",
  },
  line: { fontFamily: FONTS.body, fontStyle: "italic", fontSize: 12.5, color: "rgba(253,246,236,0.75)", lineHeight: 18 },
  rethink: { textAlign: "center", fontFamily: FONTS.body, fontSize: 12.5, color: "rgba(253,246,236,0.5)", padding: 6 },
});
