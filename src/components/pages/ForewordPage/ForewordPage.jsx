import PageShell from '../../common/PageShell/PageShell';
import PlayIcon from '../../../assets/icon/play.svg?react';
import LinkedInIcon from '../../../assets/icon/linked-in.svg?react';
import styles from './ForewordPage.module.css';

/** Page 3 — Foreword. Letter from Zack Kass. STATIC. */
export default function ForewordPage() {
  return (
    <PageShell id="foreword" className={styles.page}>
      <article className={styles.article}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Foreword</p>

          <h1 className={styles.headline}>
            Partners will define the agentic era. The AI giants already know it.
          </h1>

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

          {/* ── Video thumbnail ── */}
          <button
            type="button"
            className={styles.videoThumb}
            aria-label="Play foreword video"
          >
            <span className={styles.videoImage} aria-hidden="true" />
            <span className={styles.playButton} aria-hidden="true">
              <PlayIcon className={styles.playIcon} focusable="false" />
            </span>
          </button>

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

          {/* ── Author byline ── */}
          <figure className={styles.byline}>
            <span className={styles.avatar} aria-hidden="true" />
            <figcaption className={styles.bylineText}>
              <span className={styles.bylineName}>
                Zack Kass
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
