import { type ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  centered?: boolean;
  className?: string;
}

/**
 * The single canonical section heading block. Imported from catcherX
 * (design-system/design-system.md §1). Never hand-roll a section heading
 * — use this composition so eyebrow / title / description spacing is
 * consistent across every section.
 *
 * - Eyebrow → h2 gap: 12px (mt-3)
 * - h2 → description gap: 16px (mt-4)
 * - Block max-width: 42rem / 672px (max-w-2xl) — long lines deliberately
 *   not allowed for section headings.
 *
 * Alignment rule: section h2/h3 + body are left-aligned; centred only
 * for hero h1, hero subtitle, and CTA-banner headings.
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
