import type { ReactNode } from "react";

export type TechnologySectionId =
  | "index"
  | "lgm-vs-llm"
  | "data-collection"
  | "core-reasoning"
  | "research-blog"
  | "careers"
  | "hiring-humans";

export type NavItem = {
  id: TechnologySectionId;
  label: string;
};

export type ResearchCard = {
  title: string;
  href: string;
  featured?: boolean;
  image?: string;
};

export type TimelineEntry = {
  name: string;
  year: string;
};

export type ResearchArticle = {
  title: string;
  href: string;
  date: string;
};

export type RevealOnViewProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
  once?: boolean;
};
