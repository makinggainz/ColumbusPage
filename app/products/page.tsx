import FavoritesSection from "@/components/products/FavoritesSection";
import FinalCTASection from "@/components/products/FinalCTASection";
import Hero from "@/components/products/Hero";
import HowItWorksSection from "@/components/products/HowItWorksSection";
import InspirationSection from "@/components/products/InspirationSection";
import QuestionsSection from "@/components/products/QuestionsSection";
import RecommendationsSection from "@/components/products/RecommendationsSection";
import SeeWhatPeopleSection from "@/components/products/SeeWhatPeopleSection";
import ShowcaseSection from "@/components/products/ShowcaseSection";


export default function ProductsPage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <ShowcaseSection />
      <QuestionsSection />
      <HowItWorksSection /> 
      <FavoritesSection />
      <InspirationSection />
      <SeeWhatPeopleSection />
      <RecommendationsSection />
      <FinalCTASection  />
    </main>
  );
}