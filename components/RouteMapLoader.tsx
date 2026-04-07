"use client";

import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="h-[50vh] sm:h-[60vh] rounded-2xl glass animate-pulse" />
      </div>
    </div>
  ),
});

export default function RouteMapLoader() {
  return <RouteMap />;
}
