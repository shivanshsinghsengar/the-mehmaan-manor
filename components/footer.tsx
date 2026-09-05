import Link from "next/link";
import { Instagram, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-[#eee9df] border-t border-[#1e2b27]/8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Logo size={52} />
            <p className="text-sm text-ink/65 leading-relaxed max-w-[220px]">
              Thoughtful stays, warm hospitality, and memories that last.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.instagram.com/the_mehmaan_manor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-forest/10 text-ink/50 hover:text-gold hover:border-gold/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="tel:+918828352311"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-forest/10 text-ink/50 hover:text-gold hover:border-gold/40 transition-colors"
                aria-label="Call Simran"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Our Homes */}
          <div>
            <h3 className="text-sm font-semibold text-forest uppercase tracking-wider mb-4">
              Our Homes
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2.5">
                <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <Link
                    href="/homes/sushant-lok"
                    className="text-sm font-medium text-ink hover:text-forest transition-colors block"
                  >
                    Sushant Lok
                  </Link>
                  <p className="text-xs text-ink/50 mt-0.5">Sector 57, Phase 2, Gurugram</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <Link
                    href="/homes/jharsa-village"
                    className="text-sm font-medium text-ink hover:text-forest transition-colors block"
                  >
                    Jharsa Village
                  </Link>
                  <p className="text-xs text-ink/50 mt-0.5">Sector 39, Gurugram – 122003</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-forest uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <nav className="space-y-0.5">
              {[
                { href: "/homes",      label: "Our Homes" },
                { href: "/experience", label: "Experience" },
                { href: "/gallery",    label: "Gallery" },
                { href: "/about",      label: "About Us" },
                { href: "/contact",    label: "Contact & Book" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center text-sm text-ink/60 hover:text-forest transition-colors min-h-[36px]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-forest uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-ink/45 uppercase tracking-wider mb-1">Host</p>
                <p className="text-sm font-medium text-ink">Simran</p>
                <a
                  href="tel:+918828352311"
                  className="text-sm text-ink/60 hover:text-forest transition-colors font-mono"
                >
                  +91 88283 52311
                </a>
              </div>
              <div>
                <p className="text-xs text-ink/45 uppercase tracking-wider mb-1">WhatsApp</p>
                <a
                  href="https://wa.me/918828352311"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#1a7a3a] font-medium hover:underline"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Message us now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-forest/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-ink/40 text-center sm:text-left">
              © {new Date().getFullYear()} The Mehmaan Manor. All rights reserved.
            </p>
            <p className="font-display text-sm italic text-ink/50">
              Come as a guest, leave as family.
            </p>
            {/* Staff-only admin link — invisible to guests */}
            <Link
              href="/admin/login"
              className="text-transparent hover:text-ink/20 transition-colors text-xs font-mono min-h-[36px] flex items-center"
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
