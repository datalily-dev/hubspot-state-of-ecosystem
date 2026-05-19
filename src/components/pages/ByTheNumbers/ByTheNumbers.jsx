import { useEffect, useState } from 'react';
import PageShell from '../../common/PageShell/PageShell';
import { useFilters } from '../../../context/FilterContext';
import { getByTheNumbers } from '../../../data/dynamicContent';
import gradientA from '../../../assets/by-the-numbers/gradient-a.svg';
import gradientB from '../../../assets/by-the-numbers/gradient-b.svg';
import aircall from '../../../assets/by-the-numbers/aircall.jpg';
import apitude from '../../../assets/by-the-numbers/apitude-8.jpg';
import engaging from '../../../assets/by-the-numbers/engaging.jpg';
import guepard from '../../../assets/by-the-numbers/guepard.jpg';
import hububble from '../../../assets/by-the-numbers/hububble.jpg';
import siloy from '../../../assets/by-the-numbers/siloy.jpg';
import smartbug from '../../../assets/by-the-numbers/smartbug-media.jpg';
import zoom from '../../../assets/by-the-numbers/zoom.jpg';
import styles from './ByTheNumbers.module.css';

/* Partner photos cycled in the image card. Each asset has the
   "HEAR FROM PARTNERS / <name>" label + dark scrim baked in. */
const PARTNER_PHOTOS = [
  { src: aircall, name: 'Aircall' },
  { src: apitude, name: 'Apitude 8' },
  { src: engaging, name: 'Engaging' },
  { src: guepard, name: 'Guepard' },
  { src: hububble, name: 'HuBubble' },
  { src: siloy, name: 'Siloy' },
  { src: smartbug, name: 'SmartBug Media' },
  { src: zoom, name: 'Zoom' },
];

const SLIDE_INTERVAL_MS = 4000;

function CardIcon({ name }) {
  if (name === 'target') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === 'sparkle') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        {/* 4-point star (Figma "Design" icon, node 2293:2120) */}
        <path d="M12 2c.4 4.8 2.8 7.2 7.6 7.6v.8c-4.8.4-7.2 2.8-7.6 7.6h-.8c-.4-4.8-2.8-7.2-7.6-7.6v-.8c4.8-.4 7.2-2.8 7.6-7.6h.8z" />
      </svg>
    );
  }
  if (name === 'arrow') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    );
  }
  return null;
}

/**
 * PartnerCarousel — cycles through PARTNER_PHOTOS with a right-to-left
 * slide. Each photo has the "HEAR FROM PARTNERS / <name>" label and dark
 * scrim baked into the JPG, so we just slide whole images. When clean
 * headshots replace these, lift the label out into an HTML overlay so it
 * stays localizable per the vendor guidelines.
 *
 * Implementation: every photo is stacked at inset:0 and positioned with
 * translateX. The active slide sits at 0, the previous (outgoing) slide
 * sits at -100%, all others park offscreen at 100%. When `index` advances,
 * the active/previous pair animate; idle slides switch position with
 * transition disabled so they don't streak across the card.
 */
function PartnerCarousel({ label }) {
  const [index, setIndex] = useState(0);
  const count = PARTNER_PHOTOS.length;

  useEffect(() => {
    if (count <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count]);

  return (
    <div
      className={`${styles.card} ${styles.cardImage}`}
      role="img"
      aria-label={label}
      aria-live="off"
    >
      {PARTNER_PHOTOS.map((photo, i) => {
        const isActive = i === index;
        const isPrev = i === (index - 1 + count) % count;
        let position = styles.slideOffRight;
        if (isActive) position = styles.slideActive;
        else if (isPrev) position = styles.slideOffLeft;
        return (
          <img
            key={photo.src}
            className={`${styles.imagePhoto} ${styles.slide} ${position}`}
            src={photo.src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            aria-hidden={isActive ? undefined : true}
          />
        );
      })}
    </div>
  );
}

function StatCard({ stat }) {
  if (stat.size === 'image') {
    const overlayLabel = [stat.value, stat.description].filter(Boolean).join(' — ');
    return <PartnerCarousel label={overlayLabel} />;
  }

  return (
    <div className={`${styles.card} ${styles[`size_${stat.size}`]}`}>
      {stat.icon && (
        <span className={styles.cardIcon} aria-hidden="true">
          <CardIcon name={stat.icon} />
        </span>
      )}
      <p className={styles.cardValue}>{stat.value}</p>
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
 * Layout (Figma 2194:2341):
 *   Top row    — 434 / 305 / 321 (308px tall)
 *   Bottom row — 290 / 290 / 260 / 210 (232px tall)
 * Decorative orange-tinted blob gradients sit behind the cards.
 */
export default function ByTheNumbers() {
  const { filterId } = useFilters();
  const byTheNumbers = getByTheNumbers(filterId);

  const top = byTheNumbers.stats.slice(0, 3);
  const bottom = byTheNumbers.stats.slice(3);

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
            {top.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className={`${styles.row} ${styles.rowBottom}`}>
            {bottom.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
