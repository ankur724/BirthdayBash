import type { Gift } from "../constants/gifts";
import type { ThemeKey } from "../theme/themes";

export interface Drop {
  id: string;
  share_code: string;
  name: string;
  age: number;
  message: string;
  theme_key: ThemeKey;
  photo_url: string | null;
  memory_photo_url_1: string | null;
  memory_photo_url_2: string | null;
  memory_photo_url_3: string | null;
  selected_gift: Gift | null;
  created_at: string;
  viewed_at: string | null;
}

export interface DropCreatePayload {
  name: string;
  age: number;
  message: string;
  theme_key: ThemeKey;
  photo_url?: string | null;
  memory_photo_url_1?: string | null;
  memory_photo_url_2?: string | null;
  memory_photo_url_3?: string | null;
}
