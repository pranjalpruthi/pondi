import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from "@/components/homepage/hero-section";
import { DevoteeStories } from "@/components/homepage/devotee-stories";
import { Gallery } from "@/components/homepage/gallery";
import { UpcomingEventBanner } from "@/components/upcoming-event-banner"; // Import the new banner component

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  // Removed username and roomName variables for cursors

  return (
    <main className="flex flex-col min-h-screen"> {/* Removed relative positioning if not needed */}
      {/* Removed Realtime Cursors Component */}

      {/* Existing Page Content */}
      <HeroSection />
      <DevoteeStories />
      <Gallery />

      {/* Add the Upcoming Event Banner at the bottom */}
      <UpcomingEventBanner />
    </main>
  )
}
