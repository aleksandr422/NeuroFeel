"use client";

import { HomeTranslation } from "@/components/home/types";

export function StepsSection({ t }: { t: HomeTranslation }) {
  const steps = [
    { title: t.step1Title, description: t.step1Description, icon: "✍️" },
    { title: t.step2Title, description: t.step2Description, icon: "✨" },
    { title: t.step3Title, description: t.step3Description, icon: "📈" },
  ];

  return (
    <section id="how-it-works" className="space-y-7">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">{t.stepsEyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{t.stepsTitle}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/60 transition hover:-translate-y-1"
          >
            <span className="text-2xl">{step.icon}</span>
            <p className="mt-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
              {index + 1}
            </p>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
