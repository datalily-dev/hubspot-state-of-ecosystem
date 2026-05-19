import { useState } from 'react';
import PageShell from '../../common/PageShell/PageShell';
import Tabs from '../../common/Tabs/Tabs';
import ChartPanel from './ChartPanel';
import growthContent from '../../../data/static-pages/growth.json';
import styles from './GrowthPage.module.css';

function CtaCard({ cta }) {
  if (!cta) return null;
  return (
    <aside className={styles.ctaCard}>
      <div className={styles.ctaImage} aria-hidden="true" />
      <div className={styles.ctaBody}>
        <h4 className={styles.ctaTitle}>{cta.title}</h4>
        {cta.subtitle && <p className={styles.ctaSubtitle}>{cta.subtitle}</p>}
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
 * Tab swaps left-column copy, right-column chart title/source, and the CTA card.
 * Each tab loads IDC-style stacked bar + table data from growth.json.
 */
export default function GrowthPage() {
  const { label, heading, tabs } = growthContent;
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const tabDefs = tabs.map((t) => ({ id: t.id, label: t.tabLabel }));
  const active = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <PageShell id="growth" className={styles.page}>
      <div className={styles.body}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{label}</p>
            <h2 className={styles.heading}>{heading}</h2>

            <div className={styles.tabRow}>
              <Tabs
                tabs={tabDefs}
                activeId={activeTabId}
                onChange={setActiveTabId}
                ariaLabel="Growth focus area"
                variant="dark"
                className={styles.tabs}
              />
            </div>
          </header>

          <div
            className={styles.columns}
            role="tabpanel"
            aria-label={active.tabLabel}
          >
            <div className={styles.leftCol}>
              <p className={styles.colEyebrow}>{active.eyebrow}</p>
              <h3 className={styles.colHeading}>{active.heading}</h3>

              {active.body.map((paragraph, i) => (
                <p key={i} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}

              {active.bullets && active.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {active.bullets.map((b, i) => (
                    <li key={i} className={styles.bullet}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              <CtaCard cta={active.cta} />
            </div>

            <div className={styles.rightCol}>
              <ChartPanel chart={active.chart} />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
