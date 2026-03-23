"use client";

import { useEffect, useRef, useState } from "react";
import {
  PenTool,
  Map,
  BookOpen,
  Cloud,
  Book,
  Database,
} from "lucide-react";
import { GridSection, GridHeader, GridCell } from "./ContentGrid";

const features = [
  {
    title: "Generative Geodata",
    description:
      "Our proprietary model creates predictive data or unique datasets tailored to your exact preferences.",
    icon: PenTool,
    link: true,
  },
  {
    title: "Map Chat",
    description:
      "Research like you're talking to an expert with Columbus Chat. Answer any question, roll the dice, or visualize data in your own way.",
    icon: Map,
  },
  {
    title: "Research Reports",
    description:
      "Task Columbus to do all the hard expert-level work for you. Reports are created for your new site selection.",
    icon: BookOpen,
  },
  {
    title: "Cloud Based",
    description:
      "No more bulky GIS research software. Let your team do work from anywhere with our mobile app and browser-based platform.",
    icon: Cloud,
  },
  {
    title: "Generative Due Diligence",
    description:
      "Cheaper, faster audits on neighbourhoods, sites, parcels, businesses and cities.",
    icon: Book,
  },
  {
    title: "Data Catalogue",
    description:
      "Find rich and relevant datasets faster with our simple interface. If you can't find a relevant dataset, we can personally order the survey.",
    icon: Database,
  },
];

export const MainFeatures = () => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <GridSection>
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <GridHeader
          label="05 — CAPABILITIES"
          title="What Columbus can do for you"
          subtitle="Powerful tools that transform how you research, analyze, and select sites."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GridCell
                key={index}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.6s ease ${index * 60 + 200}ms, transform 0.6s ease ${index * 60 + 200}ms`,
                }}
              >
                <div className="mb-4">
                  <Icon size={24} strokeWidth={1.5} className="text-[#0A1344]/60" />
                </div>
                <h3 className="text-[17px] font-semibold text-[#1D1D1F] leading-snug mb-2">
                  {feature.title}
                </h3>
                <p className="text-[15px] font-normal leading-[1.5] text-[#6E6E73]">
                  {feature.description}
                  {feature.link && (
                    <a href="#" className="ml-1 text-[#4F46E5] hover:underline font-mono text-[13px] tracking-wide">
                      DATASETS →
                    </a>
                  )}
                </p>
              </GridCell>
            );
          })}
        </div>
      </div>
    </GridSection>
  );
};
