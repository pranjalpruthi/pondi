import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

// Add this array at the top level
const images = [
  '/temple-building/1.webp',
  '/temple-building/2.webp',
  '/temple-building/3.webp',
  '/temple-building/4.webp',
  '/temple-building/5.webp',
  '/temple-building/6.webp',
  '/temple-building/7.webp',
  '/temple-building/8.webp',
  '/updates/s1.webp',
  '/updates/s2.webp',
  '/updates/s3.webp',
  '/updates/s4.webp',
  '/updates/s5.webp',
  '/updates/s6.webp',
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center py-24 overflow-hidden">
      {/* Background Image with Blur and Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.img
            key={currentIndex} // Change the image when currentIndex changes
            src={images[currentIndex]} // Use the current image from the slider
            alt="Blurred Background"
            className="w-full h-full object-cover filter blur-lg scale-110" // Add blur and slight scale
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} // Match slider transition
          />
        </AnimatePresence>
        {/* Adjusted Overlay for Light/Dark Mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/70"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Text and CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-xl"
          >
            {/* Logo (Optional, if needed on top) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 max-w-[100px]"
            >
              <img 
                src="/assets/iskmj.jpg" 
                alt="ISKM Logo" 
                className="rounded-full w-full"
              />
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Reawakening Kṛṣṇa Consciousness Worldwide
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-lg mb-8 text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join us and help spread Śrīla Prabhupāda's teachings 
              to guide everyone back to home, back to Godhead!
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/donate">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Support Us
                </Button>
              </Link>
              <Button 
                className="bg-[#e94a9c] hover:bg-[#d3428c]"
              >
                Subscribe to Our Newsletter
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Updated Right Content - Image Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="relative aspect-[4/3] w-full max-w-xl mx-auto lg:ml-auto"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`Temple Image ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -10, 0], // Floating animation
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.8,
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(233, 74, 156, 0.25), 0 8px 24px -8px rgba(255, 215, 0, 0.15)"
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Updated decorative element */}
      <motion.div 
        className="absolute bottom-12 left-0 w-full h-1"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(233, 74, 156, 0.3), rgba(255, 215, 0, 0.3), transparent)"
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scaleX: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  )
} 