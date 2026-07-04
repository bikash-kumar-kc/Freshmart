import { Heart } from "lucide-react";
import Link from "next/link";

export function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-4">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center ">
        <Heart size={32} className="text-green-600" />
      </div>
      <h2 className="font-serif text-xl font-semibold text-gray-900 mb-2">
        No saved products yet
      </h2>

      <div>
        <div className=" w-full flex justify-center items-center flex-col gap-2">
          <Link href="/">
            <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
              Visit Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
