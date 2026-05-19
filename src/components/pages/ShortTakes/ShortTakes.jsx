import { useState } from 'react';
import { useFilters } from '../../../context/FilterContext';
import { getShortTakes } from '../../../data/dynamicContent';
import PageShell from '../../common/PageShell/PageShell';
import Tabs from '../../common/Tabs/Tabs';
import AudioPlayer from '../../common/AudioPlayer/AudioPlayer';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import styles from './ShortTakes.module.css';

const TABS = [
  { id: 'field', label: 'From the Field' },
  { id: 'partners', label: 'From Partners' },
];

function QuoteCard({ quote }) {
  const { author, audio } = quote;
  return (
    <article className={styles.quote}>
      <div className={styles.quoteText}>
        <h3 className={styles.quoteTitle}>{quote.title}</h3>
        <p className={styles.quoteBody}>&ldquo;{quote.quote}&rdquo;</p>

        <div className={styles.quoteFooter}>
          <figure className={styles.byline}>
            <span className={styles.avatar} aria-hidden="true" />
            <figcaption className={styles.bylineText}>
              <span className={styles.bylineName}>
                {author.name}
                {author.linkedIn && (
                  <a
                    href={author.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedInLink}
                    aria-label={`${author.name} on LinkedIn`}
                  >
                    <LinkedInIcon
                      className={styles.linkedInIcon}
                      focusable="false"
                    />
                  </a>
                )}
              </span>
              <span className={styles.bylineRole}>{author.role}</span>
            </figcaption>
          </figure>

          <div className={styles.audioSlot}>
            <AudioPlayer
              src={audio?.src}
              durationSeconds={audio?.durationSeconds ?? 0}
              label={`Play audio quote from ${author.name}`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Page 5 — Short Takes.
 *
 * Tabs between "From the Field" (industry experts, shared across all 17 views)
 * and "From Partners" (varies per active filter). Filter-specific content is
 * resolved by `getShortTakes(filterId)`; variants that don't yet have copy
 * render a placeholder message instead of an empty list.
 */
export default function ShortTakes() {
  const { filterId } = useFilters();
  const shortTakes = getShortTakes(filterId);

  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const panel = shortTakes.tabs[activeTab];

  return (
    <PageShell id="short-takes" className={styles.page}>
      <div className={styles.body}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{shortTakes.label}</p>
            <h2 className={styles.heading}>{panel.heading}</h2>

            <div className={styles.tabRow}>
              <Tabs
                tabs={TABS}
                activeId={activeTab}
                onChange={setActiveTab}
                ariaLabel="Short takes audience"
                variant="dark"
                className={styles.tabs}
              />
            </div>
          </header>

          <div
            className={styles.quotes}
            role="tabpanel"
            aria-label={panel.heading}
          >
            {panel.placeholder ? (
              <p className={styles.placeholder}>{panel.placeholder}</p>
            ) : (
              panel.quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))
            )}
          </div>
        </div>
      </div>

    </PageShell>
  );
}
