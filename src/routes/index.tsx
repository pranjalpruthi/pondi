import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from "@/components/homepage/hero-section";
import { ConstructionUpdates } from "@/components/homepage/ConstructionUpdates";
import { QnASection } from "@/components/homepage/qna-section"
import { VisitUs } from "@/components/homepage/visit-us" 
import { FeaturedSection } from "@/components/homepage/featured-section"
import { YouTubeMarquee } from "@/components/homepage/youtube-marquee"

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {

  return (
    <main className="flex flex-col min-h-screen relative w-full">
      <div className="fixed inset-0 bg-gray-50 dark:bg-neutral-950 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        <HeroSection />

        <ConstructionUpdates />
        <YouTubeMarquee />

        <QnASection />
        <VisitUs />
        <FeaturedSection />

      </div>
    </main>
  )
}
