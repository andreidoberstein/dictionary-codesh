import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export async function wordsList() {
  const { data } = await apiClient.get(API_ENDPOINTS.words.list);
  return data;
}

export async function wordDetail(word: string) {
  const { data } = await apiClient.get(API_ENDPOINTS.words.detail(word));
  return data;
}

export async function favoriteWord(word: string) {
  const { data } = await apiClient.post(API_ENDPOINTS.words.favorite(word));
  return data;
}

export async function unfavoriteWord(word: string) {
  const { data } = await apiClient.post(API_ENDPOINTS.words.unfavorite(word));
  return data;
}