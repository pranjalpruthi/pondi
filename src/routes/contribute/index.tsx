import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, type Variants } from "motion/react"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronRight, Calendar, Building
} from "lucide-react"
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "@/components/motion-primitives/morphing-popover"

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

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

function ContributePage() {
  return (
    <div className="relative px-4 py-16 md:py-16 pb-0 md:pb-0">
      <div className="relative z-10 max-w-7xl mx-auto">
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
