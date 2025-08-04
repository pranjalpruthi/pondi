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

// TEMPORARILY COMMENTED OUT - Membership tiers data
/*
const membershipTiers = [
  {
    id: 'pushpa-seva',
    name: 'Pushpa Seva',
    price: 308,
    icon: 'cherry-blossom',
    color: 'from-pink-500 to-rose-400',
    description: 'Flower offering service for daily deity worship',
    subscriptionLink: 'https://rzp.io/rzp/14YxfBKu', // Pushpa Seva subscription link
    features: [
      'Temple access and darshan',
      'Daily flower offerings',
      'Special puja participation',
      'Prasadam delivery',
      'Festival flower arrangements'
    ],
    cta: 'Start Pushpa Seva',
    ctaIcon: 'bouquet'
  },
  {
    id: 'archana-seva',
    name: 'Archana Seva',
    price: 508,
    icon: 'diya-lamp',
    color: 'from-blue-500 to-purple-500',
    description: 'Personal prayer and archana service',
    subscriptionLink: 'https://rzp.io/rzp/archana-seva', // Replace with your actual link
    features: [
      'All previous benefits',
      'Personal archana service',
      'Name in daily prayers',
      'Special festival invitations',
      'Spiritual guidance sessions',
      'Sacred thread blessing'
    ],
    cta: 'Begin Archana Seva',
    ctaIcon: 'sparkles',
    popular: true
  },
  {
    id: 'annadanam-seva',
    name: 'Annadanam Seva',
    price: 1008,
    icon: 'bento-box',
    color: 'from-amber-600 via-orange-500 to-red-500',
    description: 'Food distribution service for devotees',
    subscriptionLink: 'https://rzp.io/rzp/annadanam-seva', // Replace with your actual link
    features: [
      'All previous benefits',
      'Daily meal sponsorship',
      'Festival feast participation',
      'Kitchen seva opportunities',
      'Recipe sharing sessions',
      'Community dining privileges'
    ],
    cta: 'Join Annadanam Seva',
    highlighted: true
  },
  {
    id: 'gau-seva',
    name: 'Gau Seva',
    price: 1555,
    icon: 'cow-emoji',
    color: 'from-green-500 to-emerald-400',
    description: 'Cow protection and care service',
    subscriptionLink: 'https://rzp.io/rzp/kmcTyLLim', // Your example link
    features: [
      'All previous benefits',
      'Cow care sponsorship',
      'Fresh milk prasadam',
      'Goshala visit privileges',
      'Cow adoption certificate',
      'Monthly progress reports'
    ],
    cta: 'Support Gau Seva',
    ctaIcon: 'cow-face'
  }
];
*/

// TEMPORARILY COMMENTED OUT - Background components for membership cards
// const HighlightedBackground = () => (...)
// const PopularBackground = () => (...)

// TEMPORARILY COMMENTED OUT - MembershipCard component
// const MembershipCard = ({ tier }) => { ... }

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

function ContributePage() {
  return (
    <div className="relative px-4 py-16 md:py-16 pb-0 md:pb-0">
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Sudama Sevaka Membership Section - TEMPORARILY HIDDEN */}
        {/* 
        <motion.section
          id="membership"
          className="mb-16 md:mb-20 py-16 md:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUpVariants}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-1 rounded-full shadow-lg">
                  <div className="bg-background rounded-full p-4">
                    <img
                      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Heart%20on%20Fire.png"
                      alt="Heart on Fire"
                      width="40"
                      height="40"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-pink-500 to-purple-500 text-transparent bg-clip-text"
              >
                Sudama Sevaka Membership
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                <p className="text-xl md:text-2xl text-foreground font-medium mb-4 leading-relaxed">
                  Become a devoted sevaka in Krishna's divine service
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Experience the joy of selfless service through our monthly seva subscriptions. Each membership tier deepens your spiritual connection while supporting our sacred mission of spreading Krishna consciousness.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {membershipTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <MembershipCard tier={tier} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <Card className="inline-block bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    All memberships include temple access, spiritual guidance, and participation in our sacred community.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                    <span>• Cancel anytime</span>
                    <span>• Secure payments</span>
                    <span>• Tax benefits available</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Srila Prabhupada Quote Section */}
        {/*
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-16 mb-8 -mx-4 md:-mx-8 lg:-mx-16"
            >
              <div className="relative overflow-hidden">
                {/* Background Pattern */}
        {/*
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-orange-950/30 dark:via-yellow-950/20 dark:to-pink-950/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.05),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent_50%)]" />

                {/* Decorative Elements */}
        {/*
                <div className="absolute top-8 left-8 opacity-20 dark:opacity-10">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Om.png"
                    alt="Om Symbol"
                    width="60"
                    height="60"
                    className="animate-pulse"
                  />
                </div>
                <div className="absolute bottom-8 right-8 opacity-20 dark:opacity-10">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Prayer%20Beads.png"
                    alt="Prayer Beads"
                    width="60"
                    height="60"
                    className="animate-pulse"
                  />
                </div>
                <div className="absolute top-1/2 left-16 opacity-10 dark:opacity-5">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diya%20Lamp.png"
                    alt="Diya Lamp"
                    width="80"
                    height="80"
                    className="animate-bounce"
                  />
                </div>

                <div className="relative z-10 px-4 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24">
                  <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="flex justify-center mb-8"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 rounded-full blur-lg opacity-30 animate-pulse" />
                        <div className="relative bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 p-4 rounded-full shadow-2xl">
                          <img
                            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Prayer%20Beads.png"
                            alt="Prayer Beads"
                            width="64"
                            height="64"
                            className="drop-shadow-lg"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-600 via-yellow-600 to-pink-600 dark:from-orange-400 dark:via-yellow-400 dark:to-pink-400 text-transparent bg-clip-text"
                    >
                      The Supreme Service
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="max-w-4xl mx-auto mb-8"
                    >
                      <blockquote className="text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed italic font-medium relative">
                        <span className="absolute -top-4 -left-4 text-6xl text-orange-400/30 dark:text-orange-600/30 font-serif">"</span>
                        The chanting of the holy names of the Lord is the most sublime process for self-realization. This chanting is the prime benediction for humanity at large because it spreads the rays of the benediction moon.
                        <span className="absolute -bottom-8 -right-4 text-6xl text-orange-400/30 dark:text-orange-600/30 font-serif">"</span>
                      </blockquote>
                    </motion.div>

                    <motion.cite
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="block text-lg md:text-xl text-muted-foreground font-semibold not-italic mb-12"
                    >
                      — His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda
                    </motion.cite>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="max-w-4xl mx-auto"
                    >
                      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 shadow-xl">
                        <CardContent className="p-6 md:p-8">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-full">
                              <img
                                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/People/Folded%20Hands.webp"
                                alt="Folded Hands"
                                width="24"
                                height="24"
                              />
                            </div>
                            <div className="text-left">
                              <h4 className="text-lg md:text-xl font-bold text-foreground mb-2">
                                For those unable to participate in seva subscriptions
                              </h4>
                              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                The chanting of the <strong className="text-orange-600 dark:text-orange-400">Hare Krishna maha-mantra</strong> is the highest form of service to the Supreme Lord. This spiritual practice is freely available to all and brings the greatest purification and joy.
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-gradient-to-r from-orange-100/50 to-yellow-100/50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200/30 dark:border-orange-700/30">
                            <p className="text-center text-sm md:text-base text-muted-foreground font-medium">
                              <span className="text-orange-600 dark:text-orange-400 font-bold">Hare Krishna Hare Krishna Krishna Krishna Hare Hare</span><br />
                              <span className="text-pink-600 dark:text-pink-400 font-bold">Hare Rama Hare Rama Rama Rama Hare Hare</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
        */}
        <motion.section
          id="construction"
          className="mb-8 md:mb-12 py-16 md:py-20 bg-gradient-to-b from-gray-50 dark:from-gray-900/30 to-transparent rounded-3xl"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUpVariants}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-12 md:mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <div className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 p-1 rounded-full shadow-lg">
                  <div className="bg-background rounded-full p-4">
                    <Building className="h-8 w-8 text-pink-600" />
                  </div>
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-400 text-transparent bg-clip-text"
              >
                {constructionData.sectionTitle}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-xl mx-auto"
              >
                Building a spiritual haven for generations to come. Track our progress and be a part of this sacred endeavor.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
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
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
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
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
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
    </div>
  )
}
