import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronUp, ChevronDown, Play, WifiOff, Youtube, Heart, Share2 } from 'lucide-react';
// import ReactPlayer from 'react-player/youtube'; // Removed ReactPlayer
import {
  YOUTUBE_CHANNEL_ID,
  fetchYouTubeRssFeed
} from './youtube-marquee';
import type { YouTubeVideo } from './youtube-marquee';
import { cn } from '@/lib/utils';
// import { AspectRatio } from '@/components/ui/aspect-ratio'; // Removed AspectRatio

const getYouTubeEmbedUrl = (url: string, autoplay: boolean, muted: boolean): string | null => {
  if (!url) return null;
  let videoId = '';
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  // Enable JS API for event handling, use modest branding, disable related videos, set initial mute state
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=1&modestbranding=1&rel=0&enablejsapi=1&mute=${muted ? 1 : 0}` : null;
};

const ClipPlayerCard = ({ video, isActive, paginate, currentIndex, totalVideos, isDragging }: { video: YouTubeVideo; isActive: boolean; paginate: (dir: number) => void; currentIndex: number; totalVideos: number; isDragging?: boolean; }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null); // Changed playerRef to iframeRef
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(isActive);
  // const [played, setPlayed] = useState(0); // Removed for native controls
  // const [seeking, setSeeking] = useState(false); // Removed for native controls
  // const [duration, setDuration] = useState(0); // Removed for native controls
  const [muted] = useState(true); // Initial state is muted
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [liked, setLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleFullDescription = () => {
    setShowFullDescription(prev => !prev);
    resetControlsTimeout(); // Keep controls visible when interacting
  };

  useEffect(() => {
    setPlaying(isActive);
    if (isActive) {
      // setPlayed(0); // Removed for native controls
      // if (iframeRef.current) iframeRef.current.src = getYouTubeEmbedUrl(video.link, true, muted) || ''; // Potentially reload iframe to autoplay
      resetControlsTimeout();
    } else {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (iframeRef.current && iframeRef.current.contentWindow) { // Pause video if iframe API is used and it's not active
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
  }, [isActive, video.link, muted]); // Added muted to dependency array

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false); // This might need adjustment based on how 'playing' is determined with iframe
    }, 3000);
  };

  const handlePlayPause = () => { // This custom button might be redundant if YouTube controls are used
    setPlaying(prev => !prev);
    // If using iframe API to control play/pause:
    // if (iframeRef.current && iframeRef.current.contentWindow) {
    //   const command = playing ? 'pauseVideo' : 'playVideo';
    //   iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, '*');
    // }
    resetControlsTimeout();
  };

  // handleSeekChange, handleSeekMouseDown, handleSeekMouseUp, handleProgress, handleDuration, handleSeekAmount are removed
  // as we rely on YouTube's native controls.

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Double tap to seek is a native YouTube player feature, so custom implementation might not be needed.
    // If custom overlay controls are absolutely necessary, this can be re-evaluated.
    // For now, a single tap might toggle play/pause if we implement it via iframe API.
    if (e.detail === 1) {
      // Potentially toggle play/pause if custom controls are desired over YouTube's default.
      // handlePlayPause();
    }
  };


  // const handleEnded = () => { // This needs to be handled by YouTube Iframe API event listener
  //   if (currentIndex < totalVideos - 1) {
  //     paginate(1);
  //   } else {
  //     setPlaying(false);
  //   }
  // };

  useEffect(() => {
    const player = iframeRef.current;
    if (!player) return;

    const onPlayerStateChange = (event: MessageEvent) => {
      // Ensure the message is from YouTube and is a player state change
      if (event.source !== player.contentWindow || typeof event.data !== 'string') {
        return;
      }
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange') {
          if (data.info === 0) { // 0 indicates video ended
            if (currentIndex < totalVideos - 1) {
              paginate(1);
            } else {
              setPlaying(false); // Or loop, or show end screen
            }
          } else if (data.info === 1) { // Playing
            setPlaying(true);
            resetControlsTimeout();
          } else if (data.info === 2) { // Paused
            setPlaying(false);
            resetControlsTimeout(); // Keep controls visible when paused
          }
        }
      } catch (e) {
        // console.error('Error parsing YouTube message:', e);
      }
    };

    window.addEventListener('message', onPlayerStateChange);
    return () => {
      window.removeEventListener('message', onPlayerStateChange);
    };
  }, [currentIndex, totalVideos, paginate]);


  const handleShare = () => {
    if (!video.link) return;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: video.link,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(video.link);
      alert('Link copied to clipboard!');
    }
  };

  // const formatTime = (seconds: number) => {
  //   if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  //   const date = new Date(seconds * 1000);
  //   const hh = date.getUTCHours();
  //   const mm = date.getUTCMinutes();
  //   const ss = date.getUTCSeconds().toString().padStart(2, '0');
  //   if (hh) {
  //     return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  //   }
  //   return `${mm}:${ss}`;
  // };

  return (
    <motion.div
      ref={playerWrapperRef}
      className={cn("w-full h-full flex bg-black")} // Removed absolute, inset-0, overflow-hidden. Adjusted fullscreen.
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={resetControlsTimeout}
    >
      <div className='w-full h-full relative flex items-center justify-center' onClick={handleTap}>
        {isActive && video.link ? (
          <div className="w-full h-full flex items-center justify-center"> {/* Removed max-w-7xl and px-6 for iframe to take full space */}
            <iframe
              ref={iframeRef}
              src={getYouTubeEmbedUrl(video.link, playing, muted) || ''}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full" // Ensure iframe takes full space of its container
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
              onLoad={() => {
                // Optional: Send 'playVideo' command if isActive and playing is true,
                // though autoplay in URL should handle it.
                // if (playing && iframeRef.current && iframeRef.current.contentWindow) {
                //   iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                // }
              }}
            />
          </div>
        ) : (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
        )}

        {/* Overlay for title, description, and custom controls if any are kept */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
        </div>

        {/* Play button overlay (shown when not playing, if YouTube controls are hidden or supplemented) */}
        {/* This might be redundant if YouTube's own play button is visible and sufficient */}
        <AnimatePresence>
          {!playing && isActive && ( // Only show if supposed to be active but not playing (e.g. initial load before autoplay or after pause)
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 cursor-pointer shadow-xl" onClick={handlePlayPause}> {/* Make clickable if it's a custom play, added shadow and blur */}
                <Play size={64} className="text-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom controls (volume, fullscreen) - YouTube's native controls will provide these. */}
        {/* If we want to keep these custom buttons, they need to interact with the iframe API. */}
        <AnimatePresence>
          {showControls && isActive && ( // Only show if active
            <motion.div
              className="absolute top-4 right-4 flex items-center gap-4 pointer-events-auto" // Ensure pointer-events-auto for buttons
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Mute and Fullscreen buttons removed as per requirement */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video title and description overlay - MOVED TO TOP */}
        <div className="absolute top-0 left-0 right-0 p-4 text-white pointer-events-auto z-10"> {/* pointer-events-auto for button */}
          <div className="flex items-start justify-end"> {/* Adjusted to justify-end as title is removed */}
            {/* <h3 className="text-lg font-bold line-clamp-2 mr-2 flex-grow">{video.title}</h3> Removed title */}
            <button
              onClick={toggleFullDescription}
              className="p-1 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
              aria-label={showFullDescription ? "Hide description" : "Show description"}
            >
              {showFullDescription ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          <AnimatePresence>
            {showFullDescription && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-sm leading-relaxed">{video.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Seek bar and time displays are removed as YouTube's native controls will provide them. */}
          {/* Custom play/pause and seek buttons are removed. */}
        </div>
      </div>

      {/* Side action buttons (Like, Share, Subscribe) */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center space-y-3 pr-2 pointer-events-auto">
        <button onClick={() => setLiked(!liked)} className="flex flex-col items-center text-white">
          <Heart size={24} className={cn("transition-colors", liked ? "text-red-500 fill-red-500" : "text-white")} />
          <span className="text-xs font-semibold mt-1">Like</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center text-white">
          <Share2 size={24} />
          <span className="text-xs font-semibold mt-1">Share</span>
        </button>
        <button onClick={() => window.open('https://www.youtube.com/channel/' + YOUTUBE_CHANNEL_ID + '?sub_confirmation=1', '_blank')} className="flex flex-col items-center text-white">
          <Youtube size={24} />
          <span className="text-xs font-semibold mt-1">Subscribe</span>
        </button>
      </div>
    </motion.div>
  );
};

// Skeleton loader for the clip card
const ClipPlayerCardSkeleton = () => (
  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden animate-pulse">
    <div className="w-full h-full bg-gray-800/50" />
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

export function ClipsPanel({ currentIndex, setCurrentIndex }: { currentIndex: number; setCurrentIndex: (index: number | ((prevIndex: number) => number)) => void; }) {
  const { data: videos, isLoading, error: queryError, isError, refetch } = useQuery<YouTubeVideo[], Error>({
    queryKey: ['youtubeClipsPanelVideos', YOUTUBE_CHANNEL_ID],
    queryFn: fetchYouTubeRssFeed,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // const [currentIndex, setCurrentIndex] = useState(0); // Managed by parent
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const paginate = (newDirection: number) => {
    if (!videos || videos.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return 0;
      if (nextIndex >= videos.length) return videos.length - 1;
      return nextIndex;
    });
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 30;
    const { offset, velocity } = info;

    if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > 200) {
      paginate(offset.y < 0 ? 1 : -1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') paginate(-1);
      else if (event.key === 'ArrowDown') paginate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videos, currentIndex]);

  if (isLoading) {
    return <div className="relative w-full h-full bg-black"><ClipPlayerCardSkeleton /></div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-black p-6 space-y-4">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute -inset-1 bg-red-500/30 rounded-full blur-xl animate-pulse-glow" />
          <WifiOff size={48} className="text-red-400 z-10" />
        </div>
        <p className="font-semibold text-lg text-red-300">A Humble Apology</p>
        <p className="text-sm text-gray-400 max-w-xs">
          {queryError?.message.includes('404')
            ? "My dear devotee, it seems we couldn't find the nectar of these video clips. The channel may be private, or perhaps there's a mistake in the sacred link."
            : "Hare Kṛṣṇa. We're facing some disturbance in the ether, which is preventing us from loading the videos. Please check your connection to the material world (the internet)."
          }
        </p>
        <p className="text-xs text-gray-500 mt-4">🌹 All Glories 🌟 to Śrīla Prabhupāda! 🙏</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2.5 bg-gradient-to-br from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600 text-white font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-black p-6 space-y-4">
        <Youtube size={48} className="text-gray-600" />
        <p className="font-semibold text-lg text-gray-400">The Well is Dry</p>
        <p className="text-sm text-gray-500 max-w-xs">
          It appears this channel is awaiting the sweet downpour of Kṛṣṇa's pastimes. No videos have been posted yet. Please check back later for transcendental nectar.
        </p>
        <p className="text-xs text-gray-500 mt-4">🌹 All Glories 🌟 to Śrīla Prabhupāda! 🙏</p>
      </div>
    );
  }

  const variants = {
    enter: (direction: number) => ({ y: direction > 0 ? "100%" : "-100%", opacity: 0, scale: 0.8 }),
    center: { zIndex: 1, y: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ zIndex: 0, y: direction < 0 ? "100%" : "-100%", opacity: 0, scale: 0.8 }),
  };

  return (
    <div className="relative w-full h-full bg-black overflow-visible cursor-grab active:cursor-grabbing flex flex-col">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="y"
          dragConstraints={{ top: -100, bottom: 100 }}
          dragElastic={0.5}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          transition={{ y: { type: "spring", stiffness: 260, damping: 20, mass: 0.8 }, opacity: { duration: 0.2 }, scale: { duration: 0.2 } }}
          className="w-full h-full absolute top-0 left-0"
        >
          <ClipPlayerCard
            video={videos[currentIndex]}
            isActive={true}
            paginate={paginate}
            currentIndex={currentIndex}
            totalVideos={videos.length}
            isDragging={isDragging}
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute top-2 right-2 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {videos.length}
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4">
        <motion.button 
          onClick={() => paginate(-1)} 
          className="text-white bg-black/70 p-3 rounded-full pointer-events-auto hover:bg-black/90 transition-all" 
          disabled={currentIndex === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={28} className={currentIndex === 0 ? "text-gray-500" : "text-white"} />
        </motion.button>
        <motion.button 
          onClick={() => paginate(1)} 
          className="text-white bg-black/70 p-3 rounded-full pointer-events-auto hover:bg-black/90 transition-all" 
          disabled={currentIndex === videos.length - 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown size={28} className={currentIndex === videos.length - 1 ? "text-gray-500" : "text-white"} />
        </motion.button>
      </div>
    </div>
  );
}
