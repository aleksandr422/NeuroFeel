"use client";

export function StatsProgressNotice({ title, text, progress }: { title: string; text: string; progress: number }) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-lg shadow-violet-100/60">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
      <div className="mt-4 h-2 rounded-full bg-violet-100">
        <div className="h-2 rounded-full bg-gradient-to-r from-[#6D5EF5] to-[#A78BFA]" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
