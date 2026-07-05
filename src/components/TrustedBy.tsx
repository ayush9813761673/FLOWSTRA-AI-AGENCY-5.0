"use client";

import { LogoCloud } from "./ui/logo-cloud-4";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

export function TrustedBy({
  heading = "Powering Workflows With",
  logos = [
    {
      id: "logo-1",
      description: "Zapier",
      image: "https://cdn.simpleicons.org/zapier/FF4A00",
    },
    {
      id: "logo-2",
      description: "Make",
      image: "https://cdn.simpleicons.org/make/6D00CC",
    },
    {
      id: "logo-3",
      description: "ChatGPT",
      image: "/chatgpt.svg",
    },
    {
      id: "logo-4",
      description: "Anthropic",
      image: "https://cdn.simpleicons.org/anthropic/D17A57",
    },
    {
      id: "logo-5",
      description: "HubSpot",
      image: "https://cdn.simpleicons.org/hubspot/FF7A59",
    },
    {
      id: "logo-6",
      description: "Airtable",
      image: "https://www.vectorlogo.zone/logos/airtable/airtable-icon.svg",
    },
    {
      id: "logo-7",
      description: "Google",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg",
    },
    {
      id: "logo-8",
      description: "N8N",
      image: "https://cdn.simpleicons.org/n8n/EA4365",
    },
  ],
}: Logos3Props) {
  // Map logos to the format expected by LogoCloud
  const cloudLogos = logos.map((logo) => ({
    src: logo.image,
    alt: logo.description,
  }));

  return (
    <section className="w-full relative z-10 flex flex-col items-center pb-16 -mt-16 sm:-mt-24">
      <p className="text-center text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-12">
        {heading}
      </p>

      <div className="w-full relative px-0 flex justify-center">
        <LogoCloud logos={cloudLogos} />
      </div>
    </section>
  );
}
