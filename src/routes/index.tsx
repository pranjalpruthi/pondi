import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from "@/components/homepage/hero-section"
import { DevoteeStories } from "@/components/homepage/devotee-stories"
import { Gallery } from "@/components/homepage/gallery"

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <DevoteeStories />
      <Gallery />
    </main>
  )
}
