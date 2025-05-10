import { createFileRoute } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from "motion/react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useRef } from 'react'

export const Route = createFileRoute('/about/')({
  component: AboutPage,
})

function AboutPage() {
  // Refs for scroll animations
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const quoteRef = useRef(null)
  
  // Parallax scroll effect for hero image
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 100])
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const fadeInLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const fadeInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const missionItems = [
    {
      id: 1,
      icon: "🕉️",
      title: "Spread Krishna's Teachings",
      description: "Spread the teachings of Lord Sri Krishna as presented by Srila Prabhupada.",
      image: "/images/about/krishna-teachings.jpg"
    },
    {
      id: 2,
      icon: "🙏",
      title: "Promote Devotional Service",
      description: "Promote devotional service (bhakti yoga) as the foundation of a meaningful life.",
      image: "/images/about/bhakti-yoga.jpg"
    },
    {
      id: 3,
      icon: "📚",
      title: "Provide Spiritual Education",
      description: "Provide spiritual education through scriptures like the Bhagavad Gita and Srimad Bhagavatam.",
      image: "/images/about/scripture-study.jpg"
    },
    {
      id: 4,
      icon: "🍚",
      title: "Distribute Prasadam",
      description: "Distribute prasadam freely to ensure no one goes hungry.",
      image: "/images/about/prasadam.jpg"
    },
    {
      id: 5,
      icon: "👨‍👩‍👧‍👦",
      title: "Character-Building Programs",
      description: "Conduct character-building programs for youth and the broader society.",
      image: "/images/about/youth-programs.jpg"
    },
    {
      id: 6,
      icon: "🐄",
      title: "Gokulam Goshala",
      description: "ISKM Pondicherry has Gokulam Goshala, dedicated to protecting cows and promoting Go-seva as an essential part of Vedic culture and Srila Prabhupada's mission.",
      image: "/images/about/goshala.jpg"
    }
  ]

  const valueItems = [
    {
      id: 1,
      icon: "💖",
      title: "Compassion",
      description: "Practice compassion towards all living entities, recognizing the divine spark in every soul."
    },
    {
      id: 2,
      icon: "🧠",
      title: "Spiritual Knowledge",
      description: "Cultivate transcendental knowledge through studying sacred texts and applying their wisdom."
    },
    {
      id: 3,
      icon: "🌱",
      title: "Simple Living",
      description: "Embrace a lifestyle of simplicity, mindfulness, and respect for Mother Earth."
    },
    {
      id: 4,
      icon: "🤝",
      title: "Community Service",
      description: "Serve the community selflessly as an expression of devotion to Krishna."
    }
  ]

  const programItems = [
    {
      id: 1,
      title: "Daily Arati",
      schedule: "Morning: 4:30 AM, Noon: 12:00 PM, Evening: 7:00 PM",
      description: "Temple worship with beautiful deity darshan, kirtan, and arati ceremonies."
    },
    {
      id: 2,
      title: "Sunday Feast Program",
      schedule: "Every Sunday, 4:30 PM - 8:00 PM",
      description: "Join us for kirtan, discourse on Bhagavad Gita, and delicious prasadam feast."
    },
    {
      id: 3,
      title: "Bhagavad Gita Study",
      schedule: "Thursdays, 6:00 PM - 7:30 PM",
      description: "In-depth study and discussion of Bhagavad Gita As It Is with senior devotees."
    },
    {
      id: 4,
      title: "Kirtan Mela",
      schedule: "First Saturday of every month, 6:00 PM - 9:00 PM",
      description: "Immerse yourself in the transcendental sound vibration of Krishna's holy names."
    }
  ]

  const faqItems = [
    {
      question: "What is Krishna Consciousness?",
      answer: "Krishna Consciousness is the awakening of our original, pure consciousness where one realizes their eternal relationship with Krishna (God). It is a scientific and practical approach to spiritual life based on the teachings of the Bhagavad Gita and other Vedic scriptures."
    },
    {
      question: "Do I need to be Hindu to visit or participate?",
      answer: "No, ISKM welcomes people from all backgrounds, faiths, and walks of life. The teachings and practices of Krishna Consciousness are universal and can be embraced by anyone interested in spiritual growth."
    },
    {
      question: "What should I wear when visiting the temple?",
      answer: "We recommend modest attire when visiting the temple. For men, shirts and pants or dhotis are appropriate. For women, saris, long skirts, or dresses that cover the legs are recommended. You might also want to bring a shawl to cover your shoulders."
    },
    {
      question: "What is prasadam?",
      answer: "Prasadam literally means 'mercy' and refers to vegetarian food that has been offered to Krishna with devotion. We believe that when food is offered to Krishna, it becomes spiritualized and purifies those who consume it."
    }
  ]

  const leadershipTeam = [
    {
      name: "Swami Maharaj",
      role: "Temple President",
      bio: "Serving the mission for over 25 years, guiding the community with wisdom and compassion.",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Bhakti Devi Dasi",
      role: "Program Director",
      bio: "Dedicated to organizing spiritual events and educational initiatives for all age groups.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Krishna Das",
      role: "Outreach Coordinator",
      bio: "Passionate about sharing Krishna Consciousness through community engagement and service.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    }
  ]

  // Fallback image URLs (from Unsplash) in case local images don't exist
  const fallbackImages = [
    "https://images.unsplash.com/photo-1625305561707-59145b50c36b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1626239656531-95cf6b18be5b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622677890084-3c1eef022d5a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628513468105-9a0383e9a0db?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561489404-42f13bbfc5e9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584966183581-a98257663730?q=80&w=800&auto=format&fit=crop"
  ]

  return (
    <div ref={containerRef} className="relative max-w-6xl mx-auto px-4 py-12 md:py-20 overflow-hidden">
      {/* Decorative element - Lotus pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M100,15 C125,15 150,35 150,55 C175,55 185,80 185,100 C185,120 175,145 150,145 C150,165 125,185 100,185 C75,185 50,165 50,145 C25,145 15,120 15,100 C15,80 25,55 50,55 C50,35 75,15 100,15 Z" />
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M100,15 C125,15 150,35 150,55 C175,55 185,80 185,100 C185,120 175,145 150,145 C150,165 125,185 100,185 C75,185 50,165 50,145 C25,145 15,120 15,100 C15,80 25,55 50,55 C50,35 75,15 100,15 Z" />
        </svg>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About <span className="text-primary">ISKM Pondicherry</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Dedicated to spreading spiritual knowledge and promoting a compassionate lifestyle based on Vedic principles.
        </p>
      </motion.div>
      
      {/* Hero Image with Parallax */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative w-full h-64 md:h-[500px] mb-16 rounded-xl overflow-hidden"
      >
        <motion.img 
          style={{ y: heroImageY }}
          src="https://images.unsplash.com/photo-1518607692857-bff9babd9d40?q=80&w=1200&auto=format&fit=crop"
          alt="ISKM Pondicherry Temple"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 md:p-8">
            <h2 className="text-white text-2xl md:text-3xl font-bold">
              ISKM Pondicherry
            </h2>
            <p className="text-white/90 mt-2 max-w-xl">
              A spiritual sanctuary dedicated to the teachings of Lord Krishna and Srila Prabhupada
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-16 flex justify-center flex-wrap gap-3"
      >
        <Button variant="outline" onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}>
          Our History
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}>
          Our Mission
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('values')?.scrollIntoView({ behavior: 'smooth' })}>
          Our Values
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}>
          Programs
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}>
          Our Team
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
          FAQ
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth' })}>
          Visit Us
        </Button>
      </motion.div>
      
      {/* Brief History Section */}
      <motion.div
        id="history"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="mb-16"
      >
        <Card className="border-0 bg-primary/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-2/5">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-primary"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1519846608558-08e6e9a4eeec?q=80&w=600&auto=format&fit=crop"
                    alt="Temple history"
                    className="rounded-md shadow-lg w-full"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <h3 className="text-2xl font-bold mb-3">Our History</h3>
                <p className="text-muted-foreground mb-4">
                  ISKM Pondicherry was established to bring the teachings of Srila Prabhupada to the region, 
                  creating a spiritual sanctuary for those seeking connection with Krishna and a deeper understanding 
                  of Vedic wisdom.
                </p>
                <p className="text-muted-foreground">
                  Since our founding, we have grown into a vibrant community center, offering a wide range of 
                  spiritual programs, educational initiatives, and community services to people from all walks of life.
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm">Learn More About Our Heritage</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <Separator className="my-16" />
      
      {/* Mission Section */}
      <motion.div
        id="mission"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {missionItems.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={fallbackImages[index]} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  onError={(e) => {
                    // Fallback if the image doesn't load
                    e.currentTarget.src = fallbackImages[index];
                  }}
                />
              </div>
              <CardHeader>
                <div className="text-3xl mb-2" aria-hidden="true">{item.icon}</div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <Separator className="my-16" />
      
      {/* Values Section */}
      <motion.div
        id="values"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">
          These core values guide our actions and define who we are as a spiritual community.
        </p>
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        {valueItems.map((item, index) => (
          <motion.div
            key={item.id}
            variants={index % 2 === 0 ? fadeInLeftVariants : fadeInRightVariants}
          >
            <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-primary">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Testimonial Quote Section */}
      <motion.div
        ref={quoteRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="relative mb-16 py-12 px-4 md:py-16 md:px-8 bg-primary/5 rounded-2xl overflow-hidden"
      >
        {/* Decorative quote marks */}
        <div className="absolute top-0 left-0 text-primary/10 text-9xl md:text-[12rem] font-serif leading-none pointer-events-none">
          "
        </div>
        <div className="absolute bottom-0 right-8 text-primary/10 text-9xl md:text-[12rem] font-serif leading-none pointer-events-none">
          "
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl italic text-foreground mb-6">
            "Krishna consciousness is the scientific process of spiritual life. It is not a religious faith or sentiment. 
            It is the actual scientific understanding of our relationship with God."
          </p>
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Srila_Prabhupada.JPG/330px-Srila_Prabhupada.JPG"
                alt="Srila Prabhupada"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-bold">Srila Prabhupada</p>
              <p className="text-sm text-muted-foreground">Founder-Acharya of ISKCON</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <Separator className="my-16" />
      
      {/* Programs Section */}
      <motion.div
        id="programs"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Programs & Activities</h2>
      </motion.div>
      
      <Tabs defaultValue="daily" className="mb-16">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="daily">Daily Programs</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Events</TabsTrigger>
          <TabsTrigger value="special">Special Events</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {programItems.slice(0, 2).map((program) => (
              <motion.div 
                key={program.id}
                variants={itemVariants}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.schedule}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{program.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {programItems.slice(1, 3).map((program) => (
              <motion.div 
                key={program.id}
                variants={itemVariants}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.schedule}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{program.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        <TabsContent value="special" className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[programItems[3], programItems[0]].map((program) => (
              <motion.div 
                key={program.id}
                variants={itemVariants}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.schedule}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{program.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-16" />
      
      {/* Our Team Section */}
      <motion.div
        id="team"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Leadership Team</h2>
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {leadershipTeam.map((member, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <Card className="overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <Separator className="my-16" />
      
      {/* FAQ Section */}
      <motion.div
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUpVariants}
        className="max-w-3xl mx-auto mb-16"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">Have other questions?</p>
          <Button>Contact Us</Button>
        </div>
      </motion.div>
      
      <Separator className="my-16" />
      
      {/* Visit Us Section */}
      <motion.div
        id="visit"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Visit Us</h2>
        <p className="text-center text-muted-foreground mb-8">
          We invite you to visit ISKM Pondicherry to experience the spiritual atmosphere, 
          attend our programs, and engage in devotional service. All are welcome regardless 
          of background or beliefs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Location & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-sm text-muted-foreground">
                    ISKM Pondicherry Temple,<br/>
                    12 Temple Street, Bharathi Nagar,<br/>
                    Pondicherry 605001, India
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-sm text-muted-foreground">+91 413-2245555</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-sm text-muted-foreground">info@iskmpondicherry.org</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Temple Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Morning: 4:30 AM - 12:00 PM<br/>
                    Evening: 4:30 PM - 8:30 PM
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Get Directions</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="aspect-auto w-full">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                {/* Embedding Google Map */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.0379456526706!2d79.8196995!3d11.9340466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5364c114a0bc37%3A0x7da0316fe6016cbb!2sPondicherry!5e0!3m2!1sen!2sin!4v1623498314852!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: "var(--radius)" }} 
                  allowFullScreen 
                  loading="lazy"
                  title="ISKM Pondicherry Location"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">We look forward to welcoming you!</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Plan Your Visit
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 