export const Container = ({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`mx-auto w-full max-w-screen-2xl ${className}`}
    style={{
      paddingLeft: "var(--page-padding)",
      paddingRight: "var(--page-padding)",
      ...style,
    }}
  >
    {children}
  </div>
);
