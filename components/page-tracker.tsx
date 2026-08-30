"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Drop this into any layout to silently track page views.
 * Fires once per pathname change, never blocks rendering.
 */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire and forget — don't await, don't surface errors to user
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
