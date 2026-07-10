"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
              aria-label="The Mehmaan Manor Home"
            >
              <Logo
                size={44}
                variant="full"
                className="transition-transform duration-500 group-hover:scale-105 flex-shrink-0"
              />
              <span className={cn(
                "hidden md:block font-display text-lg transition-colors duration-300",
                isScrolled ? "text-forest" : "text-forest"
              )}>
                The Mehmaan Manor
              </span>
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-forest hover:text-gold transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-forest text-cream transition-transform duration-500 lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-8">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-12">
            <Logo size={52} variant="full" />
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-cream hover:text-gold transition-colors"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <nav className="flex-1 flex flex-col space-y-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-display text-4xl md:text-5xl text-cream hover:text-gold transition-colors duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Footer */}
          <div className="space-y-6 pt-8 border-t border-cream/20">
            <Button
              asChild
              variant="gold"
              size="lg"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/book">Reserve Your Stay</Link>
            </Button>

            <div className="flex items-center justify-center space-x-6">
              <a
                href="https://www.instagram.com/themehmaanmanor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="tel:+918828352311"
                className="text-cream hover:text-gold transition-colors"
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
