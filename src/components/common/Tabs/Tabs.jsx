import { useId } from 'react';
import styles from './Tabs.module.css';

/**
 * Reusable pill-style tab control.
 *
 * Renders a horizontal list of tab buttons. The selected tab is highlighted
 * with the brand orange fill; inactive tabs use a translucent surface that
 * picks up the page background. Designed to be reused on Short Takes (page 5)
 * and any future page that needs the same control.
 *
 * Implements the WAI-ARIA tab pattern (tablist / tab / aria-selected) so that
 * screen readers and keyboard users get the expected semantics. Arrow key
 * navigation moves between tabs; Home / End jump to the first / last tab.
 *
 * @param {{
 *   tabs: { id: string, label: string }[],
 *   activeId: string,
 *   onChange: (id: string) => void,
 *   ariaLabel: string,
 *   variant?: 'dark' | 'light' | 'bar',
 *   className?: string,
 * }} props
 */
export default function Tabs({
  tabs,
  activeId,
  onChange,
  ariaLabel,
  variant = 'dark',
  className,
}) {
  const baseId = useId();

  const handleKeyDown = (event, index) => {
    let nextIndex = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = tabs[nextIndex];
    if (next) onChange(next.id);
  };

  let variantClass = styles.dark;
  if (variant === 'bar') variantClass = styles.bar;
  else if (variant === 'light') variantClass = styles.light;

  const rootClass = [
    styles.tablist,
    variantClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="tablist" aria-label={ariaLabel} className={rootClass}>
      {tabs.map((tab, index) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className={selected ? styles.tabActive : styles.tab}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
