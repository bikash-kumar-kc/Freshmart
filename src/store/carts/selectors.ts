import { RootState } from "../store";

export const DELIVERYCHARGEDLIMIT = 500;
export const totalItemsCart = (state: RootState) => {
  if (!state) return;
  return {
    totalItemsCart: state.carts.cartItems.cartItems.length,
  };
};

export const getAllItemsFromCart = (state: RootState) => {
  if (!state) {
    return;
  }

  return {
    items: state.carts.cartItems,
    totalItems: state.carts.cartItems.cartItems.length,
  };
};

export const isProductInCart =
  (productId: string | undefined) => (state: RootState) => {
    if (!productId) return;
    return state.carts.cartItems.cartItems.some(
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

export const statusOfCart = (state: RootState) => {
  if (!state) return;
  return {
    type: state.carts.type,
    orderId: state.carts.orderId,
  };
};

export const totalCalculation = (state: RootState) => {
  if (!state) return;

  const totalPriceWithoutDiscount = state.carts.cartItems.cartItems.reduce(
    (totalPrice, i) => totalPrice + i.varient.price * i.quantity,
    0,
  );

  const totalDiscountAmount = state.carts.cartItems.cartItems.reduce(
    (totalDiscount, i) => {
      console.log(i.discountAmount);
      return totalDiscount + (i.discountAmount ?? 0) * i.quantity;
    },
    0,
  );

  return {
    tpwod: totalPriceWithoutDiscount,
    tda: totalDiscountAmount,
    tpwd: totalPriceWithoutDiscount - totalDiscountAmount,
    totalSaving:
      totalPriceWithoutDiscount -
      (totalPriceWithoutDiscount - totalDiscountAmount),
    isDeliveryCharged: totalPriceWithoutDiscount <= DELIVERYCHARGEDLIMIT,
  };
};
