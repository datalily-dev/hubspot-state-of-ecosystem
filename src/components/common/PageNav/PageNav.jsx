import ArrowRight from '../../../assets/icon/arrow-right.svg?react';
import styles from './PageNav.module.css';

const PAGE_ANCHORS = [
  '#cover',
  '#navigation',
  '#foreword',
  '#by-the-numbers',
  '#short-takes',
  '#vision',
  '#growth',
  '#insider-insights',
];

const PAGE_LABELS = [
  'Cover',
  'Navigation',
  'Foreword',
  'By the Numbers',
  'Short Takes',
  'Vision',
  'Growth',
  'Insider Insights',
];

/**
 * Bottom-of-page navigation bar:
 *   • Pill of clickable page-indicator dots (jump to any page)
 *   • Prev / next circular arrow buttons (hidden at first / last page)
 *
 * @param {{
 *   activeIndex: number,
 *   total?: number,
 *   variant?: 'dark' | 'light',
 *   className?: string,
 *   anchors?: string[],
 *   labels?: string[],
 * }} props
 */
export default function PageNav({
  activeIndex,
  total = PAGE_ANCHORS.length,
  variant = 'light',
  className,
  anchors = PAGE_ANCHORS,
  labels = PAGE_LABELS,
}) {
  const prevHref = activeIndex > 0 ? anchors[activeIndex - 1] : null;
  const isLastPage = activeIndex === total - 1;
  const nextHref = !isLastPage ? anchors[activeIndex + 1] : null;
  const homeHref = anchors[0];

  const rootClass = [
    styles.bar,
    variant === 'dark' ? styles.dark : styles.light,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <nav className={styles.pill} aria-label="Jump to page">
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === activeIndex;
          const label = labels[i] || `Page ${i + 1}`;
          return (
            <a
              key={i}
              href={anchors[i]}
              className={isActive ? styles.dotActive : styles.dot}
              aria-label={`Page ${i + 1}: ${label}`}
              aria-current={isActive ? 'page' : undefined}
            />
          );
        })}
      </nav>

      <div className={styles.arrowGroup}>
        {prevHref ? (
          <a href={prevHref} className={`${styles.arrowBtn} ${styles.prev}`} aria-label="Previous page">
            <ArrowRight className={styles.arrowIcon} aria-hidden="true" focusable="false" />
          </a>
        ) : (
          <span className={styles.arrowSlotEmpty} aria-hidden="true" />
        )}

        {nextHref && (
          <a href={nextHref} className={`${styles.arrowBtn} ${styles.next}`} aria-label="Next page">
            <ArrowRight className={styles.arrowIcon} aria-hidden="true" focusable="false" />
          </a>
        )}

        {isLastPage && (
          <a href={homeHref} className={styles.homeBtn} aria-label="Go to cover page">
            Go home
          </a>
        )}
      </div>
    </div>
  );
}
