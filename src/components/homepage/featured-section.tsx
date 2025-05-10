import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export const FeaturedSection = () => (
  <section className="w-full py-20 lg:py-40 relative overflow-visible">
    <div className="container mx-auto">
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <div className="w-full aspect-video h-full flex-1 rounded-lg overflow-hidden shadow-xl">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/F-rfr7vrpMc"
            title="Are we Iskcon or not?"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col flex-1">
          <div>
            <Badge variant="secondary" className="text-sm font-medium">Featured Discussion</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-2xl md:text-4xl lg:text-5xl tracking-tighter font-bold text-left text-foreground">
              🤔 Are we ISKCON or not?
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left mt-4">
              We will discuss the core differences between International Sri Krishna Mandir (ISKM) & International Society for Krishna Consciousness (ISKCON)
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center text-sm md:text-base text-foreground">
                <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                🏛️ Why create a different society?
              </li>
              <li className="flex items-center text-sm md:text-base text-foreground">
                <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                🧑‍🏫 Srila Prabhupada founded ISKCON, not ISKM?
              </li>
              <li className="flex items-center text-sm md:text-base text-foreground">
                <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                🤝 Why fight amongst ourselves?
              </li>
            </ul>
            <Button className="mt-8 w-fit" size="lg">
              Learn More
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
) 