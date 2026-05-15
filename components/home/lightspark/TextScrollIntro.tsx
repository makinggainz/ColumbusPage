"use client";

/**
 * "We're all about maps" intro — section heading that sits above the
 * BentoProducts grid. V2 removed the ColumbusBackgroundMB watermark
 * that used to live here; the image has moved to the Research bento
 * tile in BentoProducts.
 */

export function TextScrollIntro() {
  return (
    <section className="section relative isolate">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center h2 tracking-tight text-ink">
            We&rsquo;re all about maps
          </h2>
        </div>
      </div>
    </section>
  );
}

export default TextScrollIntro;
