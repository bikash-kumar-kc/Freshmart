import { userUnfinishedCart } from "@/src/lib/server actions/loadcart.server.action";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const CART_LOCALSTORAGE_KEY = "cart";
export const DEBOUNCE_TIME = 300;
// let globalTimer: ReturnType<typeof setTimeout>;

export interface ICartItem {
  productId: string;
  varient: {
    weightUnit: string;
    weightValue: number;
    price: number;
    stock: number;
  };
  isOffered: boolean;
  discountAmount: number;
  quantity: number;
  thumbnail: string;
  category: string;
  productName: string;
  slug: string;
}

export interface ICartItems {
  cartItems: ICartItem[];
}

interface IUpdateTypes {
  productId: string;
  type: "increment" | "decrement" | "onchange";
  value?: number;
}

// export const loadCart = async () => {
//   try {
//     const itemsInfo = await userUnfinishedCart();

//     if (itemsInfo.success && itemsInfo.cartItems) {
//       return {
//         type: "db",
//         cartItems: itemsInfo.cartItems ?? [],
//       };
//     }

//     const cartItems = loadFromStorage();

//     return {
//       type: "localstorage",
//       cartItems: cartItems.cartItems,
//     };
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.log("Failed to load cart items to store !");
//     }
//   }
// };

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
    console.log("saved to local storage");
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
  type: "localstorage" as const,
  orderId: "",
  cartItems: { ...loadFromStorage() },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // add item/s to cart...
    addCartItem: (state, actions: PayloadAction<ICartItem>) => {
      if (!actions.payload.productId) return;
      if (
        state.cartItems.cartItems.some(
          (i) => i.productId === actions.payload.productId,
        )
      )
        return;
      state.cartItems.cartItems.push(actions.payload);
      saveToLocalStorage({ cartItems: state.cartItems.cartItems });
    },

    // remove item/s to cart...
    removeCartItem: (state, actions: PayloadAction<{ productId: string }>) => {
      if (!actions.payload.productId) return;
      const isExist = state.cartItems.cartItems.some(
        (i) => i.productId === actions.payload.productId,
      );
      if (isExist) {
        state.cartItems.cartItems = state.cartItems.cartItems.filter(
          (c) => c.productId !== actions.payload.productId,
        );
        saveToLocalStorage({ cartItems: state.cartItems.cartItems });
      }
    },

    // update item/s to cart...
    updateCartItem: (state, actions: PayloadAction<IUpdateTypes>) => {
      console.log("here at update cart item");
      try {
        if (!actions.payload.productId || !actions.payload.type) return;

        switch (actions.payload.type) {
          case "increment": {
            console.log("here at increment");
            state.cartItems.cartItems = state.cartItems.cartItems.map((c) =>
              c.productId === actions.payload.productId
                ? { ...c, quantity: c.quantity + 1 }
                : c,
            );
            break;
          }
          case "decrement": {
            state.cartItems.cartItems = state.cartItems.cartItems.map((c) =>
              c.productId === actions.payload.productId
                ? { ...c, quantity: c.quantity - 1 }
                : c,
            );
            break;
          }
          case "onchange": {
            if (!actions.payload.value) return;
            state.cartItems.cartItems = state.cartItems.cartItems.map((c) =>
              c.productId === actions.payload.productId
                ? { ...c, quantity: actions.payload.value! }
                : c,
            );
            break;
          }
        }

        // if (globalTimer) {
        //   clearTimeout(globalTimer);
        // }

        // globalTimer = setTimeout(() => {
        saveToLocalStorage({ cartItems: state.cartItems.cartItems });
        // }, DEBOUNCE_TIME);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        console.log("Failed to update cartItems !");
      }
    },

    // clear cart ...
    clearCartItems: (state) => {
      state.cartItems.cartItems = [];
      saveToLocalStorage({ cartItems: state.cartItems.cartItems });
    },

    // set cart from db ...
    setCart: (state, action) => {
      state.type = action.payload.type;
      state.cartItems.cartItems = action.payload.cartItems;
    },
  },
});

export const {
  addCartItem,
  removeCartItem,
  updateCartItem,
  clearCartItems,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
