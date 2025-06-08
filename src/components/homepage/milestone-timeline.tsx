import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const items = [
  {
    date: "2009",
    title: "🕉️ Inception of ISKM Pondicherry",
    description: "The divine mission begins with the establishment of the ISKM Pondicherry Centre, dedicated to spreading the teachings of Lord Krishna as presented by Srila Prabhupada.",
  },
  {
    date: "2018",
    title: "🏞️ Gift of Land",
    description: "With the heartfelt generosity of a devotee donor, ISKM Pondicherry received land to build a spiritual sanctuary.",
  },
  {
    date: "Sep 8, 2019",
    title: "🌸 Radhashtami – Temple Construction Commences",
    description: "On the auspicious occasion of Radhashtami, construction of the temple began with blessings and devotion.",
  },
  {
    date: "Jul 2, 2020",
    title: "🏛️ Temple Inauguration",
    description: "A milestone moment—our temple officially opened, becoming a center of worship, wisdom, and community service.",
  },
  {
    date: "July 2020",
    title: "🐄 Gokulam Goshala Begins",
    description: "The Goshala was established to care for and protect cows, honoring the sacred Vedic tradition of Go Seva.",
  },
  {
    date: "2020",
    title: "🍛 Annadanam (Prasadam Distribution) Initiated",
    description: "Daily food distribution (prasadam) began, ensuring that Krishna’s mercy reaches every heart and no one goes hungry.",
  },
  {
    date: "Jul 7, 2021",
    title: "🧱 Foundation Laying for Expansion",
    description: "The foundation stone for further development was laid, paving the way for a larger, more vibrant spiritual hub.",
  },
  {
    date: "Present Day",
    title: "🔨 Ongoing Construction",
    description: "By Krishna’s grace and your support, construction and development continue—step by step toward a grand vision of devotional service.",
  },
];

const cardColors = [
  { borderColor: "#3B82F6", gradient: "linear-gradient(145deg, #3B82F6, #000)" },
  { borderColor: "#10B981", gradient: "linear-gradient(180deg, #10B981, #000)" },
  { borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, #000)" },
  { borderColor: "#EF4444", gradient: "linear-gradient(195deg, #EF4444, #000)" },
  { borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, #000)" },
  { borderColor: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #000)" },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardContainerParentVariants = { // Renamed to avoid conflict if motion.div is used for scroll container itself
  hidden: {}, // No specific animation for the direct parent of scrolling div
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3, // Delay after title animation
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.5,
    },
  },
};

export default function MilestoneTimeline() {
  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const c = e.currentTarget as HTMLElement;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.section
      className="py-16 md:py-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10 md:mb-16"
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">
            Our Journey So Far
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Key milestones in establishing ISKM Pondicherry.
          </p>
        </motion.div>

        <motion.div variants={cardContainerParentVariants}>
          <div
            className="flex overflow-x-auto space-x-4 md:space-x-6 lg:space-x-8 pb-8"
          >
            {items.map((item, index) => {
              const color = cardColors[index % cardColors.length];
              return (
                <motion.div
                  key={index}
                  variants={cardItemVariants}
                  className="flex-shrink-0 w-72 md:w-80 lg:w-96 snap-start group relative rounded-3xl overflow-hidden"
                  onMouseMove={handleCardMove}
                  style={
                    {
                      "--card-border": color.borderColor || "transparent",
                      background: color.gradient,
                      "--spotlight-color": "rgba(255,255,255,0.3)",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100 rounded-3xl"
                    style={{
                      background:
                        "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
                    }}
                  />
                  <Card className="h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-card/80 dark:bg-neutral-800/80 border border-border/30 rounded-3xl backdrop-blur-sm relative z-10">
                    <CardHeader className="pb-3">
                      <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                        {item.date}
                      </p>
                      <CardTitle className="text-base md:text-lg font-semibold leading-tight text-card-foreground">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pt-0">
                      <CardDescription className="text-sm text-muted-foreground/90">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
