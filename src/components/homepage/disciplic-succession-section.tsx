'use client';

import React, { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react';
import { motion, useSpring, AnimatePresence } from 'motion/react';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Badge } from '@/components/ui/badge';

interface SpiritualMaster {
  id: number;
  name: string;
  mainSummary: string;
  additionalNotes?: string[];
  // No need to add imageSrc here, we'll use local images
}

// ImageData interface and images array are no longer needed as we use local images.

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
  { id: 4, name: "Śrī Vyāsa", mainSummary: "Kṛṣṇa Dvaipāyana Vyāsa — empowered compiler of the Vedas, Purāṇas, Mahābhārata, and Śrīmad-Bhāgavatam." },
  { id: 5, name: "Śrī Madhvācārya", mainSummary: "Also known as Pūrṇaprajña Tīrtha — re-established pure dualist philosophy and founded the Brahma-Madhva Sampradāya." },
  { id: 6, name: "Śrī Padmanābha Tīrtha", mainSummary: "Chief disciple and successor of Śrī Madhvācārya." },
  { id: 7, name: "Śrī Nṛhari Tīrtha", mainSummary: "Prominent disciple in the line of Śrī Madhvācārya." },
  { id: 8, name: "Śrī Mādhava Tīrtha", mainSummary: "Disciple of Śrī Nṛhari Tīrtha, notable successor in the Madhva line." },
  { id: 9, name: "Śrī Akṣobhya Tīrtha", mainSummary: "A great paramahaṁsa, disciple of Śrī Mādhava Tīrtha." },
  { id: 10, name: "Śrī Jaya Tīrtha", mainSummary: "Distinguished disciple of Śrī Akṣobhya Tīrtha, known for his commentaries on Madhva’s works." },
  { id: 11, name: "Śrī Jñānasindhu Tīrtha", mainSummary: "Disciple of Śrī Jaya Tīrtha, known for deep knowledge of devotional service." },
  { id: 12, name: "Śrī Dayānidhi Tīrtha", mainSummary: "Successor to Śrī Jñānasindhu Tīrtha, embodying compassion and wisdom." },
  { id: 13, name: "Śrī Vidyānidhi", mainSummary: "Also known as Vidyādhirāja Tīrtha — profound scholar and disciple of Śrī Dayānidhi Tīrtha." },
  { id: 14, name: "Śrī Rājendra Tīrtha", mainSummary: "Disciple of Śrī Vidyānidhi, upholding Vaiṣṇava philosophical traditions." },
  { id: 15, name: "Śrī Jayadharma", mainSummary: "Also known as Vijayadhvaja Tīrtha — exemplified steadfast dharma and guru-sevā." },
  { id: 16, name: "Śrī Puruṣottama Tīrtha", mainSummary: "Prominent sannyāsī disciple of Śrī Jayadharma." },
  { id: 17, name: "Śrī Brahmaṇya Tīrtha", mainSummary: "Also known as Subrahmanya Tīrtha — chief disciple of Śrī Puruṣottama Tīrtha." },
  { id: 18, name: "Śrī Vyāsa Tīrtha", mainSummary: "Also called Vyāsa Rāya — great scholar-saint, disciple of Śrī Brahmaṇya Tīrtha." },
  { id: 19, name: "Śrī Lakṣmīpati Tīrtha", mainSummary: "Disciple of Śrī Vyāsa Tīrtha." },
  { id: 20, name: "Śrī Mādhavendra Purī Gosvāmī", mainSummary: "Root of the Gauḍīya lineage, introduced rāgānuga-bhakti (spontaneous devotional love)." },
  {
    id: 21,
    name: "Śrī Īśvara Purī (Nityānanda, Advaita)",
    mainSummary: "Dīkṣā-guru of Śrī Caitanya Mahāprabhu, whose devotion opened the Lord’s heart to accept initiation.",
    additionalNotes: [
      "His humility and pure devotion deeply touched Śrī Caitanya, enabling Mahāprabhu's saṅkīrtana mission.",
      "Śrī Nityānanda Prabhu and Śrī Advaita Ācārya, though not direct disciples, served together as empowered associates in the Lord’s pastimes.",
      "The Guru-paramparā song names Īśvara Purī directly and honors Nityānanda and Advaita in praise of Mahāprabhu’s advent and mission."
    ]
  },
  { id: 22, name: "Śrī Caitanya Mahāprabhu", mainSummary: "The Golden Avatāra who inaugurated saṅkīrtana and propagated prema-bhakti." },
  {
    id: 23,
    name: "Śrī Rūpa Gosvāmī (Svarūpa, Sanātana)",
    mainSummary: "Foremost disciple of Śrī Caitanya and architect of Gauḍīya siddhānta.",
    additionalNotes: [
      "Śrī Sanātana Gosvāmī, his elder brother, exemplified scholarship and renunciation alongside Rūpa.",
      "Śrī Svarūpa Dāmodara, Mahāprabhu’s intimate companion, mentored Rūpa under the Lord’s direction.",
      "Together they form the inspirational core of Vṛndāvana’s devotional reawakening."
    ]
  },
  { id: 24, name: "Śrī Jīva Gosvāmī", mainSummary: "Youngest Gosvāmī, philosopher of Gauḍīya siddhānta.", additionalNotes: ["Also close to Rūpa: Śrī Raghunātha Dāsa Gosvāmī — model renunciate of Rādhā-kuṇḍa."] },
  { id: 25, name: "Śrī Kṛṣṇadāsa Kavirāja Gosvāmī", mainSummary: "Author of Śrī Caitanya-caritāmṛta." },
  { id: 26, name: "Śrī Narottama Dāsa Ṭhākura", mainSummary: "Saint-poet of Bengali bhakti literature." },
  { id: 27, name: "Śrī Viśvanātha Cakravartī Ṭhākura", mainSummary: "Master commentator on Bhāgavatam and Gītā." },
  {
    id: 28,
    name: "Śrī Baladeva Vidyābhūṣaṇa (Jagannātha Dāsa Bābājī)",
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
    title: "🕉️ Illuminating the Path: The Disciplic Succession",
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

// DUMMY_IMAGE_URL is no longer needed

const DisciplicSuccessionSection: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const getMasterImagePath = (id: number): string => `/assets/extra/parampara/${id}.jpg`;
  const [hoveredMasterId, setHoveredMasterId] = useState<number | null>(null); // For underline effect
  const [activeMaster, setActiveMaster] = useState<SpiritualMaster | null>(null); // For expanded view
  
  const [img, setImg] = useState<{ src: string; alt: string; opacity: number; scale: number }>({
    src: '',
    alt: '',
    opacity: 0,
    scale: 0.5, // Initial scale for the hover image
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);

  const spring = {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  };

  const imagePos = {
    x: useSpring(0, spring),
    y: useSpring(0, spring),
  };

  // Close expanded view when clicking outside or pressing Escape
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveMaster(null);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (expandedCardRef.current && !expandedCardRef.current.contains(event.target as Node)) {
        setActiveMaster(null);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    if (activeMaster) {
      document.addEventListener('mousedown', handleClickOutside as unknown as EventListener);
    }
    
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
    };
  }, [activeMaster]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    
    // Position image directly at cursor position
    imagePos.x.set(clientX - containerRect.left);
    imagePos.y.set(clientY - containerRect.top);
  };

  const handleMasterHover = useCallback(
    (master: SpiritualMaster) => {
      if (activeMaster) return; // Don't show hover image when expanded view is active
      
      setImg({
        src: getMasterImagePath(master.id),
        alt: master.name, // Use master's name for alt text
        opacity: 1,
        scale: 1, // Animate to full scale
      });
      setHoveredMasterId(master.id); // For the underline effect
    },
    [activeMaster, getMasterImagePath] // Added getMasterImagePath to dependencies
  );

  const handleMouseLeave = useCallback(() => {
    if (activeMaster) return; // Don't hide image when expanded view is active
    
    setImg(prev => ({...prev, opacity: 0, scale: 0.5 })); // Animate back to initial scale and hide
    setHoveredMasterId(null); // Clear underline effect
  }, [activeMaster]);
  
  const handleMasterClick = useCallback((master: SpiritualMaster) => {
    setActiveMaster(prev => prev?.id === master.id ? null : master);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-x-12 gap-y-8 p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 min-h-[calc(100vh-var(--navbar-height,4rem))] relative">
      {/* Overlay for expanded view */}
      <AnimatePresence>
        {activeMaster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/20 dark:bg-black/40 backdrop-blur-sm pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* Expanded Master View */}
      <AnimatePresence>
        {activeMaster && (
          <div className="absolute inset-0 z-30 grid place-items-center pointer-events-none">
            <motion.div
              ref={expandedCardRef}
              layoutId={`master-${activeMaster.id}`}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 w-[90%] max-w-2xl p-6 pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <motion.div layoutId={`master-badge-${activeMaster.id}`} className="mr-3">
                    <Badge
                      variant="outline"
                      className="h-8 w-8 flex items-center justify-center text-sm border-orange-400 text-orange-600 dark:text-orange-400 bg-transparent"
                    >
                      {activeMaster.id}
                    </Badge>
                  </motion.div>
                  <motion.h2 layoutId={`master-name-${activeMaster.id}`} className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeMaster.name}
                  </motion.h2>
                </div>
                <button
                  onClick={() => setActiveMaster(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full md:w-1/2 h-[300px] rounded-lg overflow-hidden"
                >
                  <img
                    src={getMasterImagePath(activeMaster.id)}
                    alt={activeMaster.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Content */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-700 dark:text-gray-300 mb-4"
                  >
                    {activeMaster.mainSummary}
                  </motion.p>
                  
                  {activeMaster.additionalNotes && activeMaster.additionalNotes.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 pt-4 border-t border-gray-200 dark:border-neutral-700"
                    >
                      <h5 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Additional Context:</h5>
                      <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {activeMaster.additionalNotes.map((info, idx) => <li key={idx}>{info}</li>)}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Left Section: Verses */}
      <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-[calc(var(--navbar-height,4rem)+2rem)] lg:max-h-[calc(100vh-var(--navbar-height,4rem)-4rem)] lg:overflow-y-auto pr-4">
        {verses.map((verse, index) => (
          <div key={index} className="space-y-6 p-4 sm:p-5 bg-orange-50/50 dark:bg-neutral-800/40 rounded-xl shadow-md border border-orange-200 dark:border-neutral-700/80 hover:shadow-lg transition-shadow duration-300">
            {verse.title && <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-orange-900 dark:text-orange-100">{verse.title}</h3>}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-medium">{verse.reference}</p>
            <div className="italic space-y-0.5 mb-3 text-gray-700 dark:text-gray-300">
              {verse.transliteration.map((line, i) => <p key={i} className="text-sm">{line}</p>)}
            </div>
            <p className="text-base italic text-orange-800 dark:text-orange-200 font-medium bg-orange-100/50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200/50 dark:border-orange-900/30">{verse.translation}</p>
          </div>
        ))}
      </div>

      {/* Right Section: Spiritual Masters List */}
      <div
        ref={containerRef}
        className="w-full lg:w-2/3 relative space-y-6"
        onMouseMove={handleMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800 dark:text-white">
            The Disciplic Succession
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
            This sacred lineage, <em className="font-italic">Evaṁ Paramparā-prāptam</em>, illuminates the path of pure devotional service, handed down from the Supreme Lord Kṛṣṇa through an unbroken chain of spiritual masters. This list is beautifully enshrined in Śrīla Bhaktisiddhānta Saraswatī Ṭhākura's song "Kṛṣṇa Hoite Caturmukha."
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-1">
          {spiritualMasters.map((master) => (
            <motion.div
              layoutId={`master-${master.id}`}
              key={master.id}
              className="relative p-4 hover:bg-orange-50/50 dark:hover:bg-neutral-800/60 rounded-lg cursor-pointer transition-colors duration-150 flex justify-between items-center group"
              onMouseEnter={() => handleMasterHover(master)}
              onClick={() => handleMasterClick(master)}
            >
              <div className="flex items-center flex-grow">
                <motion.div layoutId={`master-badge-${master.id}`}>
                  <Badge
                    variant="outline"
                    className="mr-4 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center text-xs sm:text-sm border-gray-300 dark:border-neutral-700 text-orange-600 dark:text-orange-400 bg-transparent group-hover:border-orange-500 dark:group-hover:border-orange-400 transition-colors cursor-pointer"
                  >
                    {master.id}
                  </Badge>
                </motion.div>
                <motion.span
                  layoutId={`master-name-${master.id}`}
                  className={`text-xl sm:text-2xl font-bold transition-colors tracking-tight ${isDesktop && hoveredMasterId === master.id && !activeMaster && img.opacity > 0 ? 'mix-blend-difference z-20 !text-gray-300 dark:!text-gray-300' : 'text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'}`}
                >
                  {master.name}
                </motion.span>
              </div>
              
              {/* Underline effect */}
              <div
                className={`absolute bottom-0 left-0 h-[1px] bg-orange-500 dark:bg-orange-400 transition-all duration-300 ease-out ${
                  hoveredMasterId === master.id && !activeMaster && img.opacity > 0 ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Image */}
      {isDesktop && !activeMaster && (
        <motion.img
          ref={imageRef}
          src={img.src}
          alt={img.alt}
          className="fixed dark:bg-gray-950 bg-white object-cover pointer-events-none z-25 w-[300px] h-[400px] rounded-lg shadow-xl" // Increased z-index to 25, enhanced shadow
          style={{
            x: imagePos.x,
            y: imagePos.y,
            opacity: img.opacity,
            scale: img.scale, // Apply scale from state
            transform: 'translate(-50%, -50%)'  // Center the image on the cursor
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Smooth transition for opacity and scale
        />
      )}
    </div>
  );
};

export default DisciplicSuccessionSection;
