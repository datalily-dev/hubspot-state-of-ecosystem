import { useState, useCallback, useEffect, useRef } from 'react';
import PageShell from '../../common/PageShell/PageShell';
import { useSlideDeck } from '../../../context/SlideDeckContext';
import Tabs from '../../common/Tabs/Tabs';
import Dropdown from '../../common/Dropdown/Dropdown';
import ChartPanel from './ChartPanel';
import growthContent from '../../../data/static-pages/growth.json';
import gradientA from '../../../assets/growth/gradient-a.svg';
import gradientB from '../../../assets/growth/gradient-b.svg';
import ctaPhotoMidMarket from '../../../assets/growth/cta-photo.jpg';
import ctaPhotoAgentic from '../../../assets/growth/cta-photo-agentic.jpg';
import styles from './GrowthPage.module.css';

/**
 * Per-tab CTA artwork and layout variant. Figma 2316:3209 (164px) vs 2316:3651 (180px).
 * Tabs without an entry render a gradient placeholder.
 */
const CTA_CONFIG = {
  'mid-market': { image: ctaPhotoMidMarket, variant: 'default' },
  agentic: { image: ctaPhotoAgentic, variant: 'tall' },
};

function CtaCard({ cta, image, variant = 'default' }) {
  if (!cta) return null;
  const cardClass =
    variant === 'tall'
      ? `${styles.ctaCard} ${styles.ctaCardTall}`
      : styles.ctaCard;
  return (
    <aside className={cardClass}>
      <div className={styles.ctaBackdrop} aria-hidden="true">
        {image ? (
          <div className={styles.ctaPhotoFrame}>
            <div className={styles.ctaPhotoInner}>
              <img
                className={styles.ctaPhoto}
                src={image}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ) : (
          <div className={styles.ctaPhotoPlaceholder} />
        )}
      </div>
      <div className={styles.ctaBody}>
        <div className={styles.ctaTextGroup}>
          <h4 className={styles.ctaTitle}>{cta.title}</h4>
          {cta.subtitle && <p className={styles.ctaSubtitle}>{cta.subtitle}</p>}
        </div>
        {cta.href && (
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            {cta.linkText || 'Learn more'}
          </a>
        )}
      </div>
    </aside>
  );
}

/**
 * Page 7 — Growth.
 *
 * 4 strategic areas (mid-market, agentic acceleration, marketing, specialization).
 * The tab swaps the left-column copy (eyebrow / heading / body / bullets /
 * CTA card) and the right-column chart panel.
 *
 * Layout reference: Figma 2296:2736 (1440×1408 artboard for Mid-Market tab).
 */
export default function GrowthPage() {
  const { activeAnchor } = useSlideDeck();
  const { label, heading, tabs } = growthContent;
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [animKey, setAnimKey] = useState(0);
  const prevAnchorRef = useRef(activeAnchor);
  const tabDefs = tabs.map((t) => ({ id: t.id, label: t.tabLabel }));
  const active = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // SlideDeck keeps every page mounted, so entrance animations don't re-fire
  // on revisit. Bumping animKey on return forces a fresh mount of the chart
  // and content blocks so their animations replay.
  useEffect(() => {
    if (activeAnchor === 'growth' && prevAnchorRef.current !== 'growth') {
      setAnimKey((k) => k + 1);
    }
    prevAnchorRef.current = activeAnchor;
  }, [activeAnchor]);

  const handleTabChange = useCallback((id) => {
    setActiveTabId(id);
    setAnimKey((k) => k + 1);
  }, []);

  // Figma puts the bullets between the first and remaining body paragraphs.
  const [firstBody, ...restBody] = active.body;

  return (
    <PageShell id="growth" className={styles.page}>
      <div className={styles.gradients} aria-hidden="true">
        <div className={styles.gradientAWrap}>
          <div className={styles.gradientARotate}>
            <img className={styles.gradientImg} src={gradientA} alt="" />
          </div>
        </div>
        <div className={styles.gradientBWrap}>
          <div className={styles.gradientBRotate}>
            <img className={styles.gradientImg} src={gradientB} alt="" />
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={`${styles.eyebrow} ${styles.animFadeUp}`}>{label}</p>
            <h2
              className={`${styles.heading} ${styles.animFadeUp}`}
              style={{ '--anim-delay': '80ms' }}
            >
              {heading}
            </h2>
          </header>

          <div
            className={`${styles.tabSection} ${styles.animFadeUp}`}
            style={{ '--anim-delay': '160ms' }}
          >
            <div className={styles.tabRow}>
              <Tabs
                tabs={tabDefs}
                activeId={activeTabId}
                onChange={handleTabChange}
                ariaLabel="Growth focus area"
                variant="bar"
                className={styles.tabs}
              />
              {/* Mobile (QA): themed dropdown replaces the row of tabs on
                  phones — hidden at desktop via CSS so the existing tab bar
                  remains the source of truth above the mobile breakpoint. */}
              <div className={styles.tabSelectWrap}>
                <Dropdown
                  options={tabDefs}
                  value={activeTabId}
                  onChange={handleTabChange}
                  ariaLabel="Growth focus area"
                  variant="bar"
                  flush
                />
              </div>
            </div>
            <div className={styles.tabDivider} aria-hidden="true" />
          </div>

          <div
            key={animKey}
            className={styles.columns}
            role="tabpanel"
            aria-label={active.tabLabel}
          >
            <div className={styles.leftCol}>
              <p
                className={`${styles.colEyebrow} ${styles.animSlideIn}`}
                style={{ '--anim-delay': '0ms' }}
              >
                {active.eyebrow}
              </p>
              <h3
                className={`${styles.colHeading} ${styles.animSlideIn}`}
                style={{ '--anim-delay': '60ms' }}
              >
                {active.heading}
              </h3>

              <div
                className={`${styles.copy} ${styles.animSlideIn}`}
                style={{ '--anim-delay': '120ms' }}
              >
                {firstBody && <p className={styles.paragraph}>{firstBody}</p>}

                {active.bullets && active.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {active.bullets.map((b, i) => (
                      <li key={i} className={styles.bullet}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {restBody.map((paragraph, i) => (
                  <p key={i} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div
                className={styles.animSlideIn}
                style={{ '--anim-delay': '200ms' }}
              >
                <CtaCard
                  cta={active.cta}
                  image={CTA_CONFIG[active.id]?.image}
                  variant={CTA_CONFIG[active.id]?.variant}
                />
              </div>
            </div>

            <div className={styles.divider} aria-hidden="true" />

            <div
              className={`${styles.rightCol} ${styles.animSlideIn}`}
              style={{ '--anim-delay': '80ms' }}
            >
              <ChartPanel chart={active.chart} />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
