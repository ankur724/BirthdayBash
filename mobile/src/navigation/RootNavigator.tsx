import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SetupScreen from "../screens/setup/SetupScreen";
import EnterCodeScreen from "../screens/setup/EnterCodeScreen";
import ShareScreen from "../screens/setup/ShareScreen";
import OpenDropScreen from "../screens/setup/OpenDropScreen";
import GreetingScreen from "../screens/experience/GreetingScreen";
import CandlesScreen from "../screens/experience/CandlesScreen";
import CakeSmashScreen from "../screens/experience/CakeSmashScreen";
import GiftPickerScreen from "../screens/experience/GiftPickerScreen";
import PaymentScreen from "../screens/experience/PaymentScreen";
import RevealScreen from "../screens/experience/RevealScreen";
import MessageScreen from "../screens/experience/MessageScreen";
import FireworksScreen from "../screens/experience/FireworksScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="EnterCode" component={EnterCodeScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
      <Stack.Screen name="OpenDrop" component={OpenDropScreen} />
      <Stack.Screen name="Greeting" component={GreetingScreen} />
      <Stack.Screen name="Candles" component={CandlesScreen} />
      <Stack.Screen name="CakeSmash" component={CakeSmashScreen} />
      <Stack.Screen name="GiftPicker" component={GiftPickerScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Reveal" component={RevealScreen} />
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="Fireworks" component={FireworksScreen} />
    </Stack.Navigator>
  );
}
