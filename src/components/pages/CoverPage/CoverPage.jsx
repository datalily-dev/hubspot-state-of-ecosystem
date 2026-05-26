import { useCallback, useState } from 'react';
import FilterIcon from '../../../assets/icon/filter.svg?react';
import gradientA from '../../../assets/cover/gradient-a.svg';
import gradientB from '../../../assets/cover/gradient-b.svg';
import coverContent from '../../../data/static-pages/cover.json';
import PageShell from '../../common/PageShell/PageShell';
import FilterModal from '../../filters/FilterModal/FilterModal';
import { useFilters } from '../../../context/FilterContext';
import { useEntranceAnimation } from '../../../hooks/useEntranceAnimation';
import styles from './CoverPage.module.css';

/** Page 1 — Cover (STATIC) */
export default function CoverPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const closeFilter = useCallback(() => setIsFilterOpen(false), []);
  const { filterSummary, hasActiveFilters } = useFilters();
  const isEntranceReady = useEntranceAnimation();
  const fadeClass = (base) =>
    [base, 'fadeUp', isEntranceReady && 'isVisible'].filter(Boolean).join(' ');

  return (
    <PageShell id="cover" className={styles.cover}>
      <div className={styles.gradients} aria-hidden="true">
        <div className={styles.gradientAWrap}>
          <div className={styles.gradientARotate}>
            <img className={styles.gradientA} src={gradientA} alt="" />
          </div>
        </div>
        <div className={styles.gradientBWrap}>
          <div className={styles.gradientBRotate}>
            <img className={styles.gradientB} src={gradientB} alt="" />
          </div>
        </div>
      </div>

      <div className={styles.colDivider} aria-hidden="true" />

      <div className={styles.body}>
        <div className={styles.left}>
          <p
            className={fadeClass(styles.reportLabel)}
            style={{ '--fade-delay': '100ms' }}
          >
            {coverContent.reportLabel}
          </p>

          <h1
            className={fadeClass(styles.headline)}
            style={{ '--fade-delay': '250ms' }}
          >
            {coverContent.headline}
          </h1>

          <p className={fadeClass(styles.intro)} style={{ '--fade-delay': '450ms' }}>
            {coverContent.intro}
          </p>

          <div
            className={fadeClass(styles.customizeGroup)}
            style={{ '--fade-delay': '650ms' }}
          >
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
              {coverContent.customizeCta}
            </button>

            <p
              className={[
                styles.activeFilters,
                !hasActiveFilters && styles.activeFiltersEmpty,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-live="polite"
            >
              <span className={styles.activeFiltersDot} aria-hidden="true" />
              {hasActiveFilters ? filterSummary : '\u00a0'}
            </p>
          </div>
        </div>

        <div className={styles.right}>
          {coverContent.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={fadeClass(styles.statBlock)}
              style={{ '--fade-delay': `${1000 + i * 200}ms` }}
            >
              <div className={styles.statValue} data-prefix={stat.prefixKind || undefined}>
                {stat.prefix && (
                  <span
                    className={
                      stat.prefixKind === 'word'
                        ? styles.statPrefixWord
                        : styles.statPrefixSymbol
                    }
                  >
                    {stat.prefix}
                  </span>
                )}
                <span className={styles.statNumber}>{stat.number}</span>
                {stat.suffix && <span className={styles.statSuffix}>{stat.suffix}</span>}
              </div>

              <p className={styles.statLabel}>
                {stat.label}
                {stat.linkText && (
                  <a
                    href={stat.linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.statLink}
                  >
                    {stat.linkText}
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={closeFilter} />
    </PageShell>
  );
}
