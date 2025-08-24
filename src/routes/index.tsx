import { createFileRoute } from '@tanstack/react-router';
import React, { Suspense, useState, useEffect } from 'react';
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
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
const LazyEventSection = React.lazy(() =>
  import('@/components/homepage/event-section').then(module => ({ default: module.EventSection }))
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
const LazyDiscussionSection = React.lazy(() =>
  import('@/components/homepage/discussion-section').then(module => ({ default: module.DiscussionSection }))
);
const LazyDisciplicSuccessionSection = React.lazy(() =>
  import('@/components/homepage/disciplic-succession-section').then(module => ({ default: module.default }))
);

// Component for the section divider
const SectionDivider = () => (
  <div className="flex justify-center pt-12 pb-6 lg:pt-16 lg:pb-8">
    <div 
      className="w-24 sm:w-32 md:w-48 lg:w-64 h-1 sm:h-1.5 md:h-2 lg:h-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
      aria-hidden="true" // Decorative element
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
              <LazyEventSection />
            </Suspense>
            

            <SectionDivider />
            <Suspense fallback={<SectionLoader />}>
              <LazyFeaturedSection />
            </Suspense>
            <SectionDivider />
            <Suspense fallback={<SectionLoader />}>
              <LazyQnASection />
            </Suspense>
          </div>

          <Suspense fallback={<SectionLoader />}>
            <LazyYouTubeMarquee />
          </Suspense>

          <SectionDivider />

          <Suspense fallback={<SectionLoader />}>
            <LazySlokaLearningSection />
          </Suspense>

          <SectionDivider />

          <Suspense fallback={<SectionLoader />}>
            <LazyDiscussionSection />
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

                      {/* New section for the relocated and improved text */}
          <motion.div
              className="mt-8 mb-12 text-center px-4" // Adjusted margin-top, text-center, and horizontal padding
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }} // Simplified animation
            >
              <div className="bg-white dark:bg-pink-900/20 rounded-2xl shadow-md p-6 max-w-3xl mx-auto border border-gray-200 dark:border-pink-700/30">
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed tracking-tight">
                Join our sacred calling
                <Badge variant="secondary" className="mx-3 p-1 align-middle inline-block bg-white/50 dark:bg-black/20 border-primary/50">
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Telephone%20Receiver.png" alt="Telephone Receiver" width="25" height="25" />
                </Badge>
                spread Śrīla Prabhupāda's wisdom and guide souls back home, back to Godhead.
                </p>
              </div>
            </motion.div>

        </div>
      </main>
  )
}
