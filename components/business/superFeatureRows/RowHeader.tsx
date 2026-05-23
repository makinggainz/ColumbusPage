"use client";

/* Header used at the top of each stacked sub-feature row in the
   "Trusted data, verified for confidence" super section. Mirrors the
   visual language of SuperFeatureSection's parent header (large semi-bold
   heading, --ent-text-secondary subtitle). Two layouts:

   align="left"          — icon chip + heading + subtitle, all left-aligned
   align="right-heading" — subtitle in a left column, heading in a right
                            column; the screenshot for row 2 has the
                            subtitle on the upper-left and the H3 on the
                            upper-right. Icon is ignored in this mode. */

export type RowHeaderProps = {
  align?: "left" | "right-heading";
  icon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
};

export default function RowHeader({
  align = "left",
  icon,
  title,
  subtitle,
}: RowHeaderProps) {
  if (align === "right-heading") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-10 lg:mb-12 items-start">
        <div
          className="text-[14px] md:text-[15px] leading-[1.6] order-2 lg:order-1"
          style={{
            color: "var(--ent-text-secondary)",
            letterSpacing: "-0.005em",
            maxWidth: 480,
          }}
        >
          {subtitle}
        </div>
        <h3
          className="text-[28px] md:text-[36px] lg:text-[44px] leading-[1.05] order-1 lg:order-2 lg:justify-self-end lg:text-right"
          style={{
            color: "var(--ent-text-primary)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            maxWidth: 520,
          }}
        >
          {title}
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mb-10 lg:mb-12" style={{ maxWidth: 640 }}>
      {icon ? <div className="mb-1 flex items-center">{icon}</div> : null}
      <h3
        className="text-[28px] md:text-[36px] lg:text-[44px] leading-[1.05]"
        style={{
          color: "var(--ent-text-primary)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>
      {subtitle ? (
        <div
          className="text-[14px] md:text-[15px] leading-[1.6]"
          style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
