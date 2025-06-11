import { useCallback, useEffect, useRef, useState } from "react"
import { Cookie, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

interface UseProgressTimerProps {
  duration: number
  interval?: number
  onComplete?: () => void
}

function useProgressTimer({
  duration,
  interval = 100,
  onComplete,
}: UseProgressTimerProps) {
  const [progress, setProgress] = useState(duration)
  const timerRef = useRef(0)
  const timerState = useRef({
    startTime: 0,
    remaining: duration,
    isPaused: false,
  })

  const cleanup = useCallback(() => {
    window.clearInterval(timerRef.current)
  }, [])

  const reset = useCallback(() => {
    cleanup()
    setProgress(duration)
    timerState.current = {
      startTime: 0,
      remaining: duration,
      isPaused: false,
    }
  }, [duration, cleanup])

  const start = useCallback(() => {
    const state = timerState.current
    state.startTime = Date.now()
    state.isPaused = false

    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - state.startTime
      const remaining = Math.max(0, state.remaining - elapsedTime)

      setProgress(remaining)

      if (remaining <= 0) {
        cleanup()
        onComplete?.()
      }
    }, interval)
  }, [interval, cleanup, onComplete])

  const pause = useCallback(() => {
    const state = timerState.current
    if (!state.isPaused) {
      cleanup()
      state.remaining = Math.max(
        0,
        state.remaining - (Date.now() - state.startTime)
      )
      state.isPaused = true
    }
  }, [cleanup])

  const resume = useCallback(() => {
    const state = timerState.current
    if (state.isPaused && state.remaining > 0) {
      start()
    }
  }, [start])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    progress,
    start,
    pause,
    resume,
    reset,
  }
}

export function CookieToast() {
  const [open, setOpen] = useState(false)
  const toastDuration = 5000
  const { progress, start, pause, resume } = useProgressTimer({
    duration: toastDuration,
    onComplete: () => {},
  })

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (consent === null) {
        const timer = setTimeout(() => {
          setOpen(true);
          start();
        }, 3000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // LocalStorage not available
    }
  }, [start]);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'true');
    } catch (e) {
      // Silently fail
    }
    setOpen(false);
  };

  const handleDecline = () => {
    setOpen(false);
  };

  return (
    <ToastProvider swipeDirection="left">
      <Toast
        open={open}
        onOpenChange={setOpen}
        onPause={pause}
        onResume={resume}
      >
        <div className="flex w-full justify-between gap-3">
          <Cookie
            className="mt-0.5 shrink-0 text-blue-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <ToastTitle>Cookie Consent</ToastTitle>
              <ToastDescription>
                We use cookies to enhance your experience.
              </ToastDescription>
            </div>
            <div>
              <ToastAction altText="Accept" asChild>
                <Button size="sm" onClick={handleAccept}>Accept</Button>
              </ToastAction>
            </div>
          </div>
          <ToastClose asChild>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Close notification"
              onClick={handleDecline}
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </ToastClose>
        </div>
        <div className="contents" aria-hidden="true">
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-blue-500"
            style={{
              width: `${(progress / toastDuration) * 100}%`,
              transition: "width 100ms linear",
            }}
          />
        </div>
      </Toast>
      <ToastViewport className="sm:right-auto sm:left-0" />
    </ToastProvider>
  )
}
