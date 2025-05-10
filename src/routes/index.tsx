import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from "@/components/homepage/hero-section";
import { ConstructionUpdates } from "@/components/homepage/ConstructionUpdates";
import { Gallery } from "@/components/homepage/gallery";
import { UpcomingEventBanner } from "@/components/upcoming-event-banner"; // Import the new banner component
import { QnASection } from "@/components/homepage/qna-section"
import { VisitUs } from "@/components/homepage/visit-us" // Import the new VisitUs component

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  // Removed username and roomName variables for cursors

  return (
    <main className="flex flex-col min-h-screen relative">
      {/* Background layers - ensuring they don't block interaction */}
      <div className="fixed inset-0 bg-gradient-to-tr from-pink-500/5 via-amber-400/5 to-blue-500/5 dark:from-pink-700/10 dark:via-amber-700/10 dark:to-blue-700/10 z-0 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pink-500/10 dark:bg-pink-700/10 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-700/10 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-400/10 dark:bg-amber-700/10 blur-2xl"></div>
      </div>

      {/* Page Content - ensuring it's accessible */}
      <div className="relative z-10 w-full">
        <HeroSection />
        <UpcomingEventBanner />
        <ConstructionUpdates />
        <QnASection />
        <Gallery />
        <VisitUs />
      </div>
    </main>
  )
}
