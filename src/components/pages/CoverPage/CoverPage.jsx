import { useState } from 'react';
import PageShell from '../../common/PageShell/PageShell';
import FilterModal from '../../filters/FilterModal/FilterModal';
import styles from './CoverPage.module.css';

const STATS = [
  {
    number: '$42',
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
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true" focusable="false">
      <path d="M0 .5h16M0 5.5h16M0 10.5h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="4.5" r="2" fill="currentColor" />
      <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="9" r="2" fill="currentColor" />
      <line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="13.5" r="2" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 9h12M9.5 3.5 15 9l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Page 1 — Cover (STATIC) */
export default function CoverPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <PageShell id="cover" className={styles.cover}>
      {/* ── Top navigation ── */}
      <header className={styles.nav}>
        {/* TODO: once exported from Figma, place hubspot-logo.svg in src/assets/ then:
             import HubSpotLogo from '../../../assets/hubspot-logo.svg?react';
             and replace the span below with: <HubSpotLogo className={styles.logo} aria-label="HubSpot" /> */}
        <a href="#cover" className={styles.logo} aria-label="HubSpot">
          <span className={styles.logoText} aria-hidden="true">HubSpot</span>
        </a>

        <div className={styles.navActions}>
          <button type="button" className={styles.menuBtn} aria-label="Open navigation menu">
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
        {/* Left column */}
        <div className={styles.left}>
          <p className={styles.reportLabel}>2026 HubSpot Partner Report</p>

          <h1 className={styles.headline}>
            The State of<br />Ecosystems
          </h1>

          <p className={styles.intro}>
            HubSpot's market potential is growing. Partners who move early will own it.
          </p>

          <button
            type="button"
            className={styles.customizeBtn}
            onClick={() => setIsFilterOpen(true)}
            aria-haspopup="dialog"
          >
            <SlidersIcon />
            Customize your experience
          </button>
        </div>

        {/* Vertical separator */}
        <div className={styles.colDivider} aria-hidden="true" />

        {/* Right column — stats */}
        <div className={styles.right}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statBlock}>
              {i > 0 && <hr className={styles.statDivider} />}

              <div className={styles.statValue}>
                {stat.prefix ? (
                  <>
                    <span className={styles.statPrefix}>{stat.prefix}</span>
                    <span className={styles.statNumber}>{stat.number}</span>
                  </>
                ) : (
                  <>
                    <span className={styles.statNumber}>{stat.number}</span>
                    <span className={styles.statSuffix}>{stat.suffix}</span>
                  </>
                )}
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
          <ArrowRightIcon />
        </a>
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </PageShell>
  );
}
