export const API_ENDPOINTS = {
  auth: {
    login: "/auth/signin",
    register: "/auth/signout",
  },
  words: {
    list: "/entries/en",
    detail: (word: string) => `/entries/en/${word}`,
    favorite: (word: string) => `/entries/en/${word}/favorite`,
    unfavorite: (word: string) => `/entries/en/${word}/unfavorite`,
  },
  user: {
    profile: "/user/me",
    histories: "/user/me/history",
    favorites: "/user/me/favorites",
  }
};
