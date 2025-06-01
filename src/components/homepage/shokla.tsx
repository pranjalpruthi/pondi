"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const SHLOKAS: Shloka[] = [
  {
    id: 1,
    title: "BG 18.66",
    sanskrit: "sarva-dharmān parityajya\nmām ekaṁ śaraṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo\nmokṣayiṣyāmi mā śucaḥ",
    translation: "Abandon all varieties of dharma and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    meaning: "The ultimate instruction to surrender completely to divine guidance, promising protection and liberation."
  },
  {
    id: 2,
    title: "BG 2.47",
    sanskrit: "karmaṇy evādhikāras te\nmā phaleṣu kadācana\nmā karma-phala-hetur bhūr\nmā te saṅgo 'stv akarmaṇi",
    translation: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    meaning: "Focus on your duties without attachment to results, performing actions with dedication and detachment."
  },
  {
    id: 3,
    title: "BG 9.34",
    sanskrit: "man-manā bhava mad-bhakto\nmad-yājī māṁ namaskuru\nmām evaiṣyasi yuktvaivam\nātmānaṁ mat-parāyaṇaḥ",
    translation: "Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me.",
    meaning: "By dedicating one's thoughts, devotion, and worship to the Divine, one attains spiritual realization."
  },
  {
    id: 4,
    title: "BG 15.15",
    sanskrit: "sarvasya cāhaṁ hṛdi sanniviṣṭo\nmattaḥ smṛtir jñānam apohanaṁ ca\nvedaiś ca sarvair aham eva vedyo\nvedānta-kṛd veda-vid eva cāham",
    translation: "I am seated in everyone's heart, and from Me come remembrance, knowledge and forgetfulness.",
    meaning: "The Divine dwells within all beings, guiding their consciousness, memory, and understanding."
  }
];

export type Shloka = {
  id: number;
  title: string;
  sanskrit: string;
  translation: string;
  meaning: string;
};

export function ShlokaCard({ shloka, onClick }: { shloka: Shloka; onClick?: () => void }) {
  const emojis = [
    {
      src: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Love%20Letter.webp",
      alt: "Love Letter"
    },
    {
      src: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Dizzy.webp",
      alt: "Dizzy"
    },
    {
      src: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Pill.png",
      alt: "Pill"
    }
  ];

  const emoji = emojis[shloka.id % emojis.length];

  return (
    <motion.div
      className={cn(
        "mx-4 flex items-center gap-2 cursor-pointer",
        "text-base py-3 px-6 rounded-full",
        "dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-800 dark:hover:border-zinc-700",
        "bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 hover:border-zinc-300",
        "transition-all flex items-center gap-3 font-medium shadow-sm"
      )}
      onClick={onClick}
      layoutId={`card-${shloka.id}`}
    >
      <motion.img 
        src={emoji.src}
        alt={emoji.alt}
        width="25" 
        height="25" 
        className="object-contain"
        layoutId={`emoji-${shloka.id}`}
      />
      <motion.span layoutId={`heading-${shloka.id}`}>
        {shloka.title}
      </motion.span>
      <Plus className="size-4" />
    </motion.div>
  );
}

export function ShlokaModal({ shloka, onClose }: { shloka: Shloka | null; onClose: () => void }) {
  if (!shloka) return null;

  const emojis = [
    {
      src: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Love%20Letter.webp",
      alt: "Love Letter"
    },
    {
      src: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Dizzy.webp",
      alt: "Dizzy"
    },
    {
      src: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Pill.png",
      alt: "Pill"
    }
  ];

  const emoji = emojis[shloka.id % emojis.length];

  return (
    <AnimatePresence mode="wait">
      {!!shloka && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="dark:bg-black/40 bg-white/95 backdrop-blur-md 
                dark:border-amber-500/30 border-pink-200 border
                p-4 sm:p-6 md:p-8 max-w-2xl w-full rounded-[30px] relative shadow-xl"
              layoutId={`card-${shloka.id}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{
                layout: { duration: 0.3, ease: "easeOut" },
                scale: { duration: 0.2, ease: "easeOut" },
                opacity: { duration: 0.2, ease: "easeOut" }
              }}
            >
              <div className="flex items-center gap-3">
                <motion.img 
                  src={emoji.src}
                  alt={emoji.alt}
                  width="30" 
                  height="30" 
                  className="object-contain"
                  layoutId={`emoji-${shloka.id}`}
                />
                <motion.h3
                  className="text-2xl font-medium dark:text-amber-200 text-pink-700"
                  layoutId={`heading-${shloka.id}`}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {shloka.title}
                </motion.h3>
              </div>
              <motion.p
                className="dark:text-amber-100/90 text-pink-700 font-medium text-xl mt-6 whitespace-pre-line"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {shloka.sanskrit}
              </motion.p>
              <motion.p 
                className="dark:text-amber-100/90 text-pink-700 font-medium text-base mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                {shloka.translation}
              </motion.p>
              <motion.p 
                className="dark:text-amber-100/90 text-pink-700 font-medium text-sm mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                {shloka.meaning}
              </motion.p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Button 
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 
                    dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white
                    border-pink-200 hover:bg-pink-100 text-pink-700 hover:text-pink-900" 
                  onClick={onClose}
                >
                  <Plus className="rotate-45" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Button({ className, children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 border-2 rounded-full flex items-center justify-center transition-all ${
        className || ""
      }`.trim()}
    >
      {children}
    </button>
  );
}
