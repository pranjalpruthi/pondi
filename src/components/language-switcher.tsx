import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import { Globe } from 'lucide-react';
import { useSoundSettings } from "@/components/context/sound-context";
import { useSound } from 'use-sound';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { isSoundEnabled } = useSoundSettings();
  const [playClick] = useSound('/sounds/click.wav', { volume: 0.25, soundEnabled: isSoundEnabled });

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
    if (isSoundEnabled) playClick();
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="rounded-full w-9 h-9 text-foreground"
      onClick={toggleLanguage}
    >
      <Globe className="w-4 h-4" />
      <span className="sr-only">Switch Language</span>
    </Button>
  );
};
