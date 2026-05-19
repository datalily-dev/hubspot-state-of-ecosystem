import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFilters } from '../../../context/FilterContext';
import filtersData from '../../../data/filters.json';
import FilterChip from '../FilterChip/FilterChip';
import XMarkIcon from '../../../assets/icon/x-mark.svg?react';
import styles from './FilterModal.module.css';

/** Matches --duration-slow in tokens.css */
const CLOSE_MS = 400;

/** Region chip order per Figma (node 2219:3351). */
const REGION_ORDER = ['emea', 'japac', 'latam', 'nam'];

/**
 * FilterModal — hierarchical filter selection overlay.
 *
 * Behaviour:
 *   - Only Partner Type is shown until Solutions is selected; Technology keeps
 *     the modal to that row (segment/region are cleared in state).
 *   - The "X selected" counter includes Partner Type, Customer Focus, and Region.
 *   - "Apply" commits selections and closes; Close discards pending changes.
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
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onClose();
      return;
    }

    setIsClosing(true);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!isClosing) return undefined;

    const timer = window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    openModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose();
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
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  const showSubFilters = pendingFilters.partnerType === 'solutions';

  const selectedCount = [
    pendingFilters.partnerType,
    pendingFilters.segment,
    pendingFilters.region,
  ].filter(Boolean).length;

  const handleApply = () => {
    confirmFilters();
    handleClose();
  };

  const togglePartnerType = (id) =>
    setPendingPartnerType(pendingFilters.partnerType === id ? null : id);
  const toggleSegment = (id) =>
    setPendingSegment(pendingFilters.segment === id ? null : id);
  const toggleRegion = (id) =>
    setPendingRegion(pendingFilters.region === id ? null : id);

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const regions = [...filtersData.regions].sort(
    (a, b) => REGION_ORDER.indexOf(a.id) - REGION_ORDER.indexOf(b.id),
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`}
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        className={`${styles.modal} ${isClosing ? styles.modalClosing : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
        tabIndex={-1}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close customize panel"
        >
          <XMarkIcon className={styles.closeIcon} aria-hidden="true" focusable="false" />
          <span className={styles.closeLabel}>Close</span>
        </button>

        <div className={styles.body}>
          <h2 id="filter-modal-title" className={styles.title}>
            Customize your own experience
          </h2>

          <div className={styles.sections}>
            <div className={styles.divider} aria-hidden="true" />

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

            {showSubFilters && (
              <>
                <div className={styles.divider} aria-hidden="true" />

                <div className={styles.row}>
                  <span className={styles.rowLabel}>Customer focus</span>
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

                <div className={styles.divider} aria-hidden="true" />

                <div className={styles.row}>
                  <span className={styles.rowLabel}>Region</span>
                  <div className={styles.options}>
                    {regions.map((region) => (
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
                <span className={styles.counterValue}>{selectedCount}</span>
                <span className={styles.counterLabel}> selected</span>
              </span>
              <button type="button" className={styles.applyBtn} onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
