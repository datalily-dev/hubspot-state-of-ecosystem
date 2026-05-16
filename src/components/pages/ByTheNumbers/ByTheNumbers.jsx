import { useFilters } from '../../../context/FilterContext';
import PageShell from '../../common/PageShell/PageShell';
import styles from './ByTheNumbers.module.css';

/**
 * Page 4 — By the Numbers
 * Stats dashboard. DYNAMIC — content driven by the active filterId (17 variants).
 * Content loaded from src/data/dynamic-pages/{filterId}.json
 */
export default function ByTheNumbers() {
  const { filterId, confirmedFilters } = useFilters();

  return (
    <PageShell id="by-the-numbers" className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.label}>Placeholder — Page 4 (Dynamic)</p>
        <h2 className={styles.heading}>By the Numbers</h2>
        <p className={styles.filterInfo}>
          Active filter: <strong>{filterId}</strong>
        </p>
        <pre className={styles.debug}>{JSON.stringify(confirmedFilters, null, 2)}</pre>
      </div>
    </PageShell>
  );
}
