"use client";

import Image from "next/image";

function DatasetCard({
  image,
  title,
  rows,
  desc,
}: {
  image: string;
  title: string;
  rows: string;
  desc: string;
}) {
  return (
    <div className="w-full rounded-[10px] border border-[#E6E6E6] bg-white overflow-hidden">
      <div className="relative w-full h-[200px]">
        <Image src={image} alt="" fill className="object-cover" />
      </div>

      <div className="p-4">
        <h4 className="text-[15px] font-medium text-[#111]">{title}</h4>
        <p className="text-[12px] text-[#6B7280] mt-1">{rows}</p>

        <p className="text-[13px] text-[#6B7280] mt-2 leading-[140%]">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function DataSection() {
  return (
    <section className="w-full bg-[#F4F3EB] py-20">

      <div className="max-w-[1728px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row gap-12">

        {/* LEFT SIDE */}
        <div className="lg:w-[226px] flex flex-col gap-6 lg:pt-68">

        <p className="text-[19px] text-[#64748B]">
          Data Collection
        </p>

        <p className="text-[16px] leading-[140%] text-[#334155]">
          Through our proprietary innovations such as asking our mom to go out and
          collect data around the neighborhood we have accrued the most expansive
          data collection that minesota has ever seen
        </p>

      </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">

          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#111] leading-[140%]">
              Cant find relevant datasets for your research?
            </h2>

            <h3 className="text-[32px] md:text-[40px] font-semibold text-[#111]">
              Columbus has it.
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-6 text-[14px] text-[#6B7280] border-b border-[#E5E7EB] pb-3 mb-6">
            <span>Suggested</span>
            <span>Base Maps</span>
            <span>Overlays</span>
            <span>Packs</span>
            <span>Environmental</span>
            <span>Infrastructure</span>
            <span className="text-[#111] border-b-2 border-[#111] pb-2">
              Smart Layers
            </span>
            <span>Demographic</span>
          </div>

          {/* Dataset cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

            <DatasetCard
              image="/enterprise/mp1.png"
              title="Future Appreciation Zones"
              rows="55,010 rows"
              desc="Predicts 2–5 year property value growth using migration, job forecasts, and permit trends."
            />

            <DatasetCard
              image="/enterprise/mp2.png"
              title="Future Turnover Hotspots"
              rows="40,206 rows"
              desc="Predicts high-flip areas from sales velocity, investor inflows, and economic cycles."
            />

            <DatasetCard
              image="/enterprise/mp3.png"
              title="Future Displacement Risk Overlay"
              rows="33,520 rows"
              desc="Flags areas at risk of resident displacement from rising costs and affordable housing changes."
            />

            <DatasetCard
              image="/enterprise/mp3.png"
              title="Future Displacement Risk Overlay"
              rows="33,520 rows"
              desc="Flags areas at risk of resident displacement from rising costs and affordable housing changes."
            />

          </div>

          {/* Description */}
          <div className="max-w-[900px] mb-10">
            <p className="text-[24px] md:text-[28px] leading-[140%] text-[#111]">
              The <span className="font-semibold">highest quality</span>, and most versatile data-sets for your critical research and decisions.
            </p>

            <a className="text-[14px] text-[#0A1344] mt-4 inline-flex items-center gap-2">
              Learn about our Data Collection →
            </a>
          </div>

          {/* Partner logos */}
          <div className="bg-white border border-[#E6E6E6] rounded-[10px] p-10">

            <h3 className="text-center text-[24px] font-semibold mb-2">
              Vetted, high-fidelity, and smart datasets
            </h3>

            <p className="text-center text-[#6B7280] text-[14px] mb-8">
              We vet our data with partner organizations
            </p>

            <div className="flex flex-wrap justify-center items-center gap-10">
              <Image src="/enterprise/logo1.png" width={70} height={40} alt="" />
              <Image src="/enterprise/logo2.png" width={90} height={40} alt="" />
              <Image src="/enterprise/logo3.png" width={90} height={40} alt="" />
              <Image src="/enterprise/logo4.png" width={90} height={40} alt="" />
              <Image src="/enterprise/logo5.png" width={90} height={40} alt="" />
              <Image src="/enterprise/logo6.png" width={70} height={40} alt="" />
              <Image src="/enterprise/logo7.png" width={90} height={40} alt="" />
            </div>

          </div>

        </div>

      </div>
    {/* section label */}
      <div className="max-w-[1728px] mx-auto px-6 lg:px-12 mt-16 text-[#8A8A8A] text-[19px]">
        Map Chat
      </div>

    </section>
  );
}