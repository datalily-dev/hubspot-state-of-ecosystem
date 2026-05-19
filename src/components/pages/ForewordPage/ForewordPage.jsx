import PageShell from '../../common/PageShell/PageShell';
import VideoHero from '../../common/VideoHero/VideoHero';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import gradientA from '../../../assets/foreword/gradient-a.svg';
import gradientB from '../../../assets/foreword/gradient-b.svg';
import forewordVideo from '../../../assets/foreword/video.jpg';
import forewordVideoSrc from '../../../assets/foreword/HubSpot-Video-Placeholder.mp4';
import zackKassAvatar from '../../../assets/foreword/zack-kass.webp';
import styles from './ForewordPage.module.css';

export default function ForewordPage() {
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
            <p className={styles.eyebrow}>Foreword</p>
            <h1 className={styles.headline}>
              Partners will define the agentic era. The AI giants already know it.
            </h1>
          </header>

          <div className={styles.body}>
            <p>The internet is being rebuilt.</p>

            <p>
              What we&rsquo;ve known&mdash;the browsable web of pages and APIs&mdash;is giving
              way to something else: a system of action.
            </p>

            <p>
              This new internet&mdash;the agentic internet&mdash;demands more from its
              infrastructure, especially data. Not just more volume, but cleaner pipes,
              shared context, and systems that can actually talk to each other.
              Intelligence is abundant. Coherence is not.
            </p>

            <p>And so the center of gravity shifts.</p>
          </div>

          <VideoHero
            className={styles.video}
            src={forewordVideoSrc}
            poster={forewordVideo}
            regionLabel="Foreword video"
            playLabel="Play foreword video"
            thumbScaleVar="--foreword-w"
          />

          <div className={styles.body}>
            <p>
              Ecosystems, in particular, take on new weight. They are no longer peripheral
              networks of partnerships. They become operating systems&mdash;the places
              where intelligence is applied, shaped, and made useful.
            </p>

            <p>
              HubSpot sits at a useful intersection of this shift: a platform rich in
              customer context, paired with a partner ecosystem that carries judgment,
              specialization, and relationships. The platform holds the data. The partners
              make it matter.
            </p>

            <p>And that role is expanding.</p>

            <p>
              Partners have always been the ones who translate capability into reality
              &mdash;especially for the millions of businesses without massive IT teams or
              transformation budgets. They close the gap between what software can do and
              what a business can actually use.
            </p>

            <p>That gap is widening again.</p>

            <p>
              Estimates now put the ecosystem economy as high as $100 trillion by 2030.
              The leading AI companies are responding accordingly. Anthropic has committed{' '}
              <a
                href="https://www.anthropic.com/news/claude-partner-network"
                target="_blank"
                rel="noopener noreferrer"
              >
                $100 million to its partner network
              </a>
              .{' '}
              <a
                href="https://fortune.com/2026/02/23/openai-partners-with-mckinsey-bcg-accenture-and-capgemini-to-push-its-frontier-ai-agent-platform/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI is building alliances
              </a>{' '}
              with firms like Boston Consulting Group and McKinsey &amp; Company.
            </p>

            <p>
              For HubSpot, IDC projects the partner opportunity will{' '}
              <a
                href="https://www.hubspot.com/technology/ecosystem-resources"
                target="_blank"
                rel="noopener noreferrer"
              >
                more than double by 2030
              </a>
              , with the mid-market&mdash;the segment most in need of guidance, most
              willing to invest in it, and least saturated&mdash;driving that growth.
            </p>

            <p>This report is for the people who will close it.</p>
          </div>

          <figure className={styles.byline}>
            <img
              className={styles.avatar}
              src={zackKassAvatar}
              alt="Zack Kass"
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
            />
            <figcaption className={styles.bylineText}>
              <span className={styles.bylineName}>
                <a
                  href="https://www.linkedin.com/in/zackkass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bylineNameLink}
                >
                  Zack Kass
                </a>
                <a
                  href="https://www.linkedin.com/in/zackkass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedInLink}
                  aria-label="Zack Kass on LinkedIn"
                >
                  <LinkedInIcon className={styles.linkedInIcon} focusable="false" />
                </a>
              </span>
              <span className={styles.bylineRole}>
                Global Advisor &amp; Former Head of GTM, Open AI
              </span>
            </figcaption>
          </figure>
        </div>
      </article>
    </PageShell>
  );
}
