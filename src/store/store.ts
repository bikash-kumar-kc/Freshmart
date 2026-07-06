import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./faviourites/slice";

export const favoritesStore = configureStore({
  reducer: {
    favorites: favoriteReducer,
  },
});

export type RootState = ReturnType<typeof favoritesStore.getState>;
export type AppDispatch = typeof favoritesStore.dispatch;
