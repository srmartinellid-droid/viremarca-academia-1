"use client";

import { useEffect, useState } from "react";
import type { OpeningHours } from "@/db/schema/content";

type Exception = {
  date: string;
  closed: boolean;
  open: string | null;
  close: string | null;
};

type Status = { open: boolean; text: string };

const days = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];

function getParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map((item) => [item.type, item.value]));
}

function calculate(hours: OpeningHours | null | undefined, exceptions: Exception[], now: Date): Status {
  const parts = getParts(now);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = dayNames.indexOf(parts.weekday);
  const date = parts.year + "-" + parts.month + "-" + parts.day;
  const keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const exception = exceptions.find((item) => item.date === date);
  const ranges = exception?.closed
    ? []
    : exception?.open && exception.close
      ? [{ open: exception.open, close: exception.close }]
      : hours?.[keys[day]] || [];
  const minute = Number(parts.hour) * 60 + Number(parts.minute);
  const current = ranges.find(
    (range) => toMinutes(range.open) <= minute && minute < toMinutes(range.close),
  );
  if (current) return { open: true, text: "ABERTO AGORA · fecha às " + current.close.slice(0, 5) };

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7;
    const nextRanges = hours?.[keys[nextDay]] || [];
    if (nextRanges.length) {
      return {
        open: false,
        text: "FECHADO · abre " + days[nextDay] + " às " + nextRanges[0].open.slice(0, 5),
      };
    }
  }
  return { open: false, text: "FECHADO · sem horário cadastrado" };
}

function toMinutes(value: string) {
  const [hours, minutes] = value.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

export function OpeningStatus({
  hours,
  exceptions,
  className = "status-open",
}: {
  hours: OpeningHours | null | undefined;
  exceptions: Exception[];
  className?: string;
}) {
  const [status, setStatus] = useState<Status>(() => calculate(hours, exceptions, new Date()));

  useEffect(() => {
    const tick = () => setStatus(calculate(hours, exceptions, new Date()));
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [hours, exceptions]);

  return <p className={className}>{status.open ? "● " : "○ "}{status.text}</p>;
}
