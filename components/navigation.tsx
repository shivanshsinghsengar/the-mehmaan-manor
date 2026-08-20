"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Instagram, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { Float } from "@/components/3d-effects";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/homes", label: "Our Homes" },
    { href: "/experience", label: "Experience" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          isScrolled
            ? "bg-cream/97 backdrop-blur-md shadow-sm border-b border-forest/8"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo — always visible */}
            <Link
              href="/"
              className="flex items-center group min-h-[44px]"
              aria-label="The Mehmaan Manor Home"
            >
              <Float amplitude={4} duration={5}>
                <Logo
                  size={52}
                  className="transition-transform duration-500 group-hover:scale-105 flex-shrink-0"
                />
              </Float>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-forest/80 font-medium transition-colors duration-300 hover:text-forest group py-2 text-sm"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              <Button asChild variant="gold" size="sm">
                <Link href="/book">Reserve</Link>
              </Button>
            </div>

            {/* Mobile Menu Button — 44×44px touch target */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-forest hover:text-gold transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — full screen overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-forest text-cream transition-transform duration-500 lg:hidden overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col min-h-full p-6 md:p-8">
          {/* Header row */}
          <div className="flex justify-between items-center mb-10">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Logo size={44} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-cream hover:text-gold transition-colors"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <nav className="flex-1 flex flex-col space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-display text-3xl md:text-4xl text-cream hover:text-gold transition-colors duration-300 py-2 min-h-[44px] flex items-center"
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Footer */}
          <div className="space-y-5 pt-6 border-t border-cream/20 mt-6">
            <Button
              asChild
              variant="gold"
              size="lg"
              className="w-full min-h-[52px] text-base"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/book">Reserve Your Stay</Link>
            </Button>

            <div className="flex items-center justify-center space-x-6">
              <a
                href="https://www.instagram.com/themehmaanmanor"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-cream hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="tel:+918828352311"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-cream hover:text-gold transition-colors"
                aria-label="Call us"
              >
                <Phone size={24} />
              </a>
            </div>

            <p className="text-center font-mono text-sm text-cream/60">
              @themehmaanmanor
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
