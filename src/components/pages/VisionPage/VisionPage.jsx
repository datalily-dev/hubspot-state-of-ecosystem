import PageShell from '../../common/PageShell/PageShell';
import VideoHero from '../../common/VideoHero/VideoHero';
import { useSlideEntrance } from '../../../hooks/useSlideEntrance';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import gradientA from '../../../assets/vision/gradient-a.svg';
import gradientB from '../../../assets/vision/gradient-b.svg';
import angieOdowdAvatar from '../../../assets/vision/angie-odowd.webp';
import visionVideo from '../../../assets/vision/video.jpg';
import visionVideoSrc from '../../../assets/foreword/HubSpot-Video-Placeholder.mp4';
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
            <p className={styles.eyebrow}>Vision</p>
            <h1 className={headlineClass}>
              Angie O&rsquo;Dowd on the State of the HubSpot ecosystem
            </h1>
          </header>

          <p className={styles.subhead}>When partners thrive, customers win.</p>

          <VideoHero
            className={styles.video}
            src={visionVideoSrc}
            poster={visionVideo}
            regionLabel="Vision video"
            playLabel="Play vision video from Angie O'Dowd"
            thumbScaleVar="--vision-w"
          />

          <div className={styles.body}>
            <p>
              Everything in this report&mdash;and Zack&rsquo;s foreword&mdash;call out
              what we&rsquo;ve always known to be true:
            </p>

            <p>When partners thrive, customers win.</p>

            <p>
              I believe that not only does that conviction hold in the agentic
              era, it will define it.
            </p>

            <p>
              That&rsquo;s what this report is all about: Connecting our
              partners&mdash;current and future&mdash;with the information you
              need to build with us and define your growth strategy with HubSpot.
            </p>

            <p>
              The next section speaks to the revenue opportunity ahead, but these
              are the takeaways that characterize the State of HubSpot&rsquo;s
              ecosystem:
            </p>

            <ol className={styles.takeaways}>
              <li>
                <strong>Industry-leading and growing at an impressive clip:</strong>{' '}
                Partnership Leaders named HubSpot a Top 10 ecosystem in the world,
                with an IDC-defined $42B in partner opportunity by 2030 at 21.8%
                CAGR.
              </li>
              <li>
                <strong>Driving upmarket and aligned in GTM and product:</strong>{' '}
                We saw +41% growth in $10k+ deals in 2025 along with ~16+ apps
                used by upmarket customers&mdash;and we&rsquo;re accelerating in
                the AWS marketplace.
              </li>
              <li>
                <strong>Guided by three principles:</strong> Customer value above
                all; Open by design; and trusted by default. These are deliberate
                choices about the kind of platform we want to be&mdash;and how we
                build with you.
              </li>
            </ol>

            <p>
              HubSpot redefined marketing with inbound. We led the front-office
              shift for GTM teams. And today, our agentic customer platform is
              driving the GTM transformation.
            </p>

            <p>
              Our partners have led customers through every shift. This moment is
              ours to win&mdash;together.
            </p>
          </div>

          <figure className={styles.byline}>
            <img
              className={styles.avatar}
              src={angieOdowdAvatar}
              alt="Angie O'Dowd"
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
            />
            <figcaption className={styles.bylineText}>
              <span className={styles.bylineName}>
                <a
                  href="https://www.linkedin.com/in/angiemarie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bylineNameLink}
                >
                  Angie O&rsquo;Dowd
                </a>
                <a
                  href="https://www.linkedin.com/in/angiemarie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedInLink}
                  aria-label="Angie O'Dowd on LinkedIn"
                >
                  <LinkedInIcon className={styles.linkedInIcon} focusable="false" />
                </a>
              </span>
              <span className={styles.bylineRole}>
                Global VP, Platform &amp; Partner Ecosystem, HubSpot
              </span>
            </figcaption>
          </figure>
        </div>
      </article>
    </PageShell>
  );
}
