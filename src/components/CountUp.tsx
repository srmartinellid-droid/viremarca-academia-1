"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ value, suffix }: { value: string; suffix?: string | null }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = Number(value.replace(/\D/g, ""));
    if (!Number.isFinite(target)) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(String(Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix || ""}
    </span>
  );
}
