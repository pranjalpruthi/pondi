import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, type Variants } from "motion/react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronRight, Calendar, Building
} from "lucide-react"
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "@/components/motion-primitives/morphing-popover"
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"

// Type definitions
interface SevaTier {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  description: string;
  subscriptionLink: string;
  quote: {
    text: string;
    reference: string;
    translation?: string;
  };
  cta: string;
  popular?: boolean;
  highlighted?: boolean;
}

export const Route = createFileRoute('/contribute/')({
  component: ContributePage,
})

const constructionData = {
  sectionTitle: "Temple Construction Progress",
  overallProgress: 45, // Keep this updated
  latestUpdate: {
    title: "Phase 1: Foundation Stone Laid",
    date: "May 09, 2025",
    description: "With immense joy and gratitude, we announce the successful completion of the foundation stone laying ceremony. This marks a significant milestone in our journey to build a divine abode. The groundwork is now underway, preparing for the next phase of construction.",
    images: [
      "/temple-building/1.webp", "/temple-building/2.webp", "/temple-building/3.webp",
      "/temple-building/4.webp", "/temple-building/5.webp", "/temple-building/6.webp",
      "/temple-building/7.webp", "/temple-building/8.webp",
    ],
  },
  campaign: {
    message: "Every contribution, big or small, brings us closer to realizing this sacred dream. Join us in building a legacy of faith and devotion.",
    ctaText: "Support the Construction",
    ctaLink: "/donate", // Link to main donate page for now
  },
  phases: [
    { name: "Foundation", progress: 100 }, { name: "Structure", progress: 60 },
    { name: "Interior", progress: 15 }, { name: "Landscaping", progress: 5 },
  ]
};

const sevaTiers: SevaTier[] = [
  {
    id: 'pushpa-seva',
    name: 'Pushpa Seva',
    price: 308,
    icon: 'cherry-blossom',
    color: 'from-pink-500 to-rose-400',
    description: 'A loving offering to lordship.',
    subscriptionLink: 'https://rzp.io/rzp/jQCh1ZBv',
    quote: {
      text: "Kṛṣṇa is so grateful. If you give little service to Kṛṣṇa sincerely, Kṛṣṇa will never forget you. And He's so powerful. If Kṛṣṇa becomes your friend and Kṛṣṇa remembers you, then what you want more?",
      reference: "Srila Prabhupada"
    },
    cta: 'Sponsor Now'
  },
  {
    id: 'archana-seva',
    name: 'Archana Seva',
    price: 508,
    icon: 'diya-lamp',
    color: 'from-blue-500 to-purple-500',
    description: 'Daily Worship of the Deities with offerings.',
    subscriptionLink: 'https://rzp.io/rzp/623BZxty',
    quote: {
      text: "patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati tad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ",
      reference: "Bhagavad-gītā 9.26",
      translation: "If one offers Me with love and devotion a leaf, a flower, a fruit or water, I will accept it."
    },
    cta: 'Sponsor Now',
    popular: true
  },
  {
    id: 'annadanam-seva',
    name: 'Annadanam Seva',
    price: 1008,
    icon: 'bento-box',
    color: 'from-amber-600 via-orange-500 to-red-500',
    description: 'Support our food distribution programme.',
    subscriptionLink: 'https://rzp.io/rzp/I2gYVRg',
    quote: {
      text: "We have to see that nobody goes hungry within a ten mile radius.",
      reference: "Śrīla Prabhupāda"
    },
    cta: 'Sponsor Now',
    highlighted: true
  },
  {
    id: 'gau-seva',
    name: 'Gau Seva',
    price: 1555,
    icon: 'cow-emoji',
    color: 'from-green-500 to-emerald-400',
    description: 'Contribute to our Gokulam Goshala and support the sacred duty of cow protection.',
    subscriptionLink: 'https://rzp.io/rzp/YzHXrv3p',
    quote: {
      text: "As long as human society continues to allow cows to be killed in slaughterhouses, there cannot be any question of peace and prosperity.",
      reference: "SB 8.8.11"
    },
    cta: 'Sponsor Now'
  }
];

const SevaCard = ({ tier }: { tier: SevaTier }) => {
  const getEmojiForIcon = (icon: string): string => {
    const emojiMap: Record<string, string> = {
      'cherry-blossom': 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Cherry%20Blossom.png',
      'diya-lamp': 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diya%20Lamp.png',
      'bento-box': 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Bento%20Box.png',
      'cow-emoji': 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Cow.png'
    };
    return emojiMap[icon] || emojiMap['diya-lamp'];
  };

  // Mobile card component for drawer trigger
  const MobileCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 50, damping: 15, duration: 0.8 }}
      className="h-full w-full"
    >
      <Card className={cn(
        "relative overflow-hidden rounded-2xl border h-full flex flex-col transition-all duration-300 group cursor-pointer",
        tier.highlighted
          ? "border-amber-400/50 bg-white/90 dark:bg-zinc-900/80 shadow-lg shadow-amber-500/20"
          : "border-zinc-200/50 dark:border-zinc-800/50 bg-white/90 dark:bg-zinc-900/70",
        "hover:shadow-lg hover:-translate-y-1 backdrop-blur-xl active:scale-95"
      )}>
        {/* Gradient tint overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5 dark:opacity-10 pointer-events-none`} />


        <div className="relative z-10 flex flex-col h-full p-4">
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              className="flex justify-center mb-3"
            >
              <div className={`bg-gradient-to-r ${tier.color} p-2 rounded-full shadow-md`}>
                <img
                  src={getEmojiForIcon(tier.icon)}
                  alt={tier.name}
                  width="24"
                  height="24"
                  className="drop-shadow-sm"
                />
              </div>
            </motion.div>
            <h3
              className="text-lg font-bold mb-2 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-50 bg-clip-text text-transparent"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {tier.name}
            </h3>
            <div className="mb-2">
              <span className="text-2xl font-bold text-foreground">₹{tier.price}</span>
              <span className="text-sm text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {tier.description}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // Desktop card component (existing design)
  const DesktopCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 50, damping: 15, duration: 0.8 }}
      className="h-full w-full"
    >
      <Card className={cn(
        "relative overflow-hidden rounded-3xl border h-full flex flex-col transition-all duration-300 group",
        tier.highlighted
          ? "border-amber-400/50 bg-white/95 dark:bg-zinc-900/80 shadow-2xl shadow-amber-500/20"
          : "border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-900/70",
        "hover:shadow-2xl hover:-translate-y-2 backdrop-blur-xl"
      )}>
        {/* Gradient tint overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5 dark:opacity-10 pointer-events-none`} />


        <div className="relative z-10 flex flex-col h-full p-6">
          <CardHeader className="text-center pt-4 pb-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              className="flex justify-center mb-3"
            >
              <div className={`bg-gradient-to-r ${tier.color} p-2.5 rounded-full shadow-lg`}>
                <img
                  src={getEmojiForIcon(tier.icon)}
                  alt={tier.name}
                  width="28"
                  height="28"
                  className="drop-shadow-lg"
                />
              </div>
            </motion.div>
            <CardTitle
              className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-50 bg-clip-text text-transparent"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {tier.name}
            </CardTitle>
            <div className="mb-2">
              <span className="text-3xl font-bold text-foreground">₹{tier.price}</span>
              <span className="text-base text-muted-foreground ml-1">/month</span>
            </div>
            <CardDescription className="text-base text-muted-foreground leading-snug px-2">
              {tier.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow px-4 pb-3">
            <div className="space-y-3 w-full">
              <blockquote className="text-center">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed mb-2 break-words">
                  "{tier.quote.text}"
                </p>
                <cite className="text-xs text-slate-600 dark:text-slate-400 font-medium not-italic">
                  — {tier.quote.reference}
                </cite>
              </blockquote>
              {tier.quote.translation && (
                <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed text-center mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  {tier.quote.translation}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-3 mt-auto px-3 pb-4">
            <a
              href={tier.subscriptionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Button
                  className={cn(
                    `w-full bg-gradient-to-r ${tier.color} text-white font-bold py-3 rounded-2xl shadow-lg transition-all duration-300 text-base`,
                    "hover:shadow-xl hover:brightness-110"
                  )}
                >
                  {tier.cta}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </a>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <>
      {/* Mobile: Drawer implementation */}
      <div className="block lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <div>
              <MobileCard />
            </div>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`bg-gradient-to-r ${tier.color} p-3 rounded-full shadow-lg`}>
                    <img
                      src={getEmojiForIcon(tier.icon)}
                      alt={tier.name}
                      width="32"
                      height="32"
                      className="drop-shadow-lg"
                    />
                  </div>
                </div>
                <DrawerTitle
                  className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-50 bg-clip-text text-transparent"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  {tier.name}
                </DrawerTitle>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹{tier.price}</span>
                  <span className="text-lg text-slate-600 dark:text-slate-400 ml-1.5">/month</span>
                </div>
                <DrawerDescription className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {tier.description}
                </DrawerDescription>

              </DrawerHeader>

              <div className="px-4 pb-0 overflow-y-auto">
                <div className="space-y-4 w-full">
                  <blockquote className="text-center">
                    <p className="text-base font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed mb-3 break-words">
                      "{tier.quote.text}"
                    </p>
                    <cite className="text-sm text-slate-600 dark:text-slate-400 font-medium not-italic">
                      — {tier.quote.reference}
                    </cite>
                  </blockquote>
                  {tier.quote.translation && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed text-center mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                      {tier.quote.translation}
                    </p>
                  )}
                </div>
              </div>

              <DrawerFooter className="pt-6">
                <a
                  href={tier.subscriptionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    className={cn(
                      `w-full bg-gradient-to-r ${tier.color} text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 text-base`,
                      "hover:shadow-xl hover:brightness-110"
                    )}
                  >
                    {tier.cta}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: Original card layout */}
      <div className="hidden lg:block">
        <DesktopCard />
      </div>
    </>
  );
};

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } }
}

function ContributePage() {
  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Seva Sponsorship Section */}
      <motion.section
        id="sponsorship"
        className="py-8 md:py-12 select-none"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUpVariants}
      >
        {/* Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden shadow-lg mb-8 md:mb-12"
        >
          {/* Mobile Image */}
          <img
            src="/services/ks.webp"
            alt="Krsna bathes Sudama's feet"
            className="w-full h-auto object-cover min-h-[250px] md:hidden"
          />
          {/* Desktop Image */}
          <img
            src="/services/ksbanner.jpg"
            alt="Krsna bathes Sudama's feet"
            className="w-full h-auto object-contain hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <motion.div variants={fadeInUpVariants}>
              <div className="inline-block mb-3 md:mb-4">
                <div className="inline-block bg-gradient-to-r from-[#D96704] to-[#F2055C] p-2 md:p-3 rounded-full shadow-lg">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png"
                    alt="Seva"
                    width="32"
                    height="32"
                    className="md:w-10 md:h-10 drop-shadow-sm"
                  />
                </div>
              </div>
              <motion.h2
                variants={fadeInUpVariants}
                className="text-3xl md:text-5xl font-black mb-2 md:mb-3 bg-gradient-to-r from-[#401801] via-[#D96704] to-[#F2055C] bg-clip-text text-transparent tracking-tight leading-tight"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Sudama Sevaka Membership
              </motion.h2>
              <motion.p
                variants={fadeInUpVariants}
                className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#401801] via-[#D96704] to-[#F2CB05] dark:from-[#D96704] dark:via-[#F2CB05] dark:to-[#F2055C] bg-clip-text text-transparent max-w-2xl mx-auto leading-snug mb-3 md:mb-4"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Become a devoted sevaka in Krishna's divine service.
              </motion.p>
              <motion.p
                variants={fadeInUpVariants}
                className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto mb-4 md:mb-6"
              >
                Support our temple activities and welcome the blessings and protection of Lord Krishna to you and your family.
              </motion.p>
            </motion.div>
          </div>
          {/* Apple-Inspired Compact Benefits Section */}
          <motion.div
            variants={fadeInUpVariants}
            className="mb-6 md:mb-8"
          >
            <div className="max-w-4xl mx-auto">
              {/* Compact Header */}
              <div className="text-center mb-4 md:mb-6">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#D96704] rounded-xl flex items-center justify-center shadow-sm">
                    <img
                      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crown.png"
                      alt="Benefits"
                      width="16"
                      height="16"
                      className="drop-shadow-sm"
                    />
                  </div>
                  <h3
                    className="text-lg md:text-2xl font-bold text-[#401801] dark:text-[#F2CB05]"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Sevaka Member Benefits
                  </h3>
                </div>
              </div>

              {/* Compact Benefits Container */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/40 dark:border-gray-700/40 shadow-lg overflow-hidden">

                {/* Mobile: Vertical Stack */}
                <div className="md:hidden">
                  <div className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                    {/* Priority Access */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-[#401801] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-lg">🏛️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#401801] dark:text-[#D96704] mb-0.5" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Priority Access
                        </h4>
                        <p className="text-xs text-[#401801]/70 dark:text-[#D96704]/70">
                          Darshan & Dining privileges
                        </p>
                      </div>
                    </motion.div>

                    {/* Sacred Prasādam */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-[#D96704] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-lg">🍯</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#D96704] dark:text-[#F2CB05] mb-0.5" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Sacred Prasādam
                        </h4>
                        <p className="text-xs text-[#D96704]/70 dark:text-[#F2CB05]/70">
                          Special day offerings
                        </p>
                      </div>
                    </motion.div>

                    {/* Spiritual Guidance */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-[#F2CB05] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-lg">🧘‍♂️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#F2055C] dark:text-[#F2CB05] mb-0.5" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Spiritual Guidance
                        </h4>
                        <p className="text-xs text-[#F2055C]/70 dark:text-[#F2CB05]/70">
                          Personal spiritual support
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Desktop: Horizontal Grid */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-3 divide-x divide-gray-200/30 dark:divide-gray-700/30">
                    {/* Priority Access */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="p-4 text-center hover:bg-[#401801]/5 dark:hover:bg-[#D96704]/10 transition-colors duration-200"
                    >
                      <div className="w-12 h-12 bg-[#401801] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <span className="text-xl">🏛️</span>
                      </div>
                      <h4 className="text-base font-semibold text-[#401801] dark:text-[#D96704] mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Priority Access
                      </h4>
                      <p className="text-sm text-[#401801]/70 dark:text-[#D96704]/70">
                        Darshan & Dining privileges
                      </p>
                    </motion.div>

                    {/* Sacred Prasādam */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="p-4 text-center hover:bg-[#D96704]/5 dark:hover:bg-[#F2CB05]/10 transition-colors duration-200"
                    >
                      <div className="w-12 h-12 bg-[#D96704] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <span className="text-xl">🍯</span>
                      </div>
                      <h4 className="text-base font-semibold text-[#D96704] dark:text-[#F2CB05] mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Sacred Prasādam
                      </h4>
                      <p className="text-sm text-[#D96704]/70 dark:text-[#F2CB05]/70">
                        Special day offerings
                      </p>
                    </motion.div>

                    {/* Spiritual Guidance */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="p-4 text-center hover:bg-[#F2055C]/5 dark:hover:bg-[#F2CB05]/10 transition-colors duration-200"
                    >
                      <div className="w-12 h-12 bg-[#F2CB05] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <span className="text-xl">🧘‍♂️</span>
                      </div>
                      <h4 className="text-base font-semibold text-[#F2055C] dark:text-[#F2CB05] mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Spiritual Guidance
                      </h4>
                      <p className="text-sm text-[#F2055C]/70 dark:text-[#F2CB05]/70">
                        Personal spiritual support
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Compact Footer */}
                <div className="border-t border-gray-200/30 dark:border-gray-700/30 bg-[#F2CB05]/5 dark:bg-[#D96704]/10">
                  <div className="px-4 py-3 text-center">
                    <p className="text-xs md:text-sm text-[#D96704] dark:text-[#F2CB05] font-medium">
                      Plus community participation, daily prayers, and Krishna's divine blessings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Mobile: 2x2 grid layout */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {sevaTiers.map((tier) => (
              <SevaCard key={tier.id} tier={tier} />
            ))}
          </div>

          {/* Desktop: Original layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6 md:gap-8">
            {sevaTiers.map((tier) => (
              <SevaCard key={tier.id} tier={tier} />
            ))}
          </div>

          <motion.div
            variants={fadeInUpVariants}
            className="text-center mt-12"
          >
            <Card className="inline-block bg-background/50 border-border/50 rounded-2xl p-4 max-w-2xl mx-auto shadow-md">
              <p className="text-sm text-muted-foreground mb-2">
                All sponsorships include daily prayers on your behalf, spiritual guidance, and community participation.
              </p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span>• Cancel anytime</span>
                <span>• Secure payments</span>
                <span>• Tax benefits under 80G</span>
                <span>• Partnered with Razorpay</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Temple Construction Section */}
      <motion.section
        id="construction"
        className="py-16 md:py-20 bg-gradient-to-b from-gray-100 dark:from-gray-900/50 to-transparent"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUpVariants}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 md:mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 p-1 rounded-full shadow-lg">
                <div className="bg-background rounded-full p-4">
                  <Building className="h-8 w-8 text-pink-600" />
                </div>
              </div>
            </motion.div>
            <motion.h2
              variants={fadeInUpVariants}
              className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-400 text-transparent bg-clip-text"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {constructionData.sectionTitle}
            </motion.h2>
            <motion.p
              variants={fadeInUpVariants}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              Building a spiritual haven for generations to come. Track our progress and be a part of this sacred endeavor.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="lg:col-span-3 w-full"
            >
              <Card className="overflow-hidden border-0 rounded-2xl bg-card/80 backdrop-blur-lg shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-pink-600">Construction Gallery</CardTitle>
                  <CardDescription>Visual milestones of the temple project.</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {constructionData.latestUpdate.images.map((imageUrl, index) => (
                      <MorphingPopover key={imageUrl + index}>
                        <MorphingPopoverTrigger asChild>
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4, transition: { duration: 0.25 } }} className="group relative aspect-square cursor-pointer">
                            <Card className="overflow-hidden h-full border rounded-lg bg-background/50 shadow-sm transition-all duration-300 group-hover:shadow-md">
                              <img src={imageUrl} alt={`Construction update ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" width="200" height="200" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-2">
                                <span className="text-white text-[10px] font-medium line-clamp-1">{`Update ${index + 1}`}</span>
                              </div>
                            </Card>
                          </motion.div>
                        </MorphingPopoverTrigger>
                        <MorphingPopoverContent className="p-0 border-0 shadow-lg max-w-[80vw] max-h-[80vh] overflow-auto">
                          <img src={imageUrl} alt={`Enlarged construction update ${index + 1}`} className="w-full h-auto object-contain" />
                          <div className="p-4 text-center bg-background/80">
                            <p className="text-lg font-semibold">Construction Update {index + 1}</p>
                          </div>
                        </MorphingPopoverContent>
                      </MorphingPopover>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="lg:col-span-2 flex flex-col"
            >
              <Card className="overflow-hidden border-0 rounded-2xl bg-card/80 backdrop-blur-lg shadow-lg flex-grow flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 px-3 py-1 rounded-full font-medium border-0 text-sm">Latest Update</Badge>
                    <div className="flex items-center text-sm text-muted-foreground"><Calendar className="h-4 w-4 mr-1.5 text-orange-500" />{constructionData.latestUpdate.date}</div>
                  </div>
                  <CardTitle className="text-xl text-blue-600 dark:text-blue-400">{constructionData.latestUpdate.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow"><p className="text-muted-foreground leading-relaxed">{constructionData.latestUpdate.description}</p></CardContent>
                <CardFooter className="bg-gradient-to-t from-pink-50 dark:from-pink-900/10 to-transparent pt-6 mt-auto rounded-b-2xl">
                  <div className="w-full">
                    <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">Join the Sacred Effort</h4>
                    <p className="text-sm text-muted-foreground mb-4">{constructionData.campaign.message}</p>
                    <Link to={constructionData.campaign.ctaLink}>
                      <Button className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90 rounded-full h-11 text-base font-medium text-white shadow-md transition-all">
                        {constructionData.campaign.ctaText} <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="mt-8 md:mt-12"
          >
            <Card className="overflow-hidden border-0 rounded-2xl bg-card/80 backdrop-blur-lg shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-semibold text-center mb-6 md:mb-8 bg-gradient-to-r from-blue-500 via-orange-400 to-pink-500 text-transparent bg-clip-text">Construction Phases Progress</h3>
                <div className="space-y-6 md:space-y-8">
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <p className="font-semibold text-foreground text-base md:text-lg">Overall Completion</p>
                      <span className="font-bold text-2xl md:text-3xl text-pink-600">{constructionData.overallProgress}%</span>
                    </div>
                    <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${constructionData.overallProgress}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {constructionData.phases.map((phase, index) => (
                      <div key={index} className="space-y-2 bg-background/30 p-4 rounded-xl border border-border/50">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-foreground">{phase.name}</p>
                          <span className="text-sm font-semibold text-muted-foreground">{phase.progress}%</span>
                        </div>
                        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${phase.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.8 + (index * 0.1), ease: "easeOut" }} className={`absolute top-0 left-0 h-full rounded-full ${index % 3 === 0 ? "bg-pink-500" : index % 3 === 1 ? "bg-orange-400" : "bg-yellow-400"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
