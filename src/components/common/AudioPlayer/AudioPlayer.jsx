import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePageId } from '../../../context/PageIdContext';
import { useSlideDeckOptional } from '../../../context/SlideDeckContext';
import AudioWavesIcon from '../../../assets/icon/audio-1.svg?react';
import styles from './AudioPlayer.module.css';

const STOP_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
  </svg>
);

const PLAY_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
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

  const timeLabel = isPlaying
    ? `${formatTime(currentTime)} / ${formatTime(duration)}`
    : `Play audio  ${formatTime(duration)}`;

  const playerClass = [
    styles.player,
    size === 'sm' ? styles.playerSm : '',
    isPlaying ? styles.playing : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={playerClass}
        onClick={togglePlay}
        aria-label={label}
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

      {hasSrc && (
        // Audio quotes are short pull-quotes whose full text is already
        // rendered above by `QuoteCard`, so the visible quote serves as the
        // accessible alternative. WebVTT captions will be wired up here once
        // transcript files are produced.
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
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
