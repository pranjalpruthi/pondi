import { useState, useEffect } from 'react';

/**
 * A custom hook to determine if the navbar should be visible based on scroll direction.
 * The navbar hides on scroll down and shows on scroll up.
 * @param {boolean} isMenuOpen - Pass the mobile menu state to prevent hiding when the menu is open.
 * @returns {boolean} - True if the navbar should be visible, false otherwise.
 */
export function useNavbarVisibility(isMenuOpen = false): boolean {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (isMenuOpen) {
        setIsVisible(true);
        return;
      }

      const scrollY = window.scrollY;

      // Hide navbar when scrolling down past the initial viewport height, show otherwise
      if (scrollY > lastScrollY && scrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY, isMenuOpen]);

  return isVisible;
}