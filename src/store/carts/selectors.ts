import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const DELIVERYCHARGEDLIMIT = 500;

const totalItems = (state: RootState) => state.carts.cartItems.cartItems.length;

export const totalItemsCart = createSelector([totalItems], (items) => ({
  totalItemsCart: items,
}));

const selectCartItems = (state: RootState) => state.carts.cartItems;

export const getAllItemsFromCart = createSelector(
  [selectCartItems],
  (cartItems) => ({
    items: cartItems,
    totalItems: cartItems.cartItems.length,
  }),
);

export const isProductInCart =
  (productId: string | undefined) => (state: RootState) => {
    if (!productId) return;
    return state.carts.cartItems.cartItems.some(
      (i) => i.productId === productId,
    );
  };

export const fetchProductFromCart =
  (productId: string | undefined) => (state: RootState) => {
    if (!productId) return;
    return state.carts.cartItems.cartItems.find(
      (i) => i.productId === productId,
    );
  };

export const productQuantity =
  (productId: string | undefined) => (state: RootState) => {
    if (!productId) return;
    const product = state.carts.cartItems.cartItems.filter(
      (i) => i.productId === productId,
    );
    return {
      productId: product[0].productId,
      quantity: product[0].quantity,
    };
  };

// export const statusOfCart = (state: RootState) => {
//   if (!state) return;
//   return {
//     type: state.carts.type,
//     orderId: state.carts.orderId,
//   };
// };

export const statusOfCart = createSelector(
  [
    (state: RootState) => state.carts.type,
    (state: RootState) => state.carts.orderId,
  ],
  (type, orderId) => ({
    type,
    orderId,
  }),
);

export const isAllowedToAddedInCart = (state: RootState) => {
  if (!state) return;
  return state.carts.orderId && state.carts.type === "db";
};

export const totalCalculation = createSelector(
  [(state: RootState) => state.carts.cartItems.cartItems],
  (cartItems) => {
    const totalPriceWithoutDiscount = cartItems.reduce(
      (totalPrice, item) => totalPrice + item.varient.price * item.quantity,
      0,
    );

    const totalDiscountAmount = cartItems.reduce(
      (totalDiscount, item) =>
        totalDiscount + (item.discountAmount ?? 0) * item.quantity,
      0,
    );

    return {
      tpwod: totalPriceWithoutDiscount,
      tda: totalDiscountAmount,
      tpwd: totalPriceWithoutDiscount - totalDiscountAmount,
      totalSaving: totalDiscountAmount,
      isDeliveryCharged: totalPriceWithoutDiscount <= DELIVERYCHARGEDLIMIT,
    };
  },
);

// export const totalCalculation = (state: RootState) => {
//   if (!state) return;

//   const totalPriceWithoutDiscount = state.carts.cartItems.cartItems.reduce(
//     (totalPrice, i) => totalPrice + i.varient.price * i.quantity,
//     0,
//   );

//   const totalDiscountAmount = state.carts.cartItems.cartItems.reduce(
//     (totalDiscount, i) => {
//       console.log(i.discountAmount);
//       return totalDiscount + (i.discountAmount ?? 0) * i.quantity;
//     },
//     0,
//   );

//   return {
//     tpwod: totalPriceWithoutDiscount,
//     tda: totalDiscountAmount,
//     tpwd: totalPriceWithoutDiscount - totalDiscountAmount,
//     totalSaving:
//       totalPriceWithoutDiscount -
//       (totalPriceWithoutDiscount - totalDiscountAmount),
//     isDeliveryCharged: totalPriceWithoutDiscount <= DELIVERYCHARGEDLIMIT,
//   };
// };
