import { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from './Dropdown.module.css';

/**
 * Themed dropdown / single-select listbox.
 *
 * Replaces the native `<select>` so we can match the page theme (teal-dark
 * surface, cream text, orange selected state) instead of inheriting the
 * system-native picker on iOS / macOS.
 *
 * Implements the WAI-ARIA combobox + listbox pattern with full keyboard
 * support (Arrow keys, Home / End, Enter / Space to choose, Escape to close,
 * type-ahead to jump to an item by first letter). The active option is
 * tracked via `aria-activedescendant` so the trigger keeps focus.
 *
 * @param {{
 *   options: { id: string, label: string }[],
 *   value: string,
 *   onChange: (id: string) => void,
 *   ariaLabel: string,
 *   variant?: 'bar',
 *   flush?: boolean,
 *   className?: string,
 *   id?: string,
 * }} props
 */
export default function Dropdown({
  options,
  value,
  onChange,
  ariaLabel,
  variant = 'bar',
  flush = false,
  className,
  id,
}) {
  const generatedId = useId();
  const baseId = id || generatedId;
  const listboxId = `${baseId}-listbox`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const i = options.findIndex((o) => o.id === value);
    return i === -1 ? 0 : i;
  });

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const typeBuffer = useRef('');
  const typeTimer = useRef(null);

  const selectedIndex = options.findIndex((o) => o.id === value);
  const selected = options[selectedIndex] || options[0];

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const openTo = useCallback(
    (index) => {
      setActiveIndex(index);
      setOpen(true);
    },
    [],
  );

  // Sync the highlighted row to the selected value whenever the menu opens
  // or the selected value changes from the outside.
  useEffect(() => {
    if (open) {
      const i = options.findIndex((o) => o.id === value);
      if (i !== -1) setActiveIndex(i);
    }
  }, [open, value, options]);

  // Outside click / escape closes the menu.
  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        close();
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  // Keep the active option scrolled into view inside the listbox.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`,
    );
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex]);

  const commit = (index) => {
    const next = options[index];
    if (next && next.id !== value) onChange(next.id);
    close();
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const i = options.findIndex((o) => o.id === value);
        openTo(i === -1 ? 0 : i);
        break;
      }
      case 'Home':
        event.preventDefault();
        openTo(0);
        break;
      case 'End':
        event.preventDefault();
        openTo(options.length - 1);
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        break;
      case 'Tab':
        close();
        break;
      default:
        // Type-ahead: jump to the next option starting with the typed prefix.
        if (event.key.length === 1 && /\S/.test(event.key)) {
          typeBuffer.current = (typeBuffer.current + event.key).toLowerCase();
          clearTimeout(typeTimer.current);
          typeTimer.current = setTimeout(() => {
            typeBuffer.current = '';
          }, 600);
          const buf = typeBuffer.current;
          const start = (activeIndex + 1) % options.length;
          for (let step = 0; step < options.length; step += 1) {
            const idx = (start + step) % options.length;
            if (options[idx].label.toLowerCase().startsWith(buf)) {
              setActiveIndex(idx);
              break;
            }
          }
        }
        break;
    }
  };

  const rootClass = [
    styles.root,
    variant === 'bar' ? styles.bar : '',
    flush ? styles.flush : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={rootClass}>
      <button
        ref={triggerRef}
        type="button"
        id={baseId}
        role="combobox"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-activedescendant={
          open ? `${baseId}-option-${options[activeIndex]?.id}` : undefined
        }
        onClick={() => (open ? close() : openTo(selectedIndex === -1 ? 0 : selectedIndex))}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles.triggerLabel}>{selected?.label}</span>
        <svg
          className={`${styles.caret} ${open ? styles.caretOpen : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={(node) => {
            listRef.current = node;
            if (node) node.focus();
          }}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-activedescendant={`${baseId}-option-${options[activeIndex]?.id}`}
          className={styles.list}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.id === value;
            const isActive = index === activeIndex;
            return (
              // Keyboard navigation/selection is handled at the listbox level via handleListKeyDown.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                key={option.id}
                id={`${baseId}-option-${option.id}`}
                role="option"
                aria-selected={isSelected}
                data-index={index}
                className={[
                  styles.option,
                  isActive ? styles.optionActive : '',
                  isSelected ? styles.optionSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  // Prevent the listbox from losing focus before click fires.
                  event.preventDefault();
                }}
                onClick={() => commit(index)}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                {isSelected && (
                  <svg
                    className={styles.check}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7.5L5.5 11L12 3.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
