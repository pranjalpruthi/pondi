import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline" // Corrected import path
import { Building, Landmark, Users, Handshake } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "motion/react" // Corrected import path as per guidelines

// Define ISKM Pondicherry milestones
const iskmMilestones = [
  {
    id: 1,
    date: "2009",
    title: "Centre Established",
    description: "Establishment of ISKM Pondicherry center.",
    icon: Handshake,
    completed: true
  },
  {
    id: 2,
    date: "2018",
    title: "Land Acquired",
    description: "Received land from the donor for the temple project.",
    icon: Landmark,
    completed: true
  },
  {
    id: 3,
    date: "Sep 8, 2019",
    title: "Construction Began",
    description: "Temple construction began on Radhashtami.",
    icon: Building,
    completed: true
  },
  {
    id: 4,
    date: "Jul 2, 2020",
    title: "Temple Opened",
    description: "The temple was officially opened.",
    icon: Building, // Using Building, could be specific like DoorOpen if available & desired
    completed: true
  },
  {
    id: 5,
    date: "July 2020",
    title: "Goshala Started",
    description: "The Goshala (cow shelter) was initiated.",
    icon: Users, // Representing care/community aspect
    completed: true
  },
  {
    id: 6,
    date: "2020",
    title: "Annadanam Started",
    description: "Commencement of Annadanam (food distribution).",
    icon: Users, // Representing community service
    completed: true
  },
  {
    id: 7,
    date: "Jul 7, 2021",
    title: "Foundation Laid",
    description: "Foundation stone laid for further development.",
    icon: Building,
    completed: true
  },
  {
    id: 8,
    date: "Present",
    title: "Ongoing Construction",
    description: "Construction work is currently in progress.",
    icon: Users, // Represents community effort/ongoing work
    completed: false
  }
]

export function MilestoneTimeline() {
  // Set the current active step (1-indexed) - Adjust as needed
  const currentStep = 8 // "Ongoing Construction" is the current focus
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // Consider tablets and phones as mobile
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full py-12 md:py-16" // Removed bg-secondary/30
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8 md:mb-12"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Our Journey So Far</h2>
          <p className="text-muted-foreground">Key milestones in establishing ISKM Pondicherry.</p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Timeline 
            defaultValue={currentStep} 
            orientation={isMobile ? "vertical" : "horizontal"}
            className={isMobile ? "px-2 max-w-md mx-auto" : "px-2"}
          >
            {iskmMilestones.map((step) => {
              const IconComponent = step.icon
              const isActive = step.id === currentStep;
              const isCompleted = step.completed;

              return (
                <TimelineItem
                  key={step.id}
                  step={step.id}
                  className={isMobile ? 
                    // Mobile vertical layout classes (simplified from original for clarity)
                    "w-[calc(50%-1.5rem)] odd:ms-auto even:text-right even:group-data-[orientation=vertical]/timeline:ms-0 even:group-data-[orientation=vertical]/timeline:me-8 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-indicator]]:-right-6 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-indicator]]:left-auto even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-indicator]]:translate-x-1/2 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-separator]]:-right-6 even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-separator]]:left-auto even:group-data-[orientation=vertical]/timeline:[&_[data-slot=timeline-separator]]:translate-x-1/2" : 
                    // Desktop horizontal layout class
                    "relative flex-1" // Ensure items take space horizontally
                  }
                >
                  <TimelineHeader className={isMobile ? "" : "flex-col items-center"}>
                    <TimelineSeparator />
                    <TimelineDate className={`text-xs mt-1 ${isMobile ? '' : 'order-3'}`}>
                      {step.date}
                    </TimelineDate>
                    <TimelineTitle className={`text-xs sm:text-sm font-medium ${isCompleted ? 'text-primary' : 'text-foreground'} ${isMobile ? '' : 'order-2 mt-1'}`}>
                      {step.title}
                    </TimelineTitle>
                    <TimelineIndicator className={`flex items-center justify-center ${isMobile ? '' : 'order-1 mb-1'} ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                      <IconComponent className={`h-4 w-4 ${isCompleted ? "text-primary" : "text-muted-foreground"}`} />
                    </TimelineIndicator>
                  </TimelineHeader>
                  <TimelineContent className={`text-[10px] sm:text-xs text-muted-foreground ${isMobile ? 'mt-1' : 'mt-2 text-center max-w-[120px] mx-auto'}`}>
                    {step.description}
                  </TimelineContent>
                </TimelineItem>
              )
            })}
          </Timeline>
        </motion.div>
      </div>
    </motion.div>
  )
}
