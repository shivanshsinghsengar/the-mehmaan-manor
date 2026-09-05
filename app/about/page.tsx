"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Heart, Star, Users } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const WA_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const team = [
  {
    name: "Simran",
    title: "Your Host",
    phone: "+91 88283 52311",
    phoneLink: "918828352311",
    description:
      "The heart of Mehmaan Manor. Simran makes sure every guest feels truly welcomed. She picks up your calls, remembers your preferences, and checks in to make sure everything is perfect.",
    emoji: "🌸",
  },
  {
    name: "Vipin",
    title: "Property Manager",
    phone: "+91 87965 68003",
    phoneLink: "918796568003",
    description:
      "Behind every clean room and functional detail is Vipin. He oversees maintenance, inspects before every check-in, and keeps the homes in pristine condition. If something needs fixing, he's on it.",
    emoji: "🔧",
  },
  {
    name: "Jyoti",
    title: "Guest Relations",
    phone: "+91 87965 68002",
    phoneLink: "918796568002",
    description:
      "Your first point of contact for reservations and questions. Jyoti coordinates bookings, answers inquiries, and makes sure your arrival is seamless. Warm, efficient, and genuinely helpful.",
    emoji: "✨",
  },
];

const values = [
  {
    icon: Heart,
    title: "Hospitality Over Business",
    desc: "We're not running a hotel. We're opening our homes. That means warmth, flexibility, and care — not corporate policies.",
  },
  {
    icon: Star,
    title: "Every Detail Matters",
    desc: "From the thread count to the coffee brand, everything is chosen with care. You may not notice every detail, but you'll feel it.",
  },
  {
    icon: Users,
    title: "Real People, Real Conversations",
    desc: "When you call, you reach Simran, Vipin, or Jyoti — real humans who genuinely care. No chatbots, no scripts.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navigation />

      <main id="main-content">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="pt-28 md:pt-36 pb-12 md:pb-20 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block label-badge text-gold mb-4 tracking-widest">About Us</span>
            <h1 className="font-display text-display text-forest leading-tight mb-4">
              More Than Hosts.
              <br />
              <span className="italic text-gold">Your Gurugram Family.</span>
            </h1>
            <p className="text-base md:text-lg text-ink/65 max-w-2xl mx-auto leading-relaxed">
              The story behind The Mehmaan Manor — and the people who make every stay feel like coming home.
            </p>
          </div>
        </section>

        {/* ── Origin Story ──────────────────────────────────────────── */}
        <section className="py-10 md:py-16 px-4 md:px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="reveal space-y-5 text-base md:text-lg text-ink/75 leading-relaxed">
              <p>
                <span className="font-display text-2xl text-gold italic">Mehmaan</span> — a Hindi word
                for "guest." But it means more than a translation can capture. When someone is your
                <em> mehmaan</em>, you don't just provide a bed. You offer warmth, care, and genuine
                hospitality. You treat them like family.
              </p>
              <p>
                That's the foundation of The Mehmaan Manor. We started with one simple question:{" "}
                <em>What if short stays felt like coming home instead of checking into a hotel?</em>
              </p>
              <p>
                We have two properties in Gurugram, each with its own personality. Sushant Lok is
                peaceful and green — a retreat from the city's noise. Jharsa Village is cosy and
                connected — where you feel the pulse of local life. Both are thoughtfully designed,
                meticulously maintained, and genuinely cared for.
              </p>
              <p>
                Whether you're here for work, leisure, or a weekend escape — you're not a booking
                number. You're a <em>mehmaan</em>. And we take that seriously.
              </p>
            </div>
          </div>
        </section>

        {/* ── What We Believe ───────────────────────────────────────── */}
        <section className="py-12 md:py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <span className="label-badge text-gold">Our Values</span>
              <h2 className="font-display text-title text-forest mt-3">What We Believe</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="reveal bg-white rounded-2xl p-6 md:p-8 text-center border border-forest/8 shadow-sm hover:shadow-md transition-shadow"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#faf8f4] border border-forest/8 flex items-center justify-center mx-auto mb-4">
                    <v.icon size={22} className="text-gold" />
                  </div>
                  <h3 className="font-display text-xl text-forest mb-3">{v.title}</h3>
                  <p className="text-sm text-ink/65 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ──────────────────────────────────────────────────── */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <span className="label-badge text-gold">The Team</span>
              <h2 className="font-display text-title text-forest mt-3">Meet Your Hosts</h2>
              <p className="text-ink/60 mt-2 text-sm md:text-base">
                The people who make every stay a Mehmaan experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="reveal bg-[#faf8f4] rounded-2xl p-6 text-center border border-forest/8 hover:border-gold/40 hover:shadow-md transition-all duration-300"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-[#eee9df] flex items-center justify-center mx-auto mb-4 text-2xl">
                    {member.emoji}
                  </div>
                  <h3 className="font-display text-xl text-forest">{member.name}</h3>
                  <p className="text-xs text-gold font-mono tracking-wide mt-0.5 mb-3">{member.title}</p>
                  <p className="text-sm text-ink/65 leading-relaxed mb-4">{member.description}</p>

                  {/* Contact icons */}
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={`tel:+${member.phoneLink}`}
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-forest/15 text-ink/50 hover:bg-forest hover:text-cream hover:border-forest transition-all"
                      aria-label={`Call ${member.name}`}
                    >
                      <Phone size={15} />
                    </a>
                    <a
                      href={`https://wa.me/${member.phoneLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-forest/15 text-ink/50 hover:bg-[#4caf6e] hover:text-white hover:border-[#4caf6e] transition-all"
                      aria-label={`WhatsApp ${member.name}`}
                    >
                      {WA_SVG}
                    </a>
                  </div>
                  <p className="font-mono text-xs text-ink/35 mt-3">{member.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="py-14 md:py-24 px-4 md:px-6 bg-[#eee9df]">
          <div className="max-w-3xl mx-auto text-center reveal">
            <div className="warm-divider mx-auto mb-6" />
            <blockquote className="font-display text-3xl md:text-5xl text-forest leading-tight mb-4">
              "Come as a guest,
              <br />
              <span className="italic text-gold">leave as family."</span>
            </blockquote>
            <p className="text-sm text-ink/50 mb-8">— The Mehmaan Manor Promise</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/918828352311"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-[#1a7a3a] bg-[#dcf5e5] hover:bg-[#c8efda] transition-colors min-h-[52px]"
              >
                {WA_SVG}
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold text-forest bg-[#eee9df] border border-forest/20 hover:bg-[#e0d9cc] transition-colors min-h-[52px]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
