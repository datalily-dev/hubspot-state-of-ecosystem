import { useFilters } from '../../../context/FilterContext';
import PageShell from '../../common/PageShell/PageShell';
import styles from './ShortTakes.module.css';

/**
 * Page 5 — Short Takes
 * Global perspectives with Experts / Partners tabs. DYNAMIC — 17 filter variants.
 * Content loaded from src/data/dynamic-pages/{filterId}.json
 */
export default function ShortTakes() {
  const { filterId } = useFilters();

  return (
    <PageShell id="short-takes" className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.label}>Placeholder — Page 5 (Dynamic)</p>
        <h2 className={styles.heading}>Short Takes</h2>
        <p className={styles.filterInfo}>
          Active filter: <strong>{filterId}</strong>
        </p>
        <p>Experts / Partners tab content goes here.</p>
      </div>
    </PageShell>
  );
}
