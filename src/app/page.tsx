"use client"
import Image from "next/image";
import SearchBar from "../components/client/SearchBar";
import Header from "../components/server/Header";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center  bg-amber-50 font-sans">
      <SessionProvider>
        {" "}
        <Header />
      </SessionProvider>
    </div>
  );
}
