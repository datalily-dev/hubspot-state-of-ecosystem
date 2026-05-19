import { Fragment, useState } from 'react';
import { useFilters } from '../../../context/FilterContext';
import { getShortTakes } from '../../../data/dynamicContent';
import PageShell from '../../common/PageShell/PageShell';
import Tabs from '../../common/Tabs/Tabs';
import AudioPlayer from '../../common/AudioPlayer/AudioPlayer';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import gradientA from '../../../assets/short-takes/gradient-a.svg';
import gradientB from '../../../assets/short-takes/gradient-b.svg';
import duncanLennox from '../../../assets/short-takes/duncan-lennox.jpg';
import sandhyaHegde from '../../../assets/short-takes/sandhya-hegde.jpg';
import zackKass from '../../../assets/short-takes/zack-kass.jpg';
import styles from './ShortTakes.module.css';

const TABS = [
  { id: 'field', label: 'From the Field' },
  { id: 'partners', label: 'From Partners' },
];

/** Headshots for the shared "From the Field" quotes (keyed by quote id). */
const FIELD_AVATARS = {
  'duncan-lennox': duncanLennox,
  'sandhya-hegde': sandhyaHegde,
  'zack-kass': zackKass,
};

function QuoteCard({ quote }) {
  const { author, audio } = quote;
  const avatarSrc = FIELD_AVATARS[quote.id];

  return (
    <article className={styles.quote}>
      <div className={styles.quoteInner}>
        <div className={styles.quoteCopy}>
          <h3 className={styles.quoteTitle}>{quote.title}</h3>
          <p className={styles.quoteBody}>&ldquo;{quote.quote}&rdquo;</p>
        </div>

        <div className={styles.quoteFooter}>
          <figure className={styles.byline}>
            {avatarSrc ? (
              <img
                className={styles.avatar}
                src={avatarSrc}
                alt=""
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className={styles.avatarPlaceholder} aria-hidden="true" />
            )}
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
 *
 * Layout reference: Figma 2193:1609 (1440×900 artboard).
 */
export default function ShortTakes() {
  const { filterId } = useFilters();
  const shortTakes = getShortTakes(filterId);

  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const panel = shortTakes.tabs[activeTab];

  return (
    <PageShell id="short-takes" className={styles.page}>
      <div className={styles.gradients} aria-hidden="true">
        <div className={styles.gradientBWrap}>
          <div className={styles.gradientBRotate}>
            <img className={styles.gradientB} src={gradientB} alt="" />
          </div>
        </div>
        <div className={styles.gradientAWrap}>
          <div className={styles.gradientARotate}>
            <img className={styles.gradientA} src={gradientA} alt="" />
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{shortTakes.label}</p>
            <h2 className={styles.heading}>{panel.heading}</h2>
          </header>

          <div className={styles.tabSection}>
            <div className={styles.tabRow}>
              <Tabs
                tabs={TABS}
                activeId={activeTab}
                onChange={setActiveTab}
                ariaLabel="Short takes audience"
                variant="bar"
                className={styles.tabs}
              />
            </div>
            <div className={styles.tabDivider} aria-hidden="true" />
          </div>

          <div
            className={styles.quotes}
            role="tabpanel"
            aria-label={panel.heading}
          >
            {panel.placeholder ? (
              <p className={styles.placeholder}>{panel.placeholder}</p>
            ) : (
              panel.quotes.map((quote, index) => (
                <Fragment key={quote.id}>
                  <QuoteCard quote={quote} />
                  {index < panel.quotes.length - 1 && (
                    <hr className={styles.quoteDivider} aria-hidden="true" />
                  )}
                </Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
