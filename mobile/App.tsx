import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import * as Linking from "expo-linking";
import type { RootStackParamList } from "./src/navigation/types";
import { useFonts as useBaloo2, Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold } from "@expo-google-fonts/baloo-2";
import { useFonts as useDMSans, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { useFonts as useCaveat, Caveat_600SemiBold, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { useFonts as useJetBrainsMono, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold } from "@expo-google-fonts/jetbrains-mono";
import RootNavigator from "./src/navigation/RootNavigator";
import { DropProvider } from "./src/context/DropContext";

export default function App() {
  const [baloo2Loaded] = useBaloo2({ Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold });
  const [dmSansLoaded] = useDMSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const [caveatLoaded] = useCaveat({ Caveat_600SemiBold, Caveat_700Bold });
  const [jetBrainsMonoLoaded] = useJetBrainsMono({ JetBrainsMono_500Medium, JetBrainsMono_600SemiBold });

  const fontsLoaded = baloo2Loaded && dmSansLoaded && caveatLoaded && jetBrainsMonoLoaded;

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.createURL("/")],
    config: {
      screens: {
        OpenDrop: "drop/:shareCode",
      },
    },
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0E0916" }}>
        <ActivityIndicator color="#FF4FA0" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <DropProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </DropProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
