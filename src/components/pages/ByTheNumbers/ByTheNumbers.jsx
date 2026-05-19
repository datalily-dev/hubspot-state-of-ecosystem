import PageShell from '../../common/PageShell/PageShell';
import { useFilters } from '../../../context/FilterContext';
import { getByTheNumbers } from '../../../data/dynamicContent';
import styles from './ByTheNumbers.module.css';

function CardIcon({ name }) {
  if (name === 'target') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === 'sparkle') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 2 13.5 9.5 21 11l-7.5 1.5L12 20l-1.5-7.5L3 11l7.5-1.5z" />
      </svg>
    );
  }
  if (name === 'arrow') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    );
  }
  return null;
}

function StatCard({ stat }) {
  if (stat.size === 'image') {
    return (
      <div className={`${styles.card} ${styles.cardImage}`}>
        <div className={styles.imageOverlay} aria-hidden="true" />
        <div className={styles.imageContent}>
          <p className={styles.imageHeading}>{stat.value}</p>
          {stat.description && (
            <p className={styles.imageSubtitle}>{stat.description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles[`size_${stat.size}`]}`}>
      {stat.icon && (
        <span className={styles.cardIcon} aria-hidden="true">
          <CardIcon name={stat.icon} />
        </span>
      )}
      <p className={styles.cardValue}>{stat.value}</p>
      <p className={styles.cardDescription}>
        {stat.description}
        {stat.linkText && (
          <>
            {' '}
            <a
              href={stat.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              {stat.linkText}
            </a>
          </>
        )}
      </p>
    </div>
  );
}

/**
 * Page 4 — By the Numbers.
 * Stats dashboard. DYNAMIC — content driven by the active filterId (17 variants).
 * Falls back to the "global" view when a variant isn't defined yet.
 */
export default function ByTheNumbers() {
  const { filterId } = useFilters();
  const byTheNumbers = getByTheNumbers(filterId);

  const top = byTheNumbers.stats.slice(0, 3);
  const bottom = byTheNumbers.stats.slice(3);

  return (
    <PageShell id="by-the-numbers" className={styles.page}>
      <div className={styles.body}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>{byTheNumbers.label}</p>
          <h2 className={styles.heading}>{byTheNumbers.heading}</h2>

          <div className={`${styles.row} ${styles.rowTop}`}>
            {top.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className={`${styles.row} ${styles.rowBottom}`}>
            {bottom.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
