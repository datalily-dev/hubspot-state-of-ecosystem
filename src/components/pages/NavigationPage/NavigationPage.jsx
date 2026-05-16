import PageShell from '../../common/PageShell/PageShell';
import styles from './NavigationPage.module.css';

/**
 * Page 2 — Navigation
 * Table of contents. STATIC.
 */
export default function NavigationPage() {
  return (
    <PageShell id="navigation" className={styles.nav}>
      <div className={styles.inner}>
        <p className={styles.label}>Placeholder — Page 2</p>
        <h2 className={styles.heading}>Navigation</h2>
        <p>Table of contents goes here.</p>
      </div>
    </PageShell>
  );
}
