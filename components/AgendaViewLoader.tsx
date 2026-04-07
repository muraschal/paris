"use client";

import dynamic from "next/dynamic";

const AgendaView = dynamic(() => import("@/components/AgendaView"), {
  ssr: false,
  loading: () => (
    <div className="h-[100svh] lg:h-[85vh] flex items-center justify-center">
      <div className="h-[60svh] w-full max-w-6xl mx-4 rounded-2xl glass animate-pulse" />
    </div>
  ),
});

export default function AgendaViewLoader() {
  return <AgendaView />;
}
