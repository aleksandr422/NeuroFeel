"use client";

import { KeyboardEvent } from "react";
import { Mood, moodToEmoji } from "@/lib/mood";

const VALUES: Mood[] = [1, 2, 3, 4, 5];

interface MoodPickerProps {
  value: Mood;
  onChange: (value: Mood) => void;
  labels: Record<Mood, string>;
}

export function MoodPicker({ value, onChange, labels }: MoodPickerProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? Math.min(5, value + 1) : Math.max(1, value - 1);
    onChange(next as Mood);
  };

  return (
    <div role="radiogroup" aria-label="Mood picker" onKeyDown={onKeyDown} className="mt-2 flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50/40 p-2">
      {VALUES.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={labels[item]}
            onClick={() => onChange(item)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl transition ${
              active
                ? "bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] text-white shadow-lg shadow-violet-200/70"
                : "bg-white text-slate-700 hover:bg-violet-100"
            }`}
          >
            <span aria-hidden>{moodToEmoji(item)}</span>
          </button>
        );
      })}
    </div>
  );
}
