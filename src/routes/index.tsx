import { createFileRoute } from '@tanstack/react-router';
import React, { Suspense, useState, useEffect } from 'react';
import { HeroSection } from "@/components/homepage/hero-section";
import SideBySide from "@/components/homepage/side-by-side";
import { InitialPageLoader } from '@/components/ui/initial-page-loader'; // Updated import
// Removed ShlokaModal and Shloka type imports

// Lazy load sections
// Removed LazyConstructionUpdates
const LazyMilestoneTimeline = React.lazy(() =>
  import('@/components/homepage/milestone-timeline').then(module => ({ default: module.default }))
);
const LazyYouTubeMarquee = React.lazy(() => 
  import('@/components/homepage/youtube-marquee').then(module => ({ default: module.YouTubeMarquee }))
);
const LazyQnASection = React.lazy(() => 
  import('@/components/homepage/qna-section').then(module => ({ default: module.QnASection }))
);
const LazyVisitUs = React.lazy(() => 
  import('@/components/homepage/visit-us').then(module => ({ default: module.VisitUs }))
);
const LazyFeaturedSection = React.lazy(() =>
  import('@/components/homepage/featured-section').then(module => ({ default: module.FeaturedSection }))
);
const LazySlokaLearningSection = React.lazy(() =>
  import('@/components/homepage/sloka-learning-section').then(module => ({ default: module.SlokaLearningSection }))
);
const LazyFeaturedBooksSection = React.lazy(() =>
  import('@/components/homepage/featured-books-section').then(module => ({ default: module.FeaturedBooksSection }))
);
const LazyDisciplicSuccessionSection = React.lazy(() =>
  import('@/components/homepage/disciplic-succession-section').then(module => ({ default: module.default }))
);
// Removed LazyUpcomingEventBanner import from here

// Component for the section divider
const SectionDivider = () => (
  <div className="flex justify-center pt-12 pb-6 lg:pt-16 lg:pb-8"> {/* Adjusted padding: less bottom padding */}
    <img 
      src="/assets/extra/divider.svg" 
      alt="Section Divider" 
      className="h-4 sm:h-6 md:h-8 lg:h-10 text-gray-300 dark:text-gray-700" // Made smaller again
      aria-hidden="true" // Decorative image
    />
  </div>
);

export const Route = createFileRoute('/')({
  component: HomePage
})

// Updated SectionLoader to show Mahamantra
const SectionLoader = () => (
  <div className="flex flex-col justify-center items-center h-64 text-center text-muted-foreground">
    <p className="text-lg font-medium">Hare Kṛṣṇa Hare Kṛṣṇa</p>
    <p className="text-lg font-medium">Kṛṣṇa Kṛṣṇa Hare Hare</p>
    <p className="text-lg font-medium">Hare Rāma Hare Rāma</p>
    <p className="text-lg font-medium">Rāma Rāma Hare Hare</p>
  </div>
);

function HomePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  // Removed selectedShloka state

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // Load for 1 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (isPageLoading) {
    return <InitialPageLoader />;
  }

  return (
    // Removed Fragment wrapper
      <main
        className="flex flex-col min-h-screen relative w-full pb-0" // Reduced pb from 12 to 0
        // style={{ willChange: 'transform' }} // Hint for rendering performance - REMOVED
      >
        {/* Background element removed */}
        
        {/* Actual page content */}
        <div className="relative z-10 w-full">
          <div className="min-h-screen">
            <HeroSection />
            <Suspense fallback={<SectionLoader />}>
              <LazyFeaturedSection />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
              <LazyYouTubeMarquee />
            </Suspense>
          </div>

          <Suspense fallback={<SectionLoader />}>
            <LazyQnASection />
          </Suspense>

          <SectionDivider />

          <Suspense fallback={<SectionLoader />}>
            <LazySlokaLearningSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <LazyFeaturedBooksSection />
          </Suspense>

          {/* New Disciplic Succession Section */}
          <Suspense fallback={<SectionLoader />}>
            <LazyDisciplicSuccessionSection />
          </Suspense>

          {/* Added Milestone Timeline */}
          <Suspense fallback={<SectionLoader />}>
            <LazyMilestoneTimeline />
          </Suspense>

          <SideBySide /> {/* Render SideBySide without props */}

          <Suspense fallback={<SectionLoader />}>
            <LazyVisitUs />
          </Suspense>

        </div>
      </main>
  )
}
