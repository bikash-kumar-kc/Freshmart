import { IAPIResponseTypes } from "./getPopularProducts";

export interface IOrderType {
  type: "display" | "inventory";
  orderId: string;
  orderStatus?: "pending" | "delivered" | "shipped" | "packaging" | 'processing'
  displayOrderStatus?: "pending" | "cancelled" | "processing" | "delivered" ;
  updatedTime: string;
  totalCost?: number | null;
  totalItems: number;
  productNames: string;
  farmName?: string;
  location?: string;
  phone?: string;
  email?: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/order/${userId}`,
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
