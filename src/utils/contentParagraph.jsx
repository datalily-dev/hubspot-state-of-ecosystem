/**
 * Renders a paragraph from static page JSON: plain string or { segments: [...] }.
 * Segments support optional `bold`, `italic`, and `href`.
 */
export function ContentParagraph({ paragraph, as: Tag = 'p', className }) {
  if (typeof paragraph === 'string') {
    return <Tag className={className}>{paragraph}</Tag>;
  }

  if (paragraph?.segments) {
    return (
      <Tag className={className}>
        {paragraph.segments.map((seg, i) => {
          if (seg.href) {
            return (
              <a
                key={i}
                href={seg.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {seg.text}
              </a>
            );
          }
          if (seg.italic) {
            return <em key={i}>{seg.text}</em>;
          }
          if (seg.bold) {
            return <strong key={i}>{seg.text}</strong>;
          }
          return <span key={i}>{seg.text}</span>;
        })}
      </Tag>
    );
  }

  return null;
}
