import { motion } from "motion/react"
import { ExternalLink, MessageCircleQuestion, Calendar, Clock, Youtube } from "lucide-react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { XMLParser } from "fast-xml-parser"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RippleButton } from "@/components/animate-ui/buttons/ripple"
import { Badge } from "@/components/ui/badge"

interface YouTubeVideo {
  id: string;
  title: string;
  link: string;
  thumbnailUrl: string;
  publishedDate: string;
}

const fetchPreviousSessions = async (channelId: string): Promise<YouTubeVideo[]> => {
  const rssFeedUrl = import.meta.env.DEV
    ? `/youtube-feed/feeds/videos.xml?channel_id=${channelId}`
    : `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`;

  try {
    const response = await fetch(rssFeedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlText = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const jsonObj = parser.parse(xmlText);

    if (!jsonObj.feed || !jsonObj.feed.entry) {
      console.warn("RSS feed structure not as expected or empty:", jsonObj);
      return [];
    }

    const entries = Array.isArray(jsonObj.feed.entry) ? jsonObj.feed.entry : [jsonObj.feed.entry];

    return entries.map((entry: any) => {
      const videoId = entry["yt:videoId"];
      const title = entry.title;
      const link = entry.link?.["@_href"];
      const thumbnailUrl = entry["media:group"]?.["media:thumbnail"]?.["@_url"];
      const publishedDate = entry.published ? new Date(entry.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Date not available";

      return {
        id: videoId || entry.id,
        title: title || "Untitled Video",
        link: link || `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: thumbnailUrl || "/assets/qna_thumb_default.jpg",
        publishedDate,
      };
    }).filter((video: YouTubeVideo) => video.id && video.link);
  } catch (error) {
    console.error("Failed to fetch or parse YouTube RSS feed:", error);
    throw error;
  }
};


export function QnASection() {
  const FRIDAY_CHANNEL_ID = "UCA7bxZwd7dF3r8GWpShRqug";
  const SUNDAY_CHANNEL_ID = "UCI_lrxFMPnjcEcBsPtX47hQ"; // New Sunday channel ID

  const [activeTab, setActiveTab] = useState("friday"); // State for active tab

  const currentChannelId = activeTab === "friday" ? FRIDAY_CHANNEL_ID : SUNDAY_CHANNEL_ID;

  const {
    data: previousSessions,
    isLoading,
    isError,
    error
  } = useQuery<YouTubeVideo[], Error>({
    queryKey: ['previousYouTubeSessions', currentChannelId],
    queryFn: () => fetchPreviousSessions(currentChannelId),
    // The data will be considered fresh for 30 minutes.
    // No new network request will be made for this query during this time.
    staleTime: 1000 * 60 * 30, // 30 minutes
    // The data will be garbage collected after 60 minutes of inactivity.
    gcTime: 1000 * 60 * 60, // 60 minutes
    // Keep previous data while fetching new data to avoid UI flashes
    placeholderData: keepPreviousData,
  });

  return (
    <section className="relative py-20 md:py-28 bg-gray-100/50 dark:bg-gray-950/95 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-pink-400/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-400/10 via-transparent to-transparent blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl relative z-10">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl border border-gray-200/50 dark:border-gray-800/50 p-6 sm:p-8 md:p-12 shadow-2xl shadow-gray-600/10 dark:shadow-black/20">
          {/* Section header with styled design */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3">
                  <MessageCircleQuestion className="h-8 w-8 text-[#ffc547]" />
                </div>
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffc547] via-[#e94a9c] to-[#0a84ff] text-transparent bg-clip-text"
            >
              Q&A Sessions
            </motion.h2>
          </div>

          <motion.blockquote
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative max-w-md text-right border-r-4 border-pink-400/50 pr-4"
          >
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              "Chanting is the waxing moon that spreads the white lotus flower of good fortune for all living entities."
            </p>
            <cite className="text-xs not-italic text-gray-500 dark:text-gray-500 block mt-1">- Śrīla Prabhupāda</cite>
          </motion.blockquote>
        </div>

        <Tabs defaultValue="friday" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-sm mx-auto"> {/* Centered tabs */}
            <TabsTrigger value="friday" onClick={() => setActiveTab("friday")}>Friday Session</TabsTrigger>
            <TabsTrigger value="sunday" onClick={() => setActiveTab("sunday")}>Sunday Session</TabsTrigger>
          </TabsList>

          <TabsContent value="friday">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#ffc547]/20 via-[#e94a9c]/10 to-transparent z-10"></div>
                    <img
                      src="/assets/extra/hgsgpqna.jpg"
                      alt="Q&A Session Preview"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-6 lg:p-8 flex flex-col justify-between lg:w-1/2">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-[#0a84ff] dark:text-[#0a84ff]">
                        Dive Deep into Vedic Wisdom
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-lg text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"
                      >
                        <span>With</span>
                        <Badge variant="outline" className="border-blue-300 bg-blue-100/50 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-bold text-lg px-3 py-1">
                          H.G. Sundar Gopal Prabhu
                        </Badge>
                      </motion.div>

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Join H.G. Sundar Gopal Prabhu as he illuminates the timeless teachings of Śrīla Prabhupāda, drawing from the depths of Bhagavad-gītā and Śrīmad-Bhāgavatam.
                      </p>
                      
                      <blockquote className="mt-4 border-l-4 border-pink-400/50 pl-4 italic text-gray-600 dark:text-gray-400">
                        <p>"Religion without philosophy is sentiment, or sometimes fanaticism, while philosophy without religion is mental speculation."</p>
                        <cite className="mt-2 block text-right text-sm not-italic text-gray-500">- Śrīla Prabhupāda</cite>
                      </blockquote>

                      <div className="flex flex-col space-y-2 pt-2">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-[#ffc547] dark:text-[#ffc547]" />
                          <span className="font-medium">Every Friday</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-[#e94a9c] dark:text-[#e94a9c]" />
                          <span className="font-medium">8:00 PM (SGT) • 5:30 PM (IST)</span>
                        </div>
                      </div>
                    </div>

                    {/* Responsive button group */}
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-8 items-center">
                      <RippleButton className="w-full sm:flex-1 bg-gradient-to-r from-[#e94a9c] to-[#0a84ff] hover:from-[#d3428c] hover:to-[#0077ed] rounded-full border-0 h-14 sm:h-12 font-medium text-white shadow-sm transition-all">
                        <a href="https://www.youtube.com/@ISKM108/streams" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                          <Youtube className="mr-2 h-5 w-5" /> Watch Live Stream
                        </a>
                      </RippleButton>

                      <RippleButton variant="outline" className="w-full sm:flex-1 rounded-full h-14 sm:h-12 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-medium transition-all">
                        <a href="https://t.me/ISKMVaishnavasanga" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                          <ExternalLink className="mr-2 h-5 w-5" /> Join Telegram Group
                        </a>
                      </RippleButton>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="sunday">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#ffc547]/20 via-[#e94a9c]/10 to-transparent z-10"></div>
                    <img
                      src="/assets/extra/sunday.jpg" // Sunday image
                      alt="Sunday Session Preview"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-6 lg:p-8 flex flex-col justify-between lg:w-1/2">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-[#0a84ff] dark:text-[#0a84ff]">
                        Unlocking the Secrets of Bhakti
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-lg text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"
                      >
                        <span>With</span>
                        <Badge variant="outline" className="border-pink-300 bg-pink-100/50 text-pink-800 dark:border-pink-700 dark:bg-pink-900/30 dark:text-pink-300 font-bold text-lg px-3 py-1">
                          H.G. Prahlad Bhakta Prabhu
                        </Badge>
                      </motion.div>

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Delve into the profound science of devotion with H.G. Prahlad Bhakta Prabhu. These enlightening Sunday sessions offer a systematic journey into the heart of Bhakti, welcoming aspirants from all walks of life to discover its timeless wisdom.
                      </p>

                      <blockquote className="mt-4 border-l-4 border-pink-400/50 pl-4 italic text-gray-600 dark:text-gray-400">
                        <p>"Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him. The self-realized soul can impart knowledge unto you because he has seen the truth."</p>
                        <cite className="mt-2 block text-right text-sm not-italic text-gray-500">- Bhagavad-gītā 4.34</cite>
                      </blockquote>

                      <div className="flex flex-col space-y-2 pt-2">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-[#ffc547] dark:text-[#ffc547]" />
                          <span className="font-medium">Every Sunday</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-[#e94a9c] dark:text-[#e94a9c]" />
                          <span className="font-medium">4:00 PM - 7:30 PM (IST)</span>
                        </div>
                      </div>
                    </div>

                    {/* Responsive button group */}
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-8 items-center">
                      <RippleButton className="w-full sm:flex-1 bg-gradient-to-r from-[#e94a9c] to-[#0a84ff] hover:from-[#d3428c] hover:to-[#0077ed] rounded-full border-0 h-14 sm:h-12 font-medium text-white shadow-sm transition-all">
                        <a href="https://www.youtube.com/@harekrsnaleague2764" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                          <Youtube className="mr-2 h-5 w-5" /> Watch Live Stream
                        </a>
                      </RippleButton>

                      <RippleButton variant="outline" className="w-full sm:flex-1 rounded-full h-14 sm:h-12 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-medium transition-all">
                        <a href="https://t.me/ISKMVaishnavasanga" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                          <ExternalLink className="mr-2 h-5 w-5" /> Join Telegram Group
                        </a>
                      </RippleButton>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Previous sessions grid - Mobile friendly */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
            Previous Sessions
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {isLoading && !previousSessions ? (
              [...Array(10)].map((_, item) => (
                <Card key={item} className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))
            ) : isError ? (
              <div className="col-span-full text-center text-red-500 dark:text-red-400 py-8">
                <p>Failed to load previous sessions.</p>
                {error && <p className="text-sm">{error.message}</p>}
              </div>
            ) : previousSessions && previousSessions.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No previous sessions found.</p>
              </div>
            ) : (
              previousSessions?.slice(0, 10).map((video, index) => (
                <motion.div
                  key={video.id}
                  className="group block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: index * 0.1 }}
                >
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative overflow-hidden rounded-2xl aspect-video shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 border border-gray-200/50 dark:border-gray-800/50 group-hover:border-pink-500/50"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = "/assets/qna_thumb_default.jpg")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-300 group-hover:from-black/90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="rounded-full bg-white/25 backdrop-blur-md p-3 border border-white/30">
                        <Youtube className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="font-bold text-white drop-shadow-sm line-clamp-2 text-sm sm:text-base leading-tight">
                        {video.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-white/80 mt-1.5 drop-shadow-sm">
                        {video.publishedDate}
                      </p>
                    </div>
                  </a>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-10 text-center">
            <Button variant="ghost" className="text-[#0a84ff] dark:text-[#0a84ff] hover:text-[#0077ed] dark:hover:text-[#0077ed] hover:bg-[#0a84ff]/5 dark:hover:bg-[#0a84ff]/10 rounded-full h-12 text-base">
              <a href={`https://www.youtube.com/channel/${currentChannelId}/videos`} target="_blank" rel="noopener noreferrer" className="flex items-center px-8">
                View All Sessions <ExternalLink className="ml-2.5 h-4 w-4" />
              </a>
            </Button>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
