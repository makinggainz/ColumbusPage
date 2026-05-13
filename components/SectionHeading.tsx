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
 * system). Composition: optional `.eyebrow` kicker → h2
 * (text-3xl→sm:text-4xl, font-bold, tracking-tight) → optional
 * description (text-lg text-muted). Block max-width is 42rem so
 * long lines aren't allowed for section headings.
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
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted">{description}</p>
      )}
    </div>
  );
}

export default SectionHeading;
