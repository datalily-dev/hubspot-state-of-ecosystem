import PageShell from '../../common/PageShell/PageShell';
import AudioPlayer from '../../common/AudioPlayer/AudioPlayer';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import insiderContent from '../../../data/static-pages/insider-insights.json';
import styles from './InsiderInsights.module.css';

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  );
}

function VideoTile({ video }) {
  return (
    <div className={styles.videoTile}>
      <div className={styles.videoFrame} aria-hidden="true">
        {video?.thumbnail && (
          <img
            src={video.thumbnail}
            alt=""
            className={styles.videoThumb}
          />
        )}
      </div>

      <button
        type="button"
        className={styles.videoPlay}
        aria-label={video?.title ? `Play video: ${video.title}` : 'Play video'}
        disabled={!video?.src}
      >
        <PlayIcon />
      </button>
    </div>
  );
}

function StoryRow({ story }) {
  const { author, audio } = story;
  return (
    <article className={styles.story}>
      <div className={styles.orb} aria-hidden="true" />

      <div className={styles.storyBody}>
        <h3 className={styles.headline}>{story.headline}</h3>
        <p className={styles.bodyText}>{story.body}</p>

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
          <span className={styles.bylineRole}>
            {author.role}
            {story.tags ? `, ${story.tags}` : ''}
          </span>
        </div>
      </div>

      <div className={styles.audioSlot}>
        <AudioPlayer
          src={audio?.src}
          durationSeconds={audio?.durationSeconds ?? 0}
          label={`Play audio quote from ${author.name}`}
          size="sm"
        />
      </div>
    </article>
  );
}

/**
 * Page 8 — Insider Insights.
 *
 * Video hero followed by a vertical list of partner case-study rows. Orbs
 * and the video thumbnail are intentional placeholders pending real assets.
 */
export default function InsiderInsights() {
  const { label, heading, video, stories } = insiderContent;

  return (
    <PageShell id="insider-insights" className={styles.page}>
      <div className={styles.body}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{label}</p>
            <h2 className={styles.heading}>{heading}</h2>
          </header>

          <VideoTile video={video} />

          <ul className={styles.stories}>
            {stories.map((story) => (
              <li key={story.id} className={styles.storyItem}>
                <StoryRow story={story} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
