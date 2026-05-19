import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SlideDeckProvider } from '../../../context/SlideDeckContext';
import PageNav from '../PageNav/PageNav';
import TopNav from '../TopNav/TopNav';
import styles from './SlideDeck.module.css';

const PAGE_ANCHORS = [
  'cover',
  'navigation',
  'foreword',
  'by-the-numbers',
  'short-takes',
  'vision',
  'growth',
  'insider-insights',
];

// Per-slide variant for the persistent PageNav, matching each page's
// background palette so the dot pill stays legible.
const DEFAULT_PAGE_VARIANTS = ['dark', 'light', 'light', 'light', 'dark', 'light', 'light', 'dark'];

// Per-slide background color for the sticky PageNav footer. Matches the
// owning page's background so content scrolling underneath the nav vanishes
// cleanly instead of bleeding through behind the dot pill / arrows.
const DEFAULT_PAGE_BG_COLORS = [
  'var(--color-teal-dark)',
  'var(--color-cream)',
  'var(--color-cream)',
  'var(--color-cream)',
  'var(--color-teal-dark)',
  'var(--color-cream)',
  'var(--color-teal-dark)',
  'var(--color-cream)',
];

// Adjacent (delta = 1) hops run a "push" transition: the track translates
// 100vw to the next slide while the outgoing slide fades to opacity 0 and
// the incoming slide fades to opacity 1 in the same time window. The
// simultaneous opacity envelope softens the color boundary at the slide
// edge so the eye never sees a hard vertical color seam crossing the
// viewport — directional motion is preserved, the seam is dissolved.
const SLIDE_MS = 500;
// Non-adjacent (delta > 1) hops run a pure crossfade instead — translating
// the track across multiple slide-widths at high speed would feel like a
// disorienting flicker through every intermediate page. Half-cycle: full
// fade-out + fade-in takes 2x this value.
const FADE_HALF_MS = 220;
const EDGE_TOLERANCE = 2;
const WHEEL_THRESHOLD = 8;
const TOUCH_THRESHOLD = 60;

// Buffer settings — prevents an aggressive scroll from blowing past a page.
// After hitting the bottom (or top) edge of a slide, residual inertia is
// ignored for EDGE_DWELL_MS. After that, the user must express intent by
// accumulating INTENT_THRESHOLD pixels of wheel delta in the same direction
// before the deck advances. The accumulator resets on a pause longer than
// INTENT_RESET_MS or on a direction reversal.
const EDGE_DWELL_MS = 120;
const INTENT_THRESHOLD = 100;
const INTENT_RESET_MS = 180;

// A short post-navigation lockout that absorbs residual momentum and prevents
// unintentional multi-page cascades (especially on non-scrollable slides).
const POST_NAV_LOCKOUT_MS = 800;

function clampIndex(index, total) {
  if (Number.isNaN(index)) return 0;
  if (index < 0) return 0;
  if (index > total - 1) return total - 1;
  return index;
}

function indexFromHash(hash, anchors) {
  const slug = (hash || '').replace(/^#/, '');
  const found = anchors.indexOf(slug);
  return found === -1 ? 0 : found;
}

/**
 * Horizontal slide deck for the report.
 *
 * Each child page becomes a full-viewport slide. Vertical scrolling inside a
 * slide is preserved; once the user reaches the bottom edge and keeps
 * scrolling/swiping, the deck transitions to the next slide. Scrolling up at
 * the top edge reverses to the previous slide. The active slide is mirrored
 * into the URL hash so that existing in-page anchors keep working.
 *
 * Two transition modes:
 *   • 'slide' — adjacent hops (delta = 1). Track translates 100vw while the
 *     outgoing/incoming slides crossfade in parallel, dissolving the color
 *     seam at the slide boundary.
 *   • 'fade' — non-adjacent hops (e.g. menu jumps). Track snaps to the
 *     target index while opacity is 0; only opacity animates.
 */
export default function SlideDeck({
  children,
  anchors = PAGE_ANCHORS,
  variants = DEFAULT_PAGE_VARIANTS,
  bgColors = DEFAULT_PAGE_BG_COLORS,
}) {
  const slides = useMemo(
    () => Children.toArray(children).filter(isValidElement),
    [children],
  );
  const total = slides.length;

  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(indexFromHash(window.location.hash, anchors), total),
  );
  const activeIndexRef = useRef(activeIndex);
  // Active transition style for the track:
  //   null     — steady state (no transition running)
  //   'slide'  — push transition for adjacent hops (transform + per-slide
  //              opacity animate simultaneously)
  //   'fade'   — crossfade for non-adjacent hops (track-level opacity
  //              animates while transform snaps mid-fade)
  const [transitionMode, setTransitionMode] = useState(null);
  // null | 'out' | 'in' — only relevant while transitionMode === 'fade'.
  // Drives the two-phase crossfade: fade-out → swap index → fade-in.
  const [fadePhase, setFadePhase] = useState(null);
  const fadeTimers = useRef([]);

  const deckRef = useRef(null);
  const slideRefs = useRef([]);
  const isAnimating = useRef(false);
  const touchStartY = useRef(null);
  const touchAccum = useRef(0);
  const prefersReducedMotion = useRef(false);

  // Edge-buffer state. `edgeSide` is 'top' | 'bottom' | null and tracks which
  // edge of the active slide the user is currently parked at. `edgeSince` is
  // the timestamp the edge was first reached (for the dwell window).
  // `intentAccum` is the running |deltaY| sum of in-direction wheel events
  // captured after the dwell completes; it must cross INTENT_THRESHOLD to
  // trigger a page change. `intentLastAt` lets us reset the accumulator on
  // pause.
  const edgeSide = useRef(null);
  const edgeSince = useRef(0);
  const intentAccum = useRef(0);
  const intentLastAt = useRef(0);

  // Timestamp when the most recent slide navigation fired.
  const lastNavAt = useRef(0);

  const resetEdgeIntent = useCallback(() => {
    edgeSide.current = null;
    edgeSince.current = 0;
    intentAccum.current = 0;
    intentLastAt.current = 0;
  }, []);

  // Detect reduced-motion preference once on mount, and keep it in sync.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      prefersReducedMotion.current = media.matches;
    };
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  // Keep a synchronous reference to the active slide index so transition logic
  // does not depend on React state update timing.
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Ensure any in-flight fade timers are released on unmount.
  useEffect(() => () => {
    fadeTimers.current.forEach((id) => window.clearTimeout(id));
    fadeTimers.current = [];
  }, []);

  const clearFadeTimers = useCallback(() => {
    fadeTimers.current.forEach((id) => window.clearTimeout(id));
    fadeTimers.current = [];
  }, []);

  // Defensive: even with `overflow: clip`, neutralise any attempt to scroll
  // the deck itself (e.g. an older engine that treats `clip` as `hidden`,
  // browser scroll-to-fragment on `<a href="#anchor">` clicks, focus-induced
  // auto-scroll, etc.). The slides — not the deck — are the only intended
  // scroll containers; pinning the deck at (0, 0) keeps the transform-based
  // track in sole control of horizontal positioning.
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return undefined;
    const pin = () => {
      if (deck.scrollLeft !== 0) deck.scrollLeft = 0;
      if (deck.scrollTop !== 0) deck.scrollTop = 0;
    };
    deck.addEventListener('scroll', pin, { passive: true });
    pin();
    return () => deck.removeEventListener('scroll', pin);
  }, []);

  const goTo = useCallback(
    (next, { updateHash = true } = {}) => {
      const target = clampIndex(next, total);
      const previousIndex = activeIndexRef.current;
      if (previousIndex === target) {
        return;
      }

      if (updateHash && anchors[target]) {
        // Replace, not push — avoids cluttering history with every wheel tick.
        const url = `${window.location.pathname}${window.location.search}#${anchors[target]}`;
        window.history.replaceState(null, '', url);
      }

      clearFadeTimers();

      lastNavAt.current = performance.now();
      isAnimating.current = true;
      resetEdgeIntent();

      // Reduced-motion path — instant snap, no animation.
      if (prefersReducedMotion.current) {
        setTransitionMode(null);
        setFadePhase(null);
        activeIndexRef.current = target;
        setActiveIndex(target);
        const slide = slideRefs.current[target];
        if (slide) slide.scrollTop = 0;
        isAnimating.current = false;
        resetEdgeIntent();
        return;
      }

      const distance = Math.abs(target - previousIndex);

      // Adjacent hop — push transition. setActiveIndex flips data-active on
      // both slides; CSS transitions the track transform from -prev*100vw
      // to -target*100vw while old slide opacity goes 1→0 and new slide
      // opacity goes 0→1, all in the same SLIDE_MS window. The parallel
      // opacity envelope softens the color seam at the slide boundary so
      // the eye never perceives a hard vertical color edge crossing the
      // viewport.
      if (distance === 1) {
        setTransitionMode('slide');
        setFadePhase(null);
        activeIndexRef.current = target;
        setActiveIndex(target);
        // Reset destination scroll position so both forward and back hops
        // land at the top of the new slide; the push animation reads more
        // like "next page" than "continuing scroll".
        const slide = slideRefs.current[target];
        if (slide) slide.scrollTop = 0;

        const finish = window.setTimeout(() => {
          setTransitionMode(null);
          isAnimating.current = false;
          resetEdgeIntent();
        }, SLIDE_MS);

        fadeTimers.current.push(finish);
        return;
      }

      // Non-adjacent hop — crossfade. Translating the track across multiple
      // slide-widths at high speed would flicker through every intermediate
      // page, so instead we fade the track out, snap the transform to the
      // target index while invisible, then fade back in. Per-slide opacity
      // transitions are disabled by .track[data-mode="fade"] so they don't
      // interfere with the track-level opacity envelope.
      setTransitionMode('fade');
      setFadePhase('out');

      const swap = window.setTimeout(() => {
        activeIndexRef.current = target;
        setActiveIndex(target);
        const slide = slideRefs.current[target];
        if (slide) slide.scrollTop = 0;
        setFadePhase('in');
      }, FADE_HALF_MS);

      const finish = window.setTimeout(() => {
        setFadePhase(null);
        setTransitionMode(null);
        isAnimating.current = false;
        resetEdgeIntent();
      }, FADE_HALF_MS * 2);

      fadeTimers.current.push(swap, finish);
    },
    [anchors, clearFadeTimers, resetEdgeIntent, total],
  );

  // Keep deck in sync with hash changes (anchor clicks, back/forward).
  useEffect(() => {
    const handleHashChange = () => {
      const next = indexFromHash(window.location.hash, anchors);
      if (next !== activeIndex) {
        goTo(next, { updateHash: false });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeIndex, anchors, goTo]);

  const isAtTop = (el) => el.scrollTop <= EDGE_TOLERANCE;
  const isAtBottom = (el) =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - EDGE_TOLERANCE;

  const handleWheel = useCallback(
    (event) => {
      const now = performance.now();

      if (isAnimating.current) return;
      const slide = slideRefs.current[activeIndex];
      if (!slide) return;

      const delta = event.deltaY;
      if (Math.abs(delta) < WHEEL_THRESHOLD) {
        return;
      }

      // Post-navigation guard. After any navigation, briefly deny wheel-based
      // transitions so momentum from the prior gesture (or a tiny residual
      // trackpad delta) cannot cascade through an intermediate slide.
      const sinceLastNav = now - lastNavAt.current;
      if (sinceLastNav < POST_NAV_LOCKOUT_MS) {
        return;
      }

      // Horizontal trackpad gestures advance/retreat directly (no buffer —
      // a deliberate sideways swipe is already an explicit page-change gesture).
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (horizontal) {
        if (event.deltaX > WHEEL_THRESHOLD) goTo(activeIndex + 1);
        else if (event.deltaX < -WHEEL_THRESHOLD) goTo(activeIndex - 1);
        return;
      }

      const goingDown = delta > 0;
      const atBottom = isAtBottom(slide);
      const atTop = isAtTop(slide);
      const atRelevantEdge = (goingDown && atBottom) || (!goingDown && atTop);

      // Not parked at an edge — let the slide scroll natively and reset state.
      if (!atRelevantEdge) {
        resetEdgeIntent();
        return;
      }

      const side = goingDown ? 'bottom' : 'top';

      // First contact with this edge — start the dwell timer and absorb the event.
      if (edgeSide.current !== side) {
        edgeSide.current = side;
        edgeSince.current = now;
        intentAccum.current = 0;
        intentLastAt.current = now;
        return;
      }

      // Direction reversal or a long pause — reset the intent accumulator.
      if (now - intentLastAt.current > INTENT_RESET_MS) {
        intentAccum.current = 0;
      }
      intentLastAt.current = now;

      // Still inside the dwell window — this is residual inertia, ignore it.
      if (now - edgeSince.current < EDGE_DWELL_MS) {
        return;
      }

      intentAccum.current += Math.abs(delta);
      if (intentAccum.current < INTENT_THRESHOLD) {
        return;
      }

      if (goingDown) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    },
    [activeIndex, goTo, resetEdgeIntent],
  );

  const handleTouchStart = useCallback((event) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
    touchAccum.current = 0;
  }, []);

  const handleTouchMove = useCallback((event) => {
    if (touchStartY.current == null) return;
    const y = event.touches[0]?.clientY ?? touchStartY.current;
    touchAccum.current = touchStartY.current - y;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isAnimating.current) {
      touchStartY.current = null;
      touchAccum.current = 0;
      return;
    }
    const slide = slideRefs.current[activeIndex];
    const delta = touchAccum.current;
    touchStartY.current = null;
    touchAccum.current = 0;
    if (!slide || Math.abs(delta) < TOUCH_THRESHOLD) return;

    if (delta > 0 && isAtBottom(slide)) {
      goTo(activeIndex + 1);
    } else if (delta < 0 && isAtTop(slide)) {
      goTo(activeIndex - 1);
    }
  }, [activeIndex, goTo]);

  const handleKeyDown = useCallback(
    (event) => {
      if (isAnimating.current) return;
      const slide = slideRefs.current[activeIndex];
      if (!slide) return;

      switch (event.key) {
        case 'PageDown':
        case 'ArrowRight':
          event.preventDefault();
          goTo(activeIndex + 1);
          break;
        case 'PageUp':
        case 'ArrowLeft':
          event.preventDefault();
          goTo(activeIndex - 1);
          break;
        case 'ArrowDown':
          if (isAtBottom(slide)) {
            event.preventDefault();
            goTo(activeIndex + 1);
          }
          break;
        case 'ArrowUp':
          if (isAtTop(slide)) {
            event.preventDefault();
            goTo(activeIndex - 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          goTo(0);
          break;
        case 'End':
          event.preventDefault();
          goTo(total - 1);
          break;
        default:
          break;
      }
    },
    [activeIndex, goTo, total],
  );

  // Transition timing is owned by SlideDeck.module.css and selected via
  // [data-mode]. We pass the durations through as custom properties so the
  // CSS rules stay declarative and the JS only decides "which mode are we
  // in right now". Reduced-motion users get data-mode=null + a 'none'
  // transition shorthand so changes apply instantly.
  const trackStyle = {
    transform: `translate3d(-${activeIndex * 100}vw, 0, 0)`,
    opacity: fadePhase === 'out' ? 0 : 1,
    '--slide-ms': `${SLIDE_MS}ms`,
    '--fade-half-ms': `${FADE_HALF_MS}ms`,
    ...(prefersReducedMotion.current && { transition: 'none' }),
  };

  const slideTheme = {
    bg: bgColors[activeIndex] || 'var(--color-cream)',
    variant: variants[activeIndex] || 'light',
  };

  return (
    <SlideDeckProvider
      activeAnchor={anchors[activeIndex] || anchors[0]}
      slideTheme={slideTheme}
    >
      {/* Single, persistent top navigation floating above every slide. Lives
          outside the transformed track so it stays anchored to the viewport
          and never mounts/unmounts during transitions. */}
      <TopNav />
      {/* The deck wraps interactive page content and intercepts wheel/touch/key
          gestures to advance slides while remaining a landmark region. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={deckRef}
        className={styles.deck}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="region"
        aria-roledescription="slide deck"
        aria-label="Report sections"
      >
        <div
          className={styles.track}
          style={trackStyle}
          data-mode={transitionMode || undefined}
        >
        {slides.map((child, i) => (
          <div
            key={child.key ?? i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={styles.slide}
            style={{ '--page-bg-color': bgColors[i] || 'var(--color-cream)' }}
            data-active={i === activeIndex}
            aria-hidden={i !== activeIndex}
          >
            {cloneElement(child)}
            {/* Per-slide PageNav anchored to the very bottom of the page
                content (in normal flow — NOT sticky). On short pages it
                sits at the viewport bottom because PageShell's min-height
                is sized to leave room for it. On tall, scrollable pages
                the user scrolls through the content first and the bar
                appears at the end of the scroll, matching the design. */}
            <div className={styles.pageNavFooter}>
              <PageNav
                activeIndex={i}
                total={total}
                variant={variants[i] || 'light'}
              />
            </div>
          </div>
        ))}
        </div>
      </div>
    </SlideDeckProvider>
  );
}
