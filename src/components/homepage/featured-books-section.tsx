import * as React from 'react';
import { motion } from 'motion/react'; // AnimatePresence might not be part of motion/react, using keyed motion.divs
import { useIsMobile } from '@/hooks/use-mobile'; // Added for responsive book size
import { ModernBookCover } from '@/components/cuicui/modern-book-cover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Languages, CheckCircle, Eye, ShoppingCart } from 'lucide-react';

const springTransition = {
  type: "spring",
  stiffness: 350,
  damping: 25,
  mass: 0.8,
};

// Function to generate a unique order number
const generateOrderNumber = (prefix: string) => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${randomSuffix}`;
};

interface BookDetailData {
  id: string;
  orderIdPrefix: string;
  title: string;
  subtitle: string;
  coverImage: string;
  description: string;
  badges: string[];
  ebookPreviewLink?: string;
  productLink?: string;
  playlistLink?: string; // Added playlistLink
  whatsAppNumber: string;
  baseWhatsAppMessageTemplate: string;
  price: string;
  shippingNote?: string;
  quote?: {
    text: string;
    source: string;
  };
  keyPoints?: {
    title: string;
    icon: React.ReactNode;
  }[];
}

const ia77BookDetails: BookDetailData = {
  id: "ia77",
  orderIdPrefix: "IA77",
  title: "Initiations After 1977",
  subtitle: "Understanding Srila Prabhupada's Directives",
  coverImage: "/extra/ia77cover.png",
  description: "A definitive guide navigating spiritual initiation in ISKCON. Explores the Rtvik system based on evidence and wisdom, fostering clarity, unity, and honoring Srila Prabhupada's legacy.",
  badges: ["Essential Reading", "Printed Book", "Multilingual Edition"],
  keyPoints: [
    {
      title: "Core Principles Explored",
      icon: <BookOpen className="h-5 w-5 mr-2 text-pink-500" />
    },
    {
      title: "Global Accessibility",
      icon: <Languages className="h-5 w-5 mr-2 text-blue-500" />
    },
    {
      title: "Preserving Spiritual Integrity",
      icon: <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
    }
  ],
  ebookPreviewLink: "https://heyzine.com/flip-book/7463036c24.html#page/18",
  playlistLink: "https://youtube.com/playlist?list=PLQGHF3mp1o78H-_CwnooAqyfYo8wznJjw&feature=shared", // Added playlist link
  whatsAppNumber: "+919380395156",
  baseWhatsAppMessageTemplate: `Hare Kṛṣṇa! prabhu
 Dandwat pranam, please accept my humble obesiances
All Glories to Śrīla Prabhupāda!

I would like to order the book "Initiations After 1977".
My Temple Site Order Number is: `,
  price: "₹120",
  shippingNote: "excluding shipping charges",
  quote: {
    text: "I have deputed the ritvik, the representative of the acharya, to act for me.",
    source: "(Letter to all G.B.C. members and Temple Presidents, July 9, 1977)"
  }
};

const wwokBookDetails: BookDetailData = {
  id: "wwok",
  orderIdPrefix: "WWOK",
  title: "Why Worship Only Krsna?",
  subtitle: "The Ultimate Vedic Conclusion",
  coverImage: "/extra/wwok.webp",
  description: "Embark on a profound spiritual quest. This illuminating book delves into Vedic philosophy, presenting conclusive evidence that establishes Lord Krishna as the Supreme Personality of Godhead, the ultimate object of all worship.",
  badges: ["Spiritual Guidance", "Vedic Philosophy", "Essential Read"],
  keyPoints: [
    {
      title: "Krishna's Supreme Position",
      icon: <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
    },
    {
      title: "Guidance from Srila Prabhupāda",
      icon: <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
    },
    {
      title: "Clarity for Spiritual Seekers",
      icon: <Languages className="h-5 w-5 mr-2 text-indigo-500" />
    }
  ],
  productLink: "https://www.gaudiyabooks.com/product-page/why-worship-only-krsna-the-ultimate-vedic-conclusion",
  whatsAppNumber: "+919380395156",
  baseWhatsAppMessageTemplate: `Hare Kṛṣṇa! prabhu
 Dandwat pranam, please accept my humble obesiances
All Glories to Śrīla Prabhupāda!

I would like to order the book "Why Worship Only Krsna?".
My Temple Site Order Number is: `,
  price: "₹120",
  shippingNote: "excluding shipping charges",
  quote: {
    text: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    source: "(Bhagavad-gītā As It Is, 18.66)"
  }
};

const usuageBookDetails: BookDetailData = {
  id: "usuage",
  orderIdPrefix: "USAGE",
  title: "ISKM's Position on Usage of BBT Books after 1977",
  subtitle: "Understanding the fidelity and usage of post-1977 editions.",
  coverImage: "/extra/usuagecover.webp",
  description: "A pivotal publication addressing ISKM's stance on using books published by the BBT after 1977. Examines historical context and presents ISKM's perspective on the fidelity and usage of these editions.",
  badges: ["ISKM Stance", "BBT Books", "Post-1977"],
  keyPoints: [
    {
      title: "Historical Context",
      icon: <BookOpen className="h-5 w-5 mr-2 text-red-500" />
    },
    {
      title: "ISKM's Perspective",
      icon: <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
    },
    {
      title: "Preserving Teachings",
      icon: <Languages className="h-5 w-5 mr-2 text-blue-600" />
    }
  ],
  whatsAppNumber: "+919380395156",
  baseWhatsAppMessageTemplate: `Hare Kṛṣṇa! prabhu
 Dandwat pranam, please accept my humble obesiances
All Glories to Śrīla Prabhupāda!

I would like to order the book "ISKM's Position on Usage of BBT Books after 1977".
My Temple Site Order Number is: `,
  price: "Free of Cost",
  quote: {
    text: "The book is the basis. Reading of the books must be going on. And whatever is in the books, that must be introduced in our life.",
    source: "(Lecture, April 13, 1975, Hyderabad)"
  }
};


const allBooksData: BookDetailData[] = [ia77BookDetails, wwokBookDetails, usuageBookDetails];

export function FeaturedBooksSection() {
  const [selectedBook, setSelectedBook] = React.useState<BookDetailData>(allBooksData[0]);
  const [orderNumber, setOrderNumber] = React.useState('');
  const isMobile = useIsMobile(); // Added for responsive book size

  React.useEffect(() => {
    if (selectedBook) {
      setOrderNumber(generateOrderNumber(selectedBook.orderIdPrefix));
    }
  }, [selectedBook]);

  const whatsAppMessageWithOrder = `${selectedBook.baseWhatsAppMessageTemplate}${orderNumber}`;
  const whatsAppOrderUrl = `https://wa.me/${selectedBook.whatsAppNumber}?text=${encodeURIComponent(whatsAppMessageWithOrder)}`;

  return (
    <section className="pt-10 pb-6 md:pt-20 md:pb-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.05 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Our Publications
          </h2>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Explore our collection of essential spiritual literature.
          </p>
        </motion.div>

        {/* Adjusted grid for better tablet layout: stacks on mobile, 2-col on tablet, 10-col (4/6 split) on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-8 md:gap-10 items-start">
          {/* Left Side: Book Cover */}
          <motion.div
            key={`${selectedBook.id}-cover`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.02 }}
            className="md:col-span-1 lg:col-span-4 flex justify-center items-center" // md:justify-start removed to keep cover centered on tablet 2-col
          >
            <ModernBookCover size={isMobile ? "md" : "lg"} color={selectedBook.id === 'wwok' ? 'yellow' : selectedBook.id === 'usuage' ? 'neutral' : 'zinc'} className="shadow-xl hover:shadow-zinc-400/30 dark:hover:shadow-black/50 transition-shadow duration-300">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="w-full h-full object-cover"
              />
            </ModernBookCover>
          </motion.div>

          {/* Right Side: Context and Details */}
          <motion.div
            key={selectedBook.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springTransition, delay: 0.05 }}
            className="md:col-span-1 lg:col-span-6 space-y-4" // Adjusted col-span for tablet and large screens
          >
            <div className="flex flex-wrap gap-2">
              {selectedBook.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 border-purple-500/70 text-purple-600 dark:text-purple-400 dark:border-purple-500/50">
                  {badge}
                </Badge>
              ))}
            </div>

            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800 dark:text-white">
              {selectedBook.title}
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {selectedBook.subtitle}
            </p>

            <p className="text-base text-muted-foreground leading-relaxed pt-1 whitespace-pre-line">
              {selectedBook.description}
            </p>

            {selectedBook.quote && (
              <motion.div
                key={`${selectedBook.id}-quote`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.07 }}
                className="border-l-4 border-purple-500 pl-4 text-base text-muted-foreground mt-4"
              >
                <p className="mb-2 italic">"{selectedBook.quote.text}"</p>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs font-normal whitespace-normal">
                    - {selectedBook.quote.source}
                  </Badge>
                </div>
              </motion.div>
            )}

            {selectedBook.keyPoints && (
              <motion.ul
                key={`${selectedBook.id}-keypoints`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.1 }}
                className="mt-4 space-y-2 text-muted-foreground"
              >
                {selectedBook.keyPoints.map((point, index) => (
                  <li key={index} className="text-base md:text-lg flex items-center">
                    {point.icon}
                    <span>{point.title}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Price Display */}
            <motion.div
              key={`${selectedBook.id}-price-info`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: (selectedBook.keyPoints || selectedBook.quote) ? 0.12 : 0.07 }}
              className="mt-4 mb-2"
            >
              <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedBook.price}
              </span>
              {selectedBook.shippingNote && (
                <span className="ml-1 text-xs md:text-sm text-muted-foreground">
                  ({selectedBook.shippingNote})
                </span>
              )}
            </motion.div>

            <div className="pt-2 flex flex-wrap gap-3 items-center"> {/* Changed to flex-wrap, removed flex-col sm:flex-row */}
              <a href={whatsAppOrderUrl} target="_blank" rel="noopener noreferrer" className="min-w-[200px] grow"> {/* Removed flex-1, added grow and min-width */}
                <Button size={isMobile ? "sm" : "lg"} className="w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Order via WhatsApp
                </Button>
              </a>
              {selectedBook.productLink ? (
                <a href={selectedBook.productLink} target="_blank" rel="noopener noreferrer" className="min-w-[200px] grow"> {/* Removed flex-1, added grow and min-width */}
                  <Button size={isMobile ? "sm" : "lg"} variant="outline" className="w-full rounded-full border-purple-500/80 text-purple-600 hover:bg-purple-500/10 dark:border-purple-500/60 dark:text-purple-400 dark:hover:bg-purple-500/10 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md">
                    View Product Page <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              ) : selectedBook.ebookPreviewLink && (
                 <a href={selectedBook.ebookPreviewLink} target="_blank" rel="noopener noreferrer" className="min-w-[200px] grow"> {/* Removed flex-1, added grow and min-width */}
                  <Button size={isMobile ? "sm" : "lg"} variant="outline" className="w-full rounded-full border-purple-500/80 text-purple-600 hover:bg-purple-500/10 dark:border-purple-500/60 dark:text-purple-400 dark:hover:bg-purple-500/10 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md">
                    Read eBook Preview <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
               {selectedBook.playlistLink && (
                 <a href={selectedBook.playlistLink} target="_blank" rel="noopener noreferrer" className="min-w-[200px] grow"> {/* Removed flex-1, added grow and min-width */}
                  <Button size={isMobile ? "sm" : "lg"} variant="outline" className="w-full rounded-full border-blue-500/80 text-blue-600 hover:bg-blue-500/10 dark:border-blue-500/60 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md">
                    Watch Playlist <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-youtube ml-2 h-4 w-4"><path d="M2.8 7.1a2.2 2.2 0 0 1 1.7-1.7C7.3 5 12 5 12 5s4.7 0 7.5.4a2.2 2.2 0 0 1 1.7 1.7c.3 2.1.3 4.9.3 4.9s0 2.8-.3 4.9a2.2 2.2 0 0 1-1.7 1.7c-2.8.4-7.5.4-7.5.4s-4.7 0-7.5-.4a2.2 2.2 0 0 1-1.7-1.7c-.3-2.1-.3-4.9-.3-4.9s0-2.8.3-4.9Z"/><path d="m10 9 5 3-5 3Z"/></svg>
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Book Selector Section */}
        <div className="mt-16 md:mt-20">
          <h4 className="text-xl md:text-2xl font-semibold tracking-tight text-center mb-6 md:mb-8 text-gray-700 dark:text-gray-300">
            More Publications
          </h4>
          {/* Removed sm:justify-center and sm:flex-wrap to ensure horizontal scroll on all sizes */}
          <div className="flex overflow-x-auto py-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent justify-start gap-3 sm:gap-4 md:gap-6">
            {allBooksData.map((book) => (
              <motion.div
                key={`selector-${book.id}`}
                onClick={() => setSelectedBook(book)}
                // Ensured flex-shrink-0 is always active for horizontal scrolling
                className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex-shrink-0 ${selectedBook.id === book.id ? 'ring-2 ring-purple-500 shadow-xl bg-purple-500/5 dark:bg-purple-500/10' : 'hover:shadow-lg bg-card'} ${isMobile ? 'scale-[0.85] origin-bottom' : ''}`}
                whileHover={{ scale: isMobile ? 0.88 : 1.03 }}
                whileTap={{ scale: isMobile ? 0.82 : 0.97 }}
              >
                <ModernBookCover 
                  size="sm" 
                  color={book.id === 'wwok' ? 'yellow' : book.id === 'usuage' ? 'neutral' : 'zinc'} 
                  className="mx-auto"
                  forceRotate={isMobile && selectedBook.id === book.id}
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </ModernBookCover>
                <p className={`mt-2 text-center text-xs font-medium w-full truncate ${selectedBook.id === book.id ? 'text-purple-700 dark:text-purple-300' : 'text-muted-foreground'}`}>
                  {book.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
