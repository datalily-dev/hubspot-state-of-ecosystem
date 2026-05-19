import { useId, useState } from 'react';
import GrowthStackedOpportunityViz, {
  GrowthStackedOpportunityTable,
  validateStackedData,
} from './GrowthStackedOpportunityViz';
import styles from './GrowthPage.module.css';

const VIEW_TABS = [
  { id: 'chart', label: 'Chart' },
  { id: 'table', label: 'Table' },
];

/**
 * Right-column panel on the Growth page.
 *
 * Renders the chart title, a small Chart/Table view toggle (Figma 2296:2855
 * — orange active pill + dark-teal inactive pill with sage text), and the
 * stacked bar + table when `chart.data` includes `years` and `series`.
 *
 * @param {{ chart: { title: string, source?: string, sourceHref?: string, data?: object } }} props
 */
export default function ChartPanel({ chart }) {
  const { title, source, sourceHref, data } = chart;
  const [view, setView] = useState('chart');
  const regionId = useId();
  const showStackedViz = validateStackedData(data);

  return (
    <section className={styles.chartPanel} aria-label={title}>
      {/* Title + tabs + viz are grouped (Figma 2316:3250 → flex-col gap-20)
          so the chart panel's justify-content: space-between only separates
          this cluster from the source line at the bottom. */}
      <div className={styles.chartTop}>
        <div className={styles.chartTitleGroup}>
          <h3 className={styles.chartTitle}>{title}</h3>

          <div
            className={styles.viewToggle}
            role="tablist"
            aria-label="Chart view"
          >
            {VIEW_TABS.map((tab) => {
              const selected = view === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={regionId}
                  className={selected ? styles.viewPillActive : styles.viewPill}
                  onClick={() => setView(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={regionId}
          className={showStackedViz ? styles.chartVizRegion : undefined}
          role="region"
          aria-label={view === 'chart' ? `${title}, chart` : `${title}, data table`}
        >
          {showStackedViz ? (
            view === 'chart' ? (
              <GrowthStackedOpportunityViz data={data} title={title} />
            ) : (
              <GrowthStackedOpportunityTable data={data} />
            )
          ) : (
            <div
              className={styles.chartCanvas}
              role="img"
              aria-label={`${title} — visualization placeholder`}
            />
          )}
        </div>
      </div>

      {source && (
        <p className={styles.chartSource}>
          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.chartSourceLink}
            >
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      )}
    </section>
  );
}
