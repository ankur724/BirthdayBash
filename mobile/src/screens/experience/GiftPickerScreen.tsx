import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Star } from "lucide-react-native";
import ExperienceLayout from "../../components/ExperienceLayout";
import { GiftIcon } from "../../constants/giftIcons";
import { inr, type Gift } from "../../constants/gifts";
import { fetchGifts } from "../../api/gifts";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "GiftPicker">;

export default function GiftPickerScreen({ navigation }: Props) {
  const { drop, reset, setSelectedGift } = useDrop();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGifts().then((g) => {
      setGifts(g);
      setLoading(false);
    });
  }, []);

  if (!drop) return null;
  const theme = THEMES[drop.theme_key];

  function pick(g: Gift) {
    setSelectedGift(g);
    navigation.navigate("Payment");
  }

  return (
    <ExperienceLayout theme={theme} step="GiftPicker" onRestart={() => { reset(); navigation.popToTop(); }}>
      <Text style={styles.title}>Pick your gift</Text>
      <Text style={styles.subtitle}>(no refunds, no regrets)</Text>

      {loading ? (
        <ActivityIndicator color={theme.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={gifts}
          keyExtractor={(g) => g.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => pick(item)}
              style={[styles.card, { backgroundColor: theme.card }]}
            >
              <View style={styles.iconWrap}>
                <GiftIcon iconKey={item.icon_key} size={26} color={theme.accent} strokeWidth={1.6} />
                {item.tag && (
                  <View style={[styles.tag, { backgroundColor: theme.accent2 }]}>
                    <Text style={styles.tagLabel}>{item.tag}</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Star size={10} color={theme.accent} fill={theme.accent} strokeWidth={0} />
                  <Text style={styles.rating}>{item.rating}</Text>
                  <Text style={styles.reviews}>({item.reviews})</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.mrp}>{inr(item.mrp)}</Text>
                  <Text style={[styles.price, { color: theme.accent }]}>{inr(item.price)}</Text>
                </View>
                <Text style={[styles.delivery, { color: theme.accent2 }]}>Free delivery by tomorrow</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </ExperienceLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 20, color: "#FDF6EC", textAlign: "center", marginBottom: 4 },
  subtitle: { fontFamily: FONTS.body, fontSize: 12.5, color: "rgba(253,246,236,0.5)", textAlign: "center", marginBottom: 16 },
  card: { flex: 1, borderRadius: 14, overflow: "hidden" },
  iconWrap: {
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  tag: { position: "absolute", top: 6, left: 6, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  tagLabel: { fontFamily: FONTS.bodyBold, fontSize: 9, color: "#1A0F0A" },
  cardBody: { padding: 10 },
  name: { fontFamily: FONTS.bodyBold, fontSize: 12, color: "#FDF6EC", minHeight: 30 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginVertical: 4 },
  rating: { fontFamily: FONTS.bodyBold, fontSize: 10.5, color: "rgba(253,246,236,0.75)" },
  reviews: { fontFamily: FONTS.body, fontSize: 10, color: "rgba(253,246,236,0.4)" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  mrp: { fontFamily: FONTS.body, fontSize: 10.5, color: "rgba(253,246,236,0.35)", textDecorationLine: "line-through" },
  price: { fontFamily: FONTS.monoBold, fontSize: 12.5 },
  delivery: { fontFamily: FONTS.bodyBold, fontSize: 9.5, marginTop: 3 },
});
