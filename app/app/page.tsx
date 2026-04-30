"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Heart, Leaf, LineChart, Plus, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { dismissExportReminderFor30Days, getEntries, markExportedNow, shouldShowExportReminder } from "@/lib/storage";
import { aggregateMoodTrend } from "@/lib/chart";
import { buildKpis } from "@/lib/dashboard";
import { generateWeeklySummary } from "@/lib/summary";
import { useLanguage } from "@/lib/useLanguage";
import { DiaryEntry } from "@/lib/types";

export default function AppDashboardPage() {
  /*
    DashboardTree
    - DashboardRoot
      - ExportReminderCard?
      - HeroSection
        - HeroContent
        - HeroIllustration
      - KpiGrid
        - AvgMoodCard
        - WeekDeltaCard
        - TopEmotionCard
        - StreakCard
      - MainGrid
        - MoodTrendCard
          - SegmentedControl
          - MoodChart
        - ObservationCard
          - SummaryText
          - ObservationIllustration
          - AnalyticsButton
          - ScopeMicrocopy
  */
  const { t, language } = useLanguage();
  const [entries] = useState<DiaryEntry[]>(() => getEntries());
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const trend = useMemo(() => aggregateMoodTrend(entries, language), [entries, language]);
  const summary = generateWeeklySummary(entries, language);
  const kpis = buildKpis(entries);
  const showExportReminder = shouldShowExportReminder();

  const rangeOptions = [
    { value: 7 as const, label: t.timeRange7 },
    { value: 30 as const, label: t.timeRange30 },
    { value: 90 as const, label: t.timeRange90 },
  ];

  const chartData = trend.slice(-range).map((point) => {
    const day = new Date(`${point.key}T00:00:00`);
    return {
      ...point,
      shortDate: new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-US", { day: "2-digit", month: "2-digit" }).format(day),
      score: Number(point.score.toFixed(1)),
      energy: getEnergyForDay(entries, point.key),
    };
  });
  const streakValue = Number(kpis.streak.value);
  const deltaCaption = kpis.delta.value === "—" ? "Нужна ещё одна неделя данных" : "по сравнению с прошлой неделей";
  const streakCaption = streakValue < 3 ? "запишите 3 дня подряд, чтобы начать серию" : "дней подряд";
  const observationText = summary.suggestion ?? "Сделайте ещё несколько записей, чтобы появились наблюдения.";

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-4 px-6 pb-8 pt-6 md:px-8">
      {showExportReminder ? (
        <Card tone="muted">
          <p className="text-sm">{t.exportReminder}</p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${t.exportFileName}.json`;
                a.click();
                URL.revokeObjectURL(url);
                markExportedNow();
              }}
            >
              {t.exportNow}
            </Button>
            <Button variant="ghost" onClick={() => dismissExportReminderFor30Days()}>{t.hideInSession}</Button>
          </div>
        </Card>
      ) : null}

      <section className="grid items-center gap-8 pb-6 pt-2 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="mb-3 inline-flex items-center gap-1.5 text-[var(--fs-xs)] uppercase tracking-[1.5px] text-[var(--color-primary-500)]">
            <Sparkles size={14} />
            ВАШЕ НАСТРОЕНИЕ - ВАЖНО
          </div>
          <h1 className="text-[var(--fs-2xl)] font-[var(--fw-bold)] leading-tight text-[var(--color-text)] md:text-4xl lg:text-[44px]">
            Понимайте себя лучше
          </h1>
          <p
            className="text-[var(--fs-2xl)] font-[var(--fw-bold)] leading-tight md:text-4xl lg:text-[44px]"
            style={{ background: "var(--color-accent-gradient)", WebkitBackgroundClip: "text", color: "transparent" }}
          >
            Замечайте. Анализируйте. Растите.
          </p>
          <p className="mt-4 max-w-[520px] text-[var(--fs-base)] leading-[1.6] text-[var(--color-text-muted)]">
            MindDiary - дневник настроения, который помогает отслеживать эмоции, замечать паттерны и лучше понимать себя.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Plus size={16} />
              Записать сегодня
            </Button>
            <Link href="/app/analytics" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                <LineChart size={16} />
                Смотреть аналитику
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[280px] lg:col-span-2 lg:max-w-[240px] xl:max-w-[280px]">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at center, var(--color-primary-100), transparent 70%)" }} />
          <Image src="/assets/hero-brain.svg" alt="" aria-hidden width={280} height={280} className="relative mx-auto h-40 w-40 md:h-48 md:w-48 lg:h-60 lg:w-60 xl:h-72 xl:w-72" />
          <div className="pointer-events-none absolute -left-1 top-10 rounded-full border border-[var(--color-border)] bg-white p-2 shadow-[var(--shadow-card)]"><LineChart size={14} className="text-[var(--color-primary-500)]" /></div>
          <div className="pointer-events-none absolute left-2 top-1/2 rounded-full border border-[var(--color-border)] bg-white p-2 shadow-[var(--shadow-card)]"><Heart size={14} className="text-[var(--color-primary-500)]" /></div>
          <div className="pointer-events-none absolute bottom-8 right-0 rounded-full border border-[var(--color-border)] bg-white p-2 shadow-[var(--shadow-card)]"><Leaf size={14} className="text-[var(--color-primary-500)]" /></div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Среднее настроение" value={kpis.avgMood.value} caption={kpis.avgMood.caption} progress={kpis.avgMood.progress} />
        <KpiCard title="Изменение за неделю" value={kpis.delta.value} caption={deltaCaption} progress={kpis.delta.value === "—" ? 0 : kpis.delta.progress} />
        <KpiCard title="Самая частая эмоция" value={kpis.emotion.value} caption={kpis.emotion.caption} progress={kpis.emotion.value === "—" ? 0 : kpis.emotion.progress} emoji={kpis.emotion.value === "Несколько" ? "🙂" : undefined} />
        <KpiCard title="Серия дней" value={kpis.streak.value} caption={streakCaption} progress={streakValue < 3 ? Math.max(0, streakValue / 3) : kpis.streak.progress} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="min-w-0 overflow-visible lg:col-span-8" padding="md">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[var(--fs-lg)] font-[var(--fw-semibold)] text-[var(--color-text)]">Динамика настроения</h2>
            <SegmentedControl value={range} onChange={(value) => setRange(value as 7 | 30 | 90)} options={rangeOptions} ariaLabel="Период графика" />
          </div>
          <div className="mt-4 h-72 pl-1">
            {chartData.length < 2 ? (
              <p className="text-sm text-[var(--color-text-muted)]">{t.statsNeedDifferentDays}</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodFillRedesign" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="shortDate" axisLine={false} tickLine={false} minTickGap={22} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} width={36} axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                  <Tooltip content={<MoodTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-primary-500)"
                    strokeWidth={2.5}
                    fill="url(#moodFillRedesign)"
                    dot={{ r: 4, fill: "var(--color-primary-500)" }}
                    activeDot={{ r: 4, fill: "var(--color-primary-500)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="min-w-0 lg:col-span-4" padding="md">
          <h3 className="text-[var(--fs-base)] font-[var(--fw-semibold)] text-[var(--color-text)]">Наблюдение за последние 30 дней</h3>
          <p className="mt-3 text-[var(--fs-sm)] leading-[1.6] text-[var(--color-text-muted)]">
            {observationText}
          </p>
          <div className="mt-4 flex justify-center">
            <Image src="/assets/observation-brain.svg" alt="" aria-hidden width={120} height={120} className="h-[120px] w-[120px]" />
          </div>
          <Link href="/app/analytics" className="mt-4 block">
            <Button variant="secondary" className="w-full">
              <LineChart size={16} />
              Смотреть всю аналитику
            </Button>
          </Link>
          <p className="mt-3 text-[var(--fs-xs)] text-[var(--color-text-subtle)]">Это автоматическая сводка, не консультация.</p>
        </Card>
      </section>
    </div>
  );
}

function KpiCard({ title, value, caption, progress, emoji }: { title: string; value: string; caption: string; progress: number; emoji?: string }) {
  return (
    <Card className="min-w-0" padding="md">
      <div className="flex items-center justify-between">
        <p className="text-[var(--fs-sm)] font-[var(--fw-medium)] text-[var(--color-text-muted)]">{title}</p>
        <Ring value={progress} />
      </div>
      <p className="mt-3 flex items-center gap-2 text-[var(--fs-2xl)] font-[var(--fw-semibold)] text-[var(--color-text)]">{emoji ? <span>{emoji}</span> : null}{value}</p>
      <p className="mt-1.5 text-[var(--fs-xs)] text-[var(--color-text-muted)]">{caption}</p>
    </Card>
  );
}

function Ring({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r={radius} fill="none" stroke="var(--color-primary-100)" strokeWidth="4" />
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="var(--color-primary-500)"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - clamped)}
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}

function MoodTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { shortDate: string; score: number; energy: number | null } }> }) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 shadow-[var(--shadow-card)]">
      <p className="text-sm font-[var(--fw-semibold)] text-[var(--color-text)]">{item.shortDate}</p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">Настроение: {item.score}</p>
      <p className="text-xs text-[var(--color-text-muted)]">Энергия: {item.energy ?? "-"}</p>
    </div>
  );
}

function getEnergyForDay(entries: DiaryEntry[], dayKey: string): number | null {
  const values = entries.filter((entry) => entry.date.slice(0, 10) === dayKey).map((entry) => entry.energy);
  if (!values.length) return null;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Number(avg.toFixed(1));
}
