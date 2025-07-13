import {
    MorphingDialog,
    MorphingDialogTrigger,
    MorphingDialogContent,
    MorphingDialogTitle,
    MorphingDialogImage,
    MorphingDialogSubtitle,
    MorphingDialogClose,
    MorphingDialogDescription,
    MorphingDialogContainer,
  } from '@/components/motion-primitives/morphing-dialog';
  import { Button } from '@/components/ui/button';
  import { PlusIcon } from 'lucide-react';
  
  type SponsorshipCardProps = {
    service: {
      title: string;
      image: string;
      description: string;
      quote: string;
      quoteAuthor: string;
      url: string;
    };
  };
  
  export function SponsorshipCard({ service }: SponsorshipCardProps) {
  
    return (
      <MorphingDialog
        transition={{
          type: 'spring',
          bounce: 0.05,
          duration: 0.25,
        }}
      >
        <MorphingDialogTrigger
          className='flex w-full max-w-sm flex-row items-center gap-4 overflow-hidden rounded-2xl border border-zinc-950/10 bg-white p-3 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-zinc-50/10 dark:bg-zinc-900 md:flex-col md:gap-0 md:rounded-xl md:p-0'
        >
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg md:h-56 md:w-full md:rounded-none">
            <img
              src={service.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover blur-sm md:blur-md"
              aria-hidden="true"
            />
            <MorphingDialogImage
              src={service.image}
              alt={service.title}
              className='relative h-full w-full object-contain'
            />
          </div>
          <div className='flex grow flex-row items-center justify-between md:justify-between md:p-4'>
            <div className="md:flex-grow">
              <MorphingDialogTitle className='text-base font-semibold text-zinc-950 dark:text-zinc-50 md:text-lg'>
                {service.title}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className='text-sm text-zinc-700 dark:text-zinc-400 mt-0.5'>
                <span className="md:hidden">Click to learn more</span>
                <span className="hidden md:inline">Click to learn more & sponsor</span>
              </MorphingDialogSubtitle>
            </div>
            <div
              className='relative flex h-8 w-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-full bg-orange-500 text-white transition-colors focus-visible:ring-2 active:scale-[0.98] md:ml-1'
              aria-label='Open dialog'
            >
              <PlusIcon size={16} />
            </div>
          </div>
        </MorphingDialogTrigger>
        <MorphingDialogContainer>
          <MorphingDialogContent
            style={{
              borderRadius: '24px',
            }}
            className='pointer-events-auto relative flex h-auto w-full max-w-lg flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900'
          >
            <div className="relative h-56 w-full">
               <img
                src={service.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover blur-lg"
                aria-hidden="true"
              />
              <MorphingDialogImage
                src={service.image}
                alt={service.title}
                className='relative h-full w-full object-contain'
              />
            </div>
            <div className='p-6 md:p-8'>
              <MorphingDialogTitle className='text-2xl md:text-3xl font-bold text-indigo-900 dark:text-indigo-200'>
                {service.title}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className='text-md text-orange-600 dark:text-orange-400 font-semibold mt-1'>
                An offering from the heart
              </MorphingDialogSubtitle>
              <MorphingDialogDescription
                disableLayoutAnimation
                variants={{
                  initial: { opacity: 0, scale: 0.8, y: 100 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.8, y: 100 },
                }}
              >
                <p className='mt-4 text-base text-zinc-600 dark:text-zinc-400'>
                  {service.description}
                </p>
                <blockquote className="mt-4 border-l-4 border-amber-500 pl-4 italic text-zinc-600 dark:text-zinc-400">
                  <p className="text-base">"{service.quote}"</p>
                  <cite className="mt-2 block not-italic font-semibold text-zinc-700 dark:text-zinc-300">— {service.quoteAuthor}</cite>
                </blockquote>
  
                <Button
                  asChild
                  size="lg"
                  className="relative w-full mt-6 h-14 px-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold text-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 group"
                >
                  <a href={service.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg transition-all duration-300 ease-in-out group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-xl"></span>
                    <span className="relative flex items-center justify-center gap-3">
                      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Wrapped%20Gift.png" alt="Wrapped Gift" width="28" height="28" />
                      Sponsor Seva
                    </span>
                  </a>
                </Button>
              </MorphingDialogDescription>
            </div>
            <MorphingDialogClose className='text-zinc-50' />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    );
  }
