// components/SaveBadge.tsx
type SaveBadgeProps = {
  amount: number | string;
  className?: string;
};

export default function SaveBanner({ amount, className = "" }: SaveBadgeProps) {
  return (
    <div
      className={`absolute  left-2  z-10 flex flex-col 
        bg-blue-500 text-white text-xs font-bold leading-tight
        pt-1.5 pb-2 rounded px-1
        ${className}`}
    >
      <span className="tracking-wide">Has Varients</span>
    </div>
  );
}
