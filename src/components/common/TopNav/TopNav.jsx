import { useEffect, useState } from 'react';
import BarsIcon from '../../../assets/icon/bars.svg?react';
import HubSpotLogo from '../../../assets/logo.svg?react';
import { useFilters } from '../../../context/FilterContext';
import { useSlideDeck } from '../../../context/SlideDeckContext';
import styles from './TopNav.module.css';

// Pixels of scroll-from-top before the nav's background fades in. Small enough
// that any real scroll triggers the transition, large enough that
// sub-pixel jitter / overscroll bounce doesn't flicker it.
const SCROLL_REVEAL_PX = 4;

// Per-slide overrides. Only deviations from the default config need an entry.
// Defaults: showMenu, showLearnMore, showClearFilter, and showFilterIndicator are true.
const PER_SLIDE_CONFIG = {
  cover: { showFilterIndicator: false },
  navigation: { showMenu: false, showClearFilter: true },
};

const DEFAULT_CONFIG = {
  showMenu: true,
  showLearnMore: true,
  showClearFilter: false,
  showFilterIndicator: true,
};

/**
 * Single, always-on top navigation bar floating above the slide deck.
 *
 * Rendered once at the deck level (NOT per page), so transitions don't mount /
 * unmount the bar — eliminating the colored seam previously visible during
 * horizontal slide animations. Background is fully transparent; only the brand
 * marks (orange logo + buttons) sit above the slides. Text color is driven
 * by the active slide's variant via `slideTheme`, so the filter pill label
 * stays legible on both light and dark page palettes.
 *
 * Each PageShell reserves `--top-nav-height` of top padding so page content
 * doesn't start under this bar; that reserved space scrolls with the page as
 * the user scrolls within a long slide.
 */
export default function TopNav() {
  const { filterSummary, hasActiveFilters, resetFilters } = useFilters();
  const { activeAnchor, slideTheme } = useSlideDeck();

  // Tracks whether the active slide's scroll container has moved past the top.
  // While at the top the nav is fully transparent so the hero composition reads
  // cleanly; once the user scrolls, a slide-bg-colored layer fades in behind
  // the nav so the menu/CTA text never overlays page content.
  const [scrolled, setScrolled] = useState(false);

  // Attach the scroll listener directly to the active slide's scroll
  // container. Each slide is its own scroller (see SlideDeck.module.css), and
  // on iOS Safari scroll events from internal scrollers don't reliably reach
  // a capture-phase listener on `window` — leaving the nav transparent over
  // content. Direct attachment fires consistently across browsers.
  // On slide change we also re-evaluate from the new slide's actual scrollTop
  // because reverse-direction navigation (wheel up at top edge, ArrowUp,
  // leftward swipe) seats the destination slide at its BOTTOM via
  // SlideDeck's `landAt: 'bottom'`, so assuming scrollTop = 0 would leave
  // the nav transparent over content.
  useEffect(() => {
    const section = document.getElementById(activeAnchor);
    const scroller = section?.parentElement ?? null;
    if (!scroller) return undefined;

    const evaluate = () => {
      setScrolled(scroller.scrollTop > SCROLL_REVEAL_PX);
    };

    // Initial read after the slide-change `seatScroll` has run. rAF defers
    // until after the layout pass so we read the seated value, not the
    // pre-seat one.
    const rafId = window.requestAnimationFrame(evaluate);

    scroller.addEventListener('scroll', evaluate, { passive: true });
    // Also re-evaluate on resize/orientation change — the scroll position
    // can shift relative to the viewport and the user may end up at a new
    // edge state without firing a scroll event.
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
            {config.showClearFilter && (
              <button
                type="button"
                className={styles.clearFilter}
                onClick={resetFilters}
              >
                Clear filter
              </button>
            )}
            <span className={styles.filterDot} aria-hidden="true" />
            <span className={styles.filterLabel}>{filterSummary}</span>
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
            href="https://www.hubspot.com/partners"
            className={styles.learnMoreBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        )}
      </div>
    </header>
  );
}
