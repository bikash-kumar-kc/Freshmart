"use client";

import Link from "next/link";

interface IErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: IErrorProps) {
  console.log(process.env.NEXT_PUBLIC_NEXT_ENV);
  return (
    <div className="w-full max-w-7xl m-auto">
      <div className="w-full  min-h-screen flex justify-center items-center ">
        <div className="w-100 h-75 px-2 py-1 rounded-sm  ">
          <h2>Something went wrong !</h2>
          <p className="text-red-400">
            {process.env.NEXT_PUBLIC_NEXT_ENV === "development"
              ? error.message
              : "error occured"}
          </p>
          <button onClick={reset}>Try again</button>
          <Link href={"/"}>Vist Home</Link>
        </div>
      </div>
    </div>
  );
}
