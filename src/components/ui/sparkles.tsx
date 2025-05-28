'use client';

import { useEffect, useId, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface SparklesProps {
  className?: string;
  color?: string;
}

export function Sparkles({
  className,
  color = '#FFD700',
}: SparklesProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsReady(true);
    });
  }, []);

  const id = useId();
  const defaultOptions = {
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    particles: {
      number: {
        value: 400,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: color,
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 1,
        random: true,
        animation: {
          enable: true,
          speed: 3,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "top" as const,
        random: true,
        straight: false,
        outModes: {
          default: "out"
        },
      },
      links: {
        enable: false,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "bubble"
        },
        onClick: {
          enable: true,
          mode: "push"
        },
      },
      modes: {
        bubble: {
          distance: 200,
          size: 3,
          duration: 0.4,
        },
        push: {
          quantity: 4
        },
      }
    },
    background: {
      color: {
        value: "transparent"
      }
    },
    detectRetina: true,
    fpsLimit: 120,
  } as const;

  return isReady && <Particles id={id} options={defaultOptions} className={className} />;
}