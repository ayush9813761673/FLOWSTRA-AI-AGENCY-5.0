import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "./ui/hover-footer";

export function Footer() {
  // Footer link data
  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { label: "CRM Automation", href: "#solutions" },
        { label: "Lead Qualification", href: "#solutions" },
        { label: "Outbound Logic", href: "#solutions" },
        { label: "Pipeline Routing", href: "#solutions" },
      ],
    },
    {
      title: "Helpful Links",
      links: [
        {
          label: "Book a Call",
          href: "https://cal.com/flowstra/30min",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        { label: "Outcomes", href: "#outcomes" },
        {
          label: "Direct Support",
          href: "https://wa.me/9779813761673?text=Hi%20Ayush%2C%20I%20want%20to%20know%20more%20about%20Flowstra%27s%20automation%20services.",
          target: "_blank",
          rel: "noopener noreferrer",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3b82f6]" />,
      text: "contact@flowstra.org",
      href: "mailto:contact@flowstra.org",
    },
    {
      icon: <Phone size={18} className="text-[#3b82f6]" />,
      text: "+977 9813761673",
      href: "tel:+9779813761673",
    },
    {
      icon: <MapPin size={18} className="text-[#3b82f6]" />,
      text: "Directly through WhatsApp",
      href: "https://wa.me/9779813761673?text=Hi%20Ayush%2C%20I%20want%20to%20know%20more%20about%20Flowstra%27s%20automation%20services.",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  ];

  // Social media icons (hidden for now)
  const socialLinks: { icon: React.ReactNode; label: string; href: string; target?: string; rel?: string }[] =
    [
      {
        icon: <Linkedin size={20} />,
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/ayush-yadav-pro/",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        icon: <Instagram size={20} />,
        label: "Instagram",
        href: "https://www.instagram.com/flowstra.ai",
        target: "_blank",
        rel: "noopener noreferrer",
      }
    ];

  return (
    <footer className="bg-[rgba(5,5,10,0.4)] relative h-fit rounded-[32px] overflow-hidden m-6 border border-[var(--card-border)]">
      <FooterBackgroundGradient />

      {/* Text hover effect */}
      <div className="absolute bottom-0 w-full flex h-[12rem] md:h-[16rem] lg:h-[22rem] opacity-30 md:opacity-50 lg:opacity-80 pointer-events-none z-0">
        <div className="w-full pointer-events-auto h-full translate-y-1/3">
          <TextHoverEffect text="FLOWSTRA" className="z-0" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-16 pb-8 md:pb-12 z-40 relative text-left pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12 pointer-events-auto">
          {/* Brand section */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Flowstra Logo"
                className="w-8 h-8 object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="text-white font-bold text-2xl tracking-tight">
                Flowstra
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] max-w-xs">
              Founder-led AI systems that automate lead qualification, routing,
              and CRM logic around how your team actually operates.
            </p>
            <div className="flex gap-5 pt-2 pointer-events-auto">
              {socialLinks.map(({ icon, label, href, target, rel }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={target}
                  rel={rel}
                  className="text-white/60 hover:text-[var(--accent-blue)] transition-colors inline-block"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-[var(--text-primary)] text-sm font-bold uppercase tracking-widest mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label} className="relative w-fit">
                    <a
                      href={link.href}
                      {...(link.target
                        ? { target: link.target, rel: link.rel }
                        : {})}
                      className="text-sm text-[var(--text-secondary)] hover:text-[#3b82f6] transition-colors relative z-50 pointer-events-auto block py-1"
                    >
                      {link.label}
                    </a>
                      {link.pulse && (
                        <span className="absolute top-2 -right-3 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse pointer-events-none"></span>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-[var(--text-primary)] text-sm font-bold uppercase tracking-widest mb-8">
              Contact
            </h4>
            <ul className="space-y-5">
              {contactInfo.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center space-x-3 text-sm text-[var(--text-secondary)] group relative z-50 pointer-events-auto"
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#3b82f6] transition-colors py-1 block"
                      {...((item as any).target
                        ? {
                            target: (item as any).target,
                            rel: (item as any).rel,
                          }
                        : {})}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="py-1 block">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-[var(--card-border)] my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 text-[var(--text-muted)] font-medium tracking-wide pointer-events-auto mt-auto pt-8">
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors block py-2">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors block py-2">
              Terms of Service
            </a>
          </div>

          <p className="text-center md:text-left pointer-events-auto">
            &copy; {new Date().getFullYear()} FLOWSTRA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
