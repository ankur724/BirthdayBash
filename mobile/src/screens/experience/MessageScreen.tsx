import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Camera } from "lucide-react-native";
import ExperienceLayout from "../../components/ExperienceLayout";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Message">;

interface MemoryPhoto {
  id: string;
  url: string | null;
  rotate: number;
}

export default function MessageScreen({ navigation }: Props) {
  const { drop, reset } = useDrop();
  const [activePhoto, setActivePhoto] = useState(0);
  if (!drop) return null;
  const theme = THEMES[drop.theme_key];

  const photos = useMemo<MemoryPhoto[]>(
    () =>
      [drop.memory_photo_url_1, drop.memory_photo_url_2, drop.memory_photo_url_3].map((url, index) => ({
        id: `memory-${index}`,
        url: url || drop.photo_url,
        rotate: [-7, 5, -3][index],
      })),
    [drop.memory_photo_url_1, drop.memory_photo_url_2, drop.memory_photo_url_3, drop.photo_url],
  );

  return (
    <ExperienceLayout theme={theme} step="Message" onRestart={() => { reset(); navigation.popToTop(); }}>
      <View style={styles.center}>
        <View style={styles.collageWrap}>
          <View style={[styles.spotlightGlow, { backgroundColor: theme.glow }]} />
          <PhotoPolaroid photo={photos[activePhoto]} active accent={theme.accent} style={styles.heroPhoto} />

          <View style={styles.card}>
            <Text style={styles.message}>{drop.message}</Text>
            <Text style={styles.signature}>- happy birthday, {drop.name}</Text>
          </View>

          <View style={styles.photoStrip}>
            {photos.map((photo, index) => (
              <PhotoPolaroid
                key={photo.id}
                photo={photo}
                selected={activePhoto === index}
                accent={theme.accent}
                onPress={() => setActivePhoto(index)}
              />
            ))}
          </View>
        </View>

        <PrimaryButton accent={theme.accent} onPress={() => navigation.navigate("Fireworks")}>
          Continue
        </PrimaryButton>
      </View>
    </ExperienceLayout>
  );
}

function PhotoPolaroid({
  photo,
  active,
  selected,
  accent,
  onPress,
  style,
}: {
  photo: MemoryPhoto;
  active?: boolean;
  selected?: boolean;
  accent: string;
  onPress?: () => void;
  style?: any;
}) {
  const body = (
    <>
      <View style={active ? styles.heroPhotoImg : styles.polaroidImg}>
        {photo.url ? (
          <Image source={{ uri: photo.url }} style={styles.photoImg} resizeMode="cover" />
        ) : (
          <View style={styles.photoFallback}>
            <Camera size={active ? 34 : 18} color="rgba(42,21,51,0.48)" strokeWidth={2} />
          </View>
        )}
      </View>
      {!active && <View style={[styles.selectedLine, { backgroundColor: selected ? accent : "transparent" }]} />}
    </>
  );

  if (active) {
    return <View style={[styles.heroPolaroid, style]}>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.polaroid,
        {
          borderColor: selected ? accent : "rgba(42,21,51,0.08)",
          transform: [{ translateY: selected ? -8 : 0 }, { rotate: `${photo.rotate}deg` }],
        },
      ]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  collageWrap: { width: "100%", marginTop: 20, marginBottom: 24, alignItems: "center" },
  spotlightGlow: {
    position: "absolute",
    top: 8,
    width: 210,
    height: 210,
    borderRadius: 105,
    opacity: 0.8,
  },
  heroPhoto: { zIndex: 1 },
  heroPolaroid: {
    width: 188,
    height: 210,
    padding: 8,
    paddingBottom: 18,
    borderRadius: 6,
    backgroundColor: "#FBF3E7",
    shadowColor: "#000",
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    transform: [{ rotate: "2.2deg" }],
  },
  heroPhotoImg: {
    flex: 1,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#EADBCB",
  },
  photoImg: { width: "100%", height: "100%" },
  photoFallback: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5DEB5" },
  card: {
    width: "96%",
    marginTop: -48,
    backgroundColor: "#FBF3E7",
    borderRadius: 4,
    padding: 24,
    paddingTop: 58,
    transform: [{ rotate: "-1.2deg" }],
    zIndex: 2,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  message: { fontFamily: FONTS.script, fontSize: 20, lineHeight: 26, color: "#2A1533" },
  signature: { fontFamily: FONTS.scriptBold, fontSize: 18, color: "#7A4A2E", marginTop: 14, textAlign: "right" },
  photoStrip: {
    marginTop: -18,
    zIndex: 3,
    width: "92%",
    height: 96,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  polaroid: {
    width: 78,
    height: 88,
    backgroundColor: "#FBF3E7",
    padding: 5,
    paddingBottom: 8,
    borderRadius: 3,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  polaroidImg: { flex: 1, borderRadius: 2, overflow: "hidden", backgroundColor: "#EADBCB" },
  selectedLine: { height: 4, borderRadius: 2, marginTop: 5 },
});
