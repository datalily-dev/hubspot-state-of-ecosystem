import { useEffect, useRef } from 'react';
import { useFilters } from '../../../context/FilterContext';
import filtersData from '../../../data/filters.json';
import FilterChip from '../FilterChip/FilterChip';
import XMarkIcon from '../../../assets/icon/x-mark.svg?react';
import styles from './FilterModal.module.css';

/**
 * FilterModal — hierarchical filter selection overlay.
 *
 * Behaviour:
 *   - Customer Focus and Region are visible by default (nothing selected) and
 *     when Solutions is selected; they hide only when Technology is selected.
 *   - Selecting a chip fills it in; unselected siblings retain full-opacity
 *     outlined style — no dimming.
 *   - The "X SELECTED" counter reflects pending (in-modal) selections.
 *   - "Apply" commits selections and closes; the close (×) button discards.
 */
export default function FilterModal({ isOpen, onClose }) {
  const {
    pendingFilters,
    setPendingPartnerType,
    setPendingSegment,
    setPendingRegion,
    confirmFilters,
    openModal,
  } = useFilters();

  const dialogRef = useRef(null);

  // When the modal opens, sync pending → confirmed and trap initial focus.
  useEffect(() => {
    if (!isOpen) return undefined;
    openModal();

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
    // We intentionally only re-run when the modal opens / closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const showSubFilters = pendingFilters.partnerType !== 'technology';

  const selectedCount = [
    pendingFilters.partnerType,
    showSubFilters && pendingFilters.segment,
    showSubFilters && pendingFilters.region,
  ].filter(Boolean).length;

  const handleApply = () => {
    confirmFilters();
    onClose();
  };

  // Toggle behaviour: clicking the active option de-selects it.
  const togglePartnerType = (id) =>
    setPendingPartnerType(pendingFilters.partnerType === id ? null : id);
  const toggleSegment = (id) =>
    setPendingSegment(pendingFilters.segment === id ? null : id);
  const toggleRegion = (id) =>
    setPendingRegion(pendingFilters.region === id ? null : id);

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
        tabIndex={-1}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close customize panel"
        >
          <XMarkIcon className={styles.closeIcon} aria-hidden="true" focusable="false" />
          <span className={styles.closeLabel}>Close</span>
        </button>

        <h2 id="filter-modal-title" className={styles.title}>
          Customize your own experience
        </h2>

        <div className={styles.divider} aria-hidden="true" />

        {/* PARTNER TYPE */}
        <div className={styles.row}>
          <span className={styles.rowLabel}>Partner Type</span>
          <div className={styles.options}>
            {filtersData.partnerTypes.map((type) => (
              <FilterChip
                key={type.id}
                label={type.label.replace(' Partner', '')}
                selected={pendingFilters.partnerType === type.id}
                onClick={() => togglePartnerType(type.id)}
              />
            ))}
          </div>
        </div>

        {/* CUSTOMER FOCUS + REGION — hidden only when Technology is selected */}
        {showSubFilters && (
          <>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Customer Focus</span>
              <div className={styles.options}>
                {filtersData.segments.map((seg) => (
                  <FilterChip
                    key={seg.id}
                    label={seg.label}
                    selected={pendingFilters.segment === seg.id}
                    onClick={() => toggleSegment(seg.id)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>Region</span>
              <div className={styles.options}>
                {filtersData.regions.map((region) => (
                  <FilterChip
                    key={region.id}
                    label={region.label}
                    selected={pendingFilters.region === region.id}
                    onClick={() => toggleRegion(region.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.footer}>
          <span className={styles.counter} aria-live="polite">
            {`${selectedCount} Selected`}
          </span>
          <button type="button" className={styles.applyBtn} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
