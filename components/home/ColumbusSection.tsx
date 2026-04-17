"use client";

import Image from "next/image";
import { useState } from "react";

const TABS = [
  { label: "Map Chat", image: "/enterprise/mapchat.png" },
  { label: "Generative Geodata", image: "/enterprise/geocoding.png" },
  { label: "Due Diligence", image: "/enterprise/mapchatEnterprise.png" },
  { label: "Data Catalogue", image: "/enterprise/dmap.png" },
];

const FEATURES = [
  {
    title: "Generative Geodata",
    description: "Our proprietary model creates predictive data or unique datasets tailored to your exact preferences.",
  },
  {
    title: "Map Chat",
    description: "Research like you're talking to an expert. Answer any question, roll the dice, or visualize data in your own way.",
  },
  {
    title: "Research Reports",
    description: "Task Columbus to do all the hard expert-level work for you. Reports are created for your new site selection.",
  },
  {
    title: "Cloud Based",
    description: "No more bulky GIS research software. Let your team do work from anywhere with our mobile app and browser-based platform.",
  },
  {
    title: "Generative Due Diligence",
    description: "Cheaper, faster audits on neighbourhoods, sites, parcels, businesses and cities.",
  },
  {
    title: "Data Catalogue",
    description: "Find rich and relevant datasets faster with our simple interface. If you can't find a relevant dataset, we can personally order the survey.",
  },
];

const OUTCOMES = [
  {
    title: "Site Selection Analysis",
    image: "/enterprise/drawnAreaMap.png",
  },
  {
    title: "Geospatial Intelligence Layer",
    image: "/enterprise/geocoding.png",
  },
  {
    title: "Urban Infrastructure Mapping",
    image: "/enterprise/citymap.png",
  },
];

export function ColumbusSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section style={{ background: "linear-gradient(to bottom, rgba(0, 102, 204, 0.10) 0%, rgba(0, 102, 204, 0.03) 40%, #ffffff 100%)" }}>
      <div className="max-w-[1287px] mx-auto px-6 min-[1287px]:px-0">

        {/* ── Header ── */}
        <div className="pt-24 md:pt-32 flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-20 mb-16">
          <div className="flex-shrink-0">
            <span
              className="block text-[13px] font-bold tracking-[0.08em] uppercase text-[#1D1D1F] mb-3"
            >
              Agentic GIS platform
            </span>
            <h2
              className="font-light text-[#0A1344] text-[39px] md:text-[49px] lg:text-[61px]"
              style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Columbus
            </h2>
          </div>

          <p
            className="text-[18px] md:text-[22px] leading-[1.6] text-[#1D1D1F] max-w-[420px] md:pt-8"
            style={{ fontWeight: 400 }}
          >
            Columbus turns you into a super-explorer. Powerful tools that
            transform how you research, analyze, and select sites.
          </p>
        </div>

        {/* ── Tabs — minimal line style ── */}
        <div className="flex gap-0" style={{ borderBottom: "1px solid rgba(10,19,68,0.08)" }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(i)}
              className="relative py-4 px-5 md:px-6 text-[14px] md:text-[16px] font-medium cursor-pointer transition-colors duration-300"
              style={{
                color: activeTab === i ? "#0A1344" : "rgba(10,19,68,0.3)",
              }}
            >
              {tab.label}
              <div
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] transition-opacity duration-300"
                style={{
                  background: "#0A1344",
                  opacity: activeTab === i ? 1 : 0,
                }}
              />
            </button>
          ))}
        </div>

        {/* ── Monitor ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#1D1D1F",
            borderRadius: "20px 20px 0 0",
            padding: "clamp(6px, 0.8vw, 10px)",
            boxShadow: "0 -4px 40px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "14px 14px 0 0",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
            }}
          >
            {/* Title bar */}
            <div style={{
              height: "5.5%", minHeight: 22,
              backgroundColor: "#F5F5F7",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center",
              paddingLeft: "1.5%", gap: "0.5%", flexShrink: 0, position: "relative",
            }}>
              {(["#FF5F57", "#FFBD2E", "#28C840"] as const).map(c => (
                <div key={c} style={{ width: "0.9%", aspectRatio: "1", minWidth: 8, borderRadius: "50%", backgroundColor: c }} />
              ))}
              <div style={{
                position: "absolute", left: "50%", transform: "translateX(-50%)",
                height: "55%", width: "18%", minWidth: 80,
                backgroundColor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "clamp(7px,0.65vw,11px)", color: "rgba(0,0,0,0.35)", userSelect: "none" }}>columbus.earth/pro</span>
              </div>
            </div>

            {/* App navbar */}
            <div style={{
              height: "5.5%", minHeight: 22,
              backgroundColor: "#fff",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center",
              paddingLeft: "1.2%", paddingRight: "1.5%",
              flexShrink: 0, gap: "0.8%",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2vw", marginRight: "0.6%" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: "clamp(8px,1vw,14px)", height: "1px", backgroundColor: "#0A1344" }} />)}
              </div>
              <div style={{ width: "clamp(10px,1.2vw,16px)", height: "clamp(10px,1.2vw,16px)", borderRadius: "50%", backgroundColor: "#0A1344", opacity: 0.85 }} />
              <span style={{ fontSize: "clamp(7px,0.7vw,11px)", fontWeight: 600, color: "#0A1344" }}>Columbus</span>
              <span style={{ fontSize: "clamp(6px,0.6vw,9px)", color: "rgba(0,0,0,0.25)" }}>/</span>
              <span style={{ fontSize: "clamp(6px,0.6vw,9px)", color: "rgba(0,0,0,0.25)" }}>{TABS[activeTab].label.toLowerCase()}</span>
            </div>

            {/* App body */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
              <div style={{
                width: "4%", minWidth: 20,
                backgroundColor: "#fff",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column",
                alignItems: "center", paddingTop: "1.5%", gap: "1.5%",
                flexShrink: 0,
              }}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: "50%", maxWidth: 14 }}>
                  <rect x="1" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                  <rect x="9" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                  <rect x="1" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                  <rect x="9" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                </svg>
                <div style={{ width: "50%", maxWidth: 14, aspectRatio: "1", borderRadius: "50%", backgroundColor: "#0A1344" }} />
              </div>

              <div style={{
                width: "26%",
                backgroundColor: "#fff",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column",
                flexShrink: 0,
              }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8% 6%" }}>
                  <span style={{ fontSize: "clamp(8px,0.8vw,12px)", fontWeight: 500, color: "#0A1344" }}>
                    Where should we begin?
                  </span>
                </div>
                <div style={{
                  height: "12%", minHeight: 22,
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  display: "flex", alignItems: "center",
                  paddingLeft: "5%", paddingRight: "3%",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "clamp(6px,0.6vw,9px)", color: "rgba(0,0,0,0.25)", flex: 1 }}>Ask Columbus</span>
                  <div style={{
                    width: "clamp(14px,1.5vw,22px)", height: "clamp(14px,1.5vw,22px)",
                    borderRadius: "50%", backgroundColor: "#0A1344",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg viewBox="0 0 10 10" fill="none" style={{ width: "50%" }}>
                      <path d="M2 8L8 2M8 2H4M8 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <Image key={activeTab} src={TABS[activeTab].image} alt={TABS[activeTab].label} fill className="object-cover object-center" sizes="900px" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <div className="py-20 md:py-28">
          <h3
            className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F] mb-14"
            style={{ letterSpacing: "-0.02em" }}
          >
            What Columbus can do for you
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <h4 className="text-[17px] md:text-[18px] font-medium text-[#1D1D1F] mb-3">{f.title}</h4>
                <p className="text-[16px] md:text-[17px] leading-[1.6] text-[#6E6E73]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Outcomes ── */}
        <div className="pb-20 md:pb-28">
          <h3
            className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F] text-center mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Real outcomes, generated by Columbus
          </h3>
          <p className="text-[16px] md:text-[18px] text-[#6E6E73] text-center mb-14">
            Examples of what our technology produces in the field.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {OUTCOMES.map((o) => (
              <div key={o.title} className="rounded-[20px] overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image src={o.image} alt={o.title} fill className="object-cover" sizes="400px" />
                </div>
                <div className="py-5 text-center">
                  <p className="text-[16px] md:text-[17px] font-medium text-[#1D1D1F]">{o.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Social Proof ── */}
        <div className="pb-20 md:pb-28">
          <h3
            className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F] text-center mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Trusted by teams across industries
          </h3>
          <p className="text-[16px] md:text-[18px] text-[#6E6E73] text-center mb-14">
            From real estate firms to urban planners — teams rely on Columbus every day.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Columbus completely transformed how we evaluate sites. What used to take weeks now takes hours.",
                author: "Director of Research",
                company: "Leading CRE Firm",
              },
              {
                quote: "The generative geodata layers gave us insights we didn't even know were possible to obtain.",
                author: "Head of Urban Planning",
                company: "Major US City",
              },
              {
                quote: "Map Chat is like having a senior analyst on call 24/7. It understands exactly what we need.",
                author: "VP of Strategy",
                company: "Global Logistics Co.",
              },
            ].map((t) => (
              <div
                key={t.company}
                className="rounded-[20px] p-8 md:p-10"
                style={{ background: "rgba(10,19,68,0.03)", border: "1px solid rgba(10,19,68,0.06)" }}
              >
                <p className="text-[16px] md:text-[18px] leading-[1.65] text-[#1D1D1F] mb-8" style={{ fontWeight: 400 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-[16px] font-medium text-[#1D1D1F]">{t.author}</p>
                  <p className="text-[14px] md:text-[15px] text-[#6E6E73] mt-1">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
