import { createFileRoute } from '@tanstack/react-router';
import React, { Suspense, useState, useEffect } from 'react';
import { HeroSection } from "@/components/homepage/hero-section";

// Lazy load sections
// Removed LazyConstructionUpdates
const LazyMilestoneTimeline = React.lazy(() =>
  import('@/components/homepage/milestone-timeline').then(module => ({ default: module.MilestoneTimeline }))
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

// Component for the initial full-page loader
const InitialPageLoader = () => (
  <div className="fixed inset-0 flex flex-col justify-center items-center h-screen w-screen bg-background z-50 text-center">
    <img src="/assets/iskmj.jpg" alt="ISKM Logo" className="w-24 h-24 rounded-full mb-6 animate-pulse" />
    <p className="text-xl font-semibold text-primary">Hare Kṛṣṇa Hare Kṛṣṇa</p>
    <p className="text-xl font-semibold text-primary">Kṛṣṇa Kṛṣṇa Hare Hare</p>
    <p className="text-xl font-semibold text-primary">Hare Rāma Hare Rāma</p>
    <p className="text-xl font-semibold text-primary">Rāma Rāma Hare Hare</p>
  </div>
);


function HomePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500); // Load for 1.5 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (isPageLoading) {
    return <InitialPageLoader />;
  }

  return (
    <main 
      className="flex flex-col min-h-screen relative w-full"
      style={{ willChange: 'transform' }} // Hint for rendering performance
    >
      {/* Background element remains */}
      <div className="fixed inset-0 bg-gray-50 dark:bg-neutral-950 z-0 pointer-events-none"></div>
      
      {/* Actual page content */}
      <div className="relative z-10 w-full">
        <HeroSection />
        
        {/* Added Milestone Timeline */}
        <Suspense fallback={<SectionLoader />}>
          <LazyMilestoneTimeline />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <LazyYouTubeMarquee />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <LazyQnASection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <LazyVisitUs />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <LazyFeaturedSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <LazySlokaLearningSection />
        </Suspense>
      </div>
    </main>
  )
}
