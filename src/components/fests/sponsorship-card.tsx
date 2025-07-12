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
  import { Input } from '@/components/ui/input';
  import { cn } from '@/lib/utils';
  import { PlusIcon, IndianRupee } from 'lucide-react';
  import { useState } from 'react';
  
  type SponsorshipCardProps = {
    service: {
      title: string;
      image: string;
      description: string;
      quote: string;
      quoteAuthor: string;
    };
  };
  
  export function SponsorshipCard({ service }: SponsorshipCardProps) {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
  
    const donationAmounts = [501, 1001, 2501, 5001];
  
    const handleAmountClick = (amount: number) => {
      setSelectedAmount(amount);
      setCustomAmount(String(amount));
    };
  
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setCustomAmount(value);
      setSelectedAmount(null);
    };
  
    return (
      <MorphingDialog
        transition={{
          type: 'spring',
          bounce: 0.05,
          duration: 0.25,
        }}
      >
        <MorphingDialogTrigger
          style={{
            borderRadius: '12px',
          }}
          className='flex w-full max-w-sm flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 shadow-lg hover:shadow-xl transition-shadow duration-300'
        >
          <div className="relative h-56 w-full">
            <img
              src={service.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover blur-md"
              aria-hidden="true"
            />
            <MorphingDialogImage
              src={service.image}
              alt={service.title}
              className='relative h-full w-full object-contain'
            />
          </div>
          <div className='flex grow flex-row items-center justify-between p-4'>
            <div>
              <MorphingDialogTitle className='text-lg font-semibold text-zinc-950 dark:text-zinc-50'>
                {service.title}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className='text-sm text-zinc-700 dark:text-zinc-400'>
                Click to learn more & sponsor
              </MorphingDialogSubtitle>
            </div>
            <div
              className='relative ml-1 flex h-8 w-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-full bg-orange-500 text-white transition-colors focus-visible:ring-2 active:scale-[0.98]'
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
            className='pointer-events-auto relative flex h-auto w-full max-w-4xl flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900'
          >
            <div className="relative h-64 w-full">
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
            <div className='p-8 md:p-10'>
              <MorphingDialogTitle className='text-3xl md:text-4xl font-bold text-indigo-900 dark:text-indigo-200'>
                {service.title}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className='text-lg text-orange-600 dark:text-orange-400 font-semibold mt-1'>
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
                <p className='mt-4 text-base md:text-lg text-zinc-600 dark:text-zinc-400'>
                  {service.description}
                </p>
                <blockquote className="mt-6 border-l-4 border-amber-500 pl-4 italic text-zinc-600 dark:text-zinc-400">
                  <p className="text-base md:text-lg">"{service.quote}"</p>
                  <cite className="mt-2 block not-italic font-semibold text-zinc-700 dark:text-zinc-300">— {service.quoteAuthor}</cite>
                </blockquote>
  
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Choose Your Contribution</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {donationAmounts.map(amount => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? 'default' : 'outline'}
                        onClick={() => handleAmountClick(amount)}
                        className={cn(
                          'h-14 text-xl font-bold transition-colors duration-200 rounded-lg transform-gpu',
                          selectedAmount === amount 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white ring-4 ring-orange-500/50 ring-offset-2 dark:ring-offset-zinc-900'
                            : 'bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800'
                        )}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                  <div className="relative mt-4">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
                    <Input
                      type="text"
                      placeholder="Custom Amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="h-16 pl-14 text-xl w-full rounded-lg"
                    />
                  </div>
                </div>
  
                <Button
                  asChild
                  size="lg"
                  className="relative w-full mt-8 h-16 px-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold text-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 group"
                >
                  <a href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
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
