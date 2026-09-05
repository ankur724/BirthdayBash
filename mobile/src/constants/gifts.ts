export interface Gift {
  id: string;
  name: string;
  price: number;
  mrp: number;
  rating: string;
  reviews: string;
  tag: string | null;
  icon_key: string;
}

// Local fallback so the picker works even if the backend is unreachable.
// The live list is fetched from GET /api/v1/gifts and takes priority.
export const FALLBACK_GIFTS: Gift[] = [
  { id: "iphone", name: "iPhone 16 Pro Max", price: 134900, mrp: 149900, rating: "4.8", reviews: "12.4k", tag: "Bestseller", icon_key: "smartphone" },
  { id: "macbook", name: "MacBook Pro M4", price: 249900, mrp: 269900, rating: "4.9", reviews: "6.1k", tag: null, icon_key: "laptop" },
  { id: "ps5", name: "PS5 + 5 games", price: 64990, mrp: 74990, rating: "4.7", reviews: "9.8k", tag: "Deal", icon_key: "gamepad2" },
  { id: "tesla", name: "Tesla Model 3", price: 3499000, mrp: 3699000, rating: "4.9", reviews: "820", tag: "Trending", icon_key: "car" },
  { id: "rolex", name: "Rolex Submariner", price: 950000, mrp: 999000, rating: "4.9", reviews: "1.1k", tag: null, icon_key: "watch" },
  { id: "maldives", name: "Trip to Maldives", price: 350000, mrp: 399000, rating: "4.8", reviews: "3.4k", tag: null, icon_key: "plane" },
  { id: "lv", name: "Louis Vuitton bag", price: 280000, mrp: 305000, rating: "4.7", reviews: "2.2k", tag: null, icon_key: "shopping-bag" },
  { id: "pc", name: "Gaming PC setup", price: 180000, mrp: 199000, rating: "4.6", reviews: "5.6k", tag: "Deal", icon_key: "monitor" },
];

export const FUNNY_LINES = [
  "Bold move. Have you considered selling a kidney? Asking for a friend.",
  "Your card is already crying. It can see the future.",
  "Sir/Ma'am, your accountant just quit. Just so you know.",
  "Studies show 100% of people who bought this now live with their parents.",
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
