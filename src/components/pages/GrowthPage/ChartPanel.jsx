import { useId, useState } from 'react';
import Tabs from '../../common/Tabs/Tabs';
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
 * Renders the chart title, a Chart/Table view toggle, and a stacked bar +
 * table when `chart.data` includes `years` and `series` (IDC-style blocks).
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
      <h3 className={styles.chartTitle}>{title}</h3>

      <Tabs
        tabs={VIEW_TABS}
        activeId={view}
        onChange={setView}
        ariaLabel="Chart view"
        variant="dark"
        className={styles.chartViewTabs}
      />

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

      {source && (
        <p className={`${styles.chartSource} ${styles.chartSourceEnd}`}>
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
