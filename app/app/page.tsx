"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { Calendar, ChevronRight, ChevronLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Modal } from "@/components/Modal";
import { DiaryInput } from "@/components/DiaryInput";
import { dismissExportReminderFor30Days, getEntries, markExportedNow, shouldShowExportReminder } from "@/lib/storage";
import { useLanguage } from "@/lib/useLanguage";
import { aggregateMoodTrend } from "@/lib/chart";
import { generateWeeklySummary } from "@/lib/summary";
import { legacyMoodToMoodValue, moodToColor, moodToEmoji } from "@/lib/mood";
import { DiaryEntry } from "@/lib/types";
import { buildKpis, getRecentEntryMoodMarker } from "@/lib/dashboard";
import Link from "next/link";
import { ScopeNotice } from "@/components/safety/ScopeNotice";

export default function AppDashboardPage() {
  const { t, language } = useLanguage();
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getEntries());
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [calendarSheet, setCalendarSheet] = useState<{ mode: "read" | "create"; day: string } | null>(null);
  const [mobileMonthOpen, setMobileMonthOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const trend = useMemo(() => aggregateMoodTrend(entries, language), [entries, language]);
  const summary = generateWeeklySummary(entries, language);
  const showExportReminder = shouldShowExportReminder();
  const todayKey = toDayKey(new Date());
  const filteredTrend = trend.slice(-range);
  const energyTrend = buildEnergyTrend(entries, language).slice(-range);
  const recentEntries = entries.slice(0, 5);
  const monthlyTagRows = buildThemeRows(entries, calendarMonth);
  const calendarCells = buildCalendarCells(calendarMonth, entries);
  const calendarStats = buildCalendarStats(calendarMonth, entries);
  const kpis = buildKpis(entries);
  const rangeOptions = [
    { value: 7 as const, label: t.timeRange7 },
    { value: 30 as const, label: t.timeRange30 },
    { value: 90 as const, label: t.timeRange90 },
  ];
  const weekdayLabels = [t.weekdayMon, t.weekdayTue, t.weekdayWed, t.weekdayThu, t.weekdayFri, t.weekdaySat, t.weekdaySun];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="space-y-4">
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
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-12">
        <KpiCard title="Среднее настроение" value={kpis.avgMood.value} caption={kpis.avgMood.caption} progress={kpis.avgMood.progress} ariaLabel={kpis.avgMood.ariaLabel} />
        <KpiCard title="Изменение за неделю" value={kpis.delta.value} caption={kpis.delta.caption} progress={kpis.delta.progress} icon={kpis.delta.icon} valueClass={kpis.delta.valueClass} ariaLabel={kpis.delta.ariaLabel} />
        <KpiCard title="Самая частая эмоция" value={kpis.emotion.value} caption={kpis.emotion.caption} progress={kpis.emotion.progress} emoji={kpis.emotion.emoji} ariaLabel={kpis.emotion.ariaLabel} />
        <KpiCard title="Серия дней" value={kpis.streak.value} caption={kpis.streak.caption} progress={kpis.streak.progress} ariaLabel={kpis.streak.ariaLabel} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="min-w-0 overflow-visible lg:col-span-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Динамика настроения</h2>
            <SegmentedControl value={range} onChange={(value) => setRange(value as 7 | 30 | 90)} options={rangeOptions} ariaLabel="Период графика настроения" />
          </div>
          <div className="mt-4 h-64 pl-1">
            {filteredTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredTrend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                  <YAxis domain={[1, 5]} width={36} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                  <Tooltip content={<ChartTooltip entries={entries} />} />
                  <Area type="monotone" dataKey="score" stroke="var(--color-primary-500)" strokeWidth={2.5} fill="url(#moodFill)" activeDot={{ r: 3, fill: "var(--color-primary-500)" }} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">{t.notEnoughData}</p>
            )}
          </div>
        </Card>
        <Card className="min-w-0 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Календарь</h2>
            <Calendar size={18} className="text-[var(--color-text-muted)]" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button type="button" aria-label="Предыдущий месяц" onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}><ChevronLeft size={18} /></button>
            <p className="text-sm font-medium">{monthLabel(calendarMonth, language)}</p>
            <button type="button" aria-label="Следующий месяц" onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}><ChevronRight size={18} /></button>
          </div>
          <div className="mt-3 md:hidden">
            <button type="button" onClick={() => setMobileMonthOpen((v) => !v)} className="text-xs text-[var(--color-primary-600)] underline">
              {mobileMonthOpen ? "Скрыть месяц" : "Открыть месяц"}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-[var(--color-text-muted)]">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <CalendarGrid
            cells={calendarCells}
            todayKey={todayKey}
            compactWeek={isMobile && !mobileMonthOpen}
            onSelect={(day) => {
              const entry = entries.find((item) => item.date.slice(0, 10) === day);
              if (entry) {
                setCalendarSheet({ mode: "read", day });
                return;
              }
              if (day <= todayKey) {
                setCalendarSheet({ mode: "create", day });
              }
            }}
          />
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--color-text-muted)]">
            <span>Записей: {calendarStats.entries}</span>
            <span>Средняя оценка: {calendarStats.avg}</span>
            <span>Самые частые эмоции: {calendarStats.topEmotions}</span>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="min-w-0 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Последние записи</h2>
            <Link href="/app/journal" className="text-sm text-[var(--color-primary-600)]">Все записи →</Link>
          </div>
          {recentEntries.length ? (
            <div className="mt-3 divide-y divide-[var(--color-border)]">
              {recentEntries.map((entry) => (
                <button key={entry.id} type="button" onClick={() => setCalendarSheet({ mode: "read", day: entry.date.slice(0, 10) })} className="grid w-full grid-cols-[100px_1fr_auto_auto] items-center gap-3 py-3 text-left">
                  <span className="text-sm text-[var(--color-text-muted)]">{new Date(entry.date).toLocaleDateString(language === "ru" ? "ru-RU" : "en-US")}</span>
                  <span className="truncate text-sm">{entry.text.slice(0, 80)}</span>
                  <span>{getRecentEntryMoodMarker(entry, language)}</span>
                  <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-[var(--color-text-muted)]">Здесь будут последние записи.</p>
              <Button className="mt-3" onClick={() => window.dispatchEvent(new CustomEvent("minddiary:open-writer"))}>{t.writeToday}</Button>
            </div>
          )}
        </Card>
        <Card className="min-w-0 lg:col-span-4">
          <h2 className="text-lg font-semibold">Сводка за неделю</h2>
          <p className="mt-2 text-sm">{summary.headline}</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--color-text-muted)]">
            {summary.observations.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="mt-2 text-sm">{summary.suggestion ?? "Сделайте ещё несколько записей, чтобы появились наблюдения."}</p>
          <ScopeNotice text="Это автоматическая сводка, не консультация." className="mt-3" />
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="min-w-0 lg:col-span-6">
          <h2 className="text-lg font-semibold">Темы за месяц</h2>
          {monthlyTagRows.length ? (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTagRows} layout="vertical" margin={{ left: 14, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} width={96} />
                  <Bar dataKey="count" fill="var(--color-primary-500)" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">Пока недостаточно тегов с уверенностью 0.6+, продолжайте записи.</p>
          )}
        </Card>
        <Card className="min-w-0 overflow-visible lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Энергия</h2>
            <SegmentedControl value={range} onChange={(value) => setRange(value as 7 | 30 | 90)} options={rangeOptions} ariaLabel="Период графика энергии" />
          </div>
          <div className="mt-4 h-56 pl-1">
            {energyTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyTrend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b7cff" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#8b7cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                  <YAxis domain={[1, 5]} width={36} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#8b7cff" strokeWidth={2.5} fill="url(#energyFill)" activeDot={{ r: 3, fill: "#8b7cff" }} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">Энергия пока не отмечалась в записях.</p>
            )}
          </div>
        </Card>
      </section>
      <Modal open={Boolean(calendarSheet)} onClose={() => setCalendarSheet(null)} title={calendarSheet?.mode === "read" ? "Запись дня" : "Новая запись"}>
        {calendarSheet?.mode === "read" ? (
          <ReadEntryContent entry={entries.find((entry) => entry.date.slice(0, 10) === calendarSheet.day) ?? null} language={language} />
        ) : calendarSheet ? (
          <DiaryInput
            editingEntry={null}
            initialDate={calendarSheet.day}
            onEntryAdded={(entry) => {
              setEntries((prev) => [entry, ...prev]);
              setCalendarSheet({ mode: "read", day: entry.date.slice(0, 10) });
            }}
            onEntryUpdated={() => undefined}
            onDone={() => setCalendarSheet(null)}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function KpiCard({
  title,
  value,
  caption,
  progress,
  ariaLabel,
  valueClass,
  icon,
  emoji,
}: {
  title: string;
  value: string;
  caption: string;
  progress: number;
  ariaLabel: string;
  valueClass?: string;
  icon?: "up" | "down";
  emoji?: string;
}) {
  return (
    <Card className="relative min-h-[150px] min-w-0 lg:col-span-3" padding="md" role="status" aria-label={ariaLabel}>
      <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
      <div className="mt-2 flex items-center gap-2">
        {emoji ? <span className="text-xl">{emoji}</span> : null}
        {icon === "up" ? <TrendingUp size={16} className="text-[var(--color-success-500)]" /> : null}
        {icon === "down" ? <TrendingDown size={16} className="text-[var(--color-warning-500)]" /> : null}
        <p className={`text-[var(--fs-2xl)] font-[var(--fw-semibold)] ${valueClass ?? ""}`}>{value}</p>
      </div>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">{caption}</p>
      <Ring progress={progress} />
    </Card>
  );
}

function Ring({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(progress, 1));
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="absolute right-5 top-5">
      <circle cx="28" cy="28" r="22" stroke="var(--color-primary-100)" strokeWidth="6" fill="none" />
      <circle cx="28" cy="28" r="22" stroke="var(--color-primary-500)" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 22}`} strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct)}`} transform="rotate(-90 28 28)" />
    </svg>
  );
}

function ReadEntryContent({ entry, language }: { entry: DiaryEntry | null; language: "ru" | "en" }) {
  if (!entry) return <p className="text-sm text-[var(--color-text-muted)]">Запись за выбранный день не найдена.</p>;
  return (
    <div className="space-y-2 text-sm">
      <p className="text-[var(--color-text-muted)]">{new Date(entry.date).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}</p>
      <p>{entry.text}</p>
      <p className="text-[var(--color-text-muted)]">Настроение: {moodToEmoji(legacyMoodToMoodValue(entry.mood))}</p>
    </div>
  );
}

function ChartTooltip({ active, payload, label, entries }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string; entries: DiaryEntry[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const entry = entries.find((item) => {
    const day = new Date(item.date).toLocaleDateString("ru-RU");
    return day === label;
  });
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 shadow-[var(--shadow-card)]">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="text-sm font-semibold">Настроение: {point?.value ?? "—"}</p>
      <p className="text-xs text-[var(--color-text-muted)]">Энергия: {entry?.energy ?? "—"}</p>
      <p className="mt-1 text-xs">{entry?.text?.slice(0, 50) ?? ""}</p>
    </div>
  );
}

function CalendarGrid({
  cells,
  todayKey,
  onSelect,
  compactWeek,
}: {
  cells: Array<{ key: string; day: number; inMonth: boolean; mood: number | null }>;
  todayKey: string;
  onSelect: (day: string) => void;
  compactWeek: boolean;
}) {
  const visibleCells = compactWeek ? cells.slice(0, 7) : cells;
  const moveFocus = (currentIndex: number, delta: number) => {
    const nextIndex = currentIndex + delta;
    const nextCell = visibleCells[nextIndex];
    if (!nextCell) return;
    const button = document.querySelector<HTMLButtonElement>(`button[data-day-key="${nextCell.key}"]`);
    button?.focus();
  };
  return (
    <div className="mt-2 grid grid-cols-7 gap-1" role="grid">
      {visibleCells.map((cell, index) => (
        <button
          key={cell.key}
          type="button"
          role="gridcell"
          data-day-key={cell.key}
          onClick={() => onSelect(cell.key)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") moveFocus(index, 1);
            if (event.key === "ArrowLeft") moveFocus(index, -1);
            if (event.key === "ArrowDown") moveFocus(index, 7);
            if (event.key === "ArrowUp") moveFocus(index, -7);
          }}
          className={`relative h-9 rounded-[var(--radius-sm)] text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] ${cell.inMonth ? "text-[var(--color-text)]" : "text-[var(--color-text-subtle)]"} ${cell.key === todayKey ? "ring-2 ring-[var(--color-primary-500)]" : "hover:bg-[var(--color-primary-100)]"}`}
        >
          {cell.day}
          {cell.mood ? <span className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full" style={{ backgroundColor: moodToColor(cell.mood as 1 | 2 | 3 | 4 | 5) }} /> : null}
        </button>
      ))}
    </div>
  );
}


function buildEnergyTrend(entries: DiaryEntry[], language: "ru" | "en") {
  const grouped = new Map<string, DiaryEntry[]>();
  entries.forEach((entry) => {
    const key = entry.date.slice(0, 10);
    grouped.set(key, [...(grouped.get(key) ?? []), entry]);
  });
  const locale = language === "ru" ? "ru-RU" : "en-US";
  return [...grouped.entries()].sort((a, b) => (a[0] > b[0] ? 1 : -1)).map(([key, bucket]) => ({
    key,
    label: new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(new Date(key)),
    score: Number((bucket.reduce((sum, item) => sum + item.energy, 0) / bucket.length).toFixed(1)),
  }));
}

function buildThemeRows(entries: DiaryEntry[], month: Date) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    const date = new Date(entry.date);
    if (date < monthStart || date > monthEnd) return;
    entry.tags.forEach((tag, index) => {
      if ((entry.tagConfidences?.[index] ?? 1) < 0.6) return;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
}

function buildCalendarCells(month: Date, entries: DiaryEntry[]) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const startDay = (start.getDay() + 6) % 7;
  const firstCell = addDays(start, -startDay);
  return Array.from({ length: 42 }).map((_, index) => {
    const date = addDays(firstCell, index);
    const key = toDayKey(date);
    const dayEntries = entries.filter((entry) => entry.date.slice(0, 10) === key);
    const mood = dayEntries.length ? Math.round(dayEntries.reduce((sum, entry) => sum + legacyMoodToMoodValue(entry.mood), 0) / dayEntries.length) : null;
    return { key, day: date.getDate(), inMonth: date.getMonth() === month.getMonth(), mood };
  });
}

function buildCalendarStats(month: Date, entries: DiaryEntry[]) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthEntries = entries.filter((entry) => {
    const date = new Date(entry.date);
    return date >= monthStart && date <= monthEnd;
  });
  const avg = monthEntries.length ? (monthEntries.reduce((sum, entry) => sum + legacyMoodToMoodValue(entry.mood), 0) / monthEntries.length).toFixed(1) : "—";
  const top = buildKpis(monthEntries).emotion.caption || "—";
  return { entries: monthEntries.length, avg, topEmotions: top };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthLabel(date: Date, language: "ru" | "en") {
  return new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-US", { month: "long", year: "numeric" }).format(date);
}
