import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePageId } from '../../../context/PageIdContext';
import { useSlideDeckOptional } from '../../../context/SlideDeckContext';
import AudioWavesIcon from '../../../assets/icon/audio-1.svg?react';
import SeekBackwardIcon from '../../../assets/icon/seek-backward.svg?react';
import SeekForwardIcon from '../../../assets/icon/seek-forward.svg?react';
import styles from './AudioPlayer.module.css';

const SKIP_SECONDS = 5;

const STOP_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
  </svg>
);

const PLAY_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Audio playback pill used by Short Takes quotes (and reusable elsewhere).
 *
 * Visual states match the Figma comp:
 *   • Idle — circular play icon + audio-waves art + "Play audio · 0:38"
 *   • Playing — circular stop icon + animated waveform + "0:15 / 0:47"
 *     plus skip-back / skip-forward 5-second controls.
 *
 * Behaviours:
 *   • Pauses automatically when scrolled out of frame (IntersectionObserver).
 *   • Pauses other instances when one starts playing (single-instance policy
 *     enforced via a module-level reference).
 *   • Falls back gracefully when no `src` is provided (button is disabled
 *     and a non-interactive label is shown).
 *
 * @param {{
 *   src?: string,
 *   durationSeconds: number,
 *   label: string,           // accessible label, e.g. "Play Duncan Lennox audio quote"
 *   size?: 'md' | 'sm',      // 'md' (default) for Short Takes; 'sm' for Insider Insights
 * }} props
 */

let activePlayer = null;

export default function AudioPlayer({ src, durationSeconds, label, size = 'md' }) {
  const audioRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds || 0);
  // Tracks which skip button just fired so we can flash it briefly as
  // click feedback (back to idle on its own, no lingering :hover state).
  const [pressedSkip, setPressedSkip] = useState(null);
  const pressTimerRef = useRef(null);
  const labelId = useId();
  const pageId = usePageId();
  const slideDeck = useSlideDeckOptional();

  const hasSrc = Boolean(src);

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    audio.pause();
    setIsPlaying(false);
    if (activePlayer === audio) {
      activePlayer = null;
    }
  }, []);

  useEffect(() => {
    setDuration(durationSeconds || 0);
  }, [durationSeconds]);

  // Pause when the pill scrolls out of the slide viewport, or when the user
  // navigates to another deck slide. Keeps UI state in sync with the element.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof window.IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
            stopPlayback();
          }
        });
      },
      { threshold: [0, 0.25, 0.5, 1] },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [stopPlayback]);

  useEffect(() => {
    if (!slideDeck || !pageId) return undefined;
    if (slideDeck.activeAnchor !== pageId) {
      stopPlayback();
    }
    return undefined;
  }, [slideDeck, slideDeck?.activeAnchor, pageId, stopPlayback]);

  // Tear down the active-player reference if this instance unmounts mid-play.
  useEffect(() => {
    const audioEl = audioRef.current;
    return () => {
      if (activePlayer === audioEl) {
        activePlayer = null;
      }
    };
  }, []);

  useEffect(() => () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
  }, []);

  const flashSkip = (which) => {
    setPressedSkip(which);
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => setPressedSkip(null), 120);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (activePlayer && activePlayer !== audioRef.current) {
      activePlayer.pause();
    }
    activePlayer = audioRef.current;
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (activePlayer === audioRef.current) {
      activePlayer = null;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (activePlayer === audioRef.current) {
      activePlayer = null;
    }
  };

  const handleTimeUpdate = (event) => {
    setCurrentTime(event.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (event) => {
    const value = event.currentTarget.duration;
    if (Number.isFinite(value)) setDuration(value);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !hasSrc) return;
    if (audio.paused) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  };

  // Seek by ±N seconds, clamped to [0, duration]. Used by the skip buttons.
  const seekBy = (delta) => {
    const audio = audioRef.current;
    if (!audio || !hasSrc) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : duration;
    const next = Math.min(Math.max(0, audio.currentTime + delta), max || 0);
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const timeLabel = isPlaying
    ? `${formatTime(currentTime)} / ${formatTime(duration)}`
    : `Play audio  ${formatTime(duration)}`;

  const playerClass = [
    styles.player,
    size === 'sm' ? styles.playerSm : '',
    isPlaying ? styles.playing : '',
    !hasSrc ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const skipBtnClass = [styles.skipBtn, size === 'sm' ? styles.skipBtnSm : '']
    .filter(Boolean)
    .join(' ');

  const skipGroupClass = [
    styles.skipGroup,
    size === 'sm' ? styles.skipGroupSm : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={playerClass} role="group" aria-label={label}>
        <button
          type="button"
          className={styles.mainBtn}
          onClick={(event) => {
            togglePlay();
            event.currentTarget.blur();
          }}
          aria-label={isPlaying ? 'Pause audio' : label}
          aria-pressed={isPlaying}
          aria-describedby={labelId}
          disabled={!hasSrc}
        >
          <span className={styles.iconBubble} aria-hidden="true">
            {isPlaying ? STOP_ICON : PLAY_ICON}
          </span>

          {isPlaying ? (
            <span className={styles.waves} aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <span
                  key={i}
                  className={styles.wave}
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </span>
          ) : (
            <AudioWavesIcon className={styles.wavesIdle} aria-hidden="true" focusable="false" />
          )}

          <span className={styles.time} id={labelId}>
            {timeLabel}
          </span>
        </button>
      </div>

      {hasSrc && isPlaying && (
        <span className={skipGroupClass}>
          <button
            type="button"
            className={`${skipBtnClass}${pressedSkip === 'back' ? ` ${styles.skipBtnPressed}` : ''}`}
            onClick={(event) => {
              seekBy(-SKIP_SECONDS);
              flashSkip('back');
              event.currentTarget.blur();
            }}
            aria-label="Jump back 5 seconds"
            title="Jump back 5 seconds"
          >
            <SeekBackwardIcon
              className={styles.skipIcon}
              aria-hidden="true"
              focusable="false"
            />
          </button>
          <button
            type="button"
            className={`${skipBtnClass}${pressedSkip === 'forward' ? ` ${styles.skipBtnPressed}` : ''}`}
            onClick={(event) => {
              seekBy(SKIP_SECONDS);
              flashSkip('forward');
              event.currentTarget.blur();
            }}
            aria-label="Jump forward 5 seconds"
            title="Jump forward 5 seconds"
          >
            <SeekForwardIcon
              className={styles.skipIcon}
              aria-hidden="true"
              focusable="false"
            />
          </button>
        </span>
      )}

      {hasSrc && (
        // Audio quotes are short pull-quotes whose full text is already
        // rendered above by `QuoteCard`, so the visible quote serves as the
        // accessible alternative. WebVTT captions will be wired up here once
        // transcript files are produced.
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}
    </div>
  );
}
