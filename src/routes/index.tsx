import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from "@/components/homepage/hero-section";
import { ConstructionUpdates } from "@/components/homepage/ConstructionUpdates";
import { Gallery } from "@/components/homepage/gallery";
import { QnASection } from "@/components/homepage/qna-section"
import { VisitUs } from "@/components/homepage/visit-us" 

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {

  return (
    <main className="flex flex-col min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-tr from-pink-500/5 via-amber-400/5 to-blue-500/5 dark:from-pink-700/10 dark:via-amber-700/10 dark:to-blue-700/10 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        <HeroSection />
        {/* Removed UpcomingEventBanner component */}
        <ConstructionUpdates />
        <QnASection />
        <Gallery />
        <VisitUs />
      </div>
    </main>
  )
}
