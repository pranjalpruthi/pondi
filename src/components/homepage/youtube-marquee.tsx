import { useQuery } from '@tanstack/react-query';
import { Marquee } from "@/components/magicui/marquee";
import { XMLParser } from "fast-xml-parser";
import { cn } from '@/lib/utils';

export interface YouTubeVideo { // Added export
  id: string;
  title: string;
  thumbnail: string;
  link?: string;
  publishedDate?: string;
  description?: string;
  views?: string;
  stars?: string;
}

export const YOUTUBE_CHANNEL_ID = "UC0vql4wq4-l-LKnugnKtUOQ"; // ISKM Pondicherry - Corrected ID // Added export

export const RSS_FEED_URL = import.meta.env.DEV  // Added export
  ? `/youtube-feed/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`
  : `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`)}`;

export const fetchYouTubeRssFeed = async (): Promise<YouTubeVideo[]> => { // Added export
  try {
    const response = await fetch(RSS_FEED_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${RSS_FEED_URL}`);
    }
    const xmlText = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      allowBooleanAttributes: true,
      parseTagValue: true,
      parseAttributeValue: true,
      trimValues: true,
      tagValueProcessor: (tagName, tagValue) => {
        if (tagName === "title") return tagValue;
        return tagValue;
      },
      attributeValueProcessor: (attrName, attrValue) => {
        if (attrName === "url") return attrValue;
        return attrValue;
      },
    });
    const jsonObj = parser.parse(xmlText);

    if (!jsonObj.feed || !jsonObj.feed.entry) {
      console.warn("RSS feed structure not as expected or empty in YouTubeMarquee:", jsonObj);
      if (jsonObj.feed && jsonObj.feed.entry && !Array.isArray(jsonObj.feed.entry)) {
         const entry = jsonObj.feed.entry;
         const videoId = entry["yt:videoId"];
         const title = entry.title;
         const link = entry.link?.["@_href"];
         const thumbnailUrl = entry["media:group"]?.["media:thumbnail"]?.["@_url"];
         const publishedDate = entry.published ? new Date(entry.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Date not available";
         
         if (videoId && title && thumbnailUrl) {
            return [{
                id: videoId,
                title,
                link: link || `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: thumbnailUrl,
                publishedDate,
            }];
         }
      }
      return [];
    }
    
    const entries = Array.isArray(jsonObj.feed.entry) ? jsonObj.feed.entry : [jsonObj.feed.entry];

    return entries.map((entry: any) => {
      const videoId = entry["yt:videoId"];
      const title = entry.title;
      const link = entry.link?.["@_href"];
      const mediaGroup = entry["media:group"];
      const thumbnailUrl = mediaGroup?.["media:thumbnail"]?.["@_url"];
      const publishedDate = entry.published ? new Date(entry.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Date not available";
      const description = mediaGroup?.["media:description"];
      const views = mediaGroup?.["media:community"]?.["media:statistics"]?.["@_views"];
      const stars = mediaGroup?.["media:community"]?.["media:starRating"]?.["@_average"];


      return {
        id: videoId || entry.id?.split(':').pop() || 'unknown-' + Math.random(),
        title: title || "Untitled Video",
        link: link || (videoId ? `https://www.youtube.com/watch?v=${videoId}`: '#'),
        thumbnail: thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` ,
        publishedDate,
        description,
        views,
        stars,
      };
    })
    .filter((video: YouTubeVideo) => video.id && video.link && video.thumbnail && !video.id.startsWith('unknown-'))
    .slice(0, 10);

  } catch (error) {
    console.error("Failed to fetch or parse YouTube RSS feed for Marquee:", error);
    if (error instanceof Error) {
        throw new Error(`YouTubeMarquee fetch/parse error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching YouTube videos for marquee.");
  }
};

const PulsingDotButton = ({ text }: { text: string }) => (
  <button className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 group transform hover:scale-105 transition-transform duration-200">
    <span className="flex items-center space-x-2">
      <span>{text}</span>
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f3b1ef] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f3b1ef]"></span>
      </span>
    </span>
  </button>
);

const VideoMarqueeCard = ({
  title,
  thumbnail,
  publishedDate,
  link,
  id,
}: YouTubeVideo) => {
  return (
    <a
      href={link || `https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative h-36 w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img
          className="rounded-full"
          width="40"
          height="40"
          alt={title}
          src={thumbnail}
        />
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white/80 rounded-full bg-white/10 px-2 py-0.5">
            {publishedDate}
          </span>
        </div>
      </div>
      <blockquote className="mt-3 text-sm font-medium dark:text-white line-clamp-2">
        {title}
      </blockquote>
    </a>
  );
};

export function YouTubeMarquee() {
  const { data: videos, isLoading, error, isError } = useQuery<YouTubeVideo[], Error>(
    {
      queryKey: ['youtubeMarqueeVideos', YOUTUBE_CHANNEL_ID],
      queryFn: fetchYouTubeRssFeed,
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const renderMarqueeContent = () => {
    if (!videos || !Array.isArray(videos) || videos.length === 0) return null;

    const videosFirstHalf = videos.slice(0, Math.ceil(videos.length / 2));
    const videosSecondHalf = videos.slice(Math.ceil(videos.length / 2));

    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s]">
          {videosFirstHalf.map((video) => (
            <VideoMarqueeCard key={`first-${video.id}`} {...video} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {videosSecondHalf.map((video) => (
            <VideoMarqueeCard key={`second-${video.id}`} {...video} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    );
  }
  
  let content;
  if (isLoading) {
    content = <p className="text-muted-foreground mt-12">Loading latest vlogs...</p>;
  } else if (isError && error) {
    content = (
      <>
        <p className="text-red-500 mt-12">Error fetching videos: {error.message}</p>
        <p className="text-xs text-muted-foreground">Could not load ISKM vlogs at this time. Please check your connection or try again later.</p>
      </>
    );
  } else if (!videos || !Array.isArray(videos) || videos.length === 0) {
    content = <p className="text-muted-foreground mt-12">No recent vlogs found. Check back soon!</p>;
  } else {
    content = renderMarqueeContent();
  }

  return (
    <section className="relative flex flex-col space-y-8 py-12 sm:py-16 lg:py-24 w-full px-0 mx-0">
      <div className="absolute inset-0 bg-gradient-to-r from-[#a7417b]/5 via-transparent to-[#a7417b]/5 pointer-events-none dark:from-[#a7417b]/10 dark:via-transparent dark:to-[#a7417b]/10"></div>
      <PulsingDotButton text="Latest ISKM Vlogs" />
      <div className="w-full flex flex-col items-center justify-center px-0 mx-0">
        {content}
      </div>
    </section>
  );
}
