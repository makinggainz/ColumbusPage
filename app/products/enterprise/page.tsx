"use client";

import "@/components/enterprise/enterprise-tokens.css";
import { useRef } from "react";
import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import ProblemCards from "@/components/enterprise/ProblemCards";
import SolutionShowcase from "@/components/enterprise/SolutionShowcase";
import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";
import ComparisonSection from "@/components/enterprise/ComparisonSection";
import ChatSection from "@/components/enterprise/ChatSection";
import PromptShowcase from "@/components/enterprise/PromptShowcase";
import StickyScrollSection from "@/components/enterprise/StickyScrollSection";
import ProductBanner from "@/components/enterprise/ProductBanner";
import DifferenceSection from "@/components/enterprise/DifferenceSection";

const sectionLabels = ["a", "b", "b2", "b3", "c", "d", "e", "g", "m", "n"] as const;

function SectionWithLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      {process.env.NODE_ENV !== "production" && (
        <span
          className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-sm font-bold text-white opacity-25"
          aria-hidden
        >
          {label}
        </span>
      )}
      {children}
    </section>
  );
}

export default function EnterprisePage() {
  const darkStartRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);

  return (
    <main className="ent-scope">
      {/* MistxNav is rendered as a direct child of <main> — not wrapped in
          SectionWithLabel — so its position:sticky has the full page as its
          containing block. Wrapping it in a navbar-height <section> would
          trap the sticky element and let it scroll away after ~88px. */}
      <MistxNav heroWhite />
      <SectionWithLabel label={sectionLabels[1]}>
        <EnterpriseHero />
      </SectionWithLabel>
      {/* White mid-block — the decorative blueprint grid + grain that used
          to texture these sections is replaced by the faint city line-art
          background, anchored full-width along the bottom horizon. */}
      <div
        ref={darkStartRef}
        className="relative"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "url(/enterpriseartbackground.png)",
          backgroundSize: "100% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center bottom",
        }}
      >
        <div className="relative z-10">
          <SectionWithLabel label={sectionLabels[2]}>
            <ProblemCards />
          </SectionWithLabel>
          <SectionWithLabel label={sectionLabels[3]}>
            <SolutionShowcase />
          </SectionWithLabel>
          {/* Horizontal line from screen edges to grid bounds */}
          <div className="relative w-full" style={{ height: 1 }}>
            <div className="absolute top-0 left-0 h-px" style={{ width: "calc((100% - var(--ent-max-width)) / 2)", backgroundColor: "var(--ent-border-card)" }} />
            <div className="absolute top-0 right-0 h-px" style={{ width: "calc((100% - var(--ent-max-width)) / 2)", backgroundColor: "var(--ent-border-card)" }} />
          </div>
          <SectionWithLabel label={sectionLabels[4]}>
            <ComparisonSection />
          </SectionWithLabel>
        </div>
      </div>
      <SectionWithLabel label={sectionLabels[5]}>
        <ProductBanner />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[7]}>
        <StickyScrollSection />
      </SectionWithLabel>
      <div ref={diffRef}>
        <SectionWithLabel label="diff">
          <DifferenceSection />
        </SectionWithLabel>
        <SectionWithLabel label={sectionLabels[6]}>
          <PromptShowcase />
        </SectionWithLabel>
      </div>
      <SectionWithLabel label={sectionLabels[8]}>
        <ChatSection />
      </SectionWithLabel>
      <div style={{ backgroundColor: "#ffffff" }}>
        <SectionWithLabel label={sectionLabels[9]}>
          <Footer theme="light" />
        </SectionWithLabel>
      </div>
    </main>
  );
}
