/**
 * Renders a paragraph from static page JSON: plain string or { segments: [...] }.
 */
export function ContentParagraph({ paragraph, as: Tag = 'p', className }) {
  if (typeof paragraph === 'string') {
    return <Tag className={className}>{paragraph}</Tag>;
  }

  if (paragraph?.segments) {
    return (
      <Tag className={className}>
        {paragraph.segments.map((seg, i) =>
          seg.href ? (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {seg.text}
            </a>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </Tag>
    );
  }

  return null;
}
