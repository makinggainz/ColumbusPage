"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AccordionCtx = {
  openTitle: string | null;
  toggle: (title: string) => void;
};

const AccordionContext = createContext<AccordionCtx | null>(null);

export function useAccordion() {
  return useContext(AccordionContext);
}

export function ResearchAccordionProvider({
  children,
  initialOpen,
}: {
  children: ReactNode;
  initialOpen?: string;
}) {
  const [openTitle, setOpenTitle] = useState<string | null>(initialOpen ?? null);

  function toggle(title: string) {
    setOpenTitle((prev) => (prev === title ? null : title));
  }

  return (
    <AccordionContext.Provider value={{ openTitle, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
}
