import styles from './FilterChip.module.css';

/**
 * FilterChip — a single toggleable filter pill.
 *
 * Visual states (per Figma):
 *   - default:  cream background, dark teal border + text  (idle, available)
 *   - selected: dark teal background, cream text           (chosen)
 *   - dimmed:   cream background, light gray border + text (sibling option
 *               available but not chosen — still clickable)
 *   - disabled: same as dimmed but non-interactive
 *
 * @param {{
 *   label: string,
 *   selected?: boolean,
 *   dimmed?: boolean,
 *   disabled?: boolean,
 *   onClick?: () => void,
 * }} props
 */
export default function FilterChip({
  label,
  selected = false,
  dimmed = false,
  disabled = false,
  onClick,
}) {
  const className = [
    styles.chip,
    selected && styles.selected,
    dimmed && !selected && styles.dimmed,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-pressed={selected}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
