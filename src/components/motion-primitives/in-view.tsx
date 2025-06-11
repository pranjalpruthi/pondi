'use client';
import { type ReactNode, useRef, useState } from 'react';
import {
  motion,
  useInView,
 type Variant,
 type Transition,
 type UseInViewOptions,
 type MotionProps,
} from 'motion/react';

export type InViewProps = {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  once?: boolean;
  [key: string]: any;
};

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = 'div',
  once,
  ...rest
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);

  const [isViewed, setIsViewed] = useState(false)

  const MotionComponent: React.ComponentType<React.ComponentProps<any> & MotionProps> =
    typeof as === 'string' ? motion[as as keyof typeof motion] : motion(as);

  return (
    <MotionComponent
      ref={ref}
      initial='hidden'
      onAnimationComplete={() => {
        if (once) setIsViewed(true)
      }}
      animate={(isInView || isViewed) ? "visible" : "hidden"}

      variants={variants}
      transition={transition}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
