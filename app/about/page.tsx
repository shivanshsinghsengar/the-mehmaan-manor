"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Button } from "@/components/ui/button";
import { TiltCard, Reveal3D, DepthText, ScrollProgressBar, Float } from "@/components/3d-effects";

const team = [
  {
    name: "Simran",
    title: "Your Host",
    phone: "+91 88283 52311",
    phoneLink: "918828352311",
    description:
      "The heart of Mehmaan Manor. Simran ensures every guest feels welcomed, cared for, and genuinely at home. She's the person who picks up when you call, remembers your preferences, and checks in to make sure everything is perfect.",
  },
  {
    name: "Vipin",
    title: "Property Manager",
    phone: "+91 87965 68003",
    phoneLink: "918796568003",
    description:
      "Behind every clean room and functional detail is Vipin. He oversees maintenance, inspects every check-in, and ensures the homes stay in pristine condition. If something needs fixing, he's on it before you notice.",
  },
  {
    name: "Jyoti",
    title: "Guest Relations",
    phone: "+91 87965 68002",
    phoneLink: "918796568002",
    description:
      "Your first point of contact for reservations, questions, and special requests. Jyoti coordinates bookings, answers inquiries, and makes sure your arrival is seamless. She's warm, efficient, and genuinely helpful.",
  },
];

export default function AboutPage() {
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

  return (
    <div className="min-h-screen bg-cream">
      <ScrollProgressBar />
      <Navigation />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-40 pb-24 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="font-mono text-gold text-sm tracking-widest uppercase mb-6 animate-fade-in">
              About Us
            </p>
            <DepthText
              as="h1"
              className="text-display font-display text-forest mb-6 animate-fade-up"
              color="oklch(0.75 0.12 85)"
            >
              More Than Hosts.
              <br />
              <span className="italic">Your Gurugram Family.</span>
            </DepthText>
            <p className="text-lg text-ink/80 max-w-2xl mx-auto animate-fade-up">
              The story behind The Mehmaan Manor — and the people who make it
              feel like home.
            </p>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="reveal space-y-6 text-lg text-ink/80 leading-relaxed">
              <p>
                <span className="text-gold italic font-display text-2xl">
                  Mehmaan
                </span>{" "}
                — it's a Hindi word that means "guest." But it means more than
                that. It carries a weight of cultural expectation: when someone
                is your <em>mehmaan</em>, you don't just provide a bed. You
                offer warmth, care, and genuine hospitality. You treat them like
                family.
              </p>
              <p>
                That's the foundation of The Mehmaan Manor. We started with a
                simple question: <em>What if short stays felt like coming home instead
                of checking into a hotel?</em> No sterile lobbies. No anonymous key
                cards. No customer service scripts. Just real people, real
                homes, and real hospitality.
              </p>
              <p>
                We have two properties in Gurugram, each with its own
                personality. Sushant Lok is peaceful and green — a retreat from
                the city's noise. Jharsa Village is cozy and connected — where
                you feel the pulse of local life. Both are thoughtfully
                designed, meticulously maintained, and genuinely cared for.
              </p>
              <p>
                Whether you're here for work, leisure, or a weekend escape —
                you're not a booking number. You're a <em>mehmaan</em>. And we take
                that seriously.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="arch-divider my-24" />

        {/* Our Values */}
        <section className="py-16 px-6 bg-forest/5">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-display font-display text-center text-forest mb-16 reveal">
              What We Believe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <Reveal3D delay={0} direction="up">
                <div className="text-center">
                  <div className="font-mono text-gold text-sm mb-3">01</div>
                  <h3 className="text-xl font-display text-forest mb-3">
                    Hospitality Over Business
                  </h3>
                  <p className="text-ink/70 text-sm leading-relaxed">
                    We're not running a hotel. We're opening our homes. That means
                    you get warmth, flexibility, and care — not corporate
                    policies.
                  </p>
                </div>
              </Reveal3D>
              <Reveal3D delay={0.15} direction="up">
                <div className="text-center">
                  <div className="font-mono text-gold text-sm mb-3">02</div>
                  <h3 className="text-xl font-display text-forest mb-3">
                    Details Matter
                  </h3>
                  <p className="text-ink/70 text-sm leading-relaxed">
                    From the thread count to the coffee brand — everything is
                    chosen with intention. You may not notice every detail, but
                    you'll feel it.
                  </p>
                </div>
              </Reveal3D>
              <Reveal3D delay={0.3} direction="up">
                <div className="text-center">
                  <div className="font-mono text-gold text-sm mb-3">03</div>
                  <h3 className="text-xl font-display text-forest mb-3">
                    Real People, Real Conversations
                  </h3>
                  <p className="text-ink/70 text-sm leading-relaxed">
                    When you call, you reach Simran, Vipin, or Jyoti — real
                    humans who genuinely care about your experience. No chatbots.
                    No scripts.
                  </p>
                </div>
              </Reveal3D>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-display font-display text-center text-forest mb-4 reveal">
              Meet the Team
            </h2>
            <p className="text-center text-ink/70 mb-16 reveal">
              The people who make every stay a Mehmaan experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <TiltCard
                  key={i}
                  intensity={10}
                  className="reveal text-center space-y-4 p-6 rounded-sm"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <Float amplitude={6} duration={3 + i * 0.5}>
                    <div className="w-32 h-32 mx-auto rounded-full bg-forest/10 flex items-center justify-center">
                      <span className="font-display text-4xl text-gold">
                        {member.name[0]}
                      </span>
                    </div>
                  </Float>
                  <div>
                    <h3 className="text-2xl font-display text-forest">
                      {member.name}
                    </h3>
                    <p className="font-mono text-sm text-gold mb-2">
                      {member.title}
                    </p>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed px-4">
                    {member.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <a
                      href={`tel:+${member.phoneLink}`}
                      className="inline-flex items-center justify-center w-10 h-10 border border-forest/20 text-forest hover:bg-forest hover:text-cream transition-colors"
                    >
                      <Phone size={16} />
                    </a>
                    <a
                      href={`https://wa.me/${member.phoneLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 border border-forest/20 text-forest hover:bg-forest hover:text-cream transition-colors"
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                  <p className="font-mono text-xs text-ink/50">{member.phone}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Final Quote */}
        <section className="py-32 px-6 bg-gold">
          <div className="container mx-auto max-w-4xl text-center reveal">
            <blockquote className="text-4xl md:text-5xl font-display leading-tight text-ink">
              "Come as a guest,
              <br />
              leave as family."
            </blockquote>
            <p className="mt-8 text-ink/70">— The Mehmaan Manor Promise</p>
            <div className="mt-12">
              <Button asChild size="lg" variant="default">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
