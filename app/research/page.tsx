import { TechnologyPage } from "@/components/technology/TechnologyPage";
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";

export default function ResearchRoutePage() {
  return (
    <>
      <TechnologyPage />
      {/* Eager prefetch-all: after load + idle, warms every below-fold image
          (tech diagram, model logos, Voyager graphic, blog cards) so the long
          scroll never reveals a half-loaded section. Scoped to /research;
          /technology renders the same TechnologyPage without it. */}
      <MediaPrefetcher />
    </>
  );
}
