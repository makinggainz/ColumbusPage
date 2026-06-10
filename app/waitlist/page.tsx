import type { Metadata } from "next";
import { WaitlistExperience } from "@/components/waitlist/WaitlistExperience";

export const metadata: Metadata = {
  title: "Join the waitlist — Columbus Earth",
  description: "Be first in line for early access to Elio and Columbus.",
};

export default function WaitlistPage() {
  return <WaitlistExperience />;
}
