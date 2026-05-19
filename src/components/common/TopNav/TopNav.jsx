import HubSpotLogo from '../../../assets/logo.svg?react';
import { useFilters } from '../../../context/FilterContext';
import { useSlideDeck } from '../../../context/SlideDeckContext';
import styles from './TopNav.module.css';

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 5h22M1 12h22M1 19h22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Per-slide overrides. Only deviations from the default config need an entry.
// Defaults: showMenu, showLearnMore, showClearFilter, and showFilterIndicator are true.
const PER_SLIDE_CONFIG = {
  cover: { showFilterIndicator: false },
  navigation: { showMenu: false },
};

const DEFAULT_CONFIG = {
  showMenu: true,
  showLearnMore: true,
  showClearFilter: true,
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

  const config = {
    ...DEFAULT_CONFIG,
    ...(PER_SLIDE_CONFIG[activeAnchor] ?? {}),
  };

  const themeStyle = {
    color:
      slideTheme.variant === 'dark'
        ? 'var(--color-cream)'
        : 'var(--color-teal-dark)',
  };

  return (
    <header
      className={styles.nav}
      style={themeStyle}
      data-active-page={activeAnchor}
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
            <MenuIcon />
            <span>Menu</span>
          </a>
        )}

        {config.showLearnMore && (
          <a href="#foreword" className={styles.learnMoreBtn}>
            Learn more
          </a>
        )}
      </div>
    </header>
  );
}
