import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export async function wordsList(search?: string, cursor?: string, limit?: number) {
  const params = new URLSearchParams();

  if (search && search.trim()) params.append('search', search.trim());
  if (cursor) params.append('cursor', cursor);
  if (search && search.trim() && Number.isFinite(limit) && (limit as number) > 0) {
    params.append("limit", String(limit));
  }
  
  const qs = params.toString();
  const { data } = await apiClient.get(`${API_ENDPOINTS.words.list}${qs ? `?${qs}` : ''}`);
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
  const { data } = await apiClient.delete(API_ENDPOINTS.words.unfavorite(word));
  return data;
}

export async function userFavorites(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const { data } = await apiClient.get(`${API_ENDPOINTS.user.favorites}?${params.toString()}`);
  return data;
}

export async function isWordFavorited(word: string): Promise<boolean> {
  try {
    await apiClient.head(`${API_ENDPOINTS}/${encodeURIComponent(word)}/favorite`);
    return true;
  } catch (err) {
    if (err?.response?.status === 404) return false;
    throw err; // outros erros propaga
  }
}

export async function userHistories(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const { data } = await apiClient.get(`${API_ENDPOINTS.user.histories}?${params.toString()}`);
  return data;
}