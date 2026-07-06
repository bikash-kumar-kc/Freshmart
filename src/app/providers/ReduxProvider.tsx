"use client";

import { Provider } from "react-redux";
import { favoritesStore } from "@/src/store/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={favoritesStore}>{children}</Provider>;
}
