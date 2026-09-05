import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, Trash2, Upload } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Field from "../../components/Field";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { createDrop, uploadPhoto } from "../../api/drops";
import { THEMES, THEME_KEYS, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Setup">;

export default function SetupScreen({ navigation }: Props) {
  const { draft, setDraft, setDrop, setSelectedGift } = useDrop();
  const [creating, setCreating] = useState(false);
  const theme = THEMES[draft.themeKey];

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setDraft((d) => ({ ...d, photoUri: result.assets[0].uri }));
    }
  }

  async function pickMemoryPhoto(index: number) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.82,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!result.canceled && result.assets[0]) {
      setDraft((d) => {
        const memoryPhotoUris = [...d.memoryPhotoUris];
        memoryPhotoUris[index] = result.assets[0].uri;
        return { ...d, memoryPhotoUris };
      });
    }
  }

  function removeMemoryPhoto(index: number) {
    setDraft((d) => {
      const memoryPhotoUris = [...d.memoryPhotoUris];
      memoryPhotoUris[index] = null;
      return { ...d, memoryPhotoUris };
    });
  }

  async function handleCreate() {
    if (!draft.name.trim()) {
      Alert.alert("Add a name", "Who is this birthday drop for?");
      return;
    }
    setCreating(true);
    try {
      let photo_url: string | null = null;
      if (draft.photoUri) {
        photo_url = await uploadPhoto(draft.photoUri);
      }
      const memoryPhotoUrls = await Promise.all(
        draft.memoryPhotoUris.map((uri) => (uri ? uploadPhoto(uri) : Promise.resolve(null))),
      );
      const drop = await createDrop({
        name: draft.name.trim(),
        age: draft.age,
        message: draft.message.trim(),
        theme_key: draft.themeKey,
        photo_url,
        memory_photo_url_1: memoryPhotoUrls[0],
        memory_photo_url_2: memoryPhotoUrls[1],
        memory_photo_url_3: memoryPhotoUrls[2],
      });
      setDrop(drop);
      setSelectedGift(null);
      navigation.navigate("Share");
    } catch (err) {
      Alert.alert(
        "Couldn't create the drop",
        "Check that the backend is running and reachable, then try again."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: "#0E0916" }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>BIRTHDAYDROP</Text>
            <Text style={styles.title}>Set up the surprise</Text>
          </View>
          <Pressable onPress={() => navigation.navigate("EnterCode")} hitSlop={8}>
            <Text style={styles.enterCodeLink}>Have a code?</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          This is exactly what they'll see when they open the link.
        </Text>

        <Field label="Name">
          <TextInput
            value={draft.name}
            onChangeText={(v) => setDraft((d) => ({ ...d, name: v.slice(0, 24) }))}
            placeholder="Birthday person's name"
            placeholderTextColor="rgba(253,246,236,0.35)"
            style={styles.input}
          />
        </Field>

        <Field label={`Turning ${draft.age}${draft.age > 12 ? " (capped at 12 candles)" : ""}`}>
          <View style={styles.ageRow}>
            {[1, -1].map((delta, i) => (
              <Pressable
                key={i}
                onPress={() =>
                  setDraft((d) => ({ ...d, age: Math.min(60, Math.max(1, d.age + delta)) }))
                }
                style={styles.ageBtn}
              >
                <Text style={styles.ageBtnLabel}>{delta > 0 ? "+" : "−"}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Personal message">
          <TextInput
            value={draft.message}
            onChangeText={(v) => setDraft((d) => ({ ...d, message: v.slice(0, 240) }))}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textarea]}
            placeholderTextColor="rgba(253,246,236,0.35)"
          />
        </Field>

        <Field label="Theme">
          <View style={styles.themeRow}>
            {THEME_KEYS.map((key) => {
              const t = THEMES[key];
              const active = draft.themeKey === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setDraft((d) => ({ ...d, themeKey: key }))}
                  style={[
                    styles.themeSwatch,
                    { backgroundColor: t.accent, borderColor: active ? "#FDF6EC" : "transparent" },
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.themeCaption}>
            {theme.name} · {theme.vibe}
          </Text>
        </Field>

        <Field label="Face photo (for the cake smash)">
          <View style={styles.photoRow}>
            <View style={styles.photoPreview}>
              {draft.photoUri ? (
                <Image source={{ uri: draft.photoUri }} style={styles.photoImg} />
              ) : (
                <ImagePlus size={16} color="rgba(253,246,236,0.4)" />
              )}
            </View>
            <Pressable onPress={pickPhoto} style={styles.uploadBtn}>
              <Upload size={13} color="#FDF6EC" />
              <Text style={styles.uploadLabel}>
                {draft.photoUri ? "Change photo" : "Upload photo"}
              </Text>
            </Pressable>
            {draft.photoUri && (
              <Pressable onPress={() => setDraft((d) => ({ ...d, photoUri: null }))} hitSlop={8}>
                <Trash2 size={15} color="rgba(253,246,236,0.4)" />
              </Pressable>
            )}
          </View>
        </Field>

        <Field label="Birthday photos">
          <View style={styles.memoryGrid}>
            {[0, 1, 2].map((index) => {
              const uri = draft.memoryPhotoUris[index];
              return (
                <View key={index} style={styles.memorySlot}>
                  <Pressable onPress={() => pickMemoryPhoto(index)} style={styles.memoryPreview}>
                    {uri ? (
                      <Image source={{ uri }} style={styles.memoryImg} />
                    ) : (
                      <View style={styles.memoryEmpty}>
                        <ImagePlus size={20} color="rgba(253,246,236,0.55)" />
                        <Text style={styles.memoryEmptyLabel}>Photo {index + 1}</Text>
                      </View>
                    )}
                  </Pressable>
                  <View style={styles.memoryActions}>
                    <Pressable onPress={() => pickMemoryPhoto(index)} style={styles.memoryActionBtn}>
                      <Upload size={12} color="#FDF6EC" />
                      <Text style={styles.memoryActionLabel}>{uri ? "Change" : "Add"}</Text>
                    </Pressable>
                    {uri && (
                      <Pressable onPress={() => removeMemoryPhoto(index)} style={styles.memoryTrash} hitSlop={8}>
                        <Trash2 size={14} color="rgba(253,246,236,0.55)" />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Field>

        <PrimaryButton accent={theme.accent} onPress={handleCreate} loading={creating}>
          {creating ? "Creating…" : "Create the surprise"}
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  enterCodeLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12.5,
    color: "#FF4FA0",
    paddingTop: 4,
  },
  eyebrow: { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: "#FF4FA0", marginBottom: 8 },
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 28, color: "#FDF6EC", marginBottom: 6 },
  subtitle: { fontFamily: FONTS.body, fontSize: 14, color: "rgba(253,246,236,0.55)", marginBottom: 24 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FDF6EC",
    fontSize: 14,
    fontFamily: FONTS.body,
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  ageRow: { flexDirection: "row", gap: 10 },
  ageBtn: {
    width: 44,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  ageBtnLabel: { color: "#FDF6EC", fontSize: 18, fontFamily: FONTS.bodyBold },
  themeRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  themeSwatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 2 },
  themeCaption: { marginTop: 6, fontSize: 12, color: "rgba(253,246,236,0.45)", fontFamily: FONTS.body },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  photoPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoImg: { width: "100%", height: "100%" },
  memoryGrid: { flexDirection: "row", gap: 10 },
  memorySlot: { flex: 1, minWidth: 0 },
  memoryPreview: {
    height: 112,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  memoryImg: { width: "100%", height: "100%" },
  memoryEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  memoryEmptyLabel: { fontFamily: FONTS.bodyMedium, fontSize: 11.5, color: "rgba(253,246,236,0.55)" },
  memoryActions: { minHeight: 32, marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  memoryActionBtn: {
    flex: 1,
    minWidth: 0,
    height: 32,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  memoryActionLabel: { fontFamily: FONTS.bodyMedium, fontSize: 11.5, color: "#FDF6EC" },
  memoryTrash: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  uploadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  uploadLabel: { color: "#FDF6EC", fontFamily: FONTS.bodyMedium, fontSize: 12.5 },
});
