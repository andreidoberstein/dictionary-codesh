type FavList = string[];

type HistoryItem = { term: string; viewed_at: string };

type HistoryList = HistoryItem[];

const favKey = (userId: string) => `dictionary:favorites:${userId}`;
const histKey = (userId: string) => `dictionary:history:${userId}`;

export const localStore = {
  listFavorites(userId: string): FavList {
    const raw = localStorage.getItem(favKey(userId));
    return raw ? (JSON.parse(raw) as FavList) : [];
  },
  addFavorite(userId: string, term: string) {
    const list = this.listFavorites(userId);
    if (!list.includes(term)) {
      list.push(term);
      localStorage.setItem(favKey(userId), JSON.stringify(list));
    }
  },
  removeFavorite(userId: string, term: string) {
    const list = this.listFavorites(userId).filter((t) => t !== term);
    localStorage.setItem(favKey(userId), JSON.stringify(list));
  },
  hasFavorite(userId: string, term: string) {
    return this.listFavorites(userId).includes(term);
  },
  listHistory(userId: string): HistoryList {
    const raw = localStorage.getItem(histKey(userId));
    return raw ? (JSON.parse(raw) as HistoryList) : [];
  },
  addHistory(userId: string, term: string) {
    const list = this.listHistory(userId);
    const item = { term, viewed_at: new Date().toISOString() };
    const next = [item, ...list.filter((i) => i.term !== term)].slice(0, 200);
    localStorage.setItem(histKey(userId), JSON.stringify(next));
  },
};
