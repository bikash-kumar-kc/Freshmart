import { Minus, Plus } from "lucide-react";
import { useState } from "react";

function QuantityControl({
  value,
  // onIncrease,
  // onDecrease,
  // quantityChange,
  max,
  // id,
}: {
  value: number;
  max: number;
  id: string;
}) {
  const [amount, setAmount] = useState(value);

  const handleIncrement = () => {};
  const handleDecrement = () => {};
  const handleChange = () => {};

  return (
    <div className="flex items-center gap-0 h-8">
      <button
        onClick={() => {
          // onDecrease();
          setAmount((prevs) => (prevs === 0 ? 0 : prevs - 1));
        }}
        className="w-8 h-8 flex items-center justify-center rounded-l-lg
          border border-gray-200 bg-white text-gray-500 hover:bg-green-50
          hover:border-green-300 hover:text-green-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={value <= 1}
      >
        <Minus size={12} />
      </button>
      <div
        className="w-10 h-8 flex items-center justify-center border-y
        border-gray-200 bg-white text-sm font-semibold text-gray-900"
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            if (Number(e.target.value) < 1) return;
            setAmount(Number(e.target.value));
            // quantityChange(Number(e.target.value), id);
          }}
          className=" w-9 py-1.5 text-center"
        />
      </div>
      <button
        onClick={() => {
          // onIncrease();
          setAmount((prevs) => prevs + 1);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-r-lg
          border border-gray-200 bg-white text-gray-500 hover:bg-green-50
          hover:border-green-300 hover:text-green-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={value >= max}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

export default QuantityControl;
