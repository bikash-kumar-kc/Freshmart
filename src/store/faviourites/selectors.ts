import { RootState } from "./store";

export const selectFavorites = (state: RootState) => {
  if (!state) return;
  return state.favorites.items;
};

export const selectFavoriteCount = (state: RootState) => {
  if (!state) return;
  return state.favorites.items.length;
};

export const selectIsFavorite = (productId: string) => (state: RootState) =>
  state.favorites.items.some((f) => f.productId === productId);
