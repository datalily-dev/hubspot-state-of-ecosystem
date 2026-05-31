import { useEffect, useState } from 'react';
import PageShell from '../../common/PageShell/PageShell';
import { useFilters } from '../../../context/FilterContext';
import { useSlideDeck } from '../../../context/SlideDeckContext';
import { getByTheNumbers } from '../../../data/dynamicContent';
import { splitHash } from '../../../utils/url';
import gradientA from '../../../assets/by-the-numbers/gradient-a.svg';
import gradientB from '../../../assets/by-the-numbers/gradient-b.svg';
import { PARTNER_SLIDES } from './partnerSlides';
import styles from './ByTheNumbers.module.css';

// sessionStorage key consumed by ShortTakes to open the "From Partners" tab
// when the user enters the slide via this carousel. Cleared on read.
const SHORT_TAKES_TAB_SIGNAL_KEY = 'shortTakes:initialTab';

const SLIDE_INTERVAL_MS = 4000;

// Brief hold after the slide lands (SlideDeck push is 500ms) before tiles animate.
const TILE_ENTRANCE_DELAY_MS = 200;
const TILE_STAGGER_MS = 215;

/** Partner carousel (Figma 2329:5670 + *-desktop frames). */
function PartnerCarousel({ eyebrow, label, entranceClassName = '', entranceStyle }) {
  const [index, setIndex] = useState(0);
  const count = PARTNER_SLIDES.length;

  useEffect(() => {
    if (count <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count]);

  // Click → jump to Short Takes and open the "From Partners" tab. Preserves
  // the active filter query that lives after the anchor in the hash.
  const handleClick = () => {
    try {
      window.sessionStorage.setItem(SHORT_TAKES_TAB_SIGNAL_KEY, 'partners');
    } catch {
      // sessionStorage unavailable (private mode, etc.) — fall through; the
      // hash change still navigates, the tab simply stays on its default.
    }
    const { query } = splitHash(window.location.hash);
    const newHash = query ? '#short-takes?' + query : '#short-takes';
    if (window.location.hash === newHash) {
      // Same anchor — fire hashchange manually so SlideDeck reacts.
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = newHash;
    }
  };

  return (
    <button
      type="button"
      className={`${styles.card} ${styles.cardImage} ${styles.cardImageButton} ${entranceClassName}`}
      style={entranceStyle}
      onClick={handleClick}
      aria-label={`${label} — open From Partners`}
    >
      {PARTNER_SLIDES.map((slide, i) => {
        const isActive = i === index;
        const isPrev = i === (index - 1 + count) % count;
        let position = styles.slideOffRight;
        if (isActive) position = styles.slideActive;
        else if (isPrev) position = styles.slideOffLeft;

        return (
          <div
            key={slide.id}
            className={`${styles.slidePanel} ${styles.slide} ${position}`}
            aria-hidden={!isActive}
          >
            <img
              className={styles.slideVisual}
              src={slide.src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className={styles.slideScrim} aria-hidden="true" />
            <div className={styles.slideCaption}>
              <p className={styles.slideEyebrow}>{eyebrow}</p>
              <p className={styles.slideName}>{slide.name}</p>
            </div>
          </div>
        );
      })}
    </button>
  );
}

function StatValue({ stat }) {
  if (stat.valueLines?.length) {
    return (
      <p className={styles.cardValue}>
        {stat.valueLines.map((line) => (
          <span key={line} className={styles.cardValueLine}>
            {line}
          </span>
        ))}
      </p>
    );
  }
  return <p className={styles.cardValue}>{stat.value}</p>;
}

function StatCard({ stat, entranceClassName = '', entranceStyle }) {
  if (stat.size === 'image') {
    const overlayLabel = [stat.value, stat.description].filter(Boolean).join(' — ');
    return (
      <PartnerCarousel
        eyebrow={stat.value}
        label={overlayLabel}
        entranceClassName={entranceClassName}
        entranceStyle={entranceStyle}
      />
    );
  }

  const valueVariantClass = stat.valueVariant
    ? styles[`value_${stat.valueVariant}`]
    : '';

  return (
    <div
      className={`${styles.card} ${styles[`size_${stat.size}`]}${valueVariantClass ? ` ${valueVariantClass}` : ''} ${entranceClassName}`}
      style={entranceStyle}
    >
      <StatValue stat={stat} />
      <p className={styles.cardDescription}>
        {stat.description}
        {stat.linkText && (
          <>
            {' '}
            <a
              href={stat.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              {stat.linkText}
            </a>
          </>
        )}
      </p>
    </div>
  );
}

/**
 * Page 4 — By the Numbers.
 * Stats dashboard. DYNAMIC — content driven by the active filterId (17 variants).
 * Falls back to the "global" view when a variant isn't defined yet.
 *
 * Layout (Figma 2405:2913 / 2194:2341):
 *   Top row    — 434 / 305 / 321 (308px tall)
 *   Bottom row — 290 / 290 / 260 / 210 (232px tall)
 * Decorative orange-tinted blob gradients sit behind the cards.
 */
export default function ByTheNumbers() {
  const { filterId } = useFilters();
  const { activeAnchor } = useSlideDeck();
  const isPageActive = activeAnchor === 'by-the-numbers';
  const [tilesReady, setTilesReady] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const byTheNumbers = getByTheNumbers(filterId);

  const top = byTheNumbers.stats.slice(0, 3);
  const bottom = byTheNumbers.stats.slice(3);

  // SlideDeck keeps every page mounted — defer tile animation until this slide
  // is active and the deck transition has finished.
  useEffect(() => {
    if (!isPageActive) {
      return undefined;
    }

    setTilesReady(false);

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setTilesReady(true);
      setAnimKey((k) => k + 1);
      return undefined;
    }

    const id = window.setTimeout(() => {
      setTilesReady(true);
      setAnimKey((k) => k + 1);
    }, TILE_ENTRANCE_DELAY_MS);

    return () => window.clearTimeout(id);
  }, [isPageActive, filterId]);

  const tileFadeClass = [styles.tileFade, tilesReady && styles.tileFadeVisible]
    .filter(Boolean)
    .join(' ');

  const tileDelay = (index) => `${index * TILE_STAGGER_MS}ms`;

  return (
    <PageShell id="by-the-numbers" className={styles.page}>
      <div className={styles.gradients} aria-hidden="true">
        <div className={styles.gradientAWrap}>
          <div className={styles.gradientARotate}>
            <img className={styles.gradientA} src={gradientA} alt="" />
          </div>
        </div>
        <div className={styles.gradientBWrap}>
          <div className={styles.gradientBRotate}>
            <img className={styles.gradientB} src={gradientB} alt="" />
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          <header className={styles.titleBlock}>
            <p className={styles.eyebrow}>{byTheNumbers.label}</p>
            <h2 className={styles.heading}>{byTheNumbers.heading}</h2>
          </header>

          <div className={`${styles.row} ${styles.rowTop}`}>
            {top.map((stat, i) => (
              <StatCard
                key={`${stat.id}-${animKey}`}
                stat={stat}
                entranceClassName={tileFadeClass}
                entranceStyle={{ '--tile-delay': tileDelay(i) }}
              />
            ))}
          </div>

          <div className={`${styles.row} ${styles.rowBottom}${bottom.length === 3 ? ` ${styles.rowBottomThree}` : ''}`}>
            {bottom.map((stat, i) => (
              <StatCard
                key={`${stat.id}-${animKey}`}
                stat={stat}
                entranceClassName={tileFadeClass}
                entranceStyle={{ '--tile-delay': tileDelay(top.length + i) }}
              />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
