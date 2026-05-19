# Static page content

Global (unfiltered) page content that doesn't change with the filter.

- `navigationToc.js` — Navigation page table of contents
- `growth.json` — Growth page sections + CTAs
- `insider-insights.json` — Insider Insights case studies

Cover / Foreword / Vision body copy is currently kept in JSX (it ships into
HubSpot CMS downstream where it becomes editable). Filter-dependent content
lives in `../dynamic-pages/`.
