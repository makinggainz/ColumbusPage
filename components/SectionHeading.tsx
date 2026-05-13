import { type ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  centered?: boolean;
  className?: string;
}

/**
 * The single canonical section heading block (catcherX design
 * system). Composition: optional `.eyebrow` kicker → `.h2`
 * (Medium 500, tracking-tight) → optional `.p-l` description in
 * text-muted. Block max-width is 42rem so long lines aren't allowed
 * for section headings.
 *
 * Alignment rule: section h2/h3 + body are left-aligned by default;
 * pass `centered` only for hero / CTA-banner heading moments.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  className = "",
}: SectionHeadingProps) {
  const wrapper = centered
    ? `mx-auto max-w-2xl text-center ${className}`
    : `max-w-2xl ${className}`;

  return (
    <div className={wrapper}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h2 mt-3 tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className="p-l mt-4 text-muted">{description}</p>
      )}
    </div>
  );
}

export default SectionHeading;
