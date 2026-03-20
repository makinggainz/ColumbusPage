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
    <section ref={sectionRef} className="bg-[#FFFFFF] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6">

        {/* Centered intro */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            filter: visible ? "blur(0px)" : "blur(6px)",
            transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
          }}
        >
          <p className="text-[17px] font-semibold text-[#6E6E73] mb-4">
            Capabilities
          </p>
          <h2 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center">
            What Columbus can do for you
          </h2>
          <p className="text-[21px] md:text-[24px] font-normal leading-[1.38] text-[#6E6E73] text-center max-w-[600px] mx-auto mt-4">
            Powerful tools that transform how you research, analyze, and select sites.
          </p>
        </div>

        {/* Feature rows */}
        <div className="w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group flex items-start gap-5 py-5 px-4 -mx-4 border-b border-[rgba(0,0,0,0.06)] hover:bg-[#F5F5F7] rounded-xl transition-colors duration-300 cursor-pointer"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  filter: visible ? "blur(0px)" : "blur(4px)",
                  transition: `opacity 0.6s ease ${index * 60 + 200}ms, transform 0.6s ease ${index * 60 + 200}ms, filter 0.6s ease ${index * 60 + 200}ms, background-color 0.3s ease`,
                }}
              >
                {/* Icon */}
                <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-[#F5F5F7]">
                  <Icon size={22} strokeWidth={1.5} className="text-[#1D1D1F]" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-semibold text-[#1D1D1F] leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-[17px] font-normal leading-[1.47] text-[#6E6E73] mt-1">
                    {feature.description}
                    {feature.link && (
                      <a
                        href="#"
                        className="ml-2 text-[#4F46E5] hover:underline inline-flex items-center gap-0.5 font-normal text-[17px]"
                      >
                        Datasets &#8250;
                      </a>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
