import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { motion } from "motion/react";
// Removed useState import
import { GlowEffect } from "@/components/animate-ui/effects/glow-effect"; 

export const FeaturedSection = () => {
  // Removed hover state variables

  return (
    <section className="w-full pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-8 lg:pb-12 bg-gradient-to-b from-background to-muted/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content Section (New Video - Left) */}
          <motion.div
            className="flex flex-col gap-5 lg:order-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Badge variant="outline" className="text-sm font-medium w-fit border-blue-500/50 text-blue-600 dark:border-blue-400/50 dark:text-blue-400">
              ISKM Presentation
            </Badge>
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-semibold text-left text-foreground">
                Introducing ISKM: Spreading Bhakti-Yoga
              </h2>
              <p className="text-base md:text-lg max-w-xl leading-relaxed tracking-normal text-muted-foreground text-left mt-2">
                Discover International Sri Krishna Mandir (ISKM): a spiritual society rooted in A.C. Bhaktivedanta Swami Prabhupāda's teachings. We propagate bhakti-yoga, fostering pure divine love.
              </p>
              <a href="https://youtu.be/kLzipOG-YZQ?si=_O-FsVsZZJgXpiku" target="_blank" rel="noopener noreferrer" className="mt-6 w-fit">
                <Button className="group" size="lg" variant="default">
                  Watch Presentation
                  <PlayCircle className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Video Section (New Video - Right) */}
          <div
            className="relative rounded-2xl lg:order-2" // Wrapper for positioning
            // Removed hover handlers
          >
            <GlowEffect
              colors={['#4CAF50', '#FFC107', '#2196F3']}
              mode='static'
              blur='strong' // Changed to strong for better visibility
              scale={1.05} // Scale to appear around the border
              className="rounded-2xl" // Apply rounded corners to the glow effect itself
            />
            <motion.div
              className="relative z-10 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/10"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/kLzipOG-YZQ?autoplay=0&modestbranding=1&rel=0"
                title="Introducing ISKM: Spreading Bhakti-Yoga"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
