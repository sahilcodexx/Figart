"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { setHeroNavigation } from "@/lib/site/hero-navigation";
import styles from "./hero-scroll.module.css";

export function ScrollHero({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const updateScroll = useRef<(() => void) | null>(null);
  useLenis(() => updateScroll.current?.(), []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let disposed = false;
    let revert: (() => void) | undefined;

    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !element) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      revert = () => media.revert();
      media.add(
        {
          all: "all",
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          if (!context.conditions?.motion) {
            setHeroNavigation(element, true);
            return;
          }
          const stage = element.querySelector<HTMLElement>("[data-hero-stage]");
          const intro = element.querySelector<HTMLElement>("[data-hero-intro]");
          const reveal =
            element.querySelector<HTMLElement>("[data-hero-reveal]");
          const hint = element.querySelector<HTMLElement>("[data-hero-hint]");
          if (!stage || !intro || !reveal || !hint) {
            setHeroNavigation(element, true);
            return;
          }
          element.dataset.scrollReady = "true";
          setHeroNavigation(element, false);
          gsap.set(reveal, { autoAlpha: 0, yPercent: 14, scale: 0.94 });
          gsap.set(stage, { transformOrigin: "50% 50%" });
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: element,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .to(intro, { y: -65, autoAlpha: 0, duration: 0.32 }, 0)
            .to(hint, { autoAlpha: 0, duration: 0.12 }, 0)
            .to(
              stage,
              {
                scale: () =>
                  Math.min(
                    context.conditions?.desktop ? 0.88 : 0.94,
                    Math.max(
                      0.65,
                      (window.innerHeight - 120) / window.innerHeight,
                    ),
                  ),
                y: 20,
                borderRadius: context.conditions.desktop ? 32 : 20,
                duration: 0.75,
              },
              0,
            )
            .to(
              reveal,
              { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.55 },
              0.28,
            )
            .to({}, { duration: 0.15 });
          timeline.eventCallback("onUpdate", () => {
            setHeroNavigation(element, timeline.progress() >= 0.78);
          });
          updateScroll.current = () => ScrollTrigger.update();
          ScrollTrigger.refresh();
          setHeroNavigation(element, timeline.progress() >= 0.78);
          return () => {
            updateScroll.current = null;
            delete element.dataset.scrollReady;
          };
        },
        element,
      );
    }

    void setup().catch(() => {
      revert?.();
      delete element.dataset.scrollReady;
      setHeroNavigation(element, true);
    });
    return () => {
      disposed = true;
      updateScroll.current = null;
      revert?.();
      delete element.dataset.scrollReady;
      setHeroNavigation(element, true);
    };
  }, []);

  return (
    <section
      ref={root}
      data-hero-nav="hidden"
      aria-labelledby="hero-title"
      className={styles.hero}
    >
      {children}
    </section>
  );
}
