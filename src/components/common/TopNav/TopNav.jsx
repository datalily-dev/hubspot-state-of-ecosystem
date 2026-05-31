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
  const { activeAnchor, slideTheme } = useSlideDeck();

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
    const section = document.getElementById(activeAnchor);
    const scroller = section?.parentElement ?? null;
    if (!scroller) return undefined;

    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = `width:100%;height:${SENTINEL_HEIGHT_PX}px;margin-bottom:-${SENTINEL_HEIGHT_PX}px;pointer-events:none;`;
    scroller.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { root: scroller, threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
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
