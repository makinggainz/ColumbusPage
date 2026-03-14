export const Container = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`mx-auto w-full max-w-screen-2xl ${className}`}
    style={{
      paddingLeft: "var(--page-padding)",
      paddingRight: "var(--page-padding)",
    }}
  >
    {children}
  </div>
);
