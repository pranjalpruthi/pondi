import { motion } from "framer-motion"

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
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Temple Gallery
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-medium">{image.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 