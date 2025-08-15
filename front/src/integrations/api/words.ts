import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export async function wordsList(search?: string, cursor?: string, limit?: number) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (cursor) params.append('cursor', cursor);
  if (limit) params.append('limit', limit.toString());

  const { data } = await apiClient.get(`${API_ENDPOINTS.words.list}?${params.toString()}`);
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