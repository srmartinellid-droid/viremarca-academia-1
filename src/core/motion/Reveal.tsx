"use client";

import type { ReactNode } from "react";
import { useReveal } from "./useReveal";

type RevealProps = {
  children: ReactNode;
  type?: "up" | "fade" | "scale";
  className?: string;
};

export function Reveal({ children, type = "up", className = "" }: RevealProps) {
  useReveal();
  return (
    <div className={"reveal reveal-" + type + " " + className} data-reveal={type}>
      {children}
    </div>
  );
}
