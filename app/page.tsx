import Hero from "@/components/Hero";
import HotelCard from "@/components/HotelCard";
import AgendaViewLoader from "@/components/AgendaViewLoader";
import PhotoSpots from "@/components/PhotoSpots";
import TicketVault from "@/components/TicketVault";
import BudgetSection from "@/components/BudgetSection";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { AgendaDayProvider } from "@/components/AgendaDayContext";

/* Layout rhythm: Hero (100dvh) + Hotel/Budget (min-h-dvh scenes) + long Agenda block + content-height Fotos/Tickets + compact Footer (no fullheight). Desktop scroll-snap: globals.css + #hotel/#budget/#agenda. */
export default function Home() {
  return (
    <AgendaDayProvider>
      <main className="relative">
        <Navigation />
        <Hero />

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-navy pointer-events-none" />
          <div className="relative z-10">
            <HotelCard />

            <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

            <AgendaViewLoader />

            <PhotoSpots />

            <TicketVault />

            <BudgetSection />

            <Footer />
          </div>
        </div>
      </main>
    </AgendaDayProvider>
  );
}
