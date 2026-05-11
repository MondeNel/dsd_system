import { Minus, Plus } from 'lucide-react';

export default function StepperInput({ value = 0, onChange, min = 0, max = 999 }) {
  const decrement = () => {
    if (value > min) onChange(Math.max(min, value - 1));
  };
  const increment = () => {
    if (value < max) onChange(Math.min(max, value + 1));
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus size={18} />
      </button>
      <span className="min-w-[3rem] text-center text-lg font-medium text-gray-800 select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}