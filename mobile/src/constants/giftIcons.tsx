import React from "react";
import { Car, Gamepad2, Laptop, Monitor, Plane, ShoppingBag, Smartphone, Watch } from "lucide-react-native";
import type { LucideProps } from "lucide-react-native";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  smartphone: Smartphone,
  laptop: Laptop,
  gamepad2: Gamepad2,
  car: Car,
  watch: Watch,
  plane: Plane,
  "shopping-bag": ShoppingBag,
  monitor: Monitor,
};

export function GiftIcon({ iconKey, ...props }: { iconKey: string } & LucideProps) {
  const Icon = ICONS[iconKey] || ShoppingBag;
  return <Icon {...props} />;
}
