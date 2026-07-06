import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./faviourites/slice";
import cartReducer from "./carts/slice";

export const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
    carts: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
