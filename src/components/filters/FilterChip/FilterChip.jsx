import styles from './FilterChip.module.css';

/**
 * FilterChip — a single toggleable filter pill.
 *
 * Visual states (Figma FilterChip):
 *   - enabled:  cream background, teal border + text
 *   - active:   teal background, cream text
 *   - disabled: gray border + text, non-interactive
 */
export default function FilterChip({
  label,
  selected = false,
  disabled = false,
  onClick,
}) {
  const className = [
    styles.chip,
    selected && styles.selected,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event) => {
    onClick?.();
    // Drop focus/hover fill after toggling off so the pill returns to outlined style.
    if (selected) event.currentTarget.blur();
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-pressed={selected}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
