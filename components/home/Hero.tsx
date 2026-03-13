import { cormorant } from "@/lib/typography";

export const Hero = () => {
  return (
    <section className="relative bg-white min-h-[calc(100vh-576px)] overflow-hidden">
      <div className="relative z-10 pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="max-w-[1168px]">
            {/* Eyebrow + Main Heading + Tag — shifted left, aligned */}
            <div className="-translate-x-[250px]">
            {/* Eyebrow */}
            <p className="text-sm md:text-base font-medium tracking-tight text-[#1C274C]/70 uppercase mb-4 text-left ml-0 pl-0 mt-[60px]">
              FRONTIER AI RESEARCH AND PRODUCT COMPANY
            </p>

            {/* Main Heading — left edge aligned with Eyebrow */}
            <h1
              className={`${cormorant.className} font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight tracking-tight text-[#0A1344] ml-0 pl-0 text-left`}
            >
              The frontier AI Lab building the first in-production Large Geospatial Model.
            </h1>

            {/* Tag — left edge aligned with Eyebrow */}
            <p className="mt-6 text-xs md:text-sm font-medium tracking-widest text-[#1C274C]/70">
              [ COLUMBUS PRO-1 ]
            </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
