import { Cormorant_Garamond, Cambo, Instrument_Serif, Geist } from "next/font/google";

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
});
