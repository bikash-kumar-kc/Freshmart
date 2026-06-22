"use client";
import Link from "next/link";

const ProductNotFound = () => {
  return (
    <div className="w-full max-w-7xl  mx-auto bg-amber-50">
      <div className=" min-h-screen flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <p className="text-black text-bold text-xl text-center tracking-wider">Products not found</p>
          <p className="text-gray-600 text-center text-[14px] tracking-wide">
            Try searching for something else or browser {" "}
            <span className="text-green-600">
              <Link href="/" className="">
                home page
              </Link>
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductNotFound;
