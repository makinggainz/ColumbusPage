"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { IndustryContent, IndustryId } from "./types";
import { DEFAULT_INDUSTRY, INDUSTRY_CONTENT } from "./content";

type IndustryContextValue = {
  industryId: IndustryId;
  industry: IndustryContent;
  setIndustryId: (id: IndustryId) => void;
};

const IndustryContext = createContext<IndustryContextValue | null>(null);

type IndustryProviderProps = {
  children: React.ReactNode;
  /** Optional starting industry. Defaults to DEFAULT_INDUSTRY (urban-planning). */
  initialIndustryId?: IndustryId;
};

export function IndustryProvider({
  children,
  initialIndustryId = DEFAULT_INDUSTRY,
}: IndustryProviderProps) {
  const [industryId, setIndustryIdState] = useState<IndustryId>(initialIndustryId);

  const setIndustryId = useCallback((id: IndustryId) => {
    setIndustryIdState(id);
  }, []);

  const value = useMemo<IndustryContextValue>(
    () => ({
      industryId,
      industry: INDUSTRY_CONTENT[industryId],
      setIndustryId,
    }),
    [industryId, setIndustryId],
  );

  return <IndustryContext.Provider value={value}>{children}</IndustryContext.Provider>;
}

/**
 * Read the active industry. The four embedded row components consume this
 * hook to look up their per-industry data, and IndustrySelector / the sticky
 * sub-navbar use it to read & write the selection.
 *
 * Throws if used outside an IndustryProvider — that's almost always a wiring
 * bug worth surfacing loudly.
 */
export function useIndustry(): IndustryContextValue {
  const ctx = useContext(IndustryContext);
  if (!ctx) {
    throw new Error("useIndustry() must be used inside an <IndustryProvider>.");
  }
  return ctx;
}
