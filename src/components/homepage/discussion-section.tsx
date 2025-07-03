import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { GlowEffect } from "@/components/animate-ui/effects/glow-effect";

export const DiscussionSection = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video Section */}
          <div
            className="relative rounded-2xl"
          >
            <GlowEffect
              colors={['#0894FF', '#C959DD', '#FF2E54']}
              mode='static'
              blur='strong'
              scale={1.05}
              className="rounded-2xl"
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
                src="https://www.youtube.com/embed/F-rfr7vrpMc?autoplay=0&modestbranding=1&rel=0"
                title="Are we Iskcon or not?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>

          {/* Text Content Section */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Badge variant="outline" className="text-sm font-medium w-fit border-primary/50 text-primary">
              Featured Discussion
            </Badge>
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-semibold text-left text-foreground">
                🤔 Are we ISKCON or not?
              </h2>
              <p className="text-base md:text-lg max-w-xl leading-relaxed tracking-normal text-muted-foreground text-left mt-2">
                Explore the key distinctions and shared heritage between the International Sri Krishna Mandir (ISKM) and the International Society for Krishna Consciousness (ISKCON).
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="text-sm md:text-base">🏛️ Why create a different society?</li>
                <li className="text-sm md:text-base">🧑‍🏫 Srila Prabhupada founded ISKCON, not ISKM?</li>
                <li className="text-sm md:text-base">🤝 Why fight amongst ourselves?</li>
              </ul>
              <Button className="mt-6 w-fit group" size="lg" variant="secondary">
                Watch Discussion
                <PlayCircle className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
