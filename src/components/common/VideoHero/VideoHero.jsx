import { useState } from 'react';
import playButton from '../../../assets/foreword/play-button.svg';
import styles from './VideoHero.module.css';

/**
 * Shared video poster → player block used by Foreword, Vision, and Insider
 * Insights. Renders a clickable thumbnail until the user activates it, then
 * swaps in a native <video> element.
 *
 * For YouTube / Vimeo, swap the player branch for an <iframe> at the call
 * site — the thumb/state machine still applies.
 *
 * @param {object} props
 * @param {string} [props.src]            Video URL (MP4/HLS). Omit to render a
 *                                        non-interactive placeholder.
 * @param {string} [props.poster]         Thumbnail image URL.
 * @param {string} props.regionLabel      aria-label for the active player region.
 * @param {string} props.playLabel        aria-label for the play button.
 * @param {number} [props.playButtonSize] Max width in px (clamps with viewport
 *                                        via --hero-w if set on the wrapper).
 * @param {string} [props.thumbScaleVar]  CSS var name driving the play button
 *                                        clamp (e.g. '--insider-w'). If unset,
 *                                        play button stays at playButtonSize.
 * @param {string} [props.className]      Page-specific class on the outer
 *                                        wrapper (background, aspect-ratio).
 * @param {React.ReactNode} [props.children] Extra overlay nodes (e.g. label).
 */
export default function VideoHero({
  src,
  poster,
  regionLabel,
  playLabel,
  playButtonSize = 78,
  thumbScaleVar,
  className,
  children,
}) {
  const [playing, setPlaying] = useState(false);
  const canPlay = Boolean(src);
  const showPlayer = canPlay && playing;

  const rootClass = className ? `${styles.root} ${className}` : styles.root;
  const playButtonStyle = thumbScaleVar
    ? {
        width: `clamp(${Math.round(playButtonSize * 0.72)}px, calc(var(${thumbScaleVar}) * ${playButtonSize} / 1440), ${playButtonSize}px)`,
      }
    : { width: `${playButtonSize}px` };

  if (showPlayer) {
    return (
      <div className={rootClass} role="region" aria-label={regionLabel}>
        <video
          className={styles.player}
          controls
          autoPlay
          playsInline
          src={src}
          poster={poster}
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <button
        type="button"
        className={styles.thumb}
        aria-label={playLabel}
        disabled={!canPlay}
        onClick={canPlay ? () => setPlaying(true) : undefined}
      >
        {poster && (
          <img
            className={styles.photo}
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}
        <span className={styles.shadow} aria-hidden="true" />
        <img
          className={styles.playButton}
          src={playButton}
          alt=""
          style={playButtonStyle}
          aria-hidden="true"
        />
        {children}
      </button>
    </div>
  );
}
