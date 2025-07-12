import { useState, useEffect, useRef } from "react";

export const useMouse = <T extends HTMLElement = HTMLDivElement>() => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
  });

  const ref = useRef<T>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const element = ref.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementX = event.clientX - rect.left;
        const elementY = event.clientY - rect.top;

        setState({
          x: event.clientX,
          y: event.clientY,
          elementX,
          elementY,
          elementPositionX: rect.left,
          elementPositionY: rect.top,
        });
      }
    };

    const el = ref.current;
    if (el) {
        el.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (el) {
        el.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [ref]);

  return [state, ref] as const;
};

export default useMouse;
