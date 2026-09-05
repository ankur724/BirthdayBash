import { apiClient } from "./client";
import { FALLBACK_GIFTS, type Gift } from "../constants/gifts";

export async function fetchGifts(): Promise<Gift[]> {
  try {
    const { data } = await apiClient.get<Gift[]>("/gifts");
    return data.length ? data : FALLBACK_GIFTS;
  } catch {
    return FALLBACK_GIFTS;
  }
}
