import {
  getAllOrders,
  IOrderType,
} from "@/src/lib/api calls/server/getAllOrders";
import { authOptions } from "@/src/lib/auth/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { manageError } from "@/src/utils/response";
import OrderRenderPage from "./components/OrderRenderPage";

const OrderStatusPage = async () => {
  let session;
  let orderData;
  let orders: IOrderType[] = [];

  try {
    session = await getServerSession(authOptions);
    if (!session?.user.id) {
      throw new Error("User is not logged in !");
    }
    orderData = await getAllOrders({ userId: session.user.id });
    orders = orderData.data;
  } catch (error) {
    const errRes = manageError(error);

    if (errRes) {
      return (
        <div className="w-full max-w-7xl m-auto">
          <div className="min-h-screen w-full flex justify-center items-center flex-col gap-2">
            <p className="text-gray-500">{errRes}</p>
            <Link
              href={
                errRes === "User Id is required !" ||
                errRes === "User is not logged in !"
                  ? "/auth/login"
                  : "/"
              }
            >
              <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
                {errRes === "User is not logged in !" ? "Login" : "Visit Home"}
              </button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-7xl m-auto">
        <div className="min-h-screen w-full flex justify-center items-center flex-col gap-2">
          <p className="text-red-500">Got an error !</p>
          <Link href="/">
            <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
              Visit Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-7xl m-auto">
        <div className="min-h-screen w-full flex justify-center items-center flex-col gap-2">
          <p className="text-gray-500">no orders yet.</p>
          <Link href="/">
            <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
              Visit Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <OrderRenderPage orders={orders} />;
};

export default OrderStatusPage;
