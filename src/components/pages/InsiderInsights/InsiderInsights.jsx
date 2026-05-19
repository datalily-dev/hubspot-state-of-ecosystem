import PageShell from '../../common/PageShell/PageShell';
import AudioPlayer from '../../common/AudioPlayer/AudioPlayer';
import VideoHero from '../../common/VideoHero/VideoHero';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import gradientA from '../../../assets/vision/gradient-a.svg';
import gradientB from '../../../assets/vision/gradient-b.svg';
import insiderVideoSrc from '../../../assets/foreword/HubSpot-Video-Placeholder.mp4';
import adamBleibtreu from '../../../assets/insider-insights/adam-bleibtreu.webp';
import camielFreriks from '../../../assets/insider-insights/camiel-freriks.webp';
import emilyWingrove from '../../../assets/insider-insights/emily-wingrove.webp';
import joseBetancur from '../../../assets/insider-insights/jose-betancur.webp';
import michelleOKeeffe from '../../../assets/insider-insights/michelle-okeeffe.webp';
import stuartToledo from '../../../assets/insider-insights/stuart-toledo.webp';
import aptitude8Audio from '../../../assets/audio/Aptitude 8 - Solutions Partner - Impact.m4a';
import engagingAudio from '../../../assets/audio/Engaging.io - JAPAC Partner of the Year - Impact.m4a';
import growsAudio from '../../../assets/audio/GROWS - LATAM - Impact.m4a';
import triarioAudio from '../../../assets/audio/Triario - LATAM - Upmarket - Impact.m4a';
import smartbugAudio from '../../../assets/audio/SmartBug - NAM Partner of the Year - Impact.m4a';
import insiderContent from '../../../data/static-pages/insider-insights.json';
import styles from './InsiderInsights.module.css';

/** Partner headshots keyed by story id. */
const AVATARS = {
  'siloy-twelve': camielFreriks,
  'aptitude8-b2c': emilyWingrove,
  'engaging-castle': michelleOKeeffe,
  'grows-colectivo': stuartToledo,
  'triario-healthcare': joseBetancur,
  'smartbug-brightstar': adamBleibtreu,
};

/**
 * Audio clips keyed by story id. Stories without an entry render a disabled
 * audio pill (AudioPlayer falls back gracefully when `src` is missing).
 */
const AUDIO = {
  'aptitude8-b2c': aptitude8Audio,
  'engaging-castle': engagingAudio,
  'grows-colectivo': growsAudio,
  'triario-healthcare': triarioAudio,
  'smartbug-brightstar': smartbugAudio,
};

function StoryRow({ story }) {
  const { author, audio } = story;
  const avatarSrc = AVATARS[story.id];
  const audioSrc = AUDIO[story.id] ?? audio?.src;

  // Avatar is rendered twice: at desktop (left of the story) and at mobile
  // (inline with the byline). CSS hides whichever isn't appropriate for the
  // current viewport so the visible DOM matches the QA design without
  // restructuring the desktop layout.
  const renderAvatar = (placement) =>
    avatarSrc ? (
      <img
        className={`${styles.avatar} ${styles[placement]}`}
        src={avatarSrc}
        alt=""
        width={160}
        height={160}
        loading="lazy"
        decoding="async"
      />
    ) : (
      <div className={`${styles.orb} ${styles[placement]}`} aria-hidden="true" />
    );

  return (
    <article className={styles.story}>
      {renderAvatar('avatarDesktop')}

      <div className={styles.storyContent}>
        <div className={styles.storyText}>
          {story.tags && (
            <div className={styles.tags}>
              {story.tags.split('|').map((tag) => (
                <span key={tag.trim()} className={styles.tag}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <h3 className={styles.storyHeadline}>{story.headline}</h3>
          <p className={styles.bodyText}>{story.body}</p>
        </div>

        <div className={styles.bylineRow}>
          <div className={styles.bylineWithAvatar}>
            {renderAvatar('avatarMobile')}
            <div className={styles.byline}>
              <span className={styles.bylineName}>
                {author.name}
                {author.linkedIn && (
                  <a
                    href={author.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedInLink}
                    aria-label={`${author.name} on LinkedIn`}
                  >
                    <LinkedInIcon
                      className={styles.linkedInIcon}
                      focusable="false"
                    />
                  </a>
                )}
              </span>
              <span className={styles.bylineRole}>{author.role}</span>
            </div>
          </div>

          <div className={styles.audioSlot}>
            <AudioPlayer
              src={audioSrc}
              durationSeconds={audio?.durationSeconds ?? 0}
              label={`Play audio quote from ${author.name}`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Page 8 — Insider Insights.
 * Layout reference: Figma 2193:2527.
 *
 * Video hero followed by a vertical list of partner case-study rows.
 * Video thumbnail is a placeholder pending a real asset.
 */
export default function InsiderInsights() {
  const { label, heading, video, stories } = insiderContent;

  return (
    <PageShell id="insider-insights" className={styles.page}>
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
        <div className={styles.outer}>
          <header className={styles.titleBlock}>
            <p className={styles.eyebrow}>{label}</p>
            <h2 className={styles.heading}>{heading}</h2>
          </header>

          <div className={styles.videoWrap}>
            <VideoHero
              className={styles.video}
              src={insiderVideoSrc}
              poster={video?.thumbnail}
              regionLabel="Partner story video"
              playLabel={video?.title ? `Play video: ${video.title}` : 'Play partner story video'}
              playButtonSize={100}
              thumbScaleVar="--insider-w"
            />
          </div>

          <ul className={styles.stories}>
            {stories.map((story, idx) => (
              <li key={story.id} className={styles.storyItem}>
                <StoryRow story={story} />
                {idx < stories.length - 1 && (
                  <div className={styles.divider} aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
