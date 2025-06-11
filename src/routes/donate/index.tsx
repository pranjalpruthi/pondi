import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { MessageCircle } from 'lucide-react';
import { HighlightText } from '@/components/animate-ui/text/highlight';
import { MorphingText } from '@/components/magicui/morphing-text';

export const Route = createFileRoute('/donate/')({
  component: DonatePage,
});

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

interface Quote {
  text: string;
  source: string;
  type: 'Translation' | 'Purport';
}

const prasadamQuotes: Quote[] = [
  { text: "The devotees of the Lord are released from all kinds of sins because they eat food which is offered first for sacrifice. Others, who prepare food for personal sense enjoyment, verily eat only sin.", source: "Bhagavad-gita As It Is 3.13", type: "Translation" },
  { text: "Human prosperity flourishes by natural gifts and not by gigantic industrial enterprises. The natural gifts such as grains and vegetables, fruits, rivers, hills, jewels, minerals and precious stones, and the cow’s milk are sufficient for maintaining a man who is obedient to the laws of nature.", source: "Srimad Bhagavatam 1.17.3", type: "Purport" },
  { text: "If one offers Me with love and devotion a leaf, a flower, fruit or water, I will accept it.", source: "Bhagavad-gita As It Is 9.26", type: "Translation" },
  { text: "The process of offering food in sacrifice to the Supreme Lord and then distributing the remnants to everyone is called prasada distribution. This activity should be expanded universally to stop hunger throughout the world.", source: "Srimad Bhagavatam 4.21.36", type: "Purport" },
];

const goSevaQuotes: Quote[] = [
  { text: "The cow, in whom the legs of religion stood, was now rendered poor and calf-less, her legs beaten by a sudra, and she was weeping in distress, with tears in her eyes. She was being forced to drink water mixed with pus.", source: "Srimad Bhagavatam 1.16.18", type: "Translation" },
  { text: "The protection of the cow means increasing the production of milk, the miracle of aggregate food value.", source: "Srimad Bhagavatam 1.16.18", type: "Purport" },
  { text: "The personality of religion said: These words just spoken by you befit a person of the Pandava dynasty. Captivated by devotional qualities, the Pandavas have always been glorified. The Supreme Personality of Godhead, Lord Krishna, is especially attached to them.", source: "Srimad Bhagavatam 1.17.9", type: "Translation" },
  { text: "Farming, cow protection and business are the natural work for the vaisyas, and for the sudras there is labor and service to others.", source: "Bhagavad-gita As It Is 18.44", type: "Translation" },
];

const sevaPhrases = [
  "Support Our Seva",
  "Serve with Love",
  "Offer Your Heart",
  "Krishna's Mercy Flows",
  "Your Seva Matters",
  "Join the Mission",
  "Spread Bhakti",
];

function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 bg-secondary/30 border-secondary/50">
        <CardContent className="pt-6">
          <blockquote className="italic text-foreground/80">"{quote.text}"</blockquote>
          <p className="text-right text-sm text-muted-foreground mt-2">— {quote.source} <Badge variant="outline" className="ml-1">{quote.type}</Badge></p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 pt-16 md:pt-24">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16 text-center md:text-left"
      >
        <motion.img
          src="/assets/pondi.webp"
          alt="Pondi Logo"
          className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover shadow-lg"
          initial={{ opacity: 0, scale: 0.5, x: -50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.2 }}
        />
        <div className="flex flex-col">
          <MorphingText
            texts={sevaPhrases}
            className="text-4xl md:text-5xl font-bold tracking-tight text-primary !h-14 md:!h-20" 
          />
          <p className="text-xl md:text-2xl text-muted-foreground mt-4 md:mt-3">
            Your contribution, <HighlightText text="big" className="!px-1 !py-0.5 from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 text-white" /> or <HighlightText text="small" className="!px-1 !py-0.5 from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 text-white" />, makes a <HighlightText text="divine difference" className="!px-1 !py-0.5 from-teal-400 to-cyan-400 dark:from-teal-500 dark:to-cyan-500 text-white" />. 🙏❤️✨
          </p>
        </div>
      </motion.header>

      {/* Prasadam Seva Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="mb-16"
        id="prasadam-seva"
      >
        <Card className="overflow-hidden shadow-lg border-primary/20">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img src="/extra/dona.png" alt="Prasadam Dona" className="w-20 h-20 object-contain hidden md:block" />
              <div>
                <CardTitle className="text-3xl font-bold text-amber-800 dark:text-amber-200">
                  <HighlightText text="Prasadam Seva – A Daily Offering of Love" className="!px-0 !py-0 bg-transparent dark:bg-transparent from-amber-500/70 to-orange-500/70 dark:from-amber-300/70 dark:to-orange-300/70" />
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300 mt-1">
                  Help us serve sanctified Krishna-conscious meals (prasadam) to those in need, every single day.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                At ISKM Pondicherry, we believe that no one should go hungry, and everyone deserves the divine mercy of prasadam. Your humble offering becomes a divine gift in Krishna’s service, feeding hungry souls with not just food—but spiritual nourishment.
              </p>

              <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                <h3 className="font-semibold text-lg mb-2 text-primary">🌿 What is Dona Seva?</h3>
                <p className="text-sm text-muted-foreground">
                  One dona is a small eco-friendly cup-plate used to serve prasadam. Now, you can be a part of this sacred mission by contributing as little as <strong className="text-foreground">₹5</strong> to sponsor <strong className="text-foreground">1 dona</strong> of Krishna prasadam for someone in need. Even small contributions like ₹5, ₹10, or ₹50 per day go a long way when done with devotion.
                </p>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                <h3 className="font-semibold text-lg mb-2 text-primary">🌼 Be a Daily Donor – Join the Seva Movement</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong className="text-foreground">₹5 = 1 dona</strong> of prasadam</li>
                  <li>Choose your amount: daily, weekly, or monthly</li>
                  <li>Perfect for students, working professionals, families – anyone can give!</li>
                </ul>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                 <h3 className="font-semibold text-lg mb-2 text-primary">🙏 How to Join</h3>
                 <p className="text-sm text-muted-foreground">
                   Subscribe to daily or regular donations and become a part of this beautiful seva. Every meal served carries your love, compassion, and Krishna’s mercy. Scan the QR code to contribute.
                 </p>
              </div>

               <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                 <h3 className="font-semibold text-lg mb-2 text-primary">🌟 Why Contribute?</h3>
                 <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Your small daily donation becomes a powerful offering when united with others.</li>
                    <li>You become a channel of Krishna’s mercy through prasadam distribution.</li>
                    <li>It's a simple yet profound act of seva (service) you can do from anywhere.</li>
                 </ul>
                 <p className="italic text-center mt-4 text-foreground/80">“Even the smallest offering, when made with devotion, pleases the Lord.”</p>
              </div>

            </div>
            <div className="flex flex-col items-center justify-center space-y-6">
              <motion.img
                variants={itemVariants}
                src="/assets/extra/miniqr.png"
                alt="Donation QR Code"
                className="w-48 h-48 md:w-64 md:h-64 object-contain border-4 border-primary/50 rounded-lg p-1 shadow-md"
              />
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white w-full">
                Donate Now (via QR)
              </Button>
              <p className="text-center text-sm text-muted-foreground">Scan to contribute easily.</p>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Or use UPI ID:</p>
                <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-md max-w-xs mx-auto">
                  <span className="text-sm font-mono text-purple-600 dark:text-purple-400">ISKM.04@idfcbank</span>
                  <CopyButton size="sm" variant="ghost" content="ISKM.04@idfcbank" className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  After payment, please share a screenshot with us on WhatsApp:
                </p>
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto"
                  onClick={() => window.open('https://wa.me/919380395156', '_blank')}
                >
                  <MessageCircle className="mr-2 h-5 w-5" /> Share on WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground mt-1">+91 93803 95156</p>
              </div>
              <motion.img
                variants={itemVariants}
                src="/pp/pp1.webp"
                alt="Srila Prabhupada"
                className="w-32 h-auto rounded-md shadow-sm mt-4"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6">
             <div className="w-full">
                <h3 className="font-semibold text-xl mb-4 text-center text-amber-800 dark:text-amber-200">Prasadam Seva – Quotes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prasadamQuotes.map((quote, index) => (
                        <QuoteCard key={`prasadam-${index}`} quote={quote} />
                    ))}
                </div>
                <p className="text-center mt-6 text-lg font-semibold text-amber-700 dark:text-amber-300">
                    Let’s feed the body and soul—one dona at a time.
                </p>
             </div>
          </CardFooter>
        </Card>
      </motion.section>

      <Separator className="my-16 border-primary/30" />

      {/* Go Seva Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="mb-16"
        id="go-seva"
      >
        <Card className="overflow-hidden shadow-lg border-green-600/20">
          <CardHeader className="bg-gradient-to-r from-green-100 to-lime-100 dark:from-green-900/30 dark:to-lime-900/30 p-6">
             <div className="flex flex-col md:flex-row items-center gap-4">
               <div className="w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-4xl hidden md:block">🐄</div>
               <div>
                  <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200">
                    <HighlightText text="Go Seva – Serve and Protect Mother Cow" className="!px-0 !py-0 bg-transparent dark:bg-transparent from-green-500/70 to-lime-500/70 dark:from-green-300/70 dark:to-lime-300/70" />
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300 mt-1">
                    Support the care of sacred cows at ISKM Pondicherry’s Gokulam Goshala.
                  </CardDescription>
               </div>
             </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                At ISKM Pondicherry’s Gokulam Goshala, we are dedicated to protecting and lovingly caring for Mother Cow, who is revered as sacred in Vedic culture and dear to Lord Krishna. By participating in Go Seva, you directly support the feeding, medical care, shelter, and comfort of cows and calves in our goshala.
              </p>

              <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                <h3 className="font-semibold text-lg mb-2 text-primary">💖 Join the Go Seva</h3>
                <p className="text-sm text-muted-foreground">
                  You can be a part of this divine service by contributing as little as <strong className="text-foreground">₹10 per day</strong> for a basic Go Seva unit. Just ₹10 helps provide fresh fodder or care for one cow for a day. Whether you choose to offer ₹10, ₹50, ₹100 or more daily, your support sustains these gentle beings and uplifts your soul through this sacred act of seva.
                </p>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                 <h3 className="font-semibold text-lg mb-2 text-primary">🙏 How to Join</h3>
                 <p className="text-sm text-muted-foreground">
                   Make Go Seva part of your daily sadhana. Let your offering nourish, protect, and serve Mother Cow—the embodiment of purity and compassion. Scan the QR code to contribute.
                 </p>
              </div>

               <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                 <h3 className="font-semibold text-lg mb-2 text-primary">🌟 Why Contribute to Go Seva?</h3>
                 <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Cows are central to Lord Krishna’s life—He is lovingly called Gopal and Govinda, the protector of cows.</li>
                    <li>Supporting Go Seva pleases the Lord and aligns with Srila Prabhupada’s mission.</li>
                    <li>It’s a simple, powerful way to practice daily devotion, from wherever you are.</li>
                 </ul>
              </div>

            </div>
            <div className="flex flex-col items-center justify-center space-y-6">
              <motion.img
                variants={itemVariants}
                src="/assets/extra/miniqr.png" // Using the same QR code as requested
                alt="Donation QR Code"
                className="w-48 h-48 md:w-64 md:h-64 object-contain border-4 border-green-600/50 rounded-lg p-1 shadow-md"
              />
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white w-full">
                Donate for Go Seva (via QR)
              </Button>
              <p className="text-center text-sm text-muted-foreground">Scan to contribute easily.</p>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Or use UPI ID:</p>
                <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-md max-w-xs mx-auto">
                  <span className="text-sm font-mono text-purple-600 dark:text-purple-400">ISKM.04@idfcbank</span>
                  <CopyButton size="sm" variant="ghost" content="ISKM.04@idfcbank" className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  After payment, please share a screenshot with us on WhatsApp:
                </p>
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto"
                  onClick={() => window.open('https://wa.me/919380395156', '_blank')}
                >
                  <MessageCircle className="mr-2 h-5 w-5" /> Share on WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground mt-1">+91 93803 95156</p>
              </div>
               {/* Placeholder for another relevant image if needed */}
            </div>
          </CardContent>
           <CardFooter className="bg-gradient-to-r from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 p-6">
             <div className="w-full">
                <h3 className="font-semibold text-xl mb-4 text-center text-green-800 dark:text-green-200">Go Seva – Quotes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goSevaQuotes.map((quote, index) => (
                        <QuoteCard key={`goseva-${index}`} quote={quote} />
                    ))}
                </div>
                 <p className="italic text-center mt-4 text-foreground/80">“The cow is the mother of all, and she must be protected with love and devotion.”</p>
                <p className="text-center mt-6 text-lg font-semibold text-green-700 dark:text-green-300">
                    Let’s serve Krishna by serving His beloved cows—one seva at a time.
                </p>
             </div>
          </CardFooter>
        </Card>
      </motion.section>
    </div>
  );
}
