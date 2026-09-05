export type RootStackParamList = {
  Setup: undefined;
  EnterCode: undefined;
  Share: undefined;
  OpenDrop: { shareCode: string };
  Greeting: undefined;
  Candles: undefined;
  CakeSmash: undefined;
  GiftPicker: undefined;
  Payment: undefined;
  Reveal: undefined;
  Message: undefined;
  Fireworks: undefined;
};

export const EXPERIENCE_STEPS: (keyof RootStackParamList)[] = [
  "Greeting",
  "Candles",
  "CakeSmash",
  "GiftPicker",
  "Payment",
  "Reveal",
  "Message",
  "Fireworks",
];
