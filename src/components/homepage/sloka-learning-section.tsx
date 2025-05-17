import { MoveRight, PlayCircle, Music } from "lucide-react"
import { Button } from "@/components/ui/button" // Corrected path
import { Badge } from "@/components/ui/badge"   // Corrected path
import { motion } from "motion/react" // Corrected import
// ShineBorder removed
import { RainbowButton } from "@/components/ui/rainbow-button" // Corrected path
import { Marquee } from "@/components/magicui/marquee" // Corrected path - Use named import
import { cn } from "@/lib/utils" // Corrected path

const episodes = [
  { emoji: "🧠", title: "Benefits of Memorizing Ślokas", description: "Discover the advantages of memorizing Ślokas in your spiritual practice.", link: "https://youtu.be/ctFYELogz-Y?si=VdRuoGNF5zJy897S" },
  { emoji: "🔤", title: "The Science of Sanskrit Alphabet", description: "Learn the intricacies of Sanskrit alphabet and pronunciation.", link: "https://youtu.be/8ntyFd6eatU?si=ck9BTgvui4TXfZoY" },
  { emoji: "🔗", title: "Joining and Division of Words", description: "Understand how words are joined and divided in Sanskrit Ślokas.", link: "https://youtu.be/sSt12nPs3O0?si=kyLvv2VpP2F9Pfcb" },
  { emoji: "🎵", title: "Chanting Ślokas in Proper Tunes", description: "Master the art of chanting Ślokas with their correct melodies.", link: "https://youtu.be/sizxDYbysAQ?si=ga1d1_dr8_ttFF-C" },
  { emoji: "📚", title: "Understanding Sanskrit Ślokas", description: "Learn techniques to easily comprehend Sanskrit Ślokas.", link: "https://youtu.be/YoM92YuFT9Y?si=j_2gbt4sIriIL8LB" },
  { emoji: "🧘", title: "Techniques for Memorizing Ślokas", description: "Explore practical methods to effectively memorize Ślokas.", link: "https://youtu.be/a0_O0KDWHrI?si=LqKakp8xh_cFIDR0" },
  { emoji: "🗣️", title: "Understanding Bengali Pronunciation", description: "Learn the nuances of Bengali pronunciation in Ślokas.", link: "https://youtu.be/Z_yfyOttdMo?si=edNO8OYbEdWIDpCb" },
]

const EpisodeCard = ({
  emoji,
  title,
  description,
  link,
}: {
  emoji: string;
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer"> {/* Changed to <a> tag */}
      <figure
        className={cn(
          "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mr-4",
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        )}
      >
        <div className="flex flex-col">
          <figcaption className="text-lg font-medium dark:text-white">
            {emoji} {title}
          </figcaption>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </figure>
    </a> // Changed to <a> tag
  );
};

export function SlokaLearningSection() {
  const firstRow = episodes.slice(0, Math.ceil(episodes.length / 2));
  const secondRow = episodes.slice(Math.ceil(episodes.length / 2));

  return (
    <div className="w-full py-20 lg:py-40 bg-background overflow-hidden rounded-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <motion.div
            className="flex gap-4 flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} // Changed to whileInView for animation trigger
            viewport={{ once: true, amount: 0.3 }} // Added viewport settings
            transition={{ duration: 0.5 }}
          >
            <div>
              <Badge>🆕 New Course!</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-7xl max-w-lg tracking-tighter text-left font-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Śloka Learning Course 📚
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Embark on a transformative journey through our Śloka Learning Course. Discover the profound wisdom and spiritual benefits of mastering these sacred verses. 🧘‍♂️✨
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Changed Link to a tag inside RainbowButton, removed asChild */}
              <RainbowButton className="gap-2 w-full sm:w-2/3 md:w-1/2 lg:w-2/5 mx-auto rounded-full">
                <a href="https://youtube.com/playlist?list=PLQGHF3mp1o79L2nIKJBTiDreq1JRjBcqc" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                ▶︎ Explore 🍯 <PlayCircle className="w-4 h-4 ml-2 inline-block" />
                </a>
              </RainbowButton>
              <div className="flex flex-col sm:flex-row gap-4">
                 {/* Changed Link to a tag inside Button */}
                <Button size="lg" className="gap-2 flex-1 text-sm sm:text-base" variant="outline" asChild>
                  <a href="https://ebooks.iskcondesiretree.com/pdf/00_-_More/Verses_most_Quoted_by_Srila_Prabhupada.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <span className="hidden sm:inline">Download</span> Śloka PDF <MoveRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                 {/* Changed Link to a tag inside Button */}
                <Button size="lg" className="gap-2 flex-1 text-sm sm:text-base" variant="outline" asChild>
                  <a href="https://iskm.notion.site/369d53ecff604ef2a008b4b4bca77355" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Sanskrit <span className="hidden sm:inline">Sloka</span> Tunes <Music className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative h-[400px] w-full overflow-hidden rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Replaced ShineBorder with a standard div and border */}
            <div className="h-full w-full border rounded-lg p-2">
              <Marquee pauseOnHover className="[--duration:40s]">
                {firstRow.map((episode) => (
                  <EpisodeCard key={episode.title} {...episode} />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:40s]">
                {secondRow.map((episode) => (
                  <EpisodeCard key={episode.title} {...episode} />
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
