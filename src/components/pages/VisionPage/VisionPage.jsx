import PageShell from '../../common/PageShell/PageShell';
import styles from './VisionPage.module.css';

/**
 * Page 6 — Vision
 * Angie O'Dowd on the HubSpot ecosystem. GLOBAL.
 */
export default function VisionPage() {
  return (
    <PageShell id="vision" className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.label}>Placeholder — Page 6 (Global)</p>
        <h2 className={styles.heading}>Vision</h2>
        <p>Angie O&apos;Dowd&apos;s perspective on the ecosystem goes here.</p>
      </div>
    </PageShell>
  );
}
