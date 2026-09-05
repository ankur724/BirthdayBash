import { apiClient, SERVER_ROOT } from "./client";
import type { Drop, DropCreatePayload } from "../types";

export async function createDrop(payload: DropCreatePayload): Promise<Drop> {
  const { data } = await apiClient.post<Drop>("/drops", payload);
  return data;
}

export async function getDrop(shareCode: string): Promise<Drop> {
  const { data } = await apiClient.get<Drop>(`/drops/${shareCode}`);
  return data;
}

export async function setDropGift(shareCode: string, giftId: string | null): Promise<Drop> {
  const { data } = await apiClient.patch<Drop>(`/drops/${shareCode}`, {
    selected_gift_id: giftId,
  });
  return data;
}

export async function uploadPhoto(uri: string): Promise<string> {
  const form = new FormData();
  const filename = uri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";
  // @ts-expect-error - React Native's FormData accepts this shape for file uploads.
  form.append("file", { uri, name: filename, type });

  const { data } = await apiClient.post<{ url: string }>("/uploads/photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // The backend returns a path relative to its own root (e.g. "/static/uploads/x.jpg"),
  // not the "/api/v1"-prefixed API — resolve it against the server root, not apiClient's baseURL.
  return `${SERVER_ROOT}${data.url}`;
}
