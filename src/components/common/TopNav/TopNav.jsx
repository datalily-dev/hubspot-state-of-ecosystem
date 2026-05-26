import { useEffect, useState } from 'react';
import BarsIcon from '../../../assets/icon/bars.svg?react';
import XMarkIcon from '../../../assets/icon/x-mark.svg?react';
import HubSpotLogo from '../../../assets/logo.svg?react';
import { useFilters } from '../../../context/FilterContext';
import { useSlideDeck } from '../../../context/SlideDeckContext';
import styles from './TopNav.module.css';

// Pixels of scroll-from-top before the nav's background fades in. Small enough
// that any real scroll triggers the transition, large enough that
// sub-pixel jitter / overscroll bounce doesn't flicker it.
const SCROLL_REVEAL_PX = 4;

// Per-slide overrides. Only deviations from the default config need an entry.
// Defaults: showMenu, showLearnMore, and showFilterIndicator are true.
const PER_SLIDE_CONFIG = {
  cover: { showFilterIndicator: false },
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
  const { activeAnchor, slideTheme } = useSlideDeck();

  const learnMoreHref =
    PARTNER_LINKS[confirmedFilters.partnerType] ?? DEFAULT_PARTNER_LINK;

  // Drives the bg-color fade-in once the active slide scrolls past the top
  // (keeps the hero clean, then keeps nav text legible over page content).
  const [scrolled, setScrolled] = useState(false);

  // Listen on the active slide's scroller directly — each slide is its own
  // scroll container, and iOS Safari doesn't reliably bubble those scroll
  // events to `window`. Re-evaluating on slide change is required because
  // reverse-direction navigation seats the new slide at its bottom (see
  // SlideDeck `landAt: 'bottom'`), not at scrollTop 0.
  useEffect(() => {
    const section = document.getElementById(activeAnchor);
    const scroller = section?.parentElement ?? null;
    if (!scroller) return undefined;

    const evaluate = () => {
      setScrolled(scroller.scrollTop > SCROLL_REVEAL_PX);
    };

    // rAF defers until after SlideDeck's `seatScroll` has run.
    const rafId = window.requestAnimationFrame(evaluate);

    scroller.addEventListener('scroll', evaluate, { passive: true });
    // Resize can shift scroll position relative to the viewport without
    // emitting a scroll event (e.g. mobile URL bar collapse).
    window.addEventListener('resize', evaluate, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      scroller.removeEventListener('scroll', evaluate);
      window.removeEventListener('resize', evaluate);
    };
  }, [activeAnchor]);

  const config = {
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
      <a href="#cover" className={styles.logo} aria-label="HubSpot home">
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
          <a
            href="#navigation"
            className={styles.menuBtn}
            aria-label="Go to navigation menu"
          >
            <BarsIcon className={styles.menuIcon} aria-hidden="true" focusable="false" />
            <span>Menu</span>
          </a>
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
