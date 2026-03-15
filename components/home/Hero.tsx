import { cormorant } from "@/lib/typography";
import { Container } from "@/components/layout/Container";

export const Hero = () => {
  return (
    <section className="relative bg-[#F9F9F9] min-h-[calc(100vh-576px)] overflow-hidden">
      <div className="relative z-10 pt-24 md:pt-32">
        <Container>
          <div className="max-w-292">
            {/* Eyebrow + Main Heading + Tag */}
            <div>
            {/* Eyebrow */}
            <p className="text-sm md:text-base font-medium tracking-tight text-[#1C274C]/70 uppercase mb-4 text-left ml-0 pl-0 mt-15">
              FRONTIER AI RESEARCH AND PRODUCT COMPANY
            </p>

            {/* Main Heading — left edge aligned with Eyebrow */}
            <h1
              className={`${cormorant.className} font-semibold leading-tight tracking-tight text-[#0A1344] ml-0 pl-0 text-left`}
              style={{ fontSize: "66px" }}
            >
              The frontier AI Lab building the first in-production Large Geospatial Model.
            </h1>

            {/* Tag — left edge aligned with Eyebrow */}
            <p className="mt-6 text-xs md:text-sm font-medium tracking-widest text-[#1C274C]/70">
              [ COLUMBUS PRO-1 ]
            </p>
            </div>

          </div>
        </Container>
      </div>
    </section>
  );
};
