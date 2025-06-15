import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from "motion/react"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Added Alert
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Added Avatar
import { useRef } from 'react'
import { 
  ChevronRight, Calendar, Building, BookOpen, Heart, GraduationCap, Utensils, Award, ShieldHalf, 
  Target, Users, Leaf, Handshake, Banknote,// Added new icons
} from "lucide-react"
// Import VisitUs component
import { CopyButton } from "@/components/animate-ui/buttons/copy" // Import CopyButton
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "@/components/motion-primitives/morphing-popover"

export const Route = createFileRoute('/about/')({
  component: AboutPage,
})

// --- Constants & Data ---
// const LOTUS_PINK = "#e94a9c"; // Removed unused constant


const templeDetails = {
  name: "ISKM (International Shri Krishna Mandir) Pondicherry",
  shortName: "ISKM Pondicherry",
  address: "Pudhuvai Vrindavanam, RS No-54/3, koodappakkam, main road, near pogo land, Pathukannu, Puducherry 605502",
  mapsLink: "https://maps.app.goo.gl/8CGJUsGp4Vt8fLdN7",
  phone: "+91 90426 42103", // Assuming this is the correct phone from VisitUs
  email: "info@iskmpondicherry.org",
  timings: [
    { period: "Mangal Aarati", time: "4:30 AM" },
    { period: "Darshan Aarati", time: "7:15 AM" },
    { period: "Guru Puja", time: "7:20 AM" },
    { period: "Bhagvatam Discourse", time: "8:00 AM" },
    { period: "Temple Closes (Midday)", time: "12:00 PM" },
    { period: "Gaura Arati", time: "5:30 PM" },
    { period: "Temple Closes (Evening)", time: "6:30 PM" },
  ],
  bankDetails: {
    accountName: "ISKM PONDICHERRY",
    accountNumber: "1197110110052583",
    ifsc: "UJVN0001197",
    bankName: "UJJIVAN BANK, PONDICHERRY BRANCH",
    type: "SAVINGS ACCOUNT"
  },
  socialLinks: {
    facebook: "https://facebook.com/iskm.pondy",
    instagram: "https://instagram.com/iskm_pondy",
    youtube: "https://www.youtube.com/@ISKMPondy"
  }
};

const historyContent = {
  title: "Our Sacred Journey",
  paragraph1: `ISKM (International Shri Krishna Mandir) Pondicherry is established under the guidance of Srila Prabhupada’s original teachings. Founded with the vision to revive Vedic culture and Krishna consciousness, ISKM Pondicherry serves as a vital spiritual hub for devotees and the wider community.`,
  paragraph2: `Our core purpose is to share the timeless wisdom encapsulated in the Bhagavad Gita and other Vedic scriptures, promoting devotional service (bhakti yoga) as the key to a fulfilling life. We are committed to offering free prasadam distribution, ensuring spiritual nourishment reaches all, and providing comprehensive spiritual education and guidance, particularly empowering the youth on their path of self-discovery and devotion.`
};

const missionItems = [
  { id: 1, icon: BookOpen, title: "Spread Teachings", description: "Spread the teachings of Lord Sri Krishna as presented by Srila Prabhupada.", image: "/gallery/temple-5.webp" },
  { id: 2, icon: Heart, title: "Promote Bhakti Yoga", description: "Promote devotional service (bhakti yoga) as the foundation of a meaningful life.", image: "/deity/deites1.webp" },
  { id: 3, icon: GraduationCap, title: "Spiritual Education", description: "Provide spiritual education via Bhagavad Gita and Srimad Bhagavatam.", image: "/gallery/temple-9.webp" },
  { id: 4, icon: Utensils, title: "Distribute Prasadam", description: "Distribute prasadam freely to ensure no one goes hungry.", image: "/gallery/temple-15.webp" },
  { id: 5, icon: Award, title: "Character Building", description: "Conduct character-building programs for youth and the broader society.", image: "/gallery/temple-11.webp" },
  { id: 6, icon: ShieldHalf, title: "Gokulam Goshala", description: "Protect cows and promote Go-seva as part of Vedic culture and Srila Prabhupada's mission.", image: "/gallery/temple-1.webp" } // Placeholder Goshala image
];

const visionItems = [
  { id: 1, icon: Users, title: "Vibrant Community", description: "Build a spiritually vibrant community rooted in Krishna consciousness." },
  { id: 2, icon: Target, title: "Serve All", description: "Ensure no one within reach remains hungry, fulfilling Srila Prabhupada’s instruction." },
  { id: 3, icon: BookOpen, title: "Accessible Wisdom", description: "Make Vedic wisdom accessible to all, regardless of caste and creed." },
  { id: 4, icon: Leaf, title: "Transform Lives", description: "Transform lives through simple living, high thinking, and pure devotion." },
  { id: 5, icon: Handshake, title: "Inspire Society", description: "Inspire a society that is peaceful, purposeful, and God-centered." },
  { id: 6, icon: ShieldHalf, title: "Revive Vedic Culture", description: "Revive Vedic culture by protecting cows and re-establishing Varnashrama Dharma." }
];

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

const faqItems = [
  { question: "What is Krishna Consciousness?", answer: "Krishna Consciousness is the awakening of our original, pure consciousness where one realizes their eternal relationship with Krishna (God). It is a scientific and practical approach to spiritual life based on the teachings of the Bhagavad Gita and other Vedic scriptures." },
  { question: "Do I need to be Hindu to visit or participate?", answer: "No, ISKM welcomes people from all backgrounds, faiths, and walks of life. The teachings and practices of Krishna Consciousness are universal and can be embraced by anyone interested in spiritual growth." },
  { question: "What should I wear when visiting the temple?", answer: "We recommend modest attire when visiting the temple. For men, shirts and pants or dhotis are appropriate. For women, saris, long skirts, or dresses that cover the legs are recommended. You might also want to bring a shawl to cover your shoulders." },
  { question: "What is prasadam?", answer: "Prasadam literally means 'mercy' and refers to vegetarian food that has been offered to Krishna with devotion. We believe that when food is offered to Krishna, it becomes spiritualized and purifies those who consume it." }
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
}
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

// --- Helper Components ---
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
    {children}
  </h2>
);


// --- Main Component ---
function AboutPage() {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 150]) // Increased parallax

  return (
    // Removed background image, overlay, and decorative SVG blobs for performance.
    // Further reduced bottom padding to minimize gap before footer.
    <div 
      ref={containerRef} 
      className="relative px-4 py-16 md:py-16 pb-0 md:pb-0" 
    >
      {/* Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto"> {/* Added wrapper with max-width and centering */}
        {/* Page Header */}
        <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 md:mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-400 text-transparent bg-clip-text">
          About {templeDetails.shortName}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Reviving Vedic culture and spreading Krishna consciousness through devotion, education, and service.
        </p>
      </motion.div>
      
      {/* Hero Image */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative w-full h-72 md:h-[600px] mb-20 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800"
      >
        <motion.img 
          style={{ y: heroImageY }}
          src="/gallery/temple-16.webp" // Selected Hero Image
          alt={`${templeDetails.shortName} Temple Exterior`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent flex items-end">
          <div className="p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-md">
              A Beacon of Spiritual Light
            </h2>
            <p className="text-lg md:text-xl max-w-2xl opacity-90 drop-shadow-sm">
              Discover peace, wisdom, and community, guided by the timeless teachings of Lord Krishna and Srila Prabhupada.
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Navigation - Removed, sections flow naturally */}
      
      {/* History Section - Updated Content */}
      <motion.section
        id="history"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        className="mb-8 md:mb-12"
      >
        <Card className="border-0 bg-gradient-to-br from-pink-50 dark:from-pink-900/10 via-transparent to-transparent overflow-hidden rounded-2xl shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              <motion.div 
                className="lg:w-2/5 relative order-2 lg:order-1"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-pink-300 dark:border-pink-700 rounded-tl-2xl opacity-70"></div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-pink-300 dark:border-pink-700 rounded-br-2xl opacity-70"></div>
                <img 
                  src="/gallery/temple-2.webp" // Selected History Image
                  alt="Founding inspiration"
                  className="rounded-2xl shadow-xl w-full relative z-10"
                />
              </motion.div>
              <motion.div 
                className="lg:w-3/5 order-1 lg:order-2"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-5 text-pink-700 dark:text-pink-400">{historyContent.title}</h2>
                <p className="text-muted-foreground mb-5 text-base md:text-lg leading-relaxed">
                  {historyContent.paragraph1}
                </p>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {historyContent.paragraph2}
                </p>
                <div className="mt-8">
                   <Link to="/donate"> {/* Example Link */}
                    <Button variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-400 dark:hover:bg-pink-900/20">
                      Support Our Mission <ChevronRight className="inline h-4 w-4 ml-1.5"/>
                    </Button>
                   </Link>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
      
      <Separator className="my-8 md:my-12 border-pink-200 dark:border-pink-800/30 h-0.5 bg-gradient-to-r from-transparent via-pink-300 dark:via-pink-700 to-transparent" />
      
      {/* Mission & Vision Section (Combined with Tabs) */}
      <motion.section
        id="mission-vision"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUpVariants}
        className="mb-8 md:mb-12"
      >
        <Tabs defaultValue="vision" className="w-full">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <TabsList className="inline-flex h-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/20 p-1.5 text-muted-foreground">
              <TabsTrigger value="mission" className="px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-pink-600 data-[state=active]:shadow-md">Our Mission</TabsTrigger>
              <TabsTrigger value="vision" className="px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-pink-600 data-[state=active]:shadow-md">Our Vision</TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="mission">
            <motion.div
              variants={containerVariants}
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {missionItems.map((item, _index) => ( 
                <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="h-full">
                  <Card className="h-full overflow-hidden border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-800/50 transition-colors shadow-sm hover:shadow-lg bg-card rounded-xl">
                    <div className="w-full h-52 overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full shadow">
                         <item.icon className="h-6 w-6 text-pink-600" />
                      </div>
                    </div>
                    <CardHeader className="pt-4 pb-2">
                      <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="vision">
             <motion.div
              variants={containerVariants}
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {visionItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="h-full">
                  <Card className="h-full border-0 bg-gradient-to-br from-pink-50 dark:from-pink-900/10 to-transparent p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-pink-500"><item.icon className="h-7 w-7" /></div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1.5 text-gray-800 dark:text-gray-100">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.section>

      <Separator className="my-12 md:my-16 border-pink-200 dark:border-pink-800/30 h-0.5 bg-gradient-to-r from-transparent via-pink-300 dark:via-pink-700 to-transparent" />

      {/* Construction Updates Section */}
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
      
      <Separator className="my-8 md:my-12 border-pink-200 dark:border-pink-800/30 h-0.5 bg-gradient-to-r from-transparent via-pink-300 dark:via-pink-700 to-transparent" />

      {/* Testimonial Quote Section */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUpVariants}
        className="relative mb-8 md:mb-12 py-16 px-4 md:py-20 md:px-8 bg-pink-50 dark:bg-pink-900/10 rounded-3xl overflow-hidden border border-pink-100 dark:border-pink-900/20"
      >
        <div className="absolute -top-10 -left-10 text-pink-100 dark:text-pink-900/30 text-[12rem] font-serif leading-none pointer-events-none opacity-50">"</div>
        <div className="absolute -bottom-16 -right-10 text-pink-100 dark:text-pink-900/30 text-[12rem] font-serif leading-none pointer-events-none opacity-50">"</div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-3xl italic text-gray-700 dark:text-gray-200 mb-10 leading-relaxed font-serif">
            "Krishna consciousness is the scientific process of spiritual life... the actual scientific understanding of our relationship with God."
          </p>
          <div className="flex items-center justify-center">
            <Avatar className="w-20 h-20 mr-5 border-4 border-white dark:border-gray-700 shadow-lg">
              <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Srila_Prabhupada.JPG/330px-Srila_Prabhupada.JPG" alt="Srila Prabhupada" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-bold text-xl text-gray-800 dark:text-gray-100">Srila Prabhupada</p>
              <p className="text-md text-pink-600 dark:text-pink-400">Founder-Acharya of ISKCON</p>
            </div>
          </div>
        </div>
      </motion.section>
      
      <Separator className="my-8 md:my-12 border-pink-200 dark:border-pink-800/30 h-0.5 bg-gradient-to-r from-transparent via-pink-300 dark:via-pink-700 to-transparent" />
      
      {/* FAQ Section */}
      <motion.section
        id="faq"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUpVariants}
        className="mb-8 md:mb-12"
      >
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUpVariants}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-gray-200 dark:border-gray-700/50 rounded-xl px-5 shadow-sm data-[state=open]:shadow-md">
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline text-gray-800 dark:text-gray-100">{faq.question}</AccordionTrigger>
                <AccordionContent className="pt-1 pb-4">
                  <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Have more questions?</p>
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-3">Contact Us</Button>
          </div>
        </motion.div>
      </motion.section>
      
      <Separator className="my-8 md:my-12 border-pink-200 dark:border-pink-800/30 h-0.5 bg-gradient-to-r from-transparent via-pink-300 dark:via-pink-700 to-transparent" />

      {/* Bank Details Section */}
       <motion.section
        id="support"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUpVariants}
        className="mb-0 md:mb-0 max-w-3xl mx-auto"
      >
        <SectionTitle>Support Our Seva</SectionTitle>
         <Alert className="bg-gradient-to-tr from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10 border-orange-200 dark:border-orange-800/50 rounded-xl shadow-md">
           <Banknote className="h-5 w-5 text-orange-600 dark:text-orange-400" />
           <AlertTitle className="font-semibold text-orange-800 dark:text-orange-300">Bank Transfer Details</AlertTitle>
           <AlertDescription className="mt-2 text-orange-700 dark:text-orange-300/90 text-sm space-y-1.5">
             <div className="flex justify-between items-center">
               <span>Account Name:</span>
               <span className="font-medium flex items-center gap-1.5">{templeDetails.bankDetails.accountName} <CopyButton size="sm" variant="ghost" content={templeDetails.bankDetails.accountName} className="text-orange-600 dark:text-orange-400" /></span>
             </div>
             <div className="flex justify-between items-center">
               <span>Account Number:</span>
               <span className="font-medium flex items-center gap-1.5">{templeDetails.bankDetails.accountNumber} <CopyButton size="sm" variant="ghost" content={templeDetails.bankDetails.accountNumber} className="text-orange-600 dark:text-orange-400" /></span>
             </div>
             <div className="flex justify-between items-center">
               <span>IFSC Code:</span>
                <span className="font-medium flex items-center gap-1.5">{templeDetails.bankDetails.ifsc} <CopyButton size="sm" variant="ghost" content={templeDetails.bankDetails.ifsc} className="text-orange-600 dark:text-orange-400" /></span>
             </div>
             <div className="flex justify-between items-center">
               <span>Bank:</span>
               <span className="font-medium">{templeDetails.bankDetails.bankName}</span>
             </div>
             <div className="flex justify-between items-center">
               <span>Account Type:</span>
               <span className="font-medium">{templeDetails.bankDetails.type}</span>
             </div>
           </AlertDescription>
         </Alert>
         <div className="text-center mt-6">
            <Link to="/donate">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-3">
                    Donate Online <ChevronRight className="h-4 w-4 ml-1.5"/>
                </Button>
            </Link>
         </div>
      </motion.section>

      </div> {/* End Content Wrapper */}
    </div>
  )
}
