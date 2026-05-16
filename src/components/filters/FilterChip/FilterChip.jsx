import styles from './FilterChip.module.css';

/**
 * FilterChip — a single toggleable filter chip.
 * Placeholder implementation. Will be fully designed in a later phase.
 *
 * @param {{ label: string, isActive: boolean, onClick: () => void }} props
 */
export default function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      className={[styles.chip, isActive ? styles.active : ''].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
