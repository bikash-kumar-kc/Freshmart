import { ProductVariant } from "@/src/db/schema";
import { discountedPrice, formatWeight } from "./helper.fun";
import { ChevronDown } from "lucide-react";

export const VariantSelect = ({
  variants,
  selected,
  onChange,
  hasDiscount,
  discount,
}: {
  variants: ProductVariant[];
  selected: ProductVariant;
  onChange: (v: ProductVariant) => void;
  hasDiscount: boolean;
  discount: number;
}) => {
  return (
    <div className="relative">
      <label className="text-xs font-medium text-gray-500 mb-1.5 block">
        Select weight
      </label>
      <div className="relative">
        <select
          value={selected.id}
          onChange={(e) => {
            const v = variants.find((v) => v.id === e.target.value);
            if (v) onChange(v);
          }}
          className="w-full appearance-none bg-white border border-gray-200
            rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-900
            focus:outline-none focus:ring-2 focus:ring-green-500
            focus:border-transparent cursor-pointer"
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {formatWeight(v.weightValue, v.weightUnit)} —{" "}
              {v.stock > 0
                ? `$${hasDiscount ? discountedPrice(v.price, discount).toFixed(2) : v.price.toFixed(2)}`
                : "Out of stock"}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2
            text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
};
