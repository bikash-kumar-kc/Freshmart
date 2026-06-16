"use client";
import { useState } from "react";

const faqs = [
  { q: "Is organic food really healthier?", a: "Yes, it reduces chemical exposure." },
  { q: "Why is organic expensive?", a: "Because of labor-intensive farming." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">FAQs</h2>

      {faqs.map((f, i) => (
        <div key={i} className="border-b py-2">
          <button
            className="w-full text-left font-medium"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
          </button>

          {open === i && (
            <p className="text-sm text-gray-600 mt-1">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}