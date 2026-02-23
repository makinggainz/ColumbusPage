export function GridContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-[100px] ${className}`}>
      <div className="grid grid-cols-12 gap-[85px]">
        {children}
      </div>
    </div>
  );
}
