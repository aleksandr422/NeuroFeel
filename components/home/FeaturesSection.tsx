"use client";

import { HomeTranslation } from "@/components/home/types";

export function FeaturesSection({ t }: { t: HomeTranslation }) {
  const features = [
    { title: t.feature1Title, text: t.feature1Description, icon: "💗" },
    { title: t.feature2Title, text: t.feature2Description, icon: "🧠" },
    { title: t.feature3Title, text: t.feature3Description, icon: "💡" },
    { title: t.feature4Title, text: t.feature4Description, icon: "🔒" },
  ];

  return (
    <section id="features" className="space-y-7">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">{t.featuresEyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{t.featuresTitle}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/60 transition hover:-translate-y-1"
          >
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
