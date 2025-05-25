import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <motion.section
      className="py-16 md:py-24 overflow-hidden" // Removed background classes to use global background
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

        {/* This outer motion.div is for staggering the cards as a group */}
        <motion.div variants={cardContainerParentVariants}>
          <div
            className="flex overflow-x-auto space-x-4 md:space-x-6 lg:space-x-8 pb-8"
            // Removed explicit scrollbar styling for a more native/subtle look
            // Consider adding -mx-4 px-4 to the scroll container if edge padding is desired for cards within container
          >
            {items.map((item, index) => (
              <motion.div
                key={index}
                variants={cardItemVariants}
                className="flex-shrink-0 w-72 md:w-80 lg:w-96 snap-start" // Added snap-start for better scroll feel
              >
                <Card className="h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-card/80 dark:bg-neutral-800/80 border border-border/30 rounded-3xl backdrop-blur-sm">
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
            ))}
            {/* Optional: Add a spacer at the end if you want padding after the last card */}
            {/* <div className="flex-shrink-0 w-1"></div> */}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
