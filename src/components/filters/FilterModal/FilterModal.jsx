import { useFilters } from '../../../context/FilterContext';
import filtersData from '../../../data/filters.json';
import styles from './FilterModal.module.css';

/**
 * FilterModal — hierarchical filter selection overlay.
 * Placeholder: renders the filter options as a basic form.
 * Will be fully designed in a later phase.
 *
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function FilterModal({ isOpen, onClose }) {
  const {
    pendingFilters,
    setPendingPartnerType,
    setPendingSegment,
    setPendingRegion,
    confirmFilters,
    resetFilters,
  } = useFilters();

  if (!isOpen) return null;

  const handleConfirm = () => {
    confirmFilters();
    onClose();
  };

  const handleReset = () => {
    resetFilters();
    onClose();
  };

  const showSegment = pendingFilters.partnerType === 'solutions';
  const showRegion = pendingFilters.partnerType === 'solutions';

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div className={styles.modal}>
        <h2 id="filter-modal-title" className={styles.title}>
          Customize Your View
        </h2>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Partner Type</legend>
          {filtersData.partnerTypes.map((type) => (
            <label key={type.id} htmlFor={`partnerType-${type.id}`} className={styles.option}>
              <input
                id={`partnerType-${type.id}`}
                type="radio"
                name="partnerType"
                value={type.id}
                checked={pendingFilters.partnerType === type.id}
                onChange={() => setPendingPartnerType(type.id)}
              />
              {type.label}
            </label>
          ))}
        </fieldset>

        {showSegment && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Segment</legend>
            {filtersData.segments.map((seg) => (
              <label key={seg.id} htmlFor={`segment-${seg.id}`} className={styles.option}>
                <input
                  id={`segment-${seg.id}`}
                  type="radio"
                  name="segment"
                  value={seg.id}
                  checked={pendingFilters.segment === seg.id}
                  onChange={() => setPendingSegment(seg.id)}
                />
                {seg.label}
              </label>
            ))}
          </fieldset>
        )}

        {showRegion && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Region</legend>
            {filtersData.regions.map((region) => (
              <label key={region.id} htmlFor={`region-${region.id}`} className={styles.option}>
                <input
                  id={`region-${region.id}`}
                  type="radio"
                  name="region"
                  value={region.id}
                  checked={pendingFilters.region === region.id}
                  onChange={() => setPendingRegion(region.id)}
                />
                {region.label}
              </label>
            ))}
          </fieldset>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.btnReset} onClick={handleReset}>
            Reset
          </button>
          <button type="button" className={styles.btnConfirm} onClick={handleConfirm}>
            Apply
          </button>
          <button type="button" className={styles.btnClose} onClick={onClose} aria-label="Close filter modal">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
