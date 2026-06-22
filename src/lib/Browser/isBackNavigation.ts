"use client";

function isBackNavigation(): boolean {
  if (typeof window === "undefined") return false;
  const nav = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming;
  return nav?.type === "back_forward";
}

export default isBackNavigation;
