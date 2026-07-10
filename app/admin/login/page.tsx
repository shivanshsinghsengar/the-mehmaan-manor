"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication - any credentials work in prototype
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-forest-deep text-cream p-12 flex-col justify-between">
        <div>
          <Logo size={72} className="mb-6" />
          <h1 className="text-4xl font-display mb-4 text-cream">The Mehmaan Manor</h1>
          <p className="text-cream/70 text-lg">
            Admin panel for managing properties, bookings, and guest relations.
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-display text-2xl italic text-gold">
            "Come as a guest,
          </p>
          <p className="font-display text-2xl italic text-cream">
            leave as family."
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">

          {/* Back to Home */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-forest/60 hover:text-forest transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              Back to Website
            </Link>
          </div>
          <div className="lg:hidden mb-8">
            <Logo size={48} className="mb-4" />
            <h1 className="text-3xl font-display text-forest">Admin Login</h1>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-display text-forest mb-2">
              Welcome Back
            </h2>
            <p className="text-ink/70">Sign in to manage your properties</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-forest mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@mehmaanmanor.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-forest"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-gold hover:text-forest transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-gold border-neutral-300 rounded focus:ring-gold"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-ink/70"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-forest/5 rounded text-sm">
            <p className="font-mono text-xs text-ink/50 mb-2">
              Demo Credentials:
            </p>
            <p className="text-ink/70">
              Email: <span className="font-mono">demo@mehmaanmanor.com</span>
            </p>
            <p className="text-ink/70">
              Password: <span className="font-mono">demo123</span>
            </p>
            <p className="text-ink/50 text-xs mt-2">
              (Any credentials work in this prototype)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
