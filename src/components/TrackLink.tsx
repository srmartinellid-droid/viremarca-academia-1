"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function TrackLink({ href, name, props, children, className }: { href: string; name: string; props?: Record<string, string | number | boolean>; children: ReactNode; className?: string }) {
  async function track() {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, origin: "cta", pagePath: window.location.pathname, props }),
      keepalive: true,
    }).catch(() => undefined);
  }
  return <Link className={className} href={href} onClick={track}>{children}</Link>;
}
