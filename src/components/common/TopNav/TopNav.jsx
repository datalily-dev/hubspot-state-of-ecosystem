import { useEffect, useState } from 'react';
import BarsIcon from '../../../assets/icon/bars.svg?react';
import XMarkIcon from '../../../assets/icon/x-mark.svg?react';
import HubSpotLogo from '../../../assets/logo.svg?react';
import { useFilters } from '../../../context/FilterContext';
import { useSlideDeck } from '../../../context/SlideDeckContext';
import styles from './TopNav.module.css';

// Sentinel height (px) at the top of each slide's scroll container. When the
// sentinel leaves the viewport the nav goes opaque. Small enough to feel
// instant, large enough that sub-pixel jitter / overscroll bounce can't
// flip it. IntersectionObserver fires after layout settles and doesn't
// depend on scroll events bubbling — fixes the Android Slack in-app webview
// timing race that scroll listeners hit.
const SENTINEL_HEIGHT_PX = 4;

// Per-slide overrides. Only deviations from the default config need an entry.
// Defaults: showMenu, showLearnMore, and showFilterIndicator are true.
const PER_SLIDE_CONFIG = {
  navigation: { showMenu: false },
};

const DEFAULT_CONFIG = {
  showMenu: true,
  showLearnMore: true,
  showFilterIndicator: true,
};

// "Become a Partner" CTA target per active partner-type filter. Falls back to
// the umbrella page when no filter is set (or for any future partner type).
const PARTNER_LINKS = {
  technology: 'https://www.hubspot.com/partners/technology',
  solutions: 'https://www.hubspot.com/partners/solutions',
};
const DEFAULT_PARTNER_LINK = 'https://www.hubspot.com/partners';

/**
 * Persistent top nav rendered once at the deck level (not per page), so
 * slide transitions never mount/unmount it. Background is transparent; text
 * color comes from the active slide's variant via `slideTheme`.
 *
 * PageShell reserves `--top-nav-height` of top padding so content never
 * starts behind the bar.
 */
export default function TopNav() {
  const { confirmedFilters, filterSummary, hasActiveFilters, resetFilters } = useFilters();
  const {
    activeAnchor,
    slideTheme,
    menuMode,
    openMenu,
    closeMenu,
    selectFromMenu,
  } = useSlideDeck();
  const isMenuOpen = menuMode != null;

  // When the user clicks the logo (or any nav-out target) while the menu
  // overlay is open, dismiss the overlay first so the deck animates to the
  // destination cleanly. `selectFromMenu` snaps the underlying deck to the
  // navigation slide and clears menuMode; the browser's default anchor
  // navigation then fires hashchange and the deck animates from navigation
  // to the chosen anchor.
  const handleNavOut = isMenuOpen ? () => selectFromMenu?.() : undefined;

  const learnMoreHref =
    PARTNER_LINKS[confirmedFilters.partnerType] ?? DEFAULT_PARTNER_LINK;

  // Drives the bg-color fade-in once the active slide scrolls past the top
  // (keeps the hero clean, then keeps nav text legible over page content).
  const [scrolled, setScrolled] = useState(false);

  // IntersectionObserver on a sentinel injected at the top of each slide's
  // scroll container: when it intersects, we're at the top → transparent;
  // when it leaves, we're scrolled → opaque. This avoids relying on scroll
  // events firing in time, which fails in some embedded webviews 
  // (where the listener attaches before layout settles.
  useEffect(() => {
    // When the menu overlay is open it is its own scroll container,
    // rendered above the deck and with the same `<section id="navigation">`
    // markup as the underlying slide. Observe the overlay directly so the
    // nav background fades in once the menu content scrolls past the top,
    // matching the behavior on every other page. Falls back to the active
    // slide's scroller for normal (non-menu) pages.
    //
    // For the deck path, prefer querying `[data-active="true"]` on the slide
    // wrapper directly: on initial load with a deep-link hash (e.g.
    // `#foreword`), the page component is lazy-loaded so `getElementById
    // (activeAnchor)` may return null for a tick — the slide wrapper itself
    // is always in the DOM. If neither is present yet, retry on the next
    // frame until the slide mounts so the sentinel is never skipped.
    // Reset to "at top" whenever the scroller changes (menu opens/closes)
    // so a stale `true` value isn't carried over.
    setScrolled(false);

    let observer = null;
    let sentinel = null;
    let rafId = 0;
    let cancelled = false;

    const findScroller = () => {
      if (isMenuOpen) {
        return document.querySelector('[data-menu-overlay="true"]');
      }
      const slide = document.querySelector(
        '[data-active="true"]',
      );
      if (slide) return slide;
      const section = document.getElementById(activeAnchor);
      return section?.parentElement ?? null;
    };

    const attach = () => {
      if (cancelled) return;
      const scroller = findScroller();
      if (!scroller) {
        rafId = window.requestAnimationFrame(attach);
        return;
      }

      sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = `width:100%;height:${SENTINEL_HEIGHT_PX}px;margin-bottom:-${SENTINEL_HEIGHT_PX}px;pointer-events:none;`;
      scroller.prepend(sentinel);

      observer = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { root: scroller, threshold: 0 },
      );
      observer.observe(sentinel);
    };

    attach();

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      if (sentinel) sentinel.remove();
    };
  }, [activeAnchor, isMenuOpen]);

  const config = isMenuOpen
    // In the menu overlay we want the same chrome as a normal page (filter
    // indicator + "Become a Partner" CTA), but the hamburger is swapped for
    // an X that closes the overlay. The X is rendered in the same slot as
    // the menu button below (gated on isMenuOpen), so showMenu is forced
    // false here.
    ? { ...DEFAULT_CONFIG, showMenu: false }
    : {
      ...DEFAULT_CONFIG,
      ...(PER_SLIDE_CONFIG[activeAnchor] ?? {}),
    };

  const themeStyle = {
    color:
      slideTheme.variant === 'dark'
        ? 'var(--color-cream)'
        : 'var(--color-teal-dark)',
    '--top-nav-bg': slideTheme.bg,
  };

  return (
    <header
      className={styles.nav}
      style={themeStyle}
      data-active-page={activeAnchor}
      data-scrolled={scrolled ? 'true' : 'false'}
    >
      <a
        href="#cover"
        className={styles.logo}
        aria-label="HubSpot home"
        onClick={handleNavOut}
      >
        <HubSpotLogo className={styles.logoSvg} aria-hidden="true" focusable="false" />
      </a>

      <div className={styles.actions}>
        {hasActiveFilters && config.showFilterIndicator && (
          <div className={styles.filterIndicator}>
            <span className={styles.filterDot} aria-hidden="true" />
            <span className={styles.filterLabel}>{filterSummary}</span>
            <button
              type="button"
              className={styles.clearFilter}
              onClick={resetFilters}
              aria-label="Clear filter"
            >
              <XMarkIcon
                className={styles.clearFilterIcon}
                aria-hidden="true"
                focusable="false"
              />
            </button>
          </div>
        )}

        {config.showMenu && (
          <button
            type="button"
            onClick={openMenu}
            className={styles.menuBtn}
            aria-label="Open navigation menu"
          >
            <BarsIcon className={styles.menuIcon} aria-hidden="true" focusable="false" />
          </button>
        )}

        {isMenuOpen && (
          <button
            type="button"
            onClick={closeMenu}
            className={styles.menuBtn}
            aria-label="Close navigation menu"
          >
            <XMarkIcon className={styles.menuIcon} aria-hidden="true" focusable="false" />
          </button>
        )}

        {config.showLearnMore && (
          <a
            href={learnMoreHref}
            className={styles.learnMoreBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            Become a Partner
          </a>
        )}
      </div>
    </header>
  );
}
