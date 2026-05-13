import { Cormorant_Garamond, Cambo, Instrument_Serif, Geist, DM_Sans, Inter } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const cambo = Cambo({
  weight: "400",
  subsets: ["latin"],
});

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

// Inter — single-family typography per the catcherX (NewsCatcher) design
// system. Headings/body/labels all bind to `--font-sans` via this variable.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
