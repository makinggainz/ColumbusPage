"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIndustry } from "./industry/IndustryContext";
import type { ChatRowContent } from "./industry/types";

type AnimatedChatCardProps = {
  query: string;
  considering: string[];
  responseHtml: string;
  followUp: string;
};

function AnimatedChatCard({ query, considering, responseHtml, followUp }: AnimatedChatCardProps) {
  const [phase, setPhase] = useState<"typing" | "sending" | "thinking" | "done">("typing");
  const [typedQuery, setTypedQuery] = useState("");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const runSequence = async () => {
      setPhase("typing");
      setTypedQuery("");
      setVisibleSteps(0);
      setShowResponse(false);
      setShowFollowUp(false);

      for (let i = 1; i <= query.length; i++) {
        if (cancelled) return;
        await new Promise(r => setTimeout(r, 28));
        setTypedQuery(query.slice(0, i));
      }

      await new Promise(r => setTimeout(r, 300));
      if (cancelled) return;
      setPhase("sending");

      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;
      setPhase("thinking");

      for (let i = 1; i <= considering.length; i++) {
        await new Promise(r => setTimeout(r, 380));
        if (cancelled) return;
        setVisibleSteps(i);
      }

      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;
      setShowResponse(true);

      await new Promise(r => setTimeout(r, 500));
      if (cancelled) return;
      setShowFollowUp(true);
      setPhase("done");

      await new Promise(r => setTimeout(r, 4000));
      if (cancelled) return;
      runSequence();
    };

    runSequence();
    return () => { cancelled = true; };
  }, [query, considering, responseHtml, followUp]);

  const sent = phase === "sending" || phase === "thinking" || phase === "done";

  return (
    <div className="absolute left-[40px] top-[100px] bottom-[40px] w-[460px] max-xl:left-[32px] max-xl:w-[400px] max-md:left-[20px] max-md:right-[20px] max-md:w-auto bg-[#f5f5f7] rounded-2xl shadow-xl p-7 flex flex-col z-20">
      <div
        className="flex items-center gap-3 mb-4"
        style={{ opacity: sent ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <span className="text-[20px]">🌐</span>
        <span className="text-gray-400 text-[14px] font-mono">Columbus is thinking...</span>
      </div>

      <div className="text-gray-400 text-[13px] space-y-1 mb-5 font-mono pl-9">
        {considering.map((step, i) => (
          <p
            key={i}
            style={{
              opacity: visibleSteps > i ? 1 : 0,
              transform: visibleSteps > i ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            {step}
          </p>
        ))}
      </div>

      <div
        className="text-gray-800 text-[14px] mb-5 leading-[1.65] font-medium"
        style={{ opacity: showResponse ? 1 : 0, transform: showResponse ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
        dangerouslySetInnerHTML={{ __html: responseHtml }}
      />

      <div
        className="text-gray-700 text-[14px] leading-[1.65]"
        style={{ opacity: showFollowUp ? 1 : 0, transform: showFollowUp ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
      >
        {followUp}
      </div>

      <div className="flex-1" />

      <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between gap-4 mt-5">
        <span className="text-gray-500 text-[15px] leading-snug" style={{ minHeight: "1.5em" }}>
          {sent ? query : (typedQuery || <span className="opacity-0">x</span>)}
          {!sent && <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse" />}
        </span>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
          style={{ background: sent ? "#0A1344" : "rgba(37, 99, 235, 0.12)" }}
        >
          <div className="w-5 h-5 rounded-sm" style={{ background: sent ? "white" : "#0A1344" }} />
        </div>
      </div>
    </div>
  );
}

type ChatProps = {
  lightTheme?: boolean;
  embedded?: boolean;
  content?: ChatRowContent;
};

/**
 * Conversational map chat — the right-column visual for row 1 of the
 * use-case sticky-scroll. The map fills the full width and height of the
 * container; the section title overlays the top-left with a gradient
 * backdrop for legibility against the photo.
 */
export default function Chat({ lightTheme = false, embedded = false, content }: ChatProps) {
  const { industry } = useIndustry();
  const data = content ?? industry.chat;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visualBlock = (
    <div
      ref={sectionRef}
      className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      <Image
        src={data.mapImageSrc}
        alt="Map"
        fill
        className="object-cover"
        priority
      />
      {!lightTheme && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(18, 8, 52, 0.22)" }}
        />
      )}

      {/* Title gradient backdrop — top, fading to transparent. */}
      <div
        className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Section title — overlays the gradient. */}
      <h2 className="absolute top-6 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
        Conversational map chat
      </h2>

      <AnimatedChatCard
        key={`${data.query}`}
        query={data.query}
        considering={data.considering}
        responseHtml={data.responseHtml}
        followUp={data.followUp}
      />
    </div>
  );

  if (embedded) return visualBlock;

  const sectionBgClass = lightTheme ? "bg-white" : "bg-black";
  return (
    <section className={`w-full ${sectionBgClass} flex justify-center`}>
      <div className="w-full max-w-[1287px] mx-auto px-8 md:px-10 py-30">
        {visualBlock}
      </div>
    </section>
  );
}
