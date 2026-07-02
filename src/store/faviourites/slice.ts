import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export const FAVIORITE_LOCALSTORAGE_KEY = "favorites";

export interface IFavoriteProduct {
  productId: string;
  slug: string;
  category: string;
}

interface IFavoriteProducts {
  items: IFavoriteProduct[];
}

export const loadFromStorage = (): IFavoriteProducts => {
  try {
    if (typeof window === "undefined") return { items: [] };
    const raw = localStorage.getItem(FAVIORITE_LOCALSTORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];

    return {
      items: items,
    };
  } catch {
    return { items: [] };
  }
};

export const saveToStorage = (items: IFavoriteProduct[]) => {
  try {
    localStorage.setItem(FAVIORITE_LOCALSTORAGE_KEY, JSON.stringify(items));
  } catch {
    console.log("Failed to store in : [localstorage]");
  }
};

const initialState: IFavoriteProducts = {
  items: loadFromStorage().items,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // add favorite items in local storage...

    addFavorite: (state, actions: PayloadAction<IFavoriteProduct>) => {
      const isExists = state.items.find(
        (f) => f.productId === actions.payload.productId,
      );

      if (isExists) return;

      state.items.push(actions.payload);
      saveToStorage(state.items);
    },

    removeFavorite: (state, action: PayloadAction<{ productId: string }>) => {
      state.items = state.items.filter(
        (f) => f.productId !== action.payload.productId,
      );
      saveToStorage(state.items);
    },

    clearFavorites: (state) => {
      state.items = [];
      saveToStorage(state.items);
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
