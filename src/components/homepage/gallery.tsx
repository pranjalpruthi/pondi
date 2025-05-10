import { motion } from "motion/react"
import { Image, GalleryVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"



const images = [
  { src: "/gallery/temple-1.webp", alt: "Temple Interior" },
  { src: "/gallery/temple-2.webp", alt: "Temple Exterior" },
  { src: "/gallery/temple-3.webp", alt: "Deity Darshan" },
  { src: "/gallery/temple-4.webp", alt: "Festival Celebration" },
  { src: "/gallery/temple-5.webp", alt: "Temple Architecture" },
  { src: "/gallery/temple-6.webp", alt: "Temple Gardens" },
]

export function Gallery() {
  return (
    <section className="py-24 relative overflow-visible">
      {/* Removed section-specific background */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto w-fit mb-6"
          >
            <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3">
                <GalleryVertical className="h-7 w-7 text-[#0a84ff] dark:text-[#0a84ff]" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#0a84ff] via-[#e94a9c] to-[#ffc547] text-transparent bg-clip-text"
          >
            Temple Gallery
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto"
          >
            Experience the beauty and serenity of our temple
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <Card className="overflow-hidden border-0 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:shadow-lg">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-5">
                    <span className="text-white text-lg font-medium">{image.alt}</span>
                  </div>
                </div>
                
                {/* Decorative accent - color varies based on index */}
                <div className={`absolute top-0 right-0 w-20 h-1 rounded-bl-full ${
                  index % 3 === 0 
                    ? "bg-[#e94a9c]" 
                    : index % 3 === 1 
                      ? "bg-[#ffc547]" 
                      : "bg-[#0a84ff]"
                }`}></div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* View More Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <Button className="bg-gradient-to-r from-[#0a84ff] via-[#ffc547] to-[#e94a9c] hover:from-[#0077ed] hover:via-[#e6b03f] hover:to-[#d3428c] rounded-full border-0 h-11 px-8 font-medium text-white shadow-sm transition-all">
            <Image className="mr-2 h-4 w-4" /> View Full Gallery
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 