import Link from "next/link";
import { Instagram, Phone } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-forest-deep text-cream py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* 1-col on mobile → 2-col on tablet → 4-col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Logo & Tagline */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo size={64} />
            <p className="text-cream/80 text-sm leading-relaxed">
              Thoughtful stays. Warm hospitality. Memories that stay.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h3 className="font-display text-lg md:text-xl mb-4 text-gold">
              Our Homes
            </h3>
            <div className="space-y-3 font-mono text-sm text-cream/80">
              <div>
                <p className="font-sans font-medium text-cream mb-1">
                  Sushant Lok
                </p>
                <p className="text-xs">Sector 57, Phase 2</p>
                <p className="text-xs">Gurugram, Haryana</p>
              </div>
              <div className="pt-3">
                <p className="font-sans font-medium text-cream mb-1">
                  Jharsa Village
                </p>
                <p className="text-xs">593, Durga Colony, Sector 39</p>
                <p className="text-xs">Gurugram, Haryana - 122003</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg md:text-xl mb-4 text-gold">
              Quick Links
            </h3>
            <nav className="space-y-1">
              {[
                { href: "/homes", label: "Our Homes" },
                { href: "/experience", label: "Experience" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact & Book" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-cream/80 hover:text-gold transition-colors text-sm min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg md:text-xl mb-4 text-gold">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone size={16} className="text-gold mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-cream font-medium">Simran</p>
                  <a
                    href="tel:+918828352311"
                    className="text-cream/80 hover:text-gold transition-colors font-mono min-h-[44px] flex items-center"
                  >
                    +91 88283 52311
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Instagram size={16} className="text-gold mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-cream font-medium">Instagram</p>
                  <a
                    href="https://www.instagram.com/themehmaanmanor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/80 hover:text-gold transition-colors font-mono min-h-[44px] flex items-center"
                  >
                    @themehmaanmanor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-cream/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
            <p className="text-cream/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} The Mehmaan Manor. All rights
              reserved.
            </p>
            <p className="font-display text-cream/80 text-sm italic">
              Come as a guest, leave as family.
            </p>
            {/* Staff-only admin link — subtle, no label visible to guests */}
            <Link
              href="/admin/login"
              className="text-cream/20 hover:text-cream/50 transition-colors text-xs font-mono min-h-[44px] flex items-center"
              title="Staff Login"
            >
              ·
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
