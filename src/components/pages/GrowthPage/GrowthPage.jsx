import PageShell from '../../common/PageShell/PageShell';
import styles from './GrowthPage.module.css';

/**
 * Page 7 — Growth
 * 4 strategic areas: mid-market, agentic acceleration, marketing, specialization. GLOBAL.
 */
export default function GrowthPage() {
  return (
    <PageShell id="growth" className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.label}>Placeholder — Page 7 (Global)</p>
        <h2 className={styles.heading}>Growth</h2>
        <p>4 strategic growth areas go here.</p>
      </div>
    </PageShell>
  );
}
