import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const stories = [
  {
    name: "Radha Devi",
    image: "/avatars/devotee1.jpg",
    story: "Finding ISKCON changed my life completely. The spiritual teachings and community support have given me a new perspective.",
    location: "Mumbai, India"
  },
  {
    name: "Krishna Das",
    image: "/avatars/devotee2.jpg",
    story: "The peace and tranquility I experience during morning Aarti is incomparable. It's become an essential part of my daily routine.",
    location: "Delhi, India"
  },
  {
    name: "Bhakti Sharma",
    image: "/avatars/devotee3.jpg",
    story: "The temple's prasadam and spiritual atmosphere have helped me connect deeper with my spiritual journey.",
    location: "Vrindavan, India"
  }
]

export function DevoteeStories() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Devotee Stories
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 mb-4">
                      <AvatarImage src={story.image} alt={story.name} />
                      <AvatarFallback>{story.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-2">{story.name}</h3>
                    <p className="text-muted-foreground mb-4">{story.story}</p>
                    <span className="text-sm text-primary">{story.location}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 