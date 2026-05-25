import PageShell from '../../common/PageShell/PageShell';
import VideoHero from '../../common/VideoHero/VideoHero';
import { useSlideEntrance } from '../../../hooks/useSlideEntrance';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import gradientA from '../../../assets/vision/gradient-a.svg';
import gradientB from '../../../assets/vision/gradient-b.svg';
import angieOdowdAvatar from '../../../assets/vision/angie-odowd.webp';
import visionVideo from '../../../assets/vision/video.jpg';
import visionVideoSrc from '../../../assets/foreword/HubSpot-Video-Placeholder.mp4';
import visionContent from '../../../data/static-pages/vision.json';
import { ContentParagraph } from '../../../utils/contentParagraph';
import styles from './VisionPage.module.css';

/**
 * Page 6 — Vision.
 * Angie O'Dowd's letter on the State of the HubSpot ecosystem. GLOBAL.
 * Layout reference: Figma 2193:1823.
 */
export default function VisionPage() {
  const isEntranceReady = useSlideEntrance('vision');
  const headlineClass = [
    styles.headline,
    'fadeDown',
    isEntranceReady && 'isVisible',
  ]
    .filter(Boolean)
    .join(' ');

  const { author, video } = visionContent;

  return (
    <PageShell id="vision" className={styles.page}>
      <div className={styles.gradients} aria-hidden="true">
        <div className={styles.gradientBWrap}>
          <div className={styles.gradientBRotate}>
            <img className={styles.gradientB} src={gradientB} alt="" />
          </div>
        </div>
        <div className={styles.gradientAWrap}>
          <div className={styles.gradientARotate}>
            <img className={styles.gradientA} src={gradientA} alt="" />
          </div>
        </div>
      </div>

      <article className={styles.article}>
        <div className={styles.container}>
          <header className={styles.titleBlock}>
            <p className={styles.eyebrow}>{visionContent.eyebrow}</p>
            <h1 className={headlineClass}>{visionContent.headline}</h1>
          </header>

          {visionContent.subhead ? (
            <p className={styles.subhead}>{visionContent.subhead}</p>
          ) : null}

          <VideoHero
            className={styles.video}
            src={visionVideoSrc}
            poster={visionVideo}
            regionLabel={video.regionLabel}
            playLabel={video.playLabel}
            thumbScaleVar="--vision-w"
          />

          <div className={styles.body}>
            {visionContent.body.map((paragraph, i) => (
              <ContentParagraph key={`body-${i}`} paragraph={paragraph} />
            ))}

            <ol className={styles.takeaways}>
              {visionContent.takeaways.map((item, i) => (
                <li key={`takeaway-${i}`}>
                  <strong>{item.title}</strong>
                  {item.linkText ? (
                    <a
                      href={item.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.takeawayLink}
                    >
                      <strong>{item.linkText}</strong>
                    </a>
                  ) : null}
                  {item.titleSuffix ? <strong>{item.titleSuffix}</strong> : null}{' '}
                  {item.body}
                </li>
              ))}
            </ol>

            {visionContent.bodyAfterTakeaways.map((paragraph, i) => (
              <ContentParagraph key={`after-${i}`} paragraph={paragraph} />
            ))}
          </div>

          <figure className={styles.byline}>
            <img
              className={styles.avatar}
              src={angieOdowdAvatar}
              alt={author.avatarAlt}
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
            />
            <figcaption className={styles.bylineText}>
              <span className={styles.bylineName}>
                <a
                  href={author.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bylineNameLink}
                >
                  {author.name}
                </a>
                <a
                  href={author.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedInLink}
                  aria-label={author.linkedInAriaLabel}
                >
                  <LinkedInIcon className={styles.linkedInIcon} focusable="false" />
                </a>
              </span>
              <span className={styles.bylineRole}>{author.role}</span>
            </figcaption>
          </figure>
        </div>
      </article>
    </PageShell>
  );
}
