"use client";

import { motion } from 'framer-motion'
// Image component removed - using standard img tag
import { Sparkles } from '@/components/ui/sparkles'
import { useState } from "react";
import { useIsMobile } from '@/hooks/use-mobile';
import { SHLOKAS, ShlokaCard, ShlokaModal, type Shloka } from './shokla'
import { useQuery } from '@tanstack/react-query';
import { getShlokas } from '@/integrations/nocodb-api';


function SideBySide() {
  const [selectedShloka, setSelectedShloka] = useState<Shloka | null>(null);
  const [showAllShlokas, setShowAllShlokas] = useState(false);
  const [showBhagavadGitaPreview, setShowBhagavadGitaPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  // Fetch shlokas from NocoDB
  const { data: allShlokas = [] } = useQuery({
    queryKey: ['shlokas'],
    queryFn: async () => {
      const response = await getShlokas();
      return response.list.map((item: any) => ({
        id: item.Id,
        title: item['Shloka Number'],
        sanskrit: item.Sanskrit,
        translation: item.Translation,
        synonyms: item.Synonyms || ''
      }));
    },
    staleTime: 60 * 1000 * 5, // Cache for 5 minutes
  });

  // Filter Shlokas based on search query
  const shlokas = searchQuery 
    ? allShlokas.filter((shloka: Shloka) => 
        shloka.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        shloka.sanskrit.toLowerCase().includes(searchQuery.toLowerCase()) || 
        shloka.translation.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : allShlokas;
  
  // Select a random shloka based on the current day
  const getDailyShloka = () => {
    if (shlokas.length === 0) {
      return SHLOKAS[0]; // Fallback if no data is loaded
    }
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % shlokas.length;
    return shlokas[index];
  };
  
  const todayShloka = getDailyShloka();

  return (
    <div className="overflow-hidden select-none">
      <div className="relative h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        {/* Background Gradient - Updated for light/dark mode */}
        <div className="absolute inset-0 before:absolute before:inset-0 
          before:bg-[radial-gradient(circle_at_bottom_center,#FFD700,transparent_90%)] 
          before:opacity-100 after:absolute after:border-2 after:-left-1/2 
          after:top-1/2 after:aspect-[1/1.8] after:w-[200%] after:rounded-[50%] 
          after:border-b after:border-[#FFD70066] 
          dark:after:bg-zinc-900 after:bg-zinc-100/80">
          {/* Grid Pattern - Updated for light/dark mode */}
          <div className="absolute inset-0 
            dark:bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)]
            bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)]
            bg-[size:70px_80px]" />
          
          {/* Sparkles Effect */}
          <Sparkles
            color="#FFD700"
            className="absolute inset-x-0 top-0 h-full w-full z-10"
          />
        </div>
      </div>

      {/* Logo Container */}
      <div className="mx-auto -mt-64 w-full max-w-3xl relative z-10">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg border border-amber-500/30 p-6 w-32 h-32 mx-auto grid place-content-center rounded-full
          before:absolute before:inset-0 before:rounded-full before:bg-[#FF69B4]/30 before:blur-2xl before:animate-pulse"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative w-24 h-24">
            <img
              src="/assets/iskm-d.svg"
              alt="ISKM Logo"
              width={120}
              height={120}
              className="object-contain drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>

      {/* Featured Shloka */}
      <article className="text-center pt-6 w-4/5 md:w-2/3 mx-auto relative z-10 space-y-6">
        <div className="space-y-4">
          <div className="inline-flex flex-col items-center gap-2">
            <h1 className="text-4xl font-semibold py-2 px-6 rounded-full 
              bg-gradient-to-r dark:from-amber-500/10 dark:to-amber-300/10 from-pink-500/10 to-indigo-500/10
              dark:text-amber-300 text-pink-600"
            >
              Take Your Daily Shloka Pill
            </h1>
            <div className="flex items-center gap-2 text-lg">
              <span className="py-1 px-4 rounded-full font-medium
                dark:bg-amber-400/10 bg-pink-500/10
                dark:text-amber-300 text-pink-600"
              >
                A Shloka Pill A Day
              </span>
              <span className="py-1 px-4 rounded-full font-medium
                dark:bg-amber-300/10 bg-indigo-500/10
                dark:text-amber-200 text-indigo-600"
              >
                Keeps Maya Away
              </span>
            </div>
          </div>
        </div>

        {/* Today's Prescription */}
        <div className="space-y-4 mt-12">
          <p className="inline-flex py-1 px-4 rounded-full text-sm font-medium
            dark:bg-amber-400/10 bg-pink-500/10
            dark:text-amber-300 text-pink-600"
          >
            Today's Prescribed Shloka
          </p>
          <p className="text-xl font-medium dark:text-amber-200/90 text-amber-700">
            {todayShloka.sanskrit}
          </p>
          <p className="text-lg dark:text-muted-foreground text-zinc-700 italic">
            {todayShloka.translation}
          </p>
            <div className="flex justify-center gap-2">
            <p className="inline-flex py-1 px-3 rounded-full text-xs font-medium
              dark:bg-zinc-800 bg-zinc-100
              dark:text-zinc-400 text-zinc-600"
            >
              Prescription ID: {todayShloka.title}
            </p>
            <button
              className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-amber-500/30 hover:bg-amber-500/40 dark:bg-amber-400/20 dark:hover:bg-amber-400/30 text-amber-900 dark:text-amber-200 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(`Shloka of the Day (${todayShloka.title}):\n${todayShloka.sanskrit}\n\nTranslation: ${todayShloka.translation}`);
                alert('Shloka copied to clipboard!');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy Shloka
            </button>
            <button
              className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-[#1877F2]/30 hover:bg-[#1877F2]/40 dark:bg-[#1877F2]/20 dark:hover:bg-[#1877F2]/30 text-[#1877F2] dark:text-[#1877F2] cursor-pointer"
              onClick={() => {
                const text = `Shloka of the Day (${todayShloka.title}):\n${todayShloka.sanskrit}\n\nTranslation: ${todayShloka.translation}\n\nCitation: Bhagavad Gita\n\nVisit ISKM Pondicherry: https://pudhuvai.vrindavanam.org.in/\nFollow us on Instagram: https://instagram.com/iskm_pondy\nFollow us on Facebook: https://facebook.com/iskm.pondy\nSubscribe on YouTube: https://www.youtube.com/@ISKMPondy`;
                navigator.clipboard.writeText(text);
                alert('Shloka content copied to clipboard! Paste it into the Facebook post.');
                window.open(`https://www.facebook.com/sharer/sharer.php?u=`, '_blank');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Share on Facebook
            </button>
              <button
                className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-[#1DA1F2]/30 hover:bg-[#1DA1F2]/40 dark:bg-[#1DA1F2]/20 dark:hover:bg-[#1DA1F2]/30 text-[#1DA1F2] dark:text-[#1DA1F2] cursor-pointer"
                onClick={() => window.open(`https://x.com/intent/tweet?text=Shloka%20of%20the%20Day%20(${encodeURIComponent(todayShloka.title)}):%0A${encodeURIComponent(todayShloka.sanskrit)}%0A%0ATranslation:%20${encodeURIComponent(todayShloka.translation)}%0A%0ACitation:%20Bhagavad%20Gita%0A%0AVisit%20ISKM%20Pondicherry:%20https://pudhuvai.vrindavanam.org.in/%0AFollow%20us:%20https://instagram.com/iskm_pondy%0Ahttps://facebook.com/iskm.pondy%0Ahttps://www.youtube.com/@ISKMPondy&via=iskm_sg`, '_blank')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                Share on X
              </button>
            <button
              className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-[#E1306C]/30 hover:bg-[#E1306C]/40 dark:bg-[#E1306C]/20 dark:hover:bg-[#E1306C]/30 text-[#E1306C] dark:text-[#E1306C] cursor-pointer"
              onClick={() => window.open(`https://www.instagram.com/iskm_pondy/`, '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              Follow on Instagram
            </button>
          </div>
        </div>
      </article>

      {/* Updated Shloka Cards Section with Single Lane */}
      <div className="mt-20 pb-0">
        <div className="relative w-full overflow-hidden">
          <div className="flex overflow-hidden [--duration:40s] [--gap:1rem]">
            {/* Single Lane for better performance */}
            <div className="flex animate-marquee [animation-direction:reverse] [gap:var(--gap)] items-center">
              {shlokas.slice(0, Math.min(10, shlokas.length)).map((shloka: Shloka) => (
                <motion.div
                  key={shloka.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <ShlokaCard
                    shloka={shloka}
                    onClick={() => setSelectedShloka(shloka)}
                  />
                </motion.div>
              ))}
              {shlokas.slice(0, Math.min(10, shlokas.length)).map((shloka: Shloka) => (
                <motion.div
                  key={`${shloka.id}-clone`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <ShlokaCard
                    shloka={shloka}
                    onClick={() => setSelectedShloka(shloka)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background" />
        </div>
        <div className="text-center mt-6 flex flex-wrap justify-center gap-4">
          <button
            className="inline-flex py-2 px-4 rounded-full text-sm font-medium bg-amber-500/30 hover:bg-amber-500/40 dark:bg-amber-400/20 dark:hover:bg-amber-400/30 text-amber-900 dark:text-amber-200 cursor-pointer"
            onClick={() => setShowAllShlokas(true)}
          >
            View All 108 Shlokas
          </button>
          <motion.button
            className="inline-flex py-2 px-4 rounded-full text-sm font-medium bg-red-500/30 hover:bg-red-500/40 dark:bg-red-400/20 dark:hover:bg-red-400/30 text-red-900 dark:text-red-200 cursor-pointer"
            onClick={() => setShowBhagavadGitaPreview(true)}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Preview Sholka PDF
          </motion.button>
        </div>
      </div>

      {/* Modal for displaying all Shlokas */}
      {showAllShlokas && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-1000 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            className="bg-[rgba(255,250,240,0.95)] dark:bg-[rgba(40,35,20,0.9)] backdrop-blur-xl rounded-2xl max-w-[90vw] w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col relative z-1000"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="sticky top-0 bg-[rgba(255,255,250,0.98)] dark:bg-[rgba(45,40,25,0.95)] backdrop-blur-sm z-10 p-4 border-b border-amber-700/20 dark:border-amber-500/20 flex justify-between items-center rounded-t-xl">
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-300">All Shlokas (108)</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search Shlokas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 rounded-md border border-amber-700/20 dark:border-amber-500/20 bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(35,30,15,0.5)] text-amber-900 dark:text-amber-300 placeholder:text-amber-700/50 dark:placeholder:text-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-700/50 dark:focus:ring-amber-500/50 w-48 md:w-64 text-lg"
                />
                <button
                  className="text-amber-900 hover:text-amber-700 dark:text-amber-300 dark:hover:text-amber-200 cursor-pointer text-2xl"
                  onClick={() => setShowAllShlokas(false)}
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="py-4 grid grid-cols-1 gap-6">
              {shlokas.map((shloka: Shloka) => (
                <div key={shloka.id} className="border-b border-amber-700/20 dark:border-amber-500/20 pb-4">
                  <p className="text-xl font-semibold text-amber-800 dark:text-amber-200">{shloka.title}</p>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{shloka.sanskrit}</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-200 italic">{shloka.translation}</p>
                  <div className="flex justify-start gap-2 mt-2 flex-wrap">
                    <button
                      className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-amber-500/30 hover:bg-amber-500/40 dark:bg-amber-400/20 dark:hover:bg-amber-400/30 text-amber-900 dark:text-amber-200 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(`Shloka (${shloka.title}):\n${shloka.sanskrit}\n\nTranslation: ${shloka.translation}`);
                        alert('Shloka copied to clipboard!');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      Copy Shloka
                    </button>
                    <button
                      className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-[#1877F2]/30 hover:bg-[#1877F2]/40 dark:bg-[#1877F2]/20 dark:hover:bg-[#1877F2]/30 text-[#1877F2] dark:text-[#1877F2] cursor-pointer"
                      onClick={() => {
                        const text = `Shloka (${shloka.title}):\n${shloka.sanskrit}\n\nTranslation: ${shloka.translation}\n\nCitation: Bhagavad Gita\n\nVisit ISKM Pondicherry: https://pudhuvai.vrindavanam.org.in/\nFollow us on Instagram: https://instagram.com/iskm_pondy\nFollow us on Facebook: https://facebook.com/iskm.pondy\nSubscribe on YouTube: https://www.youtube.com/@ISKMPondy`;
                        navigator.clipboard.writeText(text);
                        alert('Shloka content copied to clipboard! Paste it into the Facebook post.');
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=`, '_blank');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      Share on Facebook
                    </button>
                      <button
                        className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-[#1DA1F2]/30 hover:bg-[#1DA1F2]/40 dark:bg-[#1DA1F2]/20 dark:hover:bg-[#1DA1F2]/30 text-[#1DA1F2] dark:text-[#1DA1F2] cursor-pointer"
                        onClick={() => window.open(`https://x.com/intent/tweet?text=Shloka%20(${encodeURIComponent(shloka.title)}):%0A${encodeURIComponent(shloka.sanskrit)}%0A%0ATranslation:%20${encodeURIComponent(shloka.translation)}%0A%0ACitation:%20Bhagavad%20Gita%0A%0AVisit%20ISKM%20Pondicherry:%20https://pudhuvai.vrindavanam.org.in/%0AFollow%20us:%20https://instagram.com/iskm_pondy%0Ahttps://facebook.com/iskm.pondy%0Ahttps://www.youtube.com/@ISKMPondy&via=iskm_sg`, '_blank')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                        Share on X
                      </button>
                    <button
                      className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium bg-[#E1306C]/30 hover:bg-[#E1306C]/40 dark:bg-[#E1306C]/20 dark:hover:bg-[#E1306C]/30 text-[#E1306C] dark:text-[#E1306C] cursor-pointer"
                      onClick={() => window.open(`https://www.instagram.com/iskm_pondy/`, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      Follow on Instagram
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-[rgba(255,235,205,0.9)] dark:bg-[rgba(50,40,25,0.9)] backdrop-blur-sm z-10 p-4 border-t border-amber-700/20 dark:border-amber-500/20 flex justify-start rounded-b-xl">
              <button
                className="inline-flex py-2 px-4 rounded-full text-sm font-medium bg-amber-700/20 hover:bg-amber-700/30 dark:bg-amber-400/10 dark:hover:bg-amber-400/20 text-amber-900 dark:text-amber-300 cursor-pointer"
                onClick={() => setShowAllShlokas(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal for displaying Bhagavad Gita PDF Preview */}
      {showBhagavadGitaPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-1000 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            className="bg-background rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col relative z-1000 before:absolute before:inset-0 before:rounded-lg before:bg-[#FF69B4]/30 before:blur-2xl before:animate-pulse"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b border-blue-500/20 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-300">Bhagavad Gita Important Sholka's</h2>
              <button
                className="text-blue-300 hover:text-blue-200 cursor-pointer text-2xl"
                onClick={() => setShowBhagavadGitaPreview(false)}
              >
                &times;
              </button>
            </div>
            <div className="py-4 flex-grow relative overflow-auto h-[70vh]">
              {isMobile ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-blue-200 text-center">For mobile devices, please download the PDF to view it.</p>
                  <a href="/assets/books/108BG.pdf" download="Bhagavad_Gita_108.pdf">
                    <motion.button
                      className="inline-flex py-2 px-4 rounded-full text-sm font-medium bg-red-500/30 hover:bg-red-500/40 dark:bg-red-400/20 dark:hover:bg-red-400/30 text-red-900 dark:text-red-200 cursor-pointer"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Download 108 Sholka's PDF
                    </motion.button>
                  </a>
                </div>
              ) : (
                <iframe
                  src="/assets/books/108BG.pdf"
                  style={{ height: '100%', width: '100%', border: 'none' }}
                  title="Bhagavad Gita PDF Preview"
                  allowFullScreen
                />
              )}
            </div>
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-t border-blue-500/20 text-left">
              <button
                className="inline-flex py-2 px-4 rounded-full text-sm font-medium bg-blue-400/10 hover:bg-blue-400/20 text-blue-300 cursor-pointer"
                onClick={() => setShowBhagavadGitaPreview(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal with improved mobile support */}
      <ShlokaModal 
        shloka={selectedShloka} 
        onClose={() => setSelectedShloka(null)} 
      />
    </div>
  )
}

export default SideBySide;
