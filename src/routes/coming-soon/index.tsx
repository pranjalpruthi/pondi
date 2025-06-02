import { createFileRoute, Link } from "@tanstack/react-router" // Added createFileRoute
import { RainbowButton } from "@/components/ui/rainbow-button" // Changed to RainbowButton
import { ShinyRotatingBorderButton } from "@/components/ui/shiny-rotating-border-button" // Keep for other uses if any, or remove if not used elsewhere
// import { RainbowGlow } from "@/components/ui/rainbow-glow" // Removed import
import { Badge } from "@/components/ui/badge"
import Two from "@/components/gallery/two"
import { motion } from "motion/react"
import { Mail, Quote } from "lucide-react"
import { Input } from "@/components/ui/input"
import { IconBrandFacebook, IconBrandX, IconBrandWhatsapp, IconBrandTelegram, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export const Route = createFileRoute('/coming-soon/')({
  component: ComingSoonPage,
})

function ComingSoonPage() { // Changed from 'export function'
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)

  return (
    // <PageWrapper> removed
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-16 px-4">
      {/* Header Badge - Centered */}
        <div className="flex justify-center w-full mb-8">
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="relative z-5"
          >
            <motion.div
              className="px-8 py-4 rounded-full bg-secondary/80 backdrop-blur-sm 
                flex items-center gap-4 text-secondary-foreground shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Construction%20Worker%20Medium%20Skin%20Tone.png" 
                alt="Construction Worker" 
                width="80" 
                height="80"
              />
              <span className="text-xl font-medium">
                Divine Construction in Progress
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Centered Title Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3">
            🕉️ Hare Krishna Temple
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent 
            bg-gradient-to-r from-primary to-primary/60 mb-4">
            A Sacred Space
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us in manifesting a divine sanctuary for spiritual elevation. 
            Be part of this transcendental journey 🙏
          </p>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Gallery and Donate */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="h-[500px] relative"
              >
                <Two />
              </motion.div>

              {/* Support Us Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4 relative z-50"
              >
                <Link to="/donate"> {/* Changed href to to */}
                  <RainbowButton className="w-auto mx-auto px-8 flex items-center justify-center gap-3 hover:scale-105 transition-transform relative"> {/* Changed back to RainbowButton */}
                    <motion.img
                      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Heart%20Hands.png"
                      alt="Heart Hands"
                      width="60"
                      height="60"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                    <span className="text-lg font-medium">
                      Support Us
                    </span>
                  </RainbowButton>
                </Link>
              </motion.div>
            </div>

            {/* Right Side - Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Quote Section */}
              <motion.div 
                className="p-8 bg-secondary/20 rounded-xl border border-secondary/30
                  backdrop-blur-sm shadow-lg hover:bg-secondary/30 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Quote className="w-10 h-10 mb-4 text-primary" />
                <p className="text-xl italic text-primary font-medium mb-4 leading-relaxed">
                  "By installing the Deity of the Lord one becomes king of the entire earth, 
                  by building a temple for the Lord one becomes ruler of the three worlds..."
                </p>
                <Badge variant="outline" className="text-sm px-4 py-1 bg-background/50">
                  Śrīmad-Bhāgavatam 11.27.52
                </Badge>
              </motion.div>

              {/* Newsletter Form - Back to Godhead Magazine Signup */}
              <motion.div 
                className="space-y-6 bg-card/30 backdrop-blur-sm p-8 rounded-2xl border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Magazine Header */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div 
                    className="relative w-20 h-20 rounded-full bg-white shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0px rgba(255,255,255,0.2)",
                        "0 0 0 10px rgba(255,255,255,0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <img
                      src="/pp/pp1.webp" // Changed to img and updated src
                      alt="Back to Godhead Magazine"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-semibold">Back to Godhead</h3>
                    <p className="text-sm text-muted-foreground">Free Monthly E-Magazine</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Subscribe Section with Two Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Left Column - Subscribe Dialog */}
                    <div className="space-y-4">
                      <Dialog open={isSubscribeOpen} onOpenChange={setIsSubscribeOpen}>
                        <DialogTrigger asChild>
                          <Badge 
                            variant="secondary"
                            className="w-full py-3 cursor-pointer hover:bg-secondary/80 transition-all duration-300"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Mail className="h-4 w-4" />
                              Subscribe to Magazine
                            </span>
                          </Badge>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Subscribe to Back to Godhead</DialogTitle>
                            <DialogDescription>
                              Get your free monthly e-copy delivered directly to your inbox.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src="/pp/pp1.webp" // Changed to img and updated src
                                alt="Back to Godhead Magazine"
                                width={60}
                                height={60}
                                className="rounded-full bg-white p-1"
                              />
                              <div className="flex-1">
                                <Input
                                  type="email"
                                  placeholder="Enter your email address"
                                  className="bg-background/50"
                                />
                              </div>
                            </div>
                            <ShinyRotatingBorderButton
                              onClick={() => setIsSubscribeOpen(false)}
                              className="w-full"
                            >
                              Subscribe Now
                            </ShinyRotatingBorderButton>
                            <p className="text-xs text-center text-muted-foreground pt-2">
                              You can unsubscribe at any time. No spam, ever.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {/* WhatsApp Option */}
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>or get it on</span>
                        <a
                          href="https://wa.me/918056513859?text=I%20would%20like%20to%20subscribe%20to%20Back%20to%20Godhead%20e-magazine" // Changed Link to a, and to back to href
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#128C7E] transition-colors"
                        >
                          <IconBrandWhatsapp className="h-5 w-5" />
                          <span className="font-medium">WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Right Column - Social Links Badge */}
                    <div className="flex justify-end">
                      <Badge 
                        variant="outline" 
                        className="px-6 py-3 backdrop-blur-sm hover:shadow-lg transition-all duration-300 bg-background/50"
                      >
                        <div className="flex items-center gap-4">
                          {[
                            { icon: IconBrandInstagram, url: 'https://www.instagram.com/iskm_pondy', color: '#E4405F' },
                            { icon: IconBrandFacebook, url: 'https://www.facebook.com/iskm.pondy/', color: '#1877F2' },
                            { icon: IconBrandYoutube, url: 'https://www.youtube.com/@ISKMPondy', color: '#FF0000' },
                            { icon: IconBrandX, url: 'https://x.com/iskm_sg', color: '#FFFFFF' },
                            { icon: IconBrandTelegram, url: 'https://t.me/ISKMVaishnavasanga', color: '#0088cc' },
                            { icon: IconBrandWhatsapp, url: 'https://wa.me/918056513859', color: '#25D366' },
                          ].map((item, index) => (
                            <a // Changed Link to a for external, non-router links
                              key={index}
                              href={item.url} // href is fine for <a>
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                              // onClick={(e) => { // onClick is redundant if href is used with target="_blank"
                              //   e.preventDefault();
                              //   window.open(item.url, '_blank');
                              // }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <item.icon
                                  className="h-5 w-5 transition-transform duration-200"
                                  style={{ color: item.color }}
                                />
                              </motion.div>
                            </a>
                          ))}
                        </div>
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Get your free e-copy of our monthly spiritual magazine filled with transcendental knowledge.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Rainbow Glow Effect Removed */}
        {/* <RainbowGlow className="opacity-80" /> */}
      </div>
  ); // Added semicolon and ensured proper closing
}
export default ComingSoonPage; // Added default export