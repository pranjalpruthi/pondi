import { createContext, useContext, useState } from "react"

interface SoundContextType {
  isSoundEnabled: boolean
  toggleSound: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  const toggleSound = () => setIsSoundEnabled(prev => !prev)

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundSettings() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useSoundSettings must be used within a SoundProvider')
  }
  return context
}
