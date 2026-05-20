import PageShell from '../../common/PageShell/PageShell';
import VideoHero from '../../common/VideoHero/VideoHero';
import { NAVIGATION_TOC } from '../../../data/static-pages/navigationToc';
import navVideoSrc from '../../../assets/foreword/HubSpot-Video-Placeholder.mp4';
import styles from './NavigationPage.module.css';

/** Page 2 — Navigation. Static table of contents with a partner-story video
 *  pinned to the top of the right column (Figma 2463:3466). */
export default function NavigationPage() {
  const left = NAVIGATION_TOC.slice(0, 4);
  const right = NAVIGATION_TOC.slice(4);

  return (
    <PageShell id="navigation" className={styles.page}>
      <div className={styles.body}>
        <nav className={styles.toc} aria-label="Table of contents">
          <ul className={styles.column}>
            {left.map((entry) => (
              <TocItem
                key={entry.href}
                label={entry.label}
                href={entry.href}
                title={entry.title}
                description={entry.description}
              />
            ))}
          </ul>

          <div className={styles.colDivider} aria-hidden="true" />

          <div className={styles.column}>
            <div className={styles.videoWrap}>
              <VideoHero
                className={styles.video}
                src={navVideoSrc}
                regionLabel="Partner story video"
                playLabel="Play partner story video"
                playButtonSize={78}
              />
            </div>

            <ul className={styles.linkList}>
              {right.map((entry) => (
                <TocItem
                  key={entry.href}
                  label={entry.label}
                  href={entry.href}
                  title={entry.title}
                  description={entry.description}
                />
              ))}
            </ul>
          </div>
        </nav>
      </div>

    </PageShell>
  );
}

function TocItem({ label, href, title, description }) {
  return (
    <li className={styles.item}>
      <a href={href} className={styles.link}>
        <span className={styles.itemLabel}>{label}</span>
        <div className={styles.itemHeading}>
          <div className={styles.itemTitleWrap}>
            <span className={styles.itemTitle}>{title}</span>
          </div>
          <span className={styles.itemDescription}>{description}</span>
        </div>
      </a>
    </li>
  );
}
