import PageShell from '../../common/PageShell/PageShell';
import { NAVIGATION_TOC } from '../../../data/static-pages/navigationToc';
import styles from './NavigationPage.module.css';

/** Page 2 — Navigation. Static table of contents. */
export default function NavigationPage() {
  const left = NAVIGATION_TOC.slice(0, 3);
  const right = NAVIGATION_TOC.slice(3);

  return (
    <PageShell id="navigation" className={styles.page}>
      <div className={styles.body}>
        <nav className={styles.toc} aria-label="Table of contents">
          <ul className={styles.column}>
            {left.map((entry) => (
              <TocItem
                key={entry.href}
                label={entry.label}
                href={entry.href}
                title={entry.title}
                description={entry.description}
              />
            ))}
          </ul>

          <div className={styles.colDivider} aria-hidden="true" />

          <ul className={styles.column}>
            {right.map((entry) => (
              <TocItem
                key={entry.href}
                label={entry.label}
                href={entry.href}
                title={entry.title}
                description={entry.description}
              />
            ))}
          </ul>
        </nav>
      </div>

    </PageShell>
  );
}

function TocItem({ label, href, title, description }) {
  return (
    <li className={styles.item}>
      <a href={href} className={styles.link}>
        <span className={styles.itemLabel}>{label}</span>
        <span className={styles.itemTitle}>{title}</span>
        <span className={styles.itemDescription}>{description}</span>
      </a>
    </li>
  );
}
