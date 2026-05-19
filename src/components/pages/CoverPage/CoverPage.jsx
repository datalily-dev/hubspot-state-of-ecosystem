import { useState } from 'react';
import HubSpotLogo from '../../../assets/logo.svg?react';
import FilterIcon from '../../../assets/icon/filter.svg?react';
import ArrowRight from '../../../assets/icon/arrow-right.svg?react';
import PageShell from '../../common/PageShell/PageShell';
import FilterModal from '../../filters/FilterModal/FilterModal';
import { useFilters } from '../../../context/FilterContext';
import styles from './CoverPage.module.css';

const STATS = [
  {
    prefix: '$',
    number: '42',
    suffix: 'B',
    label: "HubSpot's partner opportunity by 2030",
  },
  {
    number: '28.4',
    suffix: '%',
    label: "CAGR of AI-first revenue for HubSpot's partners",
  },
  {
    prefix: 'Top',
    number: '10',
    label: 'HubSpot is a top global 10 ecosystem, according to Partnership Leaders',
  },
];

function MenuIcon() {
  return (
    <svg
      width="16"
      height="11"
      viewBox="0 0 16 11"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 .5h16M0 5.5h16M0 10.5h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Page 1 — Cover (STATIC) */
export default function CoverPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filterSummary, hasActiveFilters } = useFilters();

  return (
    <PageShell id="cover" className={styles.cover}>
      {/* ── Top navigation ── */}
      <header className={styles.nav}>
        <a href="#cover" className={styles.logo} aria-label="HubSpot home">
          <HubSpotLogo className={styles.logoSvg} aria-hidden="true" focusable="false" />
        </a>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
            <span>Menu</span>
          </button>
          <a href="#navigation" className={styles.learnMoreBtn}>
            Learn more
          </a>
        </div>
      </header>

      {/* ── Main content: two-column layout ── */}
      <div className={styles.body}>
        <div className={styles.left}>
          <p className={styles.reportLabel}>2026 HubSpot Partner Report</p>

          <h1 className={styles.headline}>
            The State of<br />Ecosystems
          </h1>

          <p className={styles.intro}>
            HubSpot&rsquo;s market potential is growing. Partners who move early will own it.
          </p>

          <button
            type="button"
            className={styles.customizeBtn}
            onClick={() => setIsFilterOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isFilterOpen}
          >
            <span className={styles.customizeIconWrap} aria-hidden="true">
              <FilterIcon className={styles.customizeIcon} focusable="false" />
            </span>
            Customize your experience
          </button>

          {hasActiveFilters && (
            <p className={styles.activeFilters} aria-live="polite">
              <span className={styles.activeFiltersDot} aria-hidden="true" />
              {filterSummary}
            </p>
          )}
        </div>

        <div className={styles.colDivider} aria-hidden="true" />

        <div className={styles.right}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statBlock}>
              {i > 0 && <hr className={styles.statDivider} />}

              <div className={styles.statValue}>
                {stat.prefix && <span className={styles.statPrefix}>{stat.prefix}</span>}
                <span className={styles.statNumber}>{stat.number}</span>
                {stat.suffix && <span className={styles.statSuffix}>{stat.suffix}</span>}
              </div>

              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar: page dots + next arrow ── */}
      <div className={styles.bottomBar}>
        <div className={styles.pagePill} role="tablist" aria-label="Page indicator">
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className={i === 0 ? styles.dotActive : styles.dot}
              role="tab"
              aria-selected={i === 0}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>

        <a href="#navigation" className={styles.nextBtn} aria-label="Go to next page">
          <ArrowRight className={styles.nextIcon} aria-hidden="true" focusable="false" />
        </a>
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </PageShell>
  );
}
