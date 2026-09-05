import React, { useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDrop } from "../../context/DropContext";
import { getDrop } from "../../api/drops";
import { FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "OpenDrop">;

export default function OpenDropScreen({ route, navigation }: Props) {
  const { setDrop, setSelectedGift } = useDrop();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const drop = await getDrop(route.params.shareCode.toLowerCase());
        if (cancelled) return;
        setDrop(drop);
        setSelectedGift(drop.selected_gift ?? null);
        navigation.replace("Greeting");
      } catch {
        if (cancelled) return;
        Alert.alert("Link expired", "This surprise couldn't be found — it may have expired.");
        navigation.replace("Setup");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [route.params.shareCode]);

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: "#0E0916" }]}>
      <View style={styles.center}>
        <ActivityIndicator color="#FF4FA0" />
        <Text style={styles.label}>Opening your surprise…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  label: { fontFamily: FONTS.body, fontSize: 13, color: "rgba(253,246,236,0.55)" },
});
