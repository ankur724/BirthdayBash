import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChevronUp, Eraser, ImagePlus } from "lucide-react-native";
import ExperienceLayout from "../../components/ExperienceLayout";
import PrimaryButton from "../../components/PrimaryButton";
import { useDrop } from "../../context/DropContext";
import { THEMES, FONTS } from "../../theme/themes";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "CakeSmash">;

const CREAM = "#FBEFD9";
const CREAM_SHADE = "#E5C27F";
const PARTICLES = 22;
const CAKES: { id: string; source: ImageSourcePropType }[] = [
  { id: "cake1", source: require("../../../assets/cake1_clean.png") },
  { id: "cake2", source: require("../../../assets/cake2_clean.png") },
  { id: "cake3", source: require("../../../assets/cake3_clean.png") },
  { id: "cake4", source: require("../../../assets/cake4_clean.png") },
];

// irregular frosting blob, viewBox 0 0 200 200
const BLOB =
  "M100,20 C128,16 150,30 158,54 C164,72 186,78 184,100 C182,120 160,124 156,146 " +
  "C152,166 130,182 100,180 C72,182 46,172 42,150 C38,130 16,124 18,102 " +
  "C20,82 36,74 40,52 C46,28 72,24 100,20 Z";

const CAPTIONS = [
  "Drag the slice up to their face — or just tap.",
  "Right in the face. Beautiful.",
  "Again?! Ruthless.",
  "Okay, okay — they get it.",
  "This is just mean now.",
];

interface Splat {
  id: number;
  grow: Animated.Value;
  x: number;
  y: number;
  rot: number;
  sc: number;
}

export default function CakeSmashScreen({ navigation }: Props) {
  const { drop, reset } = useDrop();
  const theme = drop ? THEMES[drop.theme_key] : THEMES.classic;

  const [smashed, setSmashed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [count, setCount] = useState(0);
  const [splats, setSplats] = useState<Splat[]>([]);
  const [selectedCake, setSelectedCake] = useState(CAKES[0]);
  const countRef = useRef(0);
  const splatId = useRef(0);

  // effect drivers (native)
  const shake = useRef(new Animated.Value(0)).current;
  const impact = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const wipeX = useRef(new Animated.Value(0)).current;
  const hint = useRef(new Animated.Value(0)).current;
  const drips = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  const cakeFall = useRef(new Animated.Value(0)).current;

  // cake slice (JS driver — shared with PanResponder)
  const pan = useRef(new Animated.ValueXY()).current;
  const grab = useRef(new Animated.Value(1)).current;
  const bob = useRef(new Animated.Value(0)).current;

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / PARTICLES + (Math.random() - 0.5) * 0.6;
        const dist = 80 + Math.random() * 95;
        return {
          key: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 30,
          rot: (Math.random() - 0.5) * 900,
          size: 5 + Math.random() * 11,
          round: Math.random() > 0.4,
          color: [CREAM, theme.accent, theme.accent2][i % 3],
          v: new Animated.Value(0),
        };
      }),
    [theme.key, theme.accent, theme.accent2],
  );

  function launchParticles() {
    particles.forEach((p) => p.v.setValue(0));
    Animated.parallel(
      particles.map((p) =>
        Animated.timing(p.v, {
          toValue: 1,
          duration: 650 + Math.random() * 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }

  function triggerSmash() {
    countRef.current += 1;
    setCount(countRef.current);
    setSmashed(true);

    const grow = new Animated.Value(0);
    splatId.current += 1;
    const splat: Splat = {
      id: splatId.current,
      grow,
      x: (Math.random() - 0.5) * 46,
      y: (Math.random() - 0.5) * 30 + 6,
      rot: (Math.random() - 0.5) * 50,
      sc: 0.92 + Math.random() * 0.24,
    };
    setSplats((prev) => [...prev.slice(-4), splat]);
    Animated.spring(grow, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();

    shake.setValue(0);
    Animated.timing(shake, { toValue: 1, duration: 520, easing: Easing.linear, useNativeDriver: true }).start();

    impact.setValue(0);
    Animated.sequence([
      Animated.timing(impact, { toValue: 1, duration: 70, useNativeDriver: true }),
      Animated.spring(impact, { toValue: 0, friction: 3.5, tension: 130, useNativeDriver: true }),
    ]).start();

    ring.setValue(0);
    Animated.timing(ring, { toValue: 1, duration: 520, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();

    cakeFall.setValue(0);
    Animated.timing(cakeFall, {
      toValue: 1,
      duration: 1900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    drips.forEach((v) => v.setValue(0));
    Animated.stagger(
      140,
      drips.map((v) =>
        Animated.timing(v, { toValue: 1, duration: 1450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ),
    ).start();

    launchParticles();
    try {
      Vibration.vibrate(35);
    } catch {
      /* not available on web */
    }
  }

  // keep PanResponder's closure pointing at the latest smash handler
  const triggerRef = useRef(triggerSmash);
  triggerRef.current = triggerSmash;

  function launchCakeSmash() {
    if (smashed) {
      triggerSmash();
      return;
    }

    pan.setValue({ x: 0, y: 0 });
    Animated.timing(pan, {
      toValue: { x: 0, y: -180 },
      duration: 260,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      triggerSmash();
      pan.setValue({ x: 0, y: 0 });
    });
  }

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3,
      onPanResponderGrant: () => {
        setDragging(true);
        Animated.spring(grab, { toValue: 1.12, friction: 6, useNativeDriver: false }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        setDragging(false);
        Animated.spring(grab, { toValue: 1, friction: 6, useNativeDriver: false }).start();
        if (g.dy < -90) {
          Animated.timing(pan, {
            toValue: { x: 0, y: -180 },
            duration: 90,
            useNativeDriver: false,
          }).start(() => {
            triggerRef.current();
            pan.setValue({ x: 0, y: 40 });
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, tension: 70, useNativeDriver: false }).start();
          });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 5, tension: 60, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        Animated.spring(grab, { toValue: 1, friction: 6, useNativeDriver: false }).start();
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
      },
    }),
  ).current;

  function wipe() {
    Animated.parallel(
      splats.map((s) => Animated.timing(s.grow, { toValue: 0, duration: 240, useNativeDriver: true })),
    ).start(() => {
      setSplats([]);
      setSmashed(false);
      countRef.current = 0;
      setCount(0);
      cakeFall.setValue(0);
    });
    wipeX.setValue(0);
    Animated.timing(wipeX, { toValue: 1, duration: 480, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start();
  }

  // idle bob on the slice
  useEffect(() => {
    if (smashed) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(bob, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [smashed, bob]);

  // pulsing "drag me up" chevrons
  useEffect(() => {
    if (smashed) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(hint, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(hint, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [smashed, hint]);

  if (!drop) return null;
  const photoUrl = drop.photo_url;
  const subtitle = CAPTIONS[Math.min(count, CAPTIONS.length - 1)];

  const stageStyle = {
    transform: [
      {
        translateX: shake.interpolate({
          inputRange: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
          outputRange: [0, -9, 8, -6, 5, -3, 1, 0],
        }),
      },
      {
        translateY: shake.interpolate({
          inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
          outputRange: [0, 6, -4, 3, -1, 0],
        }),
      },
      {
        rotate: shake.interpolate({
          inputRange: [0, 0.15, 0.4, 0.7, 1],
          outputRange: ["0deg", "-1.5deg", "1deg", "-0.5deg", "0deg"],
        }),
      },
    ],
  };

  const faceStyle = {
    transform: [
      { scale: impact.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] }) },
      { rotate: impact.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "4deg"] }) },
    ],
  };

  const cakeStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: Animated.add(pan.y, bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] })) },
      {
        rotate: pan.x.interpolate({
          inputRange: [-120, 0, 120],
          outputRange: ["-14deg", "0deg", "14deg"],
          extrapolate: "clamp",
        }),
      },
      { scale: grab },
    ],
  };

  return (
    <ExperienceLayout theme={theme} step="CakeSmash" onRestart={() => { reset(); navigation.popToTop(); }}>
      <View style={styles.wrap}>
        <View style={styles.head}>
          <Text style={styles.title}>Cut the cake</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <Animated.View style={[styles.stage, stageStyle]}>
          <View style={styles.faceArea}>
            <View style={[styles.halo, { backgroundColor: theme.glow }]} />

            <Animated.View
              style={[
                styles.faceCircle,
                { borderColor: theme.accent, backgroundColor: theme.card, shadowColor: theme.glow },
                faceStyle,
              ]}
            >
              <Pressable style={styles.fill} onPress={smashed ? triggerSmash : launchCakeSmash}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={styles.fill} />
                ) : (
                  <View style={styles.placeholder}>
                    <ImagePlus size={34} color="rgba(253,246,236,0.3)" />
                  </View>
                )}
              </Pressable>

              {/* frosting splats — clipped to the face */}
              {splats.map((s) => (
                <Animated.View
                  key={s.id}
                  pointerEvents="none"
                  style={[
                    styles.splat,
                    {
                      opacity: s.grow.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 1] }),
                      transform: [
                        { translateX: s.x },
                        { translateY: s.y },
                        { rotate: `${s.rot}deg` },
                        { scale: s.grow.interpolate({ inputRange: [0, 1], outputRange: [0.15, s.sc] }) },
                      ],
                    },
                  ]}
                >
                  <Svg width={122} height={122} viewBox="0 0 200 200">
                    <Defs>
                      <RadialGradient id={`fr${s.id}`} cx="38%" cy="30%" r="75%">
                        <Stop offset="0%" stopColor="#FFFDF7" />
                        <Stop offset="55%" stopColor={CREAM} />
                        <Stop offset="100%" stopColor="#E6C892" />
                      </RadialGradient>
                    </Defs>
                    <Path d={BLOB} fill={`url(#fr${s.id})`} />
                    <Path d={BLOB} fill="none" stroke={CREAM_SHADE} strokeOpacity={0.34} strokeWidth={5} />
                    <Ellipse cx="72" cy="58" rx="34" ry="20" fill="#FFFFFF" opacity={0.35} />
                    <Path
                      d="M58,120 q22,16 46,7 q22,-9 36,4"
                      stroke="#FFFFFF"
                      strokeOpacity={0.3}
                      strokeWidth={6}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </Svg>
                </Animated.View>
              ))}

              {smashed && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.fallingCake,
                    {
                      opacity: cakeFall.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 0.92, 0.76] }),
                      transform: [
                        { translateY: cakeFall.interpolate({ inputRange: [0, 1], outputRange: [-48, 38] }) },
                        { scaleY: cakeFall.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1.08] }) },
                      ],
                    },
                  ]}
                >
                  <Svg width={205} height={170} viewBox="0 0 205 170">
                    <Defs>
                      <LinearGradient id="slideCream" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#FFFDF8" />
                        <Stop offset="62%" stopColor={CREAM} />
                        <Stop offset="100%" stopColor="#EACF98" />
                      </LinearGradient>
                      <RadialGradient id="creamGlow" cx="35%" cy="20%" r="58%">
                        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.7} />
                        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                      </RadialGradient>
                    </Defs>
                    <Path
                      d="M9,12 C38,-7 62,15 84,6 C111,-5 136,5 154,23 C176,45 194,48 199,70 C205,96 181,117 151,111 C131,107 115,118 95,115 C72,112 54,124 33,111 C11,98 -7,77 4,52 C11,36 -4,23 9,12 Z"
                      fill="url(#slideCream)"
                    />
                    <Path
                      d="M31,91 C35,128 45,148 58,145 C72,141 64,111 72,95 C81,111 78,157 96,162 C116,167 111,119 124,99 C134,116 131,146 146,149 C163,153 166,119 158,93"
                      fill="url(#slideCream)"
                    />
                    <Path
                      d="M20,50 C48,35 74,46 99,37 C126,28 151,37 178,60"
                      stroke="#FFFFFF"
                      strokeOpacity={0.42}
                      strokeWidth={8}
                      strokeLinecap="round"
                      fill="none"
                    />
                    <Ellipse cx="55" cy="39" rx="36" ry="24" fill="url(#creamGlow)" />
                  </Svg>
                </Animated.View>
              )}

              {/* cream drips */}
              {smashed &&
                drips.map((v, i) => {
                  const left = [32, 66, 100, 137, 163][i];
                  const height = [78, 112, 92, 124, 70][i];
                  const width = [10, 15, 12, 17, 11][i];
                  return (
                    <Animated.View
                      key={i}
                      pointerEvents="none"
                      style={{
                        position: "absolute",
                        top: 66,
                        left,
                        width,
                        height,
                        borderBottomLeftRadius: width,
                        borderBottomRightRadius: width,
                        backgroundColor: i % 2 === 0 ? CREAM : "#FFF8E9",
                        opacity: v.interpolate({ inputRange: [0, 0.08, 1], outputRange: [0, 0.96, 0.86] }),
                        transform: [
                          { scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [0.08, 1] }) },
                          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-42, 18 + i * 3] }) },
                        ],
                      }}
                    />
                  );
                })}

              {/* squeegee sweep on wipe */}
              {smashed && (
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: 46,
                    backgroundColor: "rgba(255,255,255,0.14)",
                    borderRightWidth: 3,
                    borderRightColor: "rgba(255,255,255,0.5)",
                    opacity: wipeX.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, 1, 1, 0] }),
                    transform: [{ translateX: wipeX.interpolate({ inputRange: [0, 1], outputRange: [-60, 220] }) }],
                  }}
                />
              )}

              <View pointerEvents="none" style={styles.gloss} />
            </Animated.View>

            {/* shockwave ring — sibling, not clipped */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.poof,
                {
                  borderColor: CREAM,
                  opacity: ring.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.55, 0] }),
                  transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1.7] }) }],
                },
              ]}
            />

            {/* frosting chunks + sprinkles */}
            {smashed &&
              particles.map((p) => (
                <Animated.View
                  key={p.key}
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: 100,
                    left: "50%",
                    width: p.size,
                    height: p.size,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                    borderRadius: p.round ? p.size / 2 : 3,
                    backgroundColor: p.color,
                    opacity: p.v.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }),
                    transform: [
                      { translateX: p.v.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
                      {
                        translateY: p.v.interpolate({
                          inputRange: [0, 0.55, 1],
                          outputRange: [0, p.dy, p.dy + 140],
                        }),
                      },
                      { rotate: p.v.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${p.rot}deg`] }) },
                      { scale: p.v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.4, 1, 0.5] }) },
                    ],
                  }}
                />
              ))}

            {/* drag hint */}
            {!smashed && !dragging && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.hint,
                  {
                    opacity: hint.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.9] }),
                    transform: [{ translateY: hint.interpolate({ inputRange: [0, 1], outputRange: [6, -4] }) }],
                  },
                ]}
              >
                <ChevronUp size={22} color={theme.accent} />
                <ChevronUp size={22} color={theme.accent} style={styles.hintLower} />
              </Animated.View>
            )}

            {!smashed && (
              <Animated.View style={styles.cakeDock} {...responder.panHandlers}>
                <Animated.View style={cakeStyle}>
                  <CakeSlice frosting={theme.accent2} source={selectedCake.source} />
                </Animated.View>
              </Animated.View>
            )}
          </View>
        </Animated.View>

        <View style={styles.actions}>
          {!smashed ? (
            <>
              <View style={styles.cakePicker}>
                {CAKES.map((cake) => {
                  const selected = cake.id === selectedCake.id;
                  return (
                    <Pressable
                      key={cake.id}
                      onPress={() => setSelectedCake(cake)}
                      style={[
                        styles.cakeOption,
                        {
                          borderColor: selected ? theme.accent : "rgba(253,246,236,0.16)",
                          backgroundColor: selected ? "rgba(255,213,92,0.14)" : "rgba(255,255,255,0.05)",
                        },
                      ]}
                    >
                      <Image source={cake.source} style={styles.cakeOptionImage} resizeMode="contain" />
                      {selected && <View style={[styles.cakeOptionDot, { backgroundColor: theme.accent2 }]} />}
                    </Pressable>
                  );
                })}
              </View>
              <PrimaryButton accent={theme.accent} onPress={launchCakeSmash}>
                Smash it on their face
              </PrimaryButton>
            </>
          ) : (
            <>
              <Text style={styles.moreHint}>tap their face to pile it on</Text>
              <Pressable onPress={wipe} style={styles.ghostBtn} hitSlop={8}>
                <Eraser size={16} color="rgba(253,246,236,0.8)" />
                <Text style={styles.ghostLabel}>Wipe it clean</Text>
              </Pressable>
              <PrimaryButton accent={theme.accent} onPress={() => navigation.navigate("GiftPicker")}>
                Continue
              </PrimaryButton>
            </>
          )}
        </View>
      </View>
    </ExperienceLayout>
  );
}

function CakeSlice({ frosting, source }: { frosting: string; source: ImageSourcePropType }) {
  return (
    <View style={styles.realCakeWrap}>
      <View style={styles.realCakeShadow} />
      <View style={styles.realCakeFrame}>
        <Image source={source} style={styles.realCakeImage} resizeMode="contain" />
      </View>
      <View style={[styles.realCakeFrosting, { backgroundColor: frosting }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  head: { alignItems: "center" },
  title: { fontFamily: FONTS.headingExtraBold, fontSize: 22, color: "#FDF6EC", marginBottom: 4 },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: "rgba(253,246,236,0.55)",
    textAlign: "center",
    minHeight: 18,
  },
  stage: { width: "100%", alignItems: "center" },
  faceArea: { width: "100%", height: 356, alignItems: "center" },
  fill: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  halo: { position: "absolute", top: -12, width: 224, height: 224, borderRadius: 112 },
  faceCircle: {
    position: "absolute",
    top: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 24,
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  splat: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  fallingCake: {
    position: "absolute",
    top: -18,
    width: 205,
    height: 170,
    alignItems: "center",
  },
  gloss: {
    position: "absolute",
    top: -46,
    width: 200,
    height: 120,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.10)",
    transform: [{ rotate: "-12deg" }],
  },
  poof: {
    position: "absolute",
    top: 10,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
  },
  hint: { position: "absolute", top: 206, alignItems: "center" },
  hintLower: { marginTop: -14, opacity: 0.5 },
  cakeDock: {
    position: "absolute",
    top: 226,
    width: 162,
    height: 138,
    alignItems: "center",
    justifyContent: "center",
  },
  realCakeWrap: {
    width: 146,
    height: 126,
    alignItems: "center",
    justifyContent: "center",
  },
  realCakeShadow: {
    position: "absolute",
    bottom: 6,
    width: 118,
    height: 18,
    borderRadius: 59,
    backgroundColor: "rgba(0,0,0,0.28)",
    transform: [{ scaleX: 1.08 }],
  },
  realCakeFrame: {
    width: 128,
    height: 104,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.22)",
    shadowColor: "#000",
    shadowOpacity: 0.34,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    transform: [{ rotate: "-2deg" }],
  },
  realCakeImage: {
    width: "100%",
    height: "100%",
  },
  realCakeFrosting: {
    position: "absolute",
    top: 18,
    right: 14,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
  },
  actions: { width: "100%", alignItems: "center", gap: 10 },
  cakePicker: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  cakeOption: {
    width: 66,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cakeOptionImage: {
    width: 60,
    height: 50,
  },
  cakeOptionDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FDF6EC",
  },
  moreHint: { fontFamily: FONTS.body, fontSize: 12, color: "rgba(253,246,236,0.45)" },
  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(253,246,236,0.18)",
  },
  ghostLabel: { fontFamily: FONTS.bodyMedium, fontSize: 13, color: "rgba(253,246,236,0.8)" },
});
