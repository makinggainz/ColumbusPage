

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
      title: "Generative Geodata",
      description:
        "Our proprietary model can create predictive data or unique datasets tailored to your exact preferences.",
      icon: PenTool,
      link: true,
    },
    {
      title: "Map Chat",
      description:
        "Research like you're talking to an expert with Columbus Chat. Answer any question, roll the dice, or visualize data in your own way.",
      icon:Map,
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
        "No more bulky GIS research software. Let your team do work from anywhere with our mobile app and browser based platform.",
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
       "Find rich and relevant data sets faster with our simple to use interface.  If you cant find a relevant dataset, we can personally order the survey.",
      icon: Database
    },
  ];

  return (
    <section
      className="relative py-[160px]"
      style={{
        backgroundColor: "#FFFFFF",
        backgroundImage: `
          linear-gradient(to right, rgba(28,39,76,0.035) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(28,39,76,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "120px 120px",
      }}
    >
      <div className="max-w-[1528px] mx-auto">

        {/* Heading */}
        <div className="text-center mb-[110px]">
          <h2 className="text-[42px] font-medium text-[#1C274C] tracking-[-0.01em]">
            Main Features
          </h2>
        </div>

        {/* Grid */}
        <div className="flex flex-wrap justify-center gap-x-[100px] gap-y-[100px]">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
                  w-[333px]
                  h-[269px]
                  rounded-[12px]
                  bg-white/60
                  backdrop-blur-[12px]
                  border border-[#E5E8EF]
                  px-[28px]
                  pt-[28px]
                  shadow-[0_6px_24px_rgba(0,0,0,0.05)]
                "
              >
                {/* Icon container */}
                <div className="w-[36px] h-[36px] rounded-[10px] border border-[#E6EAF2] bg-white/80 flex items-center justify-center mb-[22px]">
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#1C274C]"
                  />
                </div>

                {/* Title */}
                <h3 className="text-[16px] font-semibold text-[#1C274C] mb-[14px]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] leading-[160%] text-[#1C274C]/70 mb-[16px]">
                  {feature.description}
                </p>

                {/* Optional Link Button (First Card Only) */}
                {feature.link && (
                  <a
                  href="#"
                  className="text-[15px] font-medium text-[#4C76C6] hover:underline inline-flex items-center gap-[6px]"
                >
                  Check out our generative datasets
                  <ArrowUpRight size={16} strokeWidth={1.6} />
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