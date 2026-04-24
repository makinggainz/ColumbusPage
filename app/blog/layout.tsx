import "@/design-system/tokens.css";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="min-h-screen bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
      {children}
    </div>
  );
}
