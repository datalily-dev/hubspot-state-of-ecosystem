import { useEffect, useState } from 'react';
import PageShell from '../../common/PageShell/PageShell';
import { useFilters } from '../../../context/FilterContext';
import { getByTheNumbers } from '../../../data/dynamicContent';
import gradientA from '../../../assets/by-the-numbers/gradient-a.svg';
import gradientB from '../../../assets/by-the-numbers/gradient-b.svg';
import { PARTNER_SLIDES } from './partnerSlides';
import styles from './ByTheNumbers.module.css';

const SLIDE_INTERVAL_MS = 4000;

/** Partner carousel (Figma 2329:5670 + *-desktop frames). */
function PartnerCarousel({ eyebrow, label }) {
  const [index, setIndex] = useState(0);
  const count = PARTNER_SLIDES.length;

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
      aria-live="polite"
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
    </div>
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

function StatCard({ stat }) {
  if (stat.size === 'image') {
    const overlayLabel = [stat.value, stat.description].filter(Boolean).join(' — ');
    return <PartnerCarousel eyebrow={stat.value} label={overlayLabel} />;
  }

  const valueVariantClass = stat.valueVariant
    ? styles[`value_${stat.valueVariant}`]
    : '';

  return (
    <div
      className={`${styles.card} ${styles[`size_${stat.size}`]}${valueVariantClass ? ` ${valueVariantClass}` : ''}`}
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

          <div className={`${styles.row} ${styles.rowBottom}${bottom.length === 3 ? ` ${styles.rowBottomThree}` : ''}`}>
            {bottom.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
