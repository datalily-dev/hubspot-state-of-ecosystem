import PageShell from '../../common/PageShell/PageShell';
import styles from './InsiderInsights.module.css';

/**
 * Page 8 — Insider Insights
 * Partner case studies with video. GLOBAL.
 */
export default function InsiderInsights() {
  return (
    <PageShell id="insider-insights" className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.label}>Placeholder — Page 8 (Global)</p>
        <h2 className={styles.heading}>Insider Insights</h2>
        <p>Partner case studies and video go here.</p>
      </div>
    </PageShell>
  );
}
