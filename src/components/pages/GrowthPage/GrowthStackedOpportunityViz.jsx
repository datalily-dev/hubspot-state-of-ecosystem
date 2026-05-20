import { useId } from 'react';
import styles from './GrowthStackedOpportunityViz.module.css';

const BAR_W = 64;
const BAR_GAP = 40;
const MAX_BAR_H = 349;
const VALUE_LABEL_H = 28;
const VALUE_LABEL_GAP = 12;
const YEAR_LABEL_H = 22;
const YEAR_LABEL_GAP = 12;
const TOP_PAD = VALUE_LABEL_H + VALUE_LABEL_GAP;
const BOTTOM_PAD = YEAR_LABEL_GAP + YEAR_LABEL_H;

/**
 * @param {number} b - value in billions (may be fractional, e.g. 0.25 for $250M)
 */
export function formatOpportunityValue(b) {
  if (typeof b !== 'number' || Number.isNaN(b)) return '—';
  return `$${(Math.round(b * 10) / 10).toFixed(1)}B`;
}

function columnTotals(years, series, explicitTotals) {
  // If the data provides authoritative totals (from the IDC source), use them
  // so labels don't drift from summed-rounded-segments.
  if (Array.isArray(explicitTotals) && explicitTotals.length === years.length) {
    return explicitTotals.map((t, i) =>
      typeof t === 'number' && !Number.isNaN(t)
        ? t
        : series.reduce((sum, s) => sum + (s.valuesM[i] ?? 0), 0),
    );
  }
  return years.map((_, i) =>
    series.reduce((sum, s) => sum + (s.valuesM[i] ?? 0), 0),
  );
}

function buildChartDescription(title, years, series, totals) {
  const parts = years.map((y, i) => {
    const seg = series
      .map((s) => `${s.label} ${formatOpportunityValue(s.valuesM[i] ?? 0)}`)
      .join(', ');
    return `${y}: ${formatOpportunityValue(totals[i])} total (${seg})`;
  });
  return `${title}. ${parts.join('. ')}.`;
}

/**
 * @param {{ years: number[], series: { label: string, valuesM: number[], fill: string, tableSwatch?: string }[] }} data
 */
export function validateStackedData(data) {
  if (!data || !Array.isArray(data.years) || data.years.length === 0) {
    return false;
  }
  const { years, series } = data;
  if (!Array.isArray(series) || series.length < 2) return false;
  const n = years.length;
  return series.every(
    (s) =>
      typeof s.label === 'string' &&
      typeof s.fill === 'string' &&
      Array.isArray(s.valuesM) &&
      s.valuesM.length === n &&
      s.valuesM.every((v) => typeof v === 'number' && !Number.isNaN(v)),
  );
}

/**
 * Stacked bar chart for Growth page IDC-style opportunity data.
 * `series[0]` is the bottom segment of each bar; the last series is the top.
 *
 * @param {{ data: { years: number[], series: object[] }, title: string }} props
 */
export default function GrowthStackedOpportunityViz({ data, title }) {
  const uid = useId();
  const titleId = `${uid}-svg-title`;
  const descId = `${uid}-svg-desc`;
  const { years, series, totals: explicitTotals } = data;
  const labelTotals = columnTotals(years, series, explicitTotals);
  const segmentSums = years.map((_, i) =>
    series.reduce((sum, s) => sum + (s.valuesM[i] ?? 0), 0),
  );
  const maxTotal = Math.max(...segmentSums, ...labelTotals, 1);

  const n = years.length;
  const viewW = n * BAR_W + (n - 1) * BAR_GAP;
  const viewH = TOP_PAD + MAX_BAR_H + BOTTOM_PAD;
  const barBottomY = TOP_PAD + MAX_BAR_H;
  const yearLabelCenterY = barBottomY + YEAR_LABEL_GAP + YEAR_LABEL_H / 2;

  const bars = years.map((year, i) => {
    const x = i * (BAR_W + BAR_GAP);
    const total = labelTotals[i];
    const barH = (segmentSums[i] / maxTotal) * MAX_BAR_H;
    let yCursor = barBottomY;

    const segments = series.map((s, si) => {
      const v = s.valuesM[i] ?? 0;
      const h = (v / maxTotal) * MAX_BAR_H;
      const yTop = yCursor - h;
      const seg = (
        <rect
          key={`${year}-${si}`}
          x={x}
          y={yTop}
          width={BAR_W}
          height={h}
          fill={s.fill}
        />
      );
      yCursor = yTop;
      return seg;
    });

    const valueLabelCenterY =
      barBottomY - barH - VALUE_LABEL_GAP - VALUE_LABEL_H / 2;

    const barDelay = i * 120;
    const labelDelay = barDelay + 450;

    return (
      <g key={year}>
        <g
          className={styles.barGroup}
          style={{
            '--bar-origin-x': `${x + BAR_W / 2}px`,
            '--bar-origin-y': `${barBottomY}px`,
            '--bar-delay': `${barDelay}ms`,
          }}
        >
          {segments}
        </g>
        <text
          x={x + BAR_W / 2}
          y={valueLabelCenterY}
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.barLabel}
          style={{ '--label-delay': `${labelDelay}ms` }}
        >
          {formatOpportunityValue(total)}
        </text>
        <text
          x={x + BAR_W / 2}
          y={yearLabelCenterY}
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.axisYear}
          style={{ '--label-delay': `${barDelay + 200}ms` }}
        >
          {year}
        </text>
      </g>
    );
  });

  // Figma 2316:4716 — legend reads top-of-stack first (Customer Success → Commerce).
  const legendSeries = [...series].reverse();

  return (
    <div className={styles.chartWrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMinYMax meet"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{buildChartDescription(title, years, series, labelTotals)}</desc>
        {bars}
      </svg>
      <div className={styles.legend} aria-hidden="true">
        {legendSeries.map((s) => (
          <span key={s.label} className={styles.legendItem}>
            <span
              className={styles.swatch}
              style={{ background: s.tableSwatch ?? s.fill }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * @param {{ data: { years: number[], series: object[] } }} props
 */
export function GrowthStackedOpportunityTable({ data }) {
  const { years, series, rowHeaderLabel } = data;
  const tableRows = [...series].reverse();
  const firstColLabel = rowHeaderLabel || 'Category';

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <caption className="sr-only">
          Opportunity values for {years.join(', ')}. Rows list categories from
          largest stack segment to smallest.
        </caption>
        <colgroup>
          <col className={styles.colLabel} />
          {years.map((y) => (
            <col key={y} className={styles.colYear} />
          ))}
        </colgroup>
        <thead>
          <tr
            className={styles.tableRowAnim}
            style={{ '--row-delay': '0ms' }}
          >
            <th scope="col">
              <span className={styles.colHeadHidden}>{firstColLabel}</span>
            </th>
            {years.map((y) => (
              <th key={y} scope="col">
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((s, ri) => (
            <tr
              key={s.label}
              className={styles.tableRowAnim}
              style={{ '--row-delay': `${(ri + 1) * 120}ms` }}
            >
              <th scope="row">
                <span className={styles.rowHead}>
                  <span
                    className={styles.swatch}
                    style={{ background: s.tableSwatch ?? s.fill }}
                    aria-hidden="true"
                  />
                  {s.label}
                </span>
              </th>
              {s.valuesM.map((v, i) => (
                <td key={`${s.label}-${years[i]}`}>{formatOpportunityValue(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
