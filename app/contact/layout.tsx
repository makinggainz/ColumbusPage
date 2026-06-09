import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Columbus Earth for Columbus Pro demos, investor relations, Elio questions, careers, or general inquiries.",
  openGraph: {
    title: "Contact — Columbus Earth",
    description:
      "Get in touch with Columbus Earth for Columbus Pro demos, investor relations, Elio questions, careers, or general inquiries.",
    url: "https://columbus.earth/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
