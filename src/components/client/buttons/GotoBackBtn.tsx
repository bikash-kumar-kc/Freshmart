"use client";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const GoBackButton = ({ text = "Back" }: { text?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleBack = () => {
    const shouldRouteToHome =
      pathname.includes("/sub") || pathname.includes("/search");

    if (shouldRouteToHome) {
      router.push("/");
      return;
    }

    if (window.history.length > 2) router.back();
    else router.push("/");
  };

  return (
    <button
      onClick={handleBack}
      className="flex gap-1 items-center text-base rounded-md pr-2 hover:bg-green-500  hover:text-gray-100 py-0.75 mb-2 "
      aria-label="Go back"
    >
      <ChevronLeft size={20} />
      <span>{text}</span>
    </button>
  );
};

export default GoBackButton;
