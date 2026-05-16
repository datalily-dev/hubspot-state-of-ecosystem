import PageShell from '../../common/PageShell/PageShell';
import styles from './ForewordPage.module.css';

/**
 * Page 3 — Foreword
 * Letter from Zack Kass, OpenAI. STATIC.
 */
export default function ForewordPage() {
  return (
    <PageShell id="foreword" className={styles.foreword}>
      <div className={styles.inner}>
        <p className={styles.label}>Placeholder — Page 3</p>
        <h2 className={styles.heading}>Foreword</h2>
        <p>Letter from Zack Kass goes here.</p>
      </div>
    </PageShell>
  );
}
