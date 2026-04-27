"use client";

import { DiaryEntry } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

const moodToScore: Record<DiaryEntry["mood"], number> = {
  sad: 1,
  anxious: 2,
  angry: 2,
  neutral: 3,
  tired: 2,
  happy: 5,
};

export function MoodChart({ entries }: { entries: DiaryEntry[] }) {
  const { t } = useLanguage();
  const sorted = [...entries].sort((a, b) => (a.date > b.date ? 1 : -1));
  if (!sorted.length) {
    return <p className="text-sm text-slate-600">{t.notEnoughData}</p>;
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-semibold text-slate-900">{t.moodTrend}</h3>
      <div className="mt-3 flex items-end gap-2 overflow-x-auto">
        {sorted.map((entry) => (
          <div key={entry.id} className="flex min-w-10 flex-col items-center gap-1">
            <div className="w-6 rounded-t bg-gradient-to-t from-blue-400 to-purple-400" style={{ height: `${moodToScore[entry.mood] * 18}px` }} />
            <span className="text-[10px] text-slate-500">{new Date(entry.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
