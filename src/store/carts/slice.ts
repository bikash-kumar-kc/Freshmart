import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const CART_LOCALSTORAGE_KEY = "cart";

export interface ICartItem {
  productId: string;
  varient: {
    weightUnit: string;
    weightValue: number;
    price: number;
  };
  isOffered: boolean;
  discountAmount: number;
}

interface ICartItems {
  cartItems: ICartItem[];
}

export const loadFromStorage = (): ICartItems => {
  try {
    if (typeof window === "undefined") return { cartItems: [] };
    const rawCartItems = localStorage.getItem(CART_LOCALSTORAGE_KEY);
    const parseCardItems = rawCartItems ? JSON.parse(rawCartItems) : [];
    return {
      cartItems: parseCardItems,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    console.log("Failed to get cartItems from localStorage !");

    return {
      cartItems: [],
    };
  }
};

export const saveToLocalStorage = ({ cartItems }: ICartItems) => {
  try {
    const parsedCartItems = JSON.stringify(
      cartItems.length === 0 ? [] : cartItems,
    );
    localStorage.setItem(CART_LOCALSTORAGE_KEY, parsedCartItems);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

const initialState = {
  ...loadFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // add item/s to cart...
    addCartItem: (state, actions: PayloadAction<ICartItem>) => {
      if (!actions.payload.productId) return;
      if (
        state.cartItems.some((i) => i.productId === actions.payload.productId)
      )
        return;
      state.cartItems.push(actions.payload);
      saveToLocalStorage({ cartItems: state.cartItems });
    },

    // remove item/s to cart...
    removeCartItem: (state, actions: PayloadAction<{ productId: string }>) => {
      if (!actions.payload.productId) return;
      const isExist = state.cartItems.some(
        (i) => i.productId === actions.payload.productId,
      );
      if (isExist) {
        state.cartItems = state.cartItems.filter(
          (c) => c.productId !== actions.payload.productId,
        );
        saveToLocalStorage({ cartItems: state.cartItems });
      }
    },
    
  },
});
