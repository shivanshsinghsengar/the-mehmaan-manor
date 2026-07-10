"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Home,
  Users,
  MessageSquare,
  Image,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  LogOut,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Properties", href: "/admin/properties", icon: Home },
  { name: "Site Manager", href: "/admin/cms", icon: Layers },
  { name: "Guests", href: "/admin/guests", icon: Users },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-forest-deep text-cream transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-cream/10">
            <Link href="/admin" className="flex items-center space-x-3">
              <Logo size={38} className="flex-shrink-0" />
              <span className="font-display text-base text-cream">Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-cream"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded transition-colors",
                    isActive
                      ? "bg-gold text-ink font-medium"
                      : "text-cream/80 hover:bg-cream/10 hover:text-cream"
                  )}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-cream/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                <span className="font-display text-gold text-sm">S</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Simran</p>
                <p className="text-xs text-cream/60">Owner</p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full border-cream/20 text-cream hover:bg-cream/10"
            >
              <Link href="/admin/login">
                <LogOut size={14} className="mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-ink"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search bookings, guests..."
                className="pl-10 pr-4 py-2 w-80 border border-neutral-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative text-ink hover:text-gold transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-ink text-xs rounded-full flex items-center justify-center font-mono">
                3
              </span>
            </button>
            <Button size="sm" variant="gold" asChild>
              <Link href="/admin/bookings/new">
                <Plus size={16} className="mr-2" />
                New Booking
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
