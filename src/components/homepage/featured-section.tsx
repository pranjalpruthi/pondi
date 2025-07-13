import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, PlayCircle } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { GlowEffect } from "@/components/animate-ui/effects/glow-effect";

interface VideoFeatureProps {
  videoId: string;
  badgeText: string;
  badgeColor: 'blue' | 'green';
  title: string;
  description: string;
  buttonText: string;
  youtubeLink: string;
  videoPosition?: 'left' | 'right';
}

const VideoFeature = ({
  videoId,
  badgeText,
  badgeColor,
  title,
  description,
  buttonText,
  youtubeLink,
  videoPosition = 'right',
}: VideoFeatureProps) => {
  const [isInteracted, setIsInteracted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const silentUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
  const interactiveUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;

  const handleInteraction = () => {
    if (!isInteracted) {
      setIsInteracted(true);
    }
  };

  const textOrder = videoPosition === 'right' ? 'lg:order-1' : 'lg:order-2';
  const videoOrder = videoPosition === 'right' ? 'lg:order-2' : 'lg:order-1';
  
  const badgeClass = badgeColor === 'blue' 
    ? "border-blue-500/50 text-blue-600 dark:border-blue-400/50 dark:text-blue-400"
    : "border-green-500/50 text-green-600 dark:border-green-400/50 dark:text-green-400";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Text Content Section */}
      <motion.div
        className={`flex flex-col gap-5 ${textOrder}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Badge variant="outline" className={`text-sm font-medium w-fit ${badgeClass}`}>
          {badgeText}
        </Badge>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-semibold text-left text-foreground">
            {title}
          </h2>
          <p className="text-base md:text-lg max-w-xl leading-relaxed tracking-normal text-muted-foreground text-left mt-2">
            {description}
          </p>
          <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="mt-6 w-fit">
            <Button className="group" size="lg" variant="default">
              {buttonText}
              <PlayCircle className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </a>
        </div>
      </motion.div>

      {/* Video Section */}
      <motion.div
        ref={ref}
        className={`relative rounded-2xl group ${videoOrder}`}
        onClick={handleInteraction}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <GlowEffect
          colors={['#4CAF50', '#FFC107', '#2196F3']}
          mode='static'
          blur='strong'
          scale={1.05}
          className="rounded-2xl"
        />
        <div
          className="relative z-10 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/10"
        >
          {isInView && (
            <iframe
              key={isInteracted ? 'interactive' : 'silent'}
              className="w-full h-full"
              src={isInteracted ? interactiveUrl : silentUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          {!isInteracted && (
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
              <Play className="h-16 w-16 text-white/70 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const FeaturedSection = () => {
  return (
    <section className="w-full pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-8 lg:pb-12 bg-gradient-to-b from-background to-muted/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 space-y-16 md:space-y-24 lg:space-y-28">
        <VideoFeature
          videoId="kLzipOG-YZQ"
          badgeText="ISKM Presentation"
          badgeColor="blue"
          title="Introducing ISKM: Spreading Bhakti-Yoga"
          description="Discover International Sri Krishna Mandir (ISKM): a spiritual society rooted in A.C. Bhaktivedanta Swami Prabhupāda's teachings. We propagate bhakti-yoga, fostering pure divine love."
          buttonText="Watch Presentation"
          youtubeLink="https://youtu.be/kLzipOG-YZQ?si=_O-FsVsZZJgXpiku"
          videoPosition="right"
        />
      </div>
    </section>
  );
};
