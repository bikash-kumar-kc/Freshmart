export const FreshnessBadge = ({ tag }: { tag: string }) => {
  const colors: Record<string, string> = {
    fresh: "bg-green-100 text-green-800",
    "farm-fresh": "bg-emerald-100 text-emerald-800",
    premium: "bg-amber-100 text-amber-800",
    "mid-fresh": "bg-yellow-100 text-yellow-800",
    "newly-harvested": "bg-lime-100 text-lime-800",
  };
  return (
    <span
      className={`text-[11px] font-medium px-2.5 py-1 rounded-full
      capitalize ${colors[tag] ?? "bg-gray-100 text-gray-600"}`}
    >
      {tag}
    </span>
  );
};
