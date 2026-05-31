import { Fragment, useEffect, useState } from 'react';
import { useFilters } from '../../../context/FilterContext';
import { useSlideDeck } from '../../../context/SlideDeckContext';
import { getShortTakes } from '../../../data/dynamicContent';
import PageShell from '../../common/PageShell/PageShell';
import Tabs from '../../common/Tabs/Tabs';
import AudioPlayer from '../../common/AudioPlayer/AudioPlayer';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import gradientA from '../../../assets/short-takes/gradient-a.svg';
import gradientB from '../../../assets/short-takes/gradient-b.svg';
import adamBleibtreu from '../../../assets/short-takes/adam-bleibtreu.webp';
import brendanIttelson from '../../../assets/short-takes/brendan-ittelson.webp';
import camielFreriks from '../../../assets/short-takes/camiel-freriks.webp';
import darylMichel from '../../../assets/short-takes/daryl-michel.webp';
import duncanLennox from '../../../assets/short-takes/duncan-lennox.webp';
import emilyWingrove from '../../../assets/short-takes/emily-wingrove.webp';
import hsiangLee from '../../../assets/short-takes/hsiang-lee.webp';
import jorgeG from '../../../assets/short-takes/jorge-g.webp';
import joseBetancur from '../../../assets/short-takes/jose-betancur.webp';
import justineGaignardParent from '../../../assets/short-takes/justine-gaignard-parent.webp';
import michelleMiller from '../../../assets/short-takes/michelle-miller.webp';
import michelleOKeeffe from '../../../assets/short-takes/michelle-okeeffe.webp';
import patrickGanzmann from '../../../assets/short-takes/patrick-ganzmann.webp';
import rossBreckenridge from '../../../assets/short-takes/ross-breckenridge.webp';
import sandhyaHegde from '../../../assets/short-takes/sandhya-hegde.webp';
import scottChancellor from '../../../assets/short-takes/scott-chancellor.webp';
import scottHarrison from '../../../assets/short-takes/scott-harrison.webp';
import stuartToledo from '../../../assets/short-takes/stuart-toledo.webp';
import zackKass from '../../../assets/short-takes/zack-kass.webp';
import duncanLennoxAudio from '../../../assets/audio/Duncan Lennox - Global View - Field Perspectives.m4a';
import sandhyaHegdeAudio from '../../../assets/audio/Sandya Hegde - Global View - Field Perspectives.m4a';
import zackKassAudio from '../../../assets/audio/Zack Kass - Global View - Field Perspectives.m4a';
import brendanIttelsonAudio from '../../../assets/audio/Zoom - Tech Partner - Global View.m4a';
import scottHarrisonAudio from '../../../assets/audio/Docusign - Global View - Tech Partner.m4a';
import adamBleibtreuAudio from '../../../assets/audio/SmartBug - NAM Partner of the Year - Global View - Partner Program.m4a';
import michelleOKeeffeAudio from '../../../assets/audio/Engaging.io - JAPAC Partner of the Year - Global View - Partner Program.m4a';
import stuartToledoAudio from '../../../assets/audio/GROWS - LATAM Partner of the Year - Global View - Partner Program.m4a';
import emilyWingroveAudio from '../../../assets/audio/Aptitude 8 - Solutions Partner - NAM - Upmarket - Partner Program.m4a';
import justineGaignardAudio from '../../../assets/audio/Guepard - Solutions Partner - NAM - SmB - Partner Program.m4a';
import michelleMillerAudio from '../../../assets/audio/Creativeate - Solutions Partner - NAM - SmB - Partner Program.m4a';
import rossBreckenridgeAudio from '../../../assets/audio/Breckenridge - EMEA - SmB - Partner Program.m4a';
import darylMichelAudio from '../../../assets/audio/Cogent Connective - EMEA - Upmarket - Partner Program.m4a';
import hsiangLeeAudio from '../../../assets/audio/Hubbubble - Solutions Partner - JAPAC - SmB - Partner Program.m4a';
import joseBetancurAudio from '../../../assets/audio/Triario - Solutions Partner - LATAM - Upmarket - Partner Program.m4a';
import jorgeGaragarzaAudio from '../../../assets/audio/Zubia - Solutions Partner - LATAM - SmB - Partner Program.m4a';
import camielFreriksAudio from '../../../assets/audio/Siloy - Global View - Partner Program.m4a';
import patrickGanzmannAudio from '../../../assets/audio/Valantic - Solutions Partner - EMEA - Upmarket - Partner Program.m4a';
import styles from './ShortTakes.module.css';

// Set by ByTheNumbers when the user clicks the partner carousel — opens the
// "From Partners" tab on this slide. Cleared after read so subsequent visits
// reset to the default tab.
const TAB_SIGNAL_KEY = 'shortTakes:initialTab';

/** Headshots keyed by quote id (field + partners). */
const AVATARS = {
  'duncan-lennox': duncanLennox,
  'sandhya-hegde': sandhyaHegde,
  'zack-kass': zackKass,
  'brendan-ittelson': brendanIttelson,
  'scott-chancellor': scottChancellor,
  'scott-harrison': scottHarrison,
  'camiel-freriks-strategic': camielFreriks,
  'michelle-okeeffe-roadmap': michelleOKeeffe,
  'stuart-toledo-community': stuartToledo,
  'patrick-ganzmann-scalable': patrickGanzmann,
  'adam-bleibtreu-innovate': adamBleibtreu,
  'emily-wingrove-central': emilyWingrove,
  'justine-gaignard-overwhelm': justineGaignardParent,
  'michelle-miller-trust': michelleMiller,
  'ross-breckenridge-transformed': rossBreckenridge,
  'daryl-michel-influence': darylMichel,
  'hsiang-lee-changed-everything': hsiangLee,
  'jose-betancur-best-option': joseBetancur,
  'jorge-garagarza-aligned': jorgeG,
};

/**
 * Audio clips keyed by quote id. Quotes without an entry render a disabled
 * audio pill (the AudioPlayer falls back gracefully when `src` is missing).
 */
const AUDIO = {
  'duncan-lennox': duncanLennoxAudio,
  'sandhya-hegde': sandhyaHegdeAudio,
  'zack-kass': zackKassAudio,
  'brendan-ittelson': brendanIttelsonAudio,
  'scott-harrison': scottHarrisonAudio,
  'adam-bleibtreu-innovate': adamBleibtreuAudio,
  'michelle-okeeffe-roadmap': michelleOKeeffeAudio,
  'stuart-toledo-community': stuartToledoAudio,
  'emily-wingrove-central': emilyWingroveAudio,
  'justine-gaignard-overwhelm': justineGaignardAudio,
  'michelle-miller-trust': michelleMillerAudio,
  'ross-breckenridge-transformed': rossBreckenridgeAudio,
  'daryl-michel-influence': darylMichelAudio,
  'hsiang-lee-changed-everything': hsiangLeeAudio,
  'jose-betancur-best-option': joseBetancurAudio,
  'jorge-garagarza-aligned': jorgeGaragarzaAudio,
  'camiel-freriks-strategic': camielFreriksAudio,
  'patrick-ganzmann-scalable': patrickGanzmannAudio,
};

function QuoteCard({ quote }) {
  const { author, audio } = quote;
  const avatarSrc = AVATARS[quote.id];
  const audioSrc = AUDIO[quote.id] ?? audio?.src;

  return (
    <article className={styles.quote}>
      <div className={styles.quoteInner}>
        <div className={styles.quoteCopy}>
          <h3 className={styles.quoteTitle}>{quote.title}</h3>
          <p className={styles.quoteBody}>&ldquo;{quote.quote}&rdquo;</p>
        </div>

        <div className={styles.quoteFooter}>
          <figure className={styles.byline}>
            {avatarSrc ? (
              <img
                className={styles.avatar}
                src={avatarSrc}
                alt={author.name}
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className={styles.avatarPlaceholder} aria-hidden="true" />
            )}
            <figcaption className={styles.bylineText}>
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
            </figcaption>
          </figure>

          {audioSrc && (
            <div className={styles.audioSlot}>
              <AudioPlayer
                src={audioSrc}
                durationSeconds={audio?.durationSeconds ?? 0}
                label={`Play audio quote from ${author.name}`}
              />
            </div>
          )}
        </div>
      </div>

    </article>
  );
}

/**
 * Page 5 — Short Takes.
 *
 * Tabs between "From the Field" (industry experts, shared across all 17 views)
 * and "From Partners" (varies per active filter). Filter-specific content is
 * resolved by `getShortTakes(filterId)`; variants that don't yet have copy
 * render a placeholder message instead of an empty list.
 *
 * Layout reference: Figma 2193:1609 (1440×900 artboard).
 */
export default function ShortTakes() {
  const { filterId } = useFilters();
  const { activeAnchor } = useSlideDeck();
  const shortTakes = getShortTakes(filterId);

  const tabs = [
    { id: 'field', label: shortTakes.tabs.field.label },
    { id: 'partners', label: shortTakes.tabs.partners.label },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const panel = shortTakes.tabs[activeTab];

  // Honor a tab signal dropped in sessionStorage by an upstream link (e.g.
  // the partner carousel on By the Numbers). Read on mount and whenever the
  // deck makes this slide active. Clear after read so other entry points
  // reset to the default tab.
  useEffect(() => {
    if (activeAnchor !== 'short-takes') return;
    let signal = null;
    try {
      signal = window.sessionStorage.getItem(TAB_SIGNAL_KEY);
      if (signal) window.sessionStorage.removeItem(TAB_SIGNAL_KEY);
    } catch {
      return;
    }
    if (signal && tabs.some((t) => t.id === signal)) {
      setActiveTab(signal);
    }
    // tabs is derived from filter content; identity changes with filterId
    // but the ids ('field' | 'partners') are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAnchor]);

  return (
    <PageShell id="short-takes" className={styles.page}>
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

      <div className={styles.body}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{shortTakes.label}</p>
            <h2 className={styles.heading}>{panel.heading}</h2>
          </header>

          <div className={styles.tabSection}>
            <div className={styles.tabRow}>
              <Tabs
                tabs={tabs}
                activeId={activeTab}
                onChange={setActiveTab}
                ariaLabel="Short takes audience"
                variant="bar"
                className={styles.tabs}
              />
            </div>
            <div className={styles.tabDivider} aria-hidden="true" />
          </div>

          <div
            className={styles.quotes}
            role="tabpanel"
            aria-label={panel.heading}
          >
            {panel.placeholder ? (
              <p className={styles.placeholder}>{panel.placeholder}</p>
            ) : (
              panel.quotes.map((quote, index) => (
                <Fragment key={quote.id}>
                  <QuoteCard quote={quote} />
                  {index < panel.quotes.length - 1 && (
                    <hr className={styles.quoteDivider} aria-hidden="true" />
                  )}
                </Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
