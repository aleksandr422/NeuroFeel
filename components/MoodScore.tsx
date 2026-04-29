"use client";

import { MOOD_SCALE_MAX, Mood, moodToEmoji } from "@/lib/mood";

export function MoodScore({ mood }: { mood: Mood }) {
  const progressWidth = Math.round((mood / MOOD_SCALE_MAX) * 100);
  return (
    <div>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {moodToEmoji(mood)} {mood} / {MOOD_SCALE_MAX}
      </p>
      <div className="mt-3 rounded-xl bg-gradient-to-r from-violet-100 via-indigo-100 to-violet-50 p-2">
        <div className="h-2 rounded-full bg-white/80">
          <div className="h-2 rounded-full bg-gradient-to-r from-[#6D5EF5] to-[#A78BFA]" style={{ width: `${progressWidth}%` }} />
        </div>
      </div>
    </div>
  );
}
