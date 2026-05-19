import { PageIdProvider } from '../../../context/PageIdContext';
import styles from './PageShell.module.css';

/**
 * Wraps every page section with consistent full-viewport structure.
 * Each page declares its own background color via className or CSS custom property.
 *
 * @param {{ id: string, children: React.ReactNode, className?: string, style?: object }} props
 */
export default function PageShell({ id, children, className, style }) {
  const classes = [styles.page, className].filter(Boolean).join(' ');

  return (
    <PageIdProvider pageId={id}>
      <section
        id={id}
        className={classes}
        aria-label={id}
        style={style}
      >
        {children}
      </section>
    </PageIdProvider>
  );
}
