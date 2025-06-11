import { createFileRoute } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'motion/react'; // Added AnimatePresence
import { useState, useCallback } from 'react'; // Added React imports
import BreathingText from '@/fancy/components/text/breathing-text';
import AnimatedPathText from '@/fancy/components/text/text-along-path';
import MinimalShop from '../../components/shop/minimal-shop';
import { Button } from '@/components/ui/button'; // Added Button import
import { Input } from '@/components/ui/input'; // Added Input import

export const Route = createFileRoute('/shop/')({
  component: ShopPageWithComingSoonOverlay,
});

function ShopPageWithComingSoonOverlay() {
  const [email, setEmail] = useState("");
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success">("idle");

  const buttonCopy = {
    idle: "Join Waitlist",
    loading: <motion.div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />,
    success: "Joined! ✓",
  } as const;

  const handleSubmit = useCallback(() => {
    if (buttonState === "success" || !email) return;
    setButtonState("loading");
    setTimeout(() => {
      setButtonState("success");
      console.log("Waitlist joined with email:", email);
    }, 1750);
    setTimeout(() => {
      setButtonState("idle");
      setEmail("");
    }, 3500);
  }, [buttonState, email]);

  // Paths and texts for the background animation, inspired by the new snippet
  const paths = [
    "M1 248C214 -47 582 158 679 -39",
    "M1 208C214 -87 582 118 679 -79",
    "M1 168C214 -127 582 78 679 -119",
    "M1 128C214 -167 582 38 679 -159",
  ];

  const texts = [
    "Hare Kṛṣṇa • Hare Kṛṣṇa • Kṛṣṇa Kṛṣṇa • Hare Hare • Hare Rāma • Hare Rāma • Rāma Rāma • Hare Hare • ",
    "Chant and Be Happy • Chant and Be Happy • Chant and Be Happy • Chant and Be Happy • Chant and Be Happy • ",
    "Hare Kṛṣṇa • Hare Kṛṣṇa • Kṛṣṇa Kṛṣṇa • Hare Hare • Hare Rāma • Hare Rāma • Rāma Rāma • Hare Hare • ",
    "Books are the Basis • Books are the Basis • Books are the Basis • Books are the Basis • Books are the Basis • ",
  ];

  return (
    <div className="relative w-screen h-screen min-h-screen overflow-hidden">
      {/* Render the actual shop page in the background */}
      <div className="absolute inset-0 z-0">
        <MinimalShop />
      </div>

      {/* "Coming Soon" Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-lg" // Darker blur
      >
        {/* New animated background using multiple paths */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden pointer-events-none">
          {paths.map((path, i) => (
            <AnimatedPathText
              key={`auto-path-${i}`}
              path={path}
              pathId={`auto-path-${i}`}
              svgClassName="w-full h-full"
              viewBox="0 0 680 250"
              preserveAspectRatio="xMidYMid slice" // Slice will ensure it covers the area
              text={texts[i % texts.length]}
              textClassName="text-[24px] font-serif font-medium fill-yellow-200/10 dark:fill-yellow-300/10" // Very subtle text
              duration={30 + i * 15} // Staggered and slow duration
              textAnchor="start"
            />
          ))}
        </div>

        {/* Central Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 bg-white/5 dark:bg-black/10 backdrop-blur-xl rounded-2xl shadow-2xl text-center max-w-lg w-full z-20"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-200 dark:text-yellow-300 mb-3 sm:mb-4">
            Temple Shop
          </h1>

          <div className="my-4 sm:my-6 text-2xl sm:text-3xl md:text-4xl text-orange-200 dark:text-amber-200">
            <BreathingText
              label="Gifts for the Soul"
              fromFontVariationSettings="'wght' 200, 'slnt' 0"
              toFontVariationSettings="'wght' 700, 'slnt' -5"
              staggerDuration={0.08}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="block"
            />
          </div>

          <p className="text-lg sm:text-xl text-yellow-100 dark:text-yellow-200 mb-4 sm:mb-6">
            Unveiling Soon...
          </p>
          
          <div className="w-full max-w-sm space-y-3 sm:space-y-4 my-4">
            <Input
              type="email"
              placeholder="Enter your email to get notified"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-black/50 border-yellow-400/50 dark:border-yellow-500/50 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-yellow-500 focus:ring-yellow-500/50 rounded-lg"
              disabled={buttonState === "loading" || buttonState === "success"}
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={buttonState === "loading" || buttonState === "success" || !email}
              className="w-full h-10 sm:h-11 bg-yellow-400 hover:bg-yellow-500 dark:bg-amber-400 dark:hover:bg-amber-500 text-yellow-900 dark:text-amber-900 font-semibold rounded-lg transition-colors text-sm sm:text-base"
              variant="default"
              size="default"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  key={buttonState}
                >
                  {buttonCopy[buttonState]}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>

          <p className="text-xs text-gray-300 dark:text-gray-400 mt-3 sm:mt-4">
            Be the first to know when we launch!
          </p>
        </motion.div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 dark:text-gray-500 z-20">
          Hare Kṛṣṇa! The spiritual marketplace is coming soon.
        </div>
      </motion.div>
    </div>
  );
}
