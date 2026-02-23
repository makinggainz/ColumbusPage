import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});
export const shanti = localFont({
  src: [
    {
      path: "./fonts/Shanti-400-latin.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
});

export const cormorantGaramond = localFont({
  src: [
    {
      path: "./fonts/CormorantGaramond-400-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/CormorantGaramond-500-latin.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
});

export const shipporiMincho = localFont({
  src: [
    {
      path: "./fonts/ShipporiMincho-400-latin.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "./fonts/ShipporiMincho-500-latin.woff2",
      weight: "500",
      style: "medium",
    },
  ],
  display: "swap",
});
