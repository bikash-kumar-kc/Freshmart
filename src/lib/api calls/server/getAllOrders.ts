import { IAPIResponseTypes } from "./getPopularProducts";

export interface IOrderType {
  orderId: string;
  orderStatus:
    | "pending"
    | "delivered"
    | "shipped"
    | "packaging"

  updatedTime: string;
  totalCost: number | null;
  totalItems: number;
  productNames: string;
}

type IOrderTypes = {
  orders: IOrderType[];
  total: number;
};

type IApiResponseType = IAPIResponseTypes<IOrderTypes>;

export const getAllOrders = async ({ userId }: { userId: string }) => {
  try {
    if (!userId) {
      throw new Error("User Id is required !");
    }

    const reponse = await fetch(
      `/api/order/${userId}`,
    );

    if (!reponse.ok) {
      throw new Error("Failed to get orders");
    }

    const responeData: IApiResponseType = await reponse.json();
    const data = responeData.data.orders;

    return {
      data,
      totalItems: responeData.data.total,
    };
  } catch (error) {
    throw error;
  }
};
