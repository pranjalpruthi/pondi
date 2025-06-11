import BreathingText from '@/fancy/components/text/breathing-text';

/**
 * @description Renders the initial full-page loader with the application logo and Mahamantra.
 * @returns {JSX.Element} The rendered initial page loader.
 */
export const InitialPageLoader = () => (
  <div className="fixed inset-0 flex flex-col justify-center items-center h-screen w-screen bg-background z-50 text-center p-4">
    <img src="/assets/pondi.webp" alt="ISKM Logo" className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-6 animate-pulse" />
    <div className="text-primary font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
      <BreathingText
        label="Hare Kṛṣṇa Hare Kṛṣṇa"
        fromFontVariationSettings="'wght' 100, 'slnt' 0"
        toFontVariationSettings="'wght' 800, 'slnt' -10"
        staggerDuration={0.05}
        className="block mb-1 sm:mb-2"
      />
      <BreathingText
        label="Kṛṣṇa Kṛṣṇa Hare Hare"
        fromFontVariationSettings="'wght' 100, 'slnt' 0"
        toFontVariationSettings="'wght' 800, 'slnt' -10"
        staggerDuration={0.05}
        staggerFrom="last"
        className="block mb-1 sm:mb-2"
      />
      <BreathingText
        label="Hare Rāma Hare Rāma"
        fromFontVariationSettings="'wght' 100, 'slnt' 0"
        toFontVariationSettings="'wght' 800, 'slnt' -10"
        staggerDuration={0.05}
        className="block mb-1 sm:mb-2"
      />
      <BreathingText
        label="Rāma Rāma Hare Hare"
        fromFontVariationSettings="'wght' 100, 'slnt' 0"
        toFontVariationSettings="'wght' 800, 'slnt' -10"
        staggerDuration={0.05}
        staggerFrom="last"
        className="block"
      />
    </div>
  </div>
);

export default InitialPageLoader;
