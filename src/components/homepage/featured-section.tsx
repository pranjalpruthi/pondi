import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { motion } from "motion/react"; // Import motion

export const FeaturedSection = () => (
  <section className="w-full py-24 md:py-32 lg:py-48 bg-background overflow-hidden"> {/* Increased padding */}
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Video Section */}
        <motion.div
          className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/10" // Enhanced styling
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <iframe
            className="w-full h-full" // Use className instead of width/height attributes
            src="https://www.youtube.com/embed/F-rfr7vrpMc?autoplay=0&modestbranding=1&rel=0" // Added params for cleaner look
            title="Are we Iskcon or not?"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>

        {/* Text Content Section */}
        <motion.div
          className="flex flex-col gap-5" // Adjusted gap
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <Badge variant="outline" className="text-sm font-medium w-fit border-primary/50 text-primary"> {/* Changed badge style */}
            Featured Discussion
          </Badge>
          <div className="flex flex-col gap-3"> {/* Adjusted gap */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-semibold text-left text-foreground"> {/* Adjusted typography */}
              🤔 Are we ISKCON or not?
            </h2>
            <p className="text-base md:text-lg max-w-xl leading-relaxed tracking-normal text-muted-foreground text-left mt-2"> {/* Adjusted typography & spacing */}
              Explore the key distinctions and shared heritage between the International Sri Krishna Mandir (ISKM) and the International Society for Krishna Consciousness (ISKCON).
            </p>
            {/* Simplified list - removed icons for cleaner look */}
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="text-sm md:text-base">🏛️ Why create a different society?</li>
              <li className="text-sm md:text-base">🧑‍🏫 Srila Prabhupada founded ISKCON, not ISKM?</li>
              <li className="text-sm md:text-base">🤝 Why fight amongst ourselves?</li>
            </ul>
            {/* Updated Button style */}
            <Button className="mt-6 w-fit group" size="lg" variant="secondary">
              Watch Discussion
              <PlayCircle className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* New Presentation Video Section (Added Below) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-24 md:mt-32 lg:mt-40">
        {/* Text Content Section (New Video - Left) */}
        <motion.div
          className="flex flex-col gap-5 lg:order-1" // Order changed for layout
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
              This is a short and informative video presenting International Sri Krishna Mandir (ISKM), a spiritual society firmly rooted in the teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda and the Supreme Personality of Godhead, Lord Śrī Kṛṣṇa. Dedicated to spreading the sublime knowledge of bhakti-yoga, ISKM aims to awaken pure love of Godhead within the hearts of all sincere souls.
            </p>
            <a href="https://youtu.be/kLzipOG-YZQ?si=_O-FsVsZZJgXpiku" target="_blank" rel="noopener noreferrer" className="mt-6 w-fit">
              <Button className="group" size="lg" variant="default">
                Watch Presentation
                <PlayCircle className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Video Section (New Video - Right) */}
        <motion.div
          className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/10 lg:order-2" // Order changed for layout
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
  </section>
);
