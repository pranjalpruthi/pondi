import { motion } from "motion/react"
import { ExternalLink, MessageCircleQuestion, Calendar, Clock, Youtube } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { XMLParser } from "fast-xml-parser"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RippleButton } from "@/components/animate-ui/buttons/ripple"

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
    queryKey: ['previousYouTubeSessions', currentChannelId], // Use currentChannelId
    queryFn: () => fetchPreviousSessions(currentChannelId), // Pass currentChannelId
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  return (
    <section className="py-16 px-4 relative overflow-visible">
      {/* Removed section-specific background */}
      
      <div className="container mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl relative z-10"> {/* Wider on large screens */}
        {/* Section header with styled design */}
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-fit mb-6 mx-auto"
          >
            <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3">
                <MessageCircleQuestion className="h-7 w-7 text-[#ffc547] dark:text-[#ffc547]" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#ffc547] via-[#e94a9c] to-[#0a84ff] text-transparent bg-clip-text"
          >
            Q&A Sessions
          </motion.h2>
          {/* Removed the static name display here */}
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
                        Hare Kṛṣṇa Dear Devotees
                      </h3>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4"
                      >
                        With H.G. Sundar Gopal Prabhu
                      </motion.p>

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Immerse yourself in profound spiritual discussions with <span className="font-medium">H.G. Sundar Gopal Prabhu</span>, who shares insights from Śrīla Prabhupāda's teachings, Bhagavad-gītā, and Śrīmad-Bhāgavatam.
                      </p>

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
                        Hare Kṛṣṇa Dear Devotees
                      </h3>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4"
                      >
                        With H.G. Prahlad Bhakta Prabhu
                      </motion.p>

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Join <span className="font-medium">H.G. Prahlad Bhakta Prabhu</span> for insightful discussions every Sunday.
                      </p>

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
          <h3 className="text-xl font-semibold mb-6 text-center bg-gradient-to-r from-[#0a84ff] via-[#ffc547] to-[#e94a9c] text-transparent bg-clip-text">
            Previous Sessions
          </h3>

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"> {/* Changed grid-cols-1 to grid-cols-2 */}
              {[...Array(5)].map((_, item) => (
                <Card key={item} className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center text-red-500 dark:text-red-400 py-8">
              <p>Failed to load previous sessions.</p>
              {error && <p className="text-sm">{error.message}</p>}
            </div>
          )}

          {!isLoading && !isError && previousSessions && previousSessions.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>No previous sessions found.</p>
            </div>
          )}

          {!isLoading && !isError && previousSessions && previousSessions.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"> {/* Changed grid-cols-1 to grid-cols-2 */}
              {previousSessions.slice(0, 10).map((video) => (
                <motion.a
                  key={video.id}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="group block"
                >
                  <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:shadow-md h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => (e.currentTarget.src = "/assets/qna_thumb_default.jpg")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="rounded-full bg-white/30 backdrop-blur-sm p-3">
                          <Youtube className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-[#e94a9c] dark:text-[#e94a9c] line-clamp-2 text-xs sm:text-sm leading-snug mb-1">
                          {video.title}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {video.publishedDate}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.a>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Button variant="ghost" className="text-[#0a84ff] dark:text-[#0a84ff] hover:text-[#0077ed] dark:hover:text-[#0077ed] hover:bg-[#0a84ff]/5 dark:hover:bg-[#0a84ff]/10 rounded-full h-12 text-base">
              <a href={`https://www.youtube.com/channel/${currentChannelId}/videos`} target="_blank" rel="noopener noreferrer" className="flex items-center px-8">
                View All Sessions <ExternalLink className="ml-2.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
