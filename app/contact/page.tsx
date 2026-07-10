"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MessageCircle, Instagram, MapPin } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    dates: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("active")
        ),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", property: "", dates: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-40 pb-24 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="font-mono text-gold text-sm tracking-widest uppercase mb-6 animate-fade-in">
              Contact & Book
            </p>
            <h1 className="text-display font-display text-forest mb-6 animate-fade-up">
              Let's Plan Your Stay
            </h1>
            <p className="text-lg text-ink/80 max-w-2xl mx-auto animate-fade-up">
              Ready to make yourself at home? Reach out to our team directly.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="pb-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Simran */}
              <div className="reveal bg-forest-deep text-cream p-8 space-y-4">
                <div className="w-16 h-16 bg-gold/10 flex items-center justify-center mb-4">
                  <span className="font-display text-3xl text-gold">S</span>
                </div>
                <div>
                  <h3 className="text-2xl font-display mb-1">Simran</h3>
                  <p className="font-mono text-sm text-gold">Your Host</p>
                </div>
                <p className="text-cream/80 text-sm">
                  Your first call for bookings, questions, and all things Mehmaan.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+918828352311"
                    className="flex items-center space-x-2 text-cream/90 hover:text-gold transition-colors"
                  >
                    <Phone size={16} />
                    <span className="font-mono text-sm">+91 88283 52311</span>
                  </a>
                  <a
                    href="https://wa.me/918828352311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-cream/90 hover:text-gold transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Vipin */}
              <div
                className="reveal bg-forest-deep text-cream p-8 space-y-4"
                style={{ animationDelay: "150ms" }}
              >
                <div className="w-16 h-16 bg-gold/10 flex items-center justify-center mb-4">
                  <span className="font-display text-3xl text-gold">V</span>
                </div>
                <div>
                  <h3 className="text-2xl font-display mb-1">Vipin</h3>
                  <p className="font-mono text-sm text-gold">Property Manager</p>
                </div>
                <p className="text-cream/80 text-sm">
                  For property-specific questions and on-ground support.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+918796568003"
                    className="flex items-center space-x-2 text-cream/90 hover:text-gold transition-colors"
                  >
                    <Phone size={16} />
                    <span className="font-mono text-sm">+91 87965 68003</span>
                  </a>
                  <a
                    href="https://wa.me/918796568003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-cream/90 hover:text-gold transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Jyoti */}
              <div
                className="reveal bg-forest-deep text-cream p-8 space-y-4"
                style={{ animationDelay: "300ms" }}
              >
                <div className="w-16 h-16 bg-gold/10 flex items-center justify-center mb-4">
                  <span className="font-display text-3xl text-gold">J</span>
                </div>
                <div>
                  <h3 className="text-2xl font-display mb-1">Jyoti</h3>
                  <p className="font-mono text-sm text-gold">Guest Relations</p>
                </div>
                <p className="text-cream/80 text-sm">
                  For reservations, inquiries, and special requests.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+918796568002"
                    className="flex items-center space-x-2 text-cream/90 hover:text-gold transition-colors"
                  >
                    <Phone size={16} />
                    <span className="font-mono text-sm">+91 87965 68002</span>
                  </a>
                  <a
                    href="https://wa.me/918796568002"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-cream/90 hover:text-gold transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="py-24 px-6 bg-forest/5">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl font-display text-forest mb-4">
                Send Us an Inquiry
              </h2>
              <p className="text-ink/70">
                Not sure which home? Have specific questions? Drop us a message.
              </p>
            </div>

            {submitted ? (
              <div className="reveal bg-cream p-12 text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display text-forest mb-2">Message Received!</h3>
                <p className="text-ink/70 mb-6">
                  We'll get back to you within a few hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reveal bg-cream p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-forest mb-2">
                      Your Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Arjun Mehta"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-forest mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="arjun@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-forest mb-2">
                      Phone *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="property" className="block text-sm font-medium text-forest mb-2">
                      Which Home?
                    </label>
                    <select
                      id="property"
                      value={formData.property}
                      onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                      className="flex h-12 w-full rounded-none border border-input bg-cream px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <option value="">Not sure yet</option>
                      <option value="sushant-lok">Sushant Lok</option>
                      <option value="jharsa-village">Jharsa Village</option>
                      <option value="either">Either works</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="dates" className="block text-sm font-medium text-forest mb-2">
                    Preferred Dates
                  </label>
                  <Input
                    id="dates"
                    type="text"
                    value={formData.dates}
                    onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                    placeholder="e.g., July 20-22, 2024"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-forest mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your stay — how many guests, any special requests, or questions you have..."
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* Properties & Instagram */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Property Addresses */}
              <div className="reveal space-y-8">
                <h2 className="text-2xl font-display text-forest mb-6">Our Homes</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 border border-forest/10">
                    <MapPin size={20} className="text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-display text-xl text-forest mb-2">Sushant Lok</h3>
                      <p className="font-mono text-sm text-ink/60 leading-relaxed">
                        Sector 57, Phase 2<br />
                        Sushant Lok, Gurugram<br />
                        Haryana - 122011<br />
                        <span className="text-xs">28.4212° N, 77.0761° E</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-6 border border-forest/10">
                    <MapPin size={20} className="text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-display text-xl text-forest mb-2">Jharsa Village</h3>
                      <p className="font-mono text-sm text-ink/60 leading-relaxed">
                        593, Durga Colony<br />
                        Jharsa Village, Sector 39<br />
                        Gurugram, Haryana - 122003<br />
                        <span className="text-xs">28.4594° N, 77.0266° E</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="reveal" style={{ animationDelay: "150ms" }}>
                <h2 className="text-2xl font-display text-forest mb-6">Follow Our Story</h2>
                <div className="bg-forest-deep text-cream p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gold/10 flex items-center justify-center">
                      <Instagram size={28} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-mono text-gold text-sm">Instagram</p>
                      <p className="font-display text-2xl">@themehmaanmanor</p>
                    </div>
                  </div>
                  <p className="text-cream/80 leading-relaxed">
                    See our homes in real life, guest stories, local Gurugram gems, and
                    behind-the-scenes moments. We keep it real, never filtered.
                  </p>
                  <Button asChild variant="gold" size="lg" className="w-full">
                    <a
                      href="https://www.instagram.com/themehmaanmanor"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Follow Us on Instagram
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
