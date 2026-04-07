import Hero from "@/components/Hero";
import HotelCard from "@/components/HotelCard";
import RouteMapLoader from "@/components/RouteMapLoader";
import Timeline from "@/components/Timeline";
import PhotoSpots from "@/components/PhotoSpots";
import TicketVault from "@/components/TicketVault";
import BudgetSection from "@/components/BudgetSection";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-navy pointer-events-none" />
        <div className="relative z-10">
          <HotelCard />

          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <RouteMapLoader />

          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <Timeline />

          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <PhotoSpots />

          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <TicketVault />

          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <BudgetSection />

          <Footer />
        </div>
      </div>
    </main>
  );
}
