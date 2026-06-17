export const ProvenanceStrip = ({
  farmName,
  originCountry,
  expireAt,
}: {
  farmName: string;
  originCountry: string;
  expireAt: string;
}) => {
  const bestBefore = new Date(expireAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const steps = [
    {
      icon: "🌱",
      label: "Grown at",
      value: farmName,
      sub: originCountry,
    },
    {
      icon: "🌾",
      label: "Harvested",
      value: "Hand-picked",
      sub: "No machines",
    },
    {
      icon: "📦",
      label: "Best before",
      value: bestBefore,
      sub: "Freshness guaranteed",
    },
  ];

  return (
    <div className="bg-[#0D1F0C] rounded-2xl p-4 mt-4">
      <p
        className="text-[10px] font-medium uppercase tracking-widest
        text-green-400 mb-3"
      >
        Farm to your door
      </p>
      <div className="flex items-start gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-2 flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-9 h-9 rounded-xl bg-green-900/60 flex
                items-center justify-center text-lg mb-1.5"
              >
                {s.icon}
              </div>
              <p
                className="text-[10px] text-green-500 text-center leading-none
                mb-0.5"
              >
                {s.label}
              </p>
              <p
                className="text-xs font-medium text-white text-center
                leading-snug"
              >
                {s.value}
              </p>
              <p
                className="text-[10px] text-green-600 text-center leading-none
                mt-0.5"
              >
                {s.sub}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className="shrink-0 mt-4 text-green-700 text-xs">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
