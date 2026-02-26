"use client";

import {
  PenTool,
  Map,
  BookOpen,
  Cloud,
  Book,
  Database,
  ArrowUpRight,
} from "lucide-react";

export const MainFeatures = () => {
  const features = [
    {
      title: "Map Chat",
      description:
        "Research like you're talking to an expert with Columbus Chat. Answer any question, roll the dice, or visualize data in your own way.",
      icon: Map,
    },
    {
      title: "Generative Geodata",
      description:
        "Our proprietary model can create predictive data or unique datasets tailored to your exact preferences.",
      icon: PenTool,
      link: true,
    },
    {
      title: "Research Reports",
      description:
        "Task Columbus to do all the hard expert-level work for you. Reports are created for your new site selection.",
      icon: BookOpen,
    },
    {
      title: "Data Catalogue",
      description:
        "Find rich and relevant data sets faster with our simple to use interface. If you cant find a relevant dataset, we can personally order the survey.",
      icon: Database,
    },
    {
      title: "Generative Due Diligence",
      description:
        "Cheaper, faster audits on neighbourhoods, sites, parcels, businesses and cities.",
      icon: Book,
    },
    {
      title: "Cloud Based",
      description:
        "No more bulky GIS research software. Let your team do work from anywhere with our mobile app and browser based platform.",
      icon: Cloud,
    },
  ];

  return (
    <section className="py-[120px] bg-white">
      <div className="max-w-[404px] mx-auto">

        {/* Heading */}
        <h2 className="text-[28px] font-semibold text-[#1C274C] text-center mb-[60px]">
          Main Features
        </h2>

        {/* Centered Vertical Stack */}
        <div className="flex flex-col items-center gap-[28px]">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
                  w-[333px]
                  rounded-[16px]
                  bg-[#F7F8FA]
                  border border-[#E6EAF2]
                  p-[24px]
                "
              >
                {/* Icon */}
                <div className="w-[40px] h-[40px] rounded-[12px] bg-white border border-[#E6EAF2] flex items-center justify-center mb-[16px]">
                  <Icon size={18} strokeWidth={1.5} className="text-[#1C274C]" />
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-semibold text-[#1C274C] mb-[8px]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] leading-[160%] text-[#1C274C]/70 mb-[12px]">
                  {feature.description}
                </p>

                {feature.link && (
                  <a
                    href="#"
                    className="text-[13px] font-medium text-[#4C76C6] inline-flex items-center gap-[4px]"
                  >
                    Check out our generative datasets
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};