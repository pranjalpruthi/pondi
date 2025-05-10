import { motion } from "motion/react" // AnimatePresence and useState no longer needed here
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Marquee } from "@/components/magicui/marquee"
import { ChevronRight, Calendar, Building } from "lucide-react" // ChevronLeft no longer needed here
import { Badge } from "@/components/ui/badge"
// import React, { useState } from "react" // useState no longer needed here
import Two from "@/components/gallery/two"; // Import the Two component

const constructionData = {
  sectionTitle: "Temple Construction Progress",
  overallProgress: 45,
  latestUpdate: {
    title: "Phase 1: Foundation Stone Laid",
    date: "May 09, 2025",
    description:
      "With immense joy and gratitude, we announce the successful completion of the foundation stone laying ceremony. This marks a significant milestone in our journey to build a divine abode. The groundwork is now underway, preparing for the next phase of construction. We thank all devotees and well-wishers for their prayers and support.",
    images: [
      "/temple-building/1.webp",
      "/temple-building/2.webp",
      "/temple-building/3.webp",
      "/temple-building/4.webp",
      "/temple-building/5.webp",
    ],
  },
  campaign: {
    message:
      "Every contribution, big or small, brings us closer to realizing this sacred dream. Join us in building a legacy of faith and devotion.",
    ctaText: "Support the Construction",
    ctaLink: "/donate/construction",
  },
  phases: [
    { name: "Foundation", progress: 100 },
    { name: "Structure", progress: 60 },
    { name: "Interior", progress: 15 },
    { name: "Landscaping", progress: 5 },
  ]
}

export function ConstructionUpdates() {
  // const [currentImageIndex, setCurrentImageIndex] = useState(0); // Removed
  // const images = constructionData.latestUpdate.images; // Will be passed directly

  // const nextImage = () => { // Removed
  //   setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  // const prevImage = () => { // Removed
  //   setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  // };

  return (
    <section className="py-24 relative overflow-visible">
      {/* Removed section-specific background */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto w-fit mb-6"
          >
            <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3">
                <Building className="h-7 w-7 text-[#e94a9c] dark:text-[#e94a9c]" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] text-transparent bg-clip-text"
          >
            {constructionData.sectionTitle}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto"
          >
            Join us in building a spiritual haven for future generations
          </motion.p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* First Column: Images Carousel (3/5 width on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 w-full"
          >
            <Card className="overflow-hidden border-0 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg h-full">
              <CardContent className="p-0">
                <div className="pb-4 pt-8 px-8">
                  <h3 className="text-xl font-semibold mb-1 text-[#e94a9c] dark:text-[#e94a9c]">
                    Construction Gallery
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Swipe to see the latest construction updates
                  </p>
                </div>
                
                {/* Replace simple carousel with Two component */}
                <div className="relative w-full min-h-[300px] md:min-h-[400px] py-4">
                  {/* Added min-height and some padding for better layout */}
                  <Two imageUrls={constructionData.latestUpdate.images} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Second Column: Update Details & Campaign (2/5 width on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-0 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg h-full">
              <CardContent className="p-6 lg:p-8 flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-[#e94a9c]/10 text-[#e94a9c] dark:bg-[#e94a9c]/20 dark:text-[#e94a9c] px-3 py-1 rounded-full font-medium border-0">
                      Latest Update
                    </Badge>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-[#ffc547] dark:text-[#ffc547]" />
                      {constructionData.latestUpdate.date}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-[#0a84ff] dark:text-[#0a84ff]">
                    {constructionData.latestUpdate.title}
                  </h3>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {constructionData.latestUpdate.description}
                  </p>
                </div>
                
                <div className="mt-auto bg-gradient-to-r from-[#e94a9c]/5 via-[#ffc547]/5 to-[#0a84ff]/5 dark:from-[#e94a9c]/10 dark:via-[#ffc547]/10 dark:to-[#0a84ff]/10 p-6 -m-6 lg:-m-8 mt-4 lg:mt-auto rounded-t-2xl backdrop-blur-sm">
                  <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                    Join the Campaign
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                    {constructionData.campaign.message}
                  </p>
                  <Button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.href = constructionData.campaign.ctaLink;
                      }
                    }}
                    className="w-full bg-gradient-to-r from-[#e94a9c] to-[#ffc547] hover:from-[#d3428c] hover:to-[#e6b03f] rounded-full h-11 font-medium text-white shadow-sm transition-all"
                  >
                    {constructionData.campaign.ctaText}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Indicators Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="overflow-hidden border-0 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-center mb-8 bg-gradient-to-r from-[#0a84ff] via-[#ffc547] to-[#e94a9c] text-transparent bg-clip-text">
                Construction Phases Progress
              </h3>
              
              <div className="space-y-8">
                {/* Overall Progress */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">Overall Completion</p>
                    <span className="font-medium text-[#e94a9c] dark:text-[#e94a9c]">
                      {constructionData.overallProgress}%
                    </span>
                  </div>
                  <div className="relative h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${constructionData.overallProgress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] rounded-full"
                    />
                  </div>
                </div>
                
                {/* Individual Phase Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {constructionData.phases.map((phase, index) => (
                    <div key={index} className="space-y-2 backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 p-4 rounded-xl">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{phase.name}</p>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{phase.progress}%</span>
                      </div>
                      <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${phase.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.7 + (index * 0.1), ease: "easeOut" }}
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            index % 3 === 0 
                              ? "bg-[#e94a9c]" 
                              : index % 3 === 1 
                                ? "bg-[#ffc547]" 
                                : "bg-[#0a84ff]"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}