import { RootState } from "../store";

export const DELIVERYCHARGEDLIMIT = 500;
export const totalItemsCart = (state: RootState) => {
  if (!state) return;
  return {
    totalItemsCart: state.carts.cartItems.length,
  };
};

export const isProductInCart =
  (productId: string | undefined) => (state: RootState) => {
    if (!productId) return;
    return state.carts.cartItems.some((i) => i.productId === productId);
  };

export const totalCalculation = (state: RootState) => {
  if (!state) return;

  const totalPriceWithoutDiscount = state.carts.cartItems.reduce(
    (totalPrice, i) => totalPrice + i.varient.price,
    0,
  );

  const totalDiscountAmount = state.carts.cartItems.reduce(
    (totalDiscount, i) => totalDiscount + i.discountAmount,
    0,
  );

  return {
    tpwod: totalPriceWithoutDiscount,
    tda: totalDiscountAmount,
    tpwd: totalPriceWithoutDiscount - totalDiscountAmount,
    isDeliveryCharged: totalPriceWithoutDiscount <= DELIVERYCHARGEDLIMIT,
  };
};


