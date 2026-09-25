"use client";

import { useState } from "react";

type ScheduleItem = {
  id: string;
  weekday: number;
  startsAt: string;
  endsAt: string;
  room: string | null;
  modalityName: string;
};

type ScheduleGridProps = {
  items: ScheduleItem[];
  compact?: boolean;
};

const days = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function ScheduleGrid({
  items,
  compact = false,
}: ScheduleGridProps) {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="schedule-wrap">
      <div className="schedule-tabs" role="tablist" aria-label="Dias da semana">
        {days.map((day, index) => (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={activeDay === index}
            className={activeDay === index ? "active" : ""}
            onClick={() => setActiveDay(index)}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="schedule-grid">
        {(compact ? [activeDay] : days.map((_, index) => index)).map((day) => (
          <section
            key={day}
            className={`schedule-day ${
              day === activeDay ? "is-active" : ""
            }`}
          >
            <h3>{days[day]}</h3>
            <div className="schedule-list">
              {items
                .filter((item) => item.weekday === day)
                .map((item) => (
                  <article className="slot" key={item.id}>
                    <strong>
                      {String(item.startsAt).slice(0, 5)}–{String(item.endsAt).slice(0, 5)}
                    </strong>
                    <span>{item.modalityName}</span>
                    <small>{item.room || "Sala a confirmar"}</small>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
