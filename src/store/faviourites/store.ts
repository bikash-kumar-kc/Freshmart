import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "../faviourites/slice";

export const favoritesStore = configureStore({
  reducer: {
    favorites: favoriteReducer,
  },
});
