import React, { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'; // Changed from motion/react
import { useMediaQuery } from '@uidotdev/usehooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListTree, X, Play, Pause } from 'lucide-react'; // Added Play and Pause icons
import { AuroraBackground } from '@/components/ui/aurora-background';
import { AuroraText } from '@/components/magicui/aurora-text';
import { cn } from '@/lib/utils';
import { Marquee } from '@/components/magicui/marquee'; // Import Marquee component

interface SpiritualMaster {
  id: number;
  name: string;
  mainSummary: string;
  additionalNotes?: string[];
  cardSummary?: string;
}

interface Verse {
  title?: string;
  reference: string;
  transliteration: string[];
  translation: string;
}

const spiritualMasters: SpiritualMaster[] = [
  { id: 1, name: "Śrī Kṛṣṇa", mainSummary: "The Supreme Personality of Godhead, original speaker of the Bhagavad-gītā." },
  { id: 2, name: "Lord Brahmā", mainSummary: "Caturmukha Brahmā — the four-headed creator god, first recipient of Vedic knowledge from Kṛṣṇa." },
  { id: 3, name: "Devarṣi Nārada", mainSummary: "The divine sage, son of Brahmā, famed for spreading devotional service." },
  { id: 4, name: "Śrīla Vyāsa", mainSummary: "Kṛṣṇa Dvaipāyana Vyāsa — empowered compiler of the Vedas, Purāṇas, Mahābhārata, and Śrīmad-Bhāgavatam." },
  { id: 5, name: "Śrīla Madhvācārya", mainSummary: "Also known as Pūrṇaprajña Tīrtha — re-established pure dualist philosophy and founded the Brahma-Madhva Sampradāya." },
  { id: 6, name: "Śrīla Padmanābha Tīrtha", mainSummary: "Chief disciple and successor of Śrī Madhvācārya." },
  { id: 7, name: "Śrīla Nṛhari Tīrtha", mainSummary: "Prominent disciple in the line of Śrī Madhvācārya." },
  { id: 8, name: "Śrīla Mādhava Tīrtha", mainSummary: "Disciple of Śrī Nṛhari Tīrtha, notable successor in the Madhva line." },
  { id: 9, name: "Śrīla Akṣobhya Tīrtha", mainSummary: "A great paramahaṁsa, disciple of Śrī Mādhava Tīrtha." },
  { id: 10, name: "Śrīla Jaya Tīrtha", mainSummary: "Distinguished disciple of Śrī Akṣobhya Tīrtha, known for his commentaries on Madhva’s works." },
  { id: 11, name: "Śrīla Jñānasindhu Tīrtha", mainSummary: "Disciple of Śrī Jaya Tīrtha, known for deep knowledge of devotional service." },
  { id: 12, name: "Śrīla Dayānidhi Tīrtha", mainSummary: "Successor to Śrī Jñānasindhu Tīrtha, embodying compassion and wisdom." },
  { id: 13, name: "Śrīla Vidyānidhi", mainSummary: "Also known as Vidyādhirāja Tīrtha — profound scholar and disciple of Śrī Dayānidhi Tīrtha." },
  { id: 14, name: "Śrīla Rājendra Tīrtha", mainSummary: "Disciple of Śrī Vidyānidhi, upholding Vaiṣṇava philosophical traditions." },
  { id: 15, name: "Śrīla Jayadharma", mainSummary: "Also known as Vijayadhvaja Tīrtha — exemplified steadfast dharma and guru-sevā." },
  { id: 16, name: "Śrīla Puruṣottama Tīrtha", mainSummary: "Prominent sannyāsī disciple of Śrī Jayadharma." },
  { id: 17, name: "Śrīla Brahmaṇya Tīrtha", mainSummary: "Also known as Subrahmanya Tīrtha — chief disciple of Śrī Puruṣottama Tīrtha." },
  { id: 18, name: "Śrīla Vyāsa Tīrtha", mainSummary: "Also called Vyāsa Rāya — great scholar-saint, disciple of Śrī Brahmaṇya Tīrtha." },
  { id: 19, name: "Śrīla Lakṣmīpati Tīrtha", mainSummary: "Disciple of Śrī Vyāsa Tīrtha." },
  { id: 20, name: "Śrīla Mādhavendra Purī Gosvāmī", mainSummary: "Root of the Gauḍīya lineage, introduced rāgānuga-bhakti (spontaneous devotional love)." },
  {
    id: 21,
    name: "Śrīla Īśvara Purī (Nityānanda, Advaita)",
    mainSummary: "Dīkṣā-guru of Śrī Caitanya Mahāprabhu, whose devotion opened the Lord’s heart to accept initiation.",
    additionalNotes: [
      "His humility and pure devotion deeply touched Śrī Caitanya, enabling Mahāprabhu's saṅkīrtana mission.",
      "Śrīla Nityānanda Prabhu and Śrī Advaita Ācārya, though not direct disciples, served together as empowered associates in the Lord’s pastimes.",
      "The Guru-paramparā song names Īśvara Purī directly and honors Nityānanda and Advaita in praise of Mahāprabhu’s advent and mission."
    ]
  },
  { id: 22, name: "Śrī Caitanya Mahāprabhu", mainSummary: "The Golden Avatāra who inaugurated saṅkīrtana and propagated prema-bhakti." },
  {
    id: 23,
    name: "Śrīla Rūpa Gosvāmī (Svarūpa, Sanātana)",
    mainSummary: "Foremost disciple of Śrī Caitanya and architect of Gauḍīya siddhānta.",
    additionalNotes: [
      "Śrīla Sanātana Gosvāmī, his elder brother, exemplified scholarship and renunciation alongside Rūpa.",
      "Śrīla Svarūpa Dāmodara, Mahāprabhu’s intimate companion, mentored Rūpa under the Lord’s direction.",
      "Together they form the inspirational core of Vṛndāvana’s devotional reawakening."
    ]
  },
  { id: 24, name: "Śrīla Jīva Gosvāmī", mainSummary: "Youngest Gosvāmī, philosopher of Gauḍīya siddhānta.", additionalNotes: ["Also close to Rūpa: Śrī Raghunātha Dāsa Gosvāmī — model renunciate of Rādhā-kuṇḍa."] },
  { id: 25, name: "Śrīla Kṛṣṇadāsa Kavirāja Gosvāmī", mainSummary: "Author of Śrī Caitanya-caritāmṛta." },
  { id: 26, name: "Śrīla Narottama Dāsa Ṭhākura", mainSummary: "Saint-poet of Bengali bhakti literature." },
  { id: 27, name: "Śrīla Viśvanātha Cakravartī Ṭhākura", mainSummary: "Master commentator on Bhāgavatam and Gītā." },
  {
    id: 28,
    name: "Śrīla Baladeva Vidyābhūṣaṇa (Jagannātha Dāsa Bābājī)",
    mainSummary: "Defender of Gauḍīya doctrine through his Govinda-bhāṣya commentary.",
    additionalNotes: [
      "Śrī Jagannātha Dāsa Bābājī’s realization and guidance bridged to Bhaktivinoda Ṭhākura.",
      "Their sharing of devotional wisdom ensured continuity of pure bhakti.",
      "This pairing honors their combined roles in sustaining the tradition’s vitality."
    ]
  },
  { id: 29, name: "Śrīla Bhaktivinoda Ṭhākura", mainSummary: "Reviver of Gauḍīya siddhānta in the 19th century." },
  { id: 30, name: "Śrīla Gaurakiśora Dāsa Bābājī", mainSummary: "Renounced paramahaṁsa and mentor of Bhaktisiddhānta Sarasvatī." },
  { id: 31, name: "Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura", mainSummary: "Founder of Gauḍīya Maṭha and pioneer of global bhakti preaching." },
  { id: 32, name: "His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda", mainSummary: "Founder-ācārya of ISKCON who spread Caitanya’s teachings worldwide." }
];

const verses: Verse[] = [
  {
    title: "Illuminating the Path: Witness this Legacy of Krishna through Prabhupada",
    reference: "Bhagavad-gītā 4.2",
    transliteration: [
      "evaṁ paramparā-prāptam",
      "imaṁ rājarṣayo viduḥ",
      "sa kāleneha mahatā",
      "yogo naṣṭaḥ paran-tapa"
    ],
    translation: "This supreme science was thus received through the chain of disciplic succession, and the saintly kings understood it in that way. But in course of time the succession was broken, and therefore the science as it is appears to be lost."
  },
  {
    reference: "ŚB 10.2.31",
    transliteration: [
      "svayaṁ samuttīrya sudustaraṁ dyuman",
      "bhavārṇavaṁ bhīmam adabhra-sauhṛdāḥ",
      "bhavat-padāmbhoruha-nāvam atra te",
      "nidhāya yātāḥ sad-anugraho bhavān"
    ],
    translation: "O Lord, who resemble the shining sun, You are always ready to fulfill the desire of Your devotee, and therefore You are known as a desire tree [vāñchā-kalpataru]. When ācāryas completely take shelter under Your lotus feet in order to cross the fierce ocean of nescience, they leave behind on earth the method by which they cross, and because You are very merciful to Your other devotees, You accept this method to help them."
  }
];

const DisciplicSuccessionSection: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const getMasterImagePath = (id: number): string => `/assets/extra/parampara/${id}.jpg`; // Reverted to .jpg as files are in this format

  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [isFullListViewOpen, setIsFullListViewOpen] = useState(false);
  const [isMarqueeManuallyPaused, setIsMarqueeManuallyPaused] = useState(false); // State for manual pause
  // const [isSectionVisible, setIsSectionVisible] = useState(false); // Managed by Marquee visibility for play state implicitly
  // const [widthOfOneSetOfCards, setWidthOfOneSetOfCards] = useState(0); // Not needed with Marquee component
  // const [isHoverPaused, setIsHoverPaused] = useState(false); // Handled by Marquee's pauseOnHover prop

  // Marquee settings for reference, props will be passed to Marquee component directly
  // const marqueeRepeat = 4; // Default in Marquee component, can be overridden
  // const pauseOnHover = true; // Passed as prop to Marquee
  // const marqueeSpeed = "80s"; // Example, passed as --duration style
  // const marqueeCardGap = "1.5rem"; // Example, passed as --gap style

  const expandedCardRef = useRef<HTMLDivElement>(null);
  const fullListDrawerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  // firstSetOfCardsRef is not needed for width measurement with Marquee component

  const smoothEasing = [0.4, 0.0, 0.2, 1];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  // useEffect for IntersectionObserver and width calculation are no longer needed as Marquee component handles this.
  // The Marquee component itself handles its animation play state based on visibility (implicitly via CSS animations starting when rendered)
  // and its own pauseOnHover logic.

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (isFullListViewOpen) {
          setIsFullListViewOpen(false);
        } else if (selectedMasterId !== null) {
          setSelectedMasterId(null);
        }
      }
    }
    function handleClickOutside(event: MouseEvent) {
      const mouseEvent = event as unknown as ReactMouseEvent<Element, MouseEvent>;
      if (isFullListViewOpen && fullListDrawerRef.current && !fullListDrawerRef.current.contains(mouseEvent.target as Node)) {
        setIsFullListViewOpen(false);
      } else if (selectedMasterId !== null && expandedCardRef.current && !expandedCardRef.current.contains(mouseEvent.target as Node)) {
        setSelectedMasterId(null);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    if (selectedMasterId !== null || isFullListViewOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedMasterId, isFullListViewOpen]);

  const handleCardClick = (masterId: number) => {
    if (selectedMasterId === masterId) {
      setSelectedMasterId(null);
    } else {
      setSelectedMasterId(masterId);
    }
  };

  const activeMaster = spiritualMasters.find(m => m.id === selectedMasterId);

  // Extracted card rendering logic into its own function for clarity
  const renderSpiritualMasterCard = (master: SpiritualMaster) => {
    const cardRenderWidth = isDesktop ? 300 : 280;
    return (
      <motion.div
        key={master.id} // Key for each card in the map
        layout={selectedMasterId === master.id} // Framer Motion layout animation
        data-master-id={master.id}
        className={cn(
          "bg-blue-900/80 dark:bg-blue-950/80 backdrop-blur-lg relative h-[450px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-2xl border border-blue-700/60 hover:border-blue-500"
          // The Marquee component handles gap via its own CSS variable `var(--gap)`
          // No explicit margin needed here unless overriding Marquee's behavior
        )}
        style={{
          width: `${cardRenderWidth}px`,
          // flexShrink: 0 is handled by Marquee's internal structure
        }}
        animate={{
          width: selectedMasterId === master.id ? (isDesktop ? "600px" : "90vw") : `${cardRenderWidth}px`,
          zIndex: selectedMasterId === master.id ? 10 : 1, // Bring selected card to front
        }}
        transition={{ duration: 0.5, ease: smoothEasing }}
        onClick={() => handleCardClick(master.id)}
        ref={selectedMasterId === master.id ? expandedCardRef : null}
      >
        {/* Inner content of the card remains the same */}
        <div className={cn(
          "relative h-full flex-shrink-0",
          selectedMasterId === master.id && !isDesktop ? "w-[130px]" : 
          isDesktop ? "w-[300px]" : "w-[280px]"
        )}>
          <img
            src={getMasterImagePath(master.id)}
            alt={master.name}
            className="h-full w-full object-cover"
            loading="lazy" // Added lazy loading
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
            <Badge variant="default" className="absolute top-3 right-3 bg-orange-600/90 text-white text-xs sm:text-sm px-2.5 py-1 shadow-md">
              {master.id}
            </Badge>
            <div className="mt-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-shadow-lg">{master.name}</h2>
            </div>
          </div>
        </div>
        <AnimatePresence mode="popLayout">
          {selectedMasterId === master.id && activeMaster && (
            <motion.div
              className="absolute top-0 right-0 h-full bg-blue-900 dark:bg-blue-950 shadow-2xl"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: isDesktop ? "300px" : `calc(90vw - 130px)`,
                opacity: 1
              }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: smoothEasing, opacity: { duration: 0.3, delay: 0.2 } }}
              onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with expanded details
            >
              <motion.div
                className="flex h-full flex-col p-5 md:p-6 text-white overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-blue-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl sm:text-2xl font-bold">{activeMaster.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); setSelectedMasterId(null); }}
                    className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full -mr-2 -mt-1 flex-shrink-0"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>
                <div className="flex-grow">
                  <p className="text-sm sm:text-base text-gray-200 mb-3 leading-relaxed">
                    {activeMaster.mainSummary}
                  </p>
                  {activeMaster.additionalNotes && activeMaster.additionalNotes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-700/50">
                      <h5 className="text-xs sm:text-sm font-semibold uppercase text-pink-400 mb-1.5">Additional Context:</h5>
                      <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-300">
                        {activeMaster.additionalNotes.map((info, idx) => <li key={idx}>{info}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <AuroraBackground
      ref={sectionRef}
      showRadialGradient={false}
      className="relative bg-transparent dark:bg-transparent min-h-[calc(100vh-var(--navbar-height,4rem))] !h-auto overflow-hidden select-none"
    >
      <motion.div
        ref={bgImageRef}
        className="absolute inset-x-0 z-0"
        style={{
          backgroundImage: "url('/assets/extra/parampara/full.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          height: '140%',
          top: '-20%',
          y: backgroundY,
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/50" />
      <div className="relative z-20 flex flex-col 2xl:flex-row gap-x-12 gap-y-8 p-4 sm:p-6 md:p-8 text-gray-900 dark:text-gray-100 w-full max-w-screen-xl 2xl:max-w-screen-2xl mx-auto py-12 md:py-20"> {/* Added 2xl:max-w-screen-2xl */}
        <div className="w-full 2xl:w-1/3 space-y-6 2xl:sticky 2xl:top-[calc(var(--navbar-height,4rem)+2rem)] 2xl:max-h-[calc(100vh-var(--navbar-height,4rem)-4rem)] 2xl:overflow-y-auto pr-4">
          {verses.filter(v => v.reference.includes("Bhagavad-gītā")).map((verse, index) => (
            <div key={`verse-bg-${index}`} className="space-y-6 p-4 sm:p-5 bg-orange-50/70 dark:bg-neutral-800/70 rounded-xl shadow-md border border-orange-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
              {verse.title && <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-orange-900 dark:text-orange-50"><AuroraText>{verse.title}</AuroraText></h3>}
              <Badge variant="outline" className="mb-4 text-sm font-medium bg-orange-500/30 dark:bg-orange-400/30 border-orange-500/50 dark:border-orange-400/50 text-orange-700 dark:text-orange-200 backdrop-blur-sm py-1.5 px-3">
                {verse.reference}
              </Badge>
              <div className="italic space-y-1 mb-4 text-gray-600 dark:text-gray-300 text-center font-semibold">
                {verse.transliteration.map((line, i) => <p key={i} className="text-base">{line}</p>)}
              </div>
              <p className="text-lg font-semibold text-center text-orange-800 dark:text-orange-100 bg-orange-100/70 dark:bg-orange-950/50 p-4 rounded-lg border border-orange-200/60 dark:border-orange-900/40">
                {verse.translation}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full 2xl:w-2/3 relative space-y-8">
          <div className="p-0 md:p-0 space-y-8">
            <div className="mb-8 text-center 2xl:text-left bg-blue-900/60 dark:bg-blue-950/60 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-blue-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white">
                  <AuroraText>The Disciplic Succession</AuroraText>
                </h1>
                <Button
                  variant="outline"
                  className="mt-2 sm:mt-0 bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 border-white/30 text-white backdrop-blur-sm"
                  onClick={() => setIsFullListViewOpen(true)}
                >
                  <ListTree className="mr-2 h-5 w-5" />
                  View Full List
                </Button>
              </div>
              <p className="text-lg md:text-xl text-gray-100 dark:text-gray-200 max-w-3xl mx-auto 2xl:mx-0 mt-4">
                This sacred lineage, <em className="font-italic">Evaṁ Paramparā-prāptam</em>, illuminates the path of pure devotional service, handed down from the Supreme Lord Kṛṣṇa through an unbroken chain of spiritual masters. This list is beautifully enshrined in Śrīla Bhaktisiddhānta Saraswatī Ṭhākura's song "Kṛṣṇa Hoite Caturmukha."
              </p>
            </div>

            {/* Marquee Carousel using the Marquee component */}
            {/* Added a wrapper div that can be styled (e.g., for relative positioning if cards expand outside bounds) */}
            <div className="relative py-2">
              <Marquee
                pauseOnHover={false}
                className={cn(
                  "[--duration:120s] [--gap:1.5rem]", // Increased duration to slow down marquee
                  isMarqueeManuallyPaused
                    ? "[&_.animate-marquee]:[animation:none] overflow-x-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-transparent"
                    : "",
                  { "marquee-has-active-selection": selectedMasterId !== null }
                )}
                repeat={2}
              >
                {spiritualMasters.map((master) => renderSpiritualMasterCard(master))}
              </Marquee>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMarqueeManuallyPaused(!isMarqueeManuallyPaused)}
                className="absolute top-0 right-0 md:top-2 md:right-2 z-20 bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 border-white/30 text-white backdrop-blur-sm rounded-full h-8 w-8 sm:h-9 sm:w-9"
                aria-label={isMarqueeManuallyPaused ? "Play Marquee" : "Pause Marquee"}
              >
                {isMarqueeManuallyPaused ? <Play className="h-4 w-4 sm:h-5 sm:w-5" /> : <Pause className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black/70 via-black/50 to-transparent z-10"></div>
            </div>
            
            {/* ŚB Verse section has been moved below */}
          </div>
        </div>
      </div>

      {/* NEW Full-width section for SB Verse */}
      <div className="relative z-20 w-full max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12"> {/* Added 2xl:max-w-screen-2xl */}
        {verses.filter(v => v.reference.includes("ŚB")).map((verse, index) => (
          <div key={`verse-sb-${index}`} className="space-y-6 p-4 sm:p-6 bg-sky-800/70 dark:bg-sky-950/80 backdrop-blur-md rounded-xl shadow-lg border border-sky-700/60 text-white mb-8">
            {verse.title && <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-sky-100 dark:text-sky-50">{verse.title}</h3>}
            <Badge variant="outline" className="mb-4 text-sm font-medium bg-sky-500/40 dark:bg-sky-400/40 border-sky-500/60 dark:border-sky-400/60 text-sky-200 dark:text-sky-100 backdrop-blur-sm py-1.5 px-3">
              {verse.reference}
            </Badge>
            <div className="italic space-y-1 mb-4 text-gray-200 dark:text-gray-300 text-center font-semibold">
              {verse.transliteration.map((line, i) => <p key={i} className="text-base">{line}</p>)}
            </div>
            <p className="text-lg font-semibold text-center text-sky-100 dark:text-sky-50 bg-sky-700/50 dark:bg-sky-900/60 p-4 rounded-lg border border-sky-600/60 dark:border-sky-800/60">
              {verse.translation}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFullListViewOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsFullListViewOpen(false)}
            />
            <motion.div
              ref={fullListDrawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md md:max-w-lg bg-white dark:bg-neutral-900 shadow-2xl z-40 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b dark:border-neutral-700">
                <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 dark:text-neutral-100">Full Disciplic Succession</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsFullListViewOpen(false)} className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-3 scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
                {spiritualMasters.map((master) => (
                  <div key={`full-list-${master.id}`} className="flex items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors">
                    <Badge variant="outline" className="mr-3 h-7 w-7 flex-shrink-0 flex items-center justify-center text-xs border-orange-500 text-orange-600 dark:text-orange-400">
                      {master.id}
                    </Badge>
                    <span className="text-sm md:text-base font-medium text-neutral-700 dark:text-neutral-200">{master.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AuroraBackground>
  );
};

export default DisciplicSuccessionSection;
