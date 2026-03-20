"use client";

import { useEffect, useRef, useState } from "react";
import {
  PenTool,
  Map,
  BookOpen,
  Cloud,
  Book,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/layout/Container";

const features = [
  {
    number: "01",
    title: "Generative Geodata",
    description:
      "Our proprietary model creates predictive data or unique datasets tailored to your exact preferences.",
    icon: PenTool,
    link: true,
  },
  {
    number: "02",
    title: "Map Chat",
    description:
      "Research like you're talking to an expert with Columbus Chat. Answer any question, roll the dice, or visualize data in your own way.",
    icon: Map,
  },
  {
    number: "03",
    title: "Research Reports",
    description:
      "Task Columbus to do all the hard expert-level work for you. Reports are created for your new site selection.",
    icon: BookOpen,
  },
  {
    number: "04",
    title: "Cloud Based",
    description:
      "No more bulky GIS research software. Let your team do work from anywhere with our mobile app and browser-based platform.",
    icon: Cloud,
  },
  {
    number: "05",
    title: "Generative Due Diligence",
    description:
      "Cheaper, faster audits on neighbourhoods, sites, parcels, businesses and cities.",
    icon: Book,
  },
  {
    number: "06",
    title: "Data Catalogue",
    description:
      "Find rich and relevant datasets faster with our simple interface. If you can't find a relevant dataset, we can personally order the survey.",
    icon: Database,
  },
];

export const MainFeatures = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-32 lg:py-44">
      <Container>

        {/* Header */}
        <div
          className="mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            filter: visible ? "blur(0px)" : "blur(6px)",
            transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
          }}
        >
          <p className="text-[10px] font-medium tracking-[0.28em] text-[#A1A1AA] uppercase mb-5">
            Capabilities
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#09090B] tracking-tight leading-tight max-w-xl">
            What Columbus can do for you
          </h2>
        </div>

        {/* Feature rows */}
        <div className="w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group border-t border-[#E4E4E7] py-8 grid grid-cols-[52px_1fr_2fr_40px] gap-8 items-start hover:bg-[#FAFAFA] transition-colors duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  filter: visible ? "blur(0px)" : "blur(4px)",
                  transition: `opacity 0.6s ease ${index * 60 + 200}ms, transform 0.6s ease ${index * 60 + 200}ms, filter 0.6s ease ${index * 60 + 200}ms`,
                }}
              >
                {/* Number */}
                <span className="text-[11px] font-medium tracking-[0.18em] text-[#A1A1AA] pt-1">
                  {feature.number}
                </span>

                {/* Icon + Title */}
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-9 h-9 flex items-center justify-center border border-[#E4E4E7] bg-[#FAFAFA]"
                  >
                    <Icon size={16} strokeWidth={1.4} className="text-[#3F3F46]" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#09090B] tracking-[-0.01em] leading-snug pt-[7px]">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[15px] leading-[1.65] text-[#71717A] pt-1">
                  {feature.description}
                  {feature.link && (
                    <a
                      href="#"
                      className="ml-2 text-[#09090B] hover:text-[#3F3F46] inline-flex items-center gap-1 transition-colors font-medium"
                    >
                      Datasets <ArrowUpRight size={13} strokeWidth={1.6} />
                    </a>
                  )}
                </p>

                {/* Arrow */}
                <div className="flex items-center justify-end pt-1 opacity-0 group-hover:opacity-40 transition-opacity">
                  <ArrowUpRight size={18} strokeWidth={1.5} className="text-[#09090B]" />
                </div>
              </div>
            );
          })}
          {/* Last row bottom border */}
          <div className="border-t border-[#E4E4E7]" />
        </div>

      </Container>
    </section>
  );
};
