import { Minus, Plus } from "lucide-react";

export const QuantityPicker = ({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
}) => {
  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="w-10 h-10 flex items-center justify-center rounded-l-xl
          border border-r-0 border-gray-200 bg-white text-gray-600
          hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        <Minus size={14} />
      </button>
      <div
        className="w-12 h-10 flex items-center justify-center border-y
        border-gray-200 bg-white text-sm font-semibold text-gray-900"
      >
        {value}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center rounded-r-xl
          border border-l-0 border-gray-200 bg-white text-gray-600
          hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
