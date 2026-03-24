import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";

/**
 * Hook to animate children on scroll entry with staggered fade+slide
 */
export function useScrollReveal(selector: string, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(30px)";
    });

    animate(elements, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: stagger(100),
      ease: "outQuart",
      autoplay: onScroll({
        target: containerRef.current,
        enter: "bottom 80%",
      }),
    });
  }, [selector, containerRef]);
}

/**
 * Hook for hero floating shapes — scroll-driven position
 */
export function useHeroShapes(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!containerRef.current) return;
    const shapes = containerRef.current.querySelectorAll(".hero-shape");
    if (shapes.length === 0) return;

    animate(shapes, {
      translateY: (_el: Element, i: number) => [0, (i % 2 === 0 ? -60 : 60)],
      rotate: (_el: Element, i: number) => [0, (i % 2 === 0 ? 45 : -30)],
      scale: [1, (_el: Element, i: number) => 0.8 + (i * 0.1)],
      duration: 2000,
      ease: "linear",
      autoplay: onScroll({
        target: containerRef.current,
        sync: true,
      }),
    });
  }, [containerRef]);
}
