import PageShell from '../../common/PageShell/PageShell';
import VideoHero from '../../common/VideoHero/VideoHero';
import { useSlideEntrance } from '../../../hooks/useSlideEntrance';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import gradientA from '../../../assets/foreword/gradient-a.svg';
import gradientB from '../../../assets/foreword/gradient-b.svg';
import forewordVideo from '../../../assets/foreword/video.jpg';
import forewordVideoSrc from '../../../assets/foreword/HubSpot-Video-Placeholder.mp4';
import zackKassAvatar from '../../../assets/foreword/zack-kass.webp';
import forewordContent from '../../../data/static-pages/foreword.json';
import { ContentParagraph } from '../../../utils/contentParagraph';
import styles from './ForewordPage.module.css';

export default function ForewordPage() {
  const isEntranceReady = useSlideEntrance('foreword');
  const headlineClass = [
    styles.headline,
    'fadeDown',
    isEntranceReady && 'isVisible',
  ]
    .filter(Boolean)
    .join(' ');

  const { author, video } = forewordContent;

  return (
    <PageShell id="foreword" className={styles.page}>
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
          <header className={styles.intro}>
            <p className={styles.eyebrow}>{forewordContent.eyebrow}</p>
            <h1 className={headlineClass}>{forewordContent.headline}</h1>
          </header>

          <div className={styles.body}>
            {forewordContent.bodyBeforeVideo.map((paragraph, i) => (
              <ContentParagraph key={`before-${i}`} paragraph={paragraph} />
            ))}
          </div>

          <VideoHero
            className={styles.video}
            src={forewordVideoSrc}
            poster={forewordVideo}
            regionLabel={video.regionLabel}
            playLabel={video.playLabel}
            thumbScaleVar="--foreword-w"
          />

          <div className={styles.body}>
            {forewordContent.bodyAfterVideo.map((paragraph, i) => (
              <ContentParagraph key={`after-${i}`} paragraph={paragraph} />
            ))}
          </div>

          <figure className={styles.byline}>
            <img
              className={styles.avatar}
              src={zackKassAvatar}
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
