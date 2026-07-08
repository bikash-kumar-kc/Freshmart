import { productQuantity, statusOfCart } from "@/src/store/carts/selectors";
import { updateCartItem } from "@/src/store/carts/slice";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { ConsoleLogWriter } from "drizzle-orm";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

function QuantityControl({
  value,
  maxStock,
  id,
}: {
  value: number;
  maxStock: number;
  id: string;
}) {
  const [quantity, setQuantity] = useState(String(value ?? 1));
  const dispatch = useAppDispatch();
  const statusCart = useAppSelector(statusOfCart);
  const quantityInfo = useAppSelector(productQuantity(id));

  const handleIncrement = (productId: string) => {
    if (!productId) return;
    if (quantityInfo?.productId === id) {
      const isStockAvailable = quantityInfo.quantity < maxStock;
      if (isStockAvailable) {
        dispatch(updateCartItem({ productId: productId, type: "increment" }));
        setQuantity((prevs) => String(Number(prevs) + 1));
      }
    }
  };

  const handleDecrement = (productId: string) => {
    if (!productId) return;
    if (quantityInfo?.productId === id) {
      dispatch(updateCartItem({ productId: productId, type: "decrement" }));
      setQuantity((prevs) => String(Number(prevs) - 1));
    }
  };

  const handleChange = (productId: string, value: number) => {
    if (!productId) return;

    if (quantityInfo?.productId === id) {
      const isValueMoreThanStock = value > maxStock;
      console.log("isValueMoreThanStock", isValueMoreThanStock);
      if (isValueMoreThanStock) return;

      dispatch(
        updateCartItem({
          productId,
          type: "onchange",
          value,
        }),
      );
    }
  };

  const isFromDb = statusCart ? statusCart.type === "db" : false;

  return (
    <div className="flex items-center gap-0 h-8">
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          handleDecrement(id);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-l-lg
          border border-gray-200 bg-white text-gray-500 hover:bg-green-50
          hover:border-green-300 hover:text-green-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={value <= 1 || isFromDb}
      >
        <Minus size={12} />
      </button>
      <div
        className="w-10 h-8 flex items-center justify-center border-y
        border-gray-200 bg-white text-sm font-semibold text-gray-900"
      >
        <input
          type="number"
          value={quantity}
          max={maxStock}
          onChange={(e) => {
            const value = e.target.value;
            const refinedValue = Math.max(1, Math.min(Number(value), maxStock));
            setQuantity(String(refinedValue));

            const numberValue = Number(value);

            if (!Number.isNaN(numberValue)) {
              handleChange(id, numberValue);
            }
          }}
          onBlur={() => {
            let value = Number(quantity);

            if (Number.isNaN(value) || value < 1) {
              value = 1;
            }

            setQuantity(String(value));

            dispatch(
              updateCartItem({
                productId: id,
                type: "onchange",
                value,
              }),
            );
          }}
          disabled={isFromDb}
          className="w-9 py-1.5 text-center"
        />
      </div>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          handleIncrement(id);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-r-lg
          border border-gray-200 bg-white text-gray-500 hover:bg-green-50
          hover:border-green-300 hover:text-green-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={value >= maxStock || isFromDb}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

export default QuantityControl;
