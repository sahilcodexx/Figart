import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ScrollHero } from "./scroll-hero";
import { HeroEditorPreview } from "./hero-editor-preview";
import { LandingButton } from "./shared";
import styles from "./hero-scroll.module.css";

export function HeroSection() {
  return (
    <ScrollHero>
      <div className={styles.viewport}>
        <div className={styles.stage} data-hero-stage>
          <div className={styles.grid} aria-hidden="true" />
          <div className={styles.intro} data-hero-intro>
            <p className={styles.eyebrow}>Your browser. Your design studio.</p>
            <h1 id="hero-title">
              One Design Platform
              <br />
              <span>for Every Big Idea.</span>
            </h1>
            <p className={styles.description}>
              Create interfaces, vector artwork, and design systems with an open
              canvas, familiar tools, and a workspace built for your ideas.
            </p>
            <div className={styles.actions}>
              <LandingButton href="/editor/demo">
                Explore the editor
              </LandingButton>
              <LandingButton href="/dashboard" secondary arrow={false}>
                Start for free
              </LandingButton>
            </div>
          </div>
          <div className={styles.reveal} data-hero-reveal>
            <div className={styles.revealHeading}>
              <span>Design Canvas</span>
              <h2>An infinite canvas with smooth pan and zoom.</h2>
            </div>
            <Link
              href="/editor/demo"
              className={styles.previewLink}
              aria-label="Open the editable Elsewhere demo"
            >
              <HeroEditorPreview />
            </Link>
            <Link href="/editor/demo" className={styles.demoLink}>
              Explore the editor <ArrowUpRight size={16} />
            </Link>
          </div>
          <a href="#hero-demo" className={styles.scrollHint} data-hero-hint>
            <span>Scroll to explore</span>
            <ArrowDown size={19} />
          </a>
        </div>
      </div>
      <span id="hero-demo" className={styles.demoAnchor} />
    </ScrollHero>
  );
}
