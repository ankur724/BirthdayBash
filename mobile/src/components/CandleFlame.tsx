import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

interface Props {
  lit: boolean;
  accent: string;
}

export default function CandleFlame({ lit, accent }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const smoke = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!lit) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.12, duration: 550, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 550, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [lit, scale]);

  useEffect(() => {
    if (lit) return;
    smoke.setValue(0);
    Animated.timing(smoke, { toValue: 1, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [lit, smoke]);

  return (
    <View style={{ width: 14, height: 26, alignItems: "center", justifyContent: "flex-end" }}>
      {lit ? (
        <Animated.View
          style={{
            width: 10,
            height: 16,
            borderRadius: 8,
            backgroundColor: accent,
            transform: [{ scale }],
          }}
        />
      ) : (
        <Animated.View
          style={{
            width: 6,
            height: 10,
            borderRadius: 6,
            backgroundColor: "rgba(180,180,190,0.5)",
            opacity: smoke.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
            transform: [
              { translateY: smoke.interpolate({ inputRange: [0, 1], outputRange: [0, -26] }) },
              { scale: smoke.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] }) },
            ],
          }}
        />
      )}
    </View>
  );
}
