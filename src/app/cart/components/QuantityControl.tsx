import { productQuantity, statusOfCart } from "@/src/store/carts/selectors";
import { updateCartItem, removeCartItem } from "@/src/store/carts/slice";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function QuantityControl({
  value,
  maxStock,
  id,
  // handleCart,
}: {
  value: number;
  maxStock: number;
  id: string;
  // handleCart?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [quantity, setQuantity] = useState(String(value ?? 1));
  const dispatch = useAppDispatch();
  const statusCart = useAppSelector(statusOfCart);
  const quantityInfoVarient = useAppSelector(productQuantity);
  const quantityInfo = quantityInfoVarient(id);

  const handleIncrement = (varientId: string) => {
    if (!varientId) return;
    if (quantityInfo?.varientId === id) {
      const isStockAvailable = quantityInfo.quantity < maxStock;
      if (isStockAvailable) {
        dispatch(updateCartItem({ varientId, type: "increment" }));
        setQuantity((prevs) => String(Number(prevs) + 1));
      }
    }
  };

  const handleDecrement = (varientId: string) => {
    if (!varientId) return;
    if (quantityInfo?.varientId === id) {
      if (quantity === "1") {
        dispatch(removeCartItem({ varientId }));
        toast.success("Product removed from cart successfully !");
        return;
      }
      dispatch(updateCartItem({ varientId, type: "decrement" }));
      setQuantity((prevs) => String(Number(prevs) - 1));
      console.log(quantity);
    }
  };

  const handleChange = (varientId: string, value: number) => {
    if (!varientId) return;

    if (quantityInfo?.varientId === id) {
      const isValueMoreThanStock = value > maxStock;
      if (isValueMoreThanStock) return;

      dispatch(
        updateCartItem({
          varientId,
          type: "onchange",
          value,
        }),
      );
    }
  };

  const isFromDb = statusCart ? statusCart.type === "db" : false;

  useEffect(() => {
    setQuantity(String(value));
  }, [value]);

  return (
    <div className="flex items-center gap-0 h-8">
      <button
        onClick={() => {
          handleDecrement(id);
        }}
        className="w-8 h-7 flex items-center justify-center rounded-l-lg
          border border-gray-200 bg-white text-gray-500 hover:bg-green-50
          hover:border-green-300 hover:text-green-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={isFromDb}
      >
        <Minus size={12} />
      </button>
      <div
        className="w-10 h-7 flex items-center justify-center border-y
        border-gray-200 bg-white text-sm font-semibold text-gray-900"
      >
        <input
          type="number"
          value={quantity}
          max={maxStock}
          onWheel={(e) => e.currentTarget.blur()}
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

            if (Number.isNaN(value)) {
              value = 1;
            }

            setQuantity(String(value));

            dispatch(
              updateCartItem({
                varientId: id,
                type: "onchange",
                value,
              }),
            );
          }}
          disabled={isFromDb}
          className="w-9 py-1.5 text-center no-spinner"
        />
      </div>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          handleIncrement(id);
        }}
        className="w-8 h-7 flex items-center justify-center rounded-r-lg
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
