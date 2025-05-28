"use client";

import { motion } from 'framer-motion'
// Image component removed - using standard img tag
import { Sparkles } from '@/components/ui/sparkles'
import { useState } from "react";
import { SHLOKAS, ShlokaCard, ShlokaModal, type Shloka } from './shokla'


function SideBySide() {
  const [selectedShloka, setSelectedShloka] = useState<Shloka | null>(null);
  const todayShloka = SHLOKAS[0];

  return (
    <div className="overflow-hidden">
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
          <p className="inline-flex py-1 px-3 rounded-full text-xs font-medium
            dark:bg-zinc-800 bg-zinc-100
            dark:text-zinc-400 text-zinc-600"
          >
            Prescription ID: {todayShloka.title}
          </p>
        </div>
      </article>

      {/* Updated Shloka Cards Section */}
      <div className="mt-20 pb-20">
        <div className="relative w-full overflow-hidden">
          <div className="flex overflow-hidden [--duration:40s] [--gap:1rem]">
            <div className="flex animate-marquee [gap:var(--gap)] items-center">
              {SHLOKAS.map((shloka) => (
                <ShlokaCard
                  key={shloka.id}
                  shloka={shloka}
                  onClick={() => setSelectedShloka(shloka)}
                />
              ))}
            </div>
            <div className="flex animate-marquee [gap:var(--gap)] items-center" aria-hidden="true">
              {SHLOKAS.map((shloka) => (
                <ShlokaCard
                  key={`${shloka.id}-clone`}
                  shloka={shloka}
                  onClick={() => setSelectedShloka(shloka)}
                />
              ))}
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background" />
        </div>
      </div>

      {/* Modal with improved mobile support */}
      <ShlokaModal 
        shloka={selectedShloka} 
        onClose={() => setSelectedShloka(null)} 
      />
    </div>
  )
}

export default SideBySide;
