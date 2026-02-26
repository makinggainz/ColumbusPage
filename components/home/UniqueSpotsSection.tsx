"use client";

export const UniqueSpotsSection = () => {
  const spots = Array(5).fill(null);

  return (
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0F766E] mb-12 md:mb-16">
          Unique spots people are favoriting
        </h2>

        {/* Responsive Grid */}
        <div className="grid gap-8
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4">

          {spots.map((_, i) => (
            <div
              key={i}
              className="
                rounded-[11px]
                bg-white
                shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                overflow-hidden
              "
            >
              {/* Image */}
              <div className="relative w-full aspect-[462/180] bg-gray-200">
                <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300 rounded-md" />
              </div>

              {/* Text */}
              <div className="p-4 space-y-3">
                <div className="h-4 w-40 bg-gray-300 rounded-md" />
                <div className="h-3 w-full bg-gray-200 rounded-md" />
                <div className="h-3 w-4/5 bg-gray-200 rounded-md" />
                <div className="h-3 w-28 bg-gray-200 rounded-md" />
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};