import * as React from 'react';
import { motion } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernBookCover } from '@/components/cuicui/modern-book-cover';
import { Badge } from '@/components/ui/badge';
import { FlipButton } from '@/components/animate-ui/buttons/flip';
import { LiquidButton } from '@/components/animate-ui/buttons/liquid';
import { BookOpen, Languages, CheckCircle, Eye, Download } from 'lucide-react';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { InView } from '@/components/motion-primitives/in-view';

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
  previewPdfPath?: string;
  productLink?: string;
  playlistLink?: string;
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
  previewPdfPath: "/assets/books/IA77.pdf",
  playlistLink: "https://youtube.com/playlist?list=PLQGHF3mp1o78H-_CwnooAqyfYo8wznJjw&feature=shared",
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
  previewPdfPath: "/assets/books/WWOK.pdf",
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
  previewPdfPath: "/assets/books/Usage of BBT Books – ISKM Position Paper.pdf",
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

const PDFPreview: React.FC<{ src: string }> = ({ src }) => {
  return (
    <iframe
      src={src}
      style={{ height: '100%', width: '100%', border: 'none' }}
      title="PDF Preview"
      allowFullScreen
    />
  );
};

export function FeaturedBooksSection() {
  const [selectedBook, setSelectedBook] = React.useState<BookDetailData>(allBooksData[0]);
  const [orderNumber, setOrderNumber] = React.useState('');
  const isMobile = useIsMobile();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = React.useState<string | undefined>(undefined);
  const [previewBookTitle, setPreviewBookTitle] = React.useState<string>('');

  const handlePreviewClick = (pdfUrl: string, bookTitle: string) => {
    setPreviewPdfUrl(pdfUrl);
    setPreviewBookTitle(bookTitle);
    setIsPreviewOpen(true);
  };

  React.useEffect(() => {
    if (selectedBook) {
      setOrderNumber(generateOrderNumber(selectedBook.orderIdPrefix));
    }
  }, [selectedBook]);

  const whatsAppMessageWithOrder = `${selectedBook.baseWhatsAppMessageTemplate}${orderNumber}`;
  const whatsAppOrderUrl = `https://wa.me/${selectedBook.whatsAppNumber}?text=${encodeURIComponent(whatsAppMessageWithOrder)}`;

  return (
    <>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-8 md:gap-10 items-start">
          <motion.div
            key={`${selectedBook.id}-cover`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.02 }}
            className="md:col-span-1 lg:col-span-4 flex justify-center items-center"
          >
            <ModernBookCover size={isMobile ? "md" : "lg"} color={selectedBook.id === 'wwok' ? 'yellow' : selectedBook.id === 'usuage' ? 'neutral' : 'zinc'} className="shadow-xl hover:shadow-zinc-400/30 dark:hover:shadow-black/50 transition-shadow duration-300">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="w-full h-full object-cover"
              />
            </ModernBookCover>
          </motion.div>

          <motion.div
            key={selectedBook.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springTransition, delay: 0.05 }}
            className="md:col-span-1 lg:col-span-6 space-y-4"
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

            <div className="mt-6 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="space-y-4 flex-grow">
                {selectedBook.keyPoints && (
                  <motion.ul
                    key={`${selectedBook.id}-keypoints`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springTransition, delay: 0.1 }}
                    className="space-y-2 text-muted-foreground"
                  >
                    {selectedBook.keyPoints.map((point, index) => (
                      <li key={index} className="text-base md:text-lg flex items-center">
                        {point.icon}
                        <span>{point.title}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}

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
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center justify-start lg:justify-end shrink-0">
                <a href={whatsAppOrderUrl} target="_blank" rel="noopener noreferrer">
                  <LiquidButton
                    variant="default"
                    className="w-24 h-24 p-2 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg"
                    style={{ '--liquid-button-color': '#25D366' } as React.CSSProperties}
                  >
                    <IconBrandWhatsapp className="h-10 w-10" />
                    <span className="text-xs font-semibold">Order</span>
                  </LiquidButton>
                </a>

                {selectedBook.productLink && (
                  <a href={selectedBook.productLink} target="_blank" rel="noopener noreferrer">
                    <FlipButton
                      className="w-24 h-24 p-2 rounded-2xl text-white shadow-lg"
                      frontClassName="bg-sky-500 hover:bg-sky-600"
                      backClassName="bg-sky-700"
                      frontContent={
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Eye className="h-10 w-10" />
                          <span className="text-xs font-semibold text-center">Product Page</span>
                        </div>
                      }
                      backContent={<span className="text-sm font-bold">View Now</span>}
                    />
                  </a>
                )}

                {selectedBook.previewPdfPath &&
                  (isMobile ? (
                    <a href={selectedBook.previewPdfPath} download={`${selectedBook.title.replace(/\s+/g, '_')}-Preview.pdf`}>
                      <LiquidButton
                        variant="secondary"
                        className="w-24 h-24 p-2 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg"
                      >
                        <Download className="h-10 w-10" />
                        <span className="text-xs font-semibold">Download</span>
                      </LiquidButton>
                    </a>
                  ) : (
                    <FlipButton
                      className="w-24 h-24 p-2 rounded-2xl shadow-lg"
                      frontClassName=""
                      backClassName="bg-primary text-primary-foreground"
                      onClick={() => handlePreviewClick(selectedBook.previewPdfPath!, selectedBook.title)}
                      frontContent={
                        <div className="flex flex-col items-center justify-center gap-1">
                          <BookOpen className="h-10 w-10" />
                          <span className="text-xs font-semibold">Preview</span>
                        </div>
                      }
                      backContent={<span className="text-sm font-bold">Open</span>}
                    />
                  ))}

                {!selectedBook.previewPdfPath && selectedBook.ebookPreviewLink && (
                  <a href={selectedBook.ebookPreviewLink} target="_blank" rel="noopener noreferrer">
                    <FlipButton
                      className="w-24 h-24 p-2 rounded-2xl shadow-lg"
                      frontClassName=""
                      backClassName="bg-primary text-primary-foreground"
                      frontContent={
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Eye className="h-10 w-10" />
                          <span className="text-xs font-semibold">eBook</span>
                        </div>
                      }
                      backContent={<span className="text-sm font-bold">Read</span>}
                    />
                  </a>
                )}

                {selectedBook.playlistLink && (
                  <a href={selectedBook.playlistLink} target="_blank" rel="noopener noreferrer">
                    <LiquidButton
                      variant="playlist"
                      className="w-24 h-24 p-2 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10"
                      >
                        <path d="M2.8 7.1a2.2 2.2 0 0 1 1.7-1.7C7.3 5 12 5 12 5s4.7 0 7.5.4a2.2 2.2 0 0 1 1.7 1.7c.3 2.1.3 4.9.3 4.9s0 2.8-.3 4.9a2.2 2.2 0 0 1-1.7 1.7c-2.8.4-7.5.4-7.5.4s-4.7 0-7.5-.4a2.2 2.2 0 0 1-1.7-1.7c-.3-2.1-.3-4.9-.3-4.9s0-2.8.3-4.9Z" />
                        <path d="m10 9 5 3-5 3Z" />
                      </svg>
                      <span className="text-xs font-semibold">Playlist</span>
                    </LiquidButton>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 md:mt-20">
          <InView
            variants={{
              hidden: {
                opacity: 0,
                y: 30,
                scale: 0.95,
                filter: 'blur(4px)',
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
              },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            viewOptions={{ margin: '0px 0px -150px 0px' }}
            once={true}
          >
            <h4 className="text-xl md:text-2xl font-semibold tracking-tight text-center mb-6 md:mb-8 text-gray-700 dark:text-gray-300">
              More Publications
            </h4>
          </InView>
          <div className="flex overflow-x-auto py-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent justify-start gap-3 sm:gap-4 md:gap-6">
            {allBooksData.map((book) => (
              <InView
                key={`selector-${book.id}`}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                    filter: 'blur(4px)',
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                  },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                viewOptions={{ margin: '0px 0px -150px 0px' }}
                once={true}
              >
                <motion.div
                  onClick={() => setSelectedBook(book)}
                  className={`cursor-pointer p-1.5 sm:p-2 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex-shrink-0 ${selectedBook.id === book.id ? 'ring-2 ring-purple-500 shadow-lg bg-purple-500/5 dark:bg-purple-500/10' : 'hover:shadow-md bg-card'} ${isMobile ? 'scale-[0.8] origin-bottom' : 'scale-[0.9]'}`}
                  whileHover={{ scale: isMobile ? 0.82 : 0.93 }}
                  whileTap={{ scale: isMobile ? 0.78 : 0.88 }}
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
              </InView>
            ))}
          </div>
        </div>
      </div>
    </section>
    <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <SheetContent side="bottom" className="h-[90vh] w-full max-w-full p-0 sm:max-w-full">
        <SheetHeader className="p-4 border-b flex-shrink-0">
          <SheetTitle>Book Preview: {previewBookTitle}</SheetTitle>
        </SheetHeader>
        <div className="flex-grow relative overflow-auto h-full">
          {previewPdfUrl && <PDFPreview src={previewPdfUrl} />}
        </div>
      </SheetContent>
    </Sheet>
    </>
  );
}
