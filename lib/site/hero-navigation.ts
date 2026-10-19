export const HERO_NAVIGATION_EVENT = "figart:hero-navigation";

export function setHeroNavigation(hero: HTMLElement, visible: boolean) {
  const value = visible ? "visible" : "hidden";
  if (hero.dataset.heroNav === value) return;
  hero.dataset.heroNav = value;
  window.dispatchEvent(new Event(HERO_NAVIGATION_EVENT));
}

export function subscribeHeroNavigation(notify: () => void) {
  window.addEventListener(HERO_NAVIGATION_EVENT, notify);
  return () => window.removeEventListener(HERO_NAVIGATION_EVENT, notify);
}

export function getHeroNavigation() {
  const hero = document.querySelector<HTMLElement>("[data-hero-nav]");
  return !hero || hero.dataset.heroNav === "visible";
}

export function getServerHeroNavigation() {
  return false;
}
