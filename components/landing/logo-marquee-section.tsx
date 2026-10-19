"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "./shared";
import styles from "./logo-marquee.module.css";

const brands = [
  { name: "Next.js", file: "nextjs" },
  { name: "React", file: "react" },
  { name: "Tailwind CSS", file: "tailwindcss" },
  { name: "Convex", file: "convex" },
  { name: "Clerk", file: "clerk" },
  { name: "Vercel", file: "vercel" },
];

export function LogoMarqueeSection() {
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.inView = String(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={root}
      id="built-with"
      aria-labelledby="marquee-title"
      data-paused={paused}
      className={styles.section}
    >
      <div className="mb-8 max-w-[700px]">
        <h2
          id="marquee-title"
          className="text-[34px] leading-[1.08] font-normal tracking-[-0.25px] text-balance md:text-[40px]"
        >
          For designers and makers who move ideas forward.
        </h2>
        <p className="mt-4 max-w-[570px] text-[18px] leading-[1.45] text-pretty text-[#777777]">
          Design interfaces, explore visual ideas, and refine the details in one
          browser workspace.
        </p>
      </div>
      <div className="flex items-start justify-between gap-4">
        <Eyebrow>Powered by</Eyebrow>
        <button
          type="button"
          aria-label={paused ? "Resume logo animation" : "Pause logo animation"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
          className={`${styles.control} -mt-1 rounded-[7px] border border-[#e6e8e4] px-3 py-1 text-[12px] text-[#797979] hover:bg-[#f1f1f1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#147bd0]`}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <div className="border-y border-[#e6e8e4] py-6 sm:py-8">
        <div className={styles.window} aria-hidden="true">
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <div key={copy} className={styles.group}>
                {brands.map((brand) => (
                  <div key={brand.file} className={styles.logo}>
                    <Image
                      src={`/brands/${brand.file}.svg`}
                      alt=""
                      width={160}
                      height={40}
                      className="h-7 w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ul className="sr-only">
        {brands.map((brand) => (
          <li key={brand.file}>{brand.name}</li>
        ))}
      </ul>
    </section>
  );
}
