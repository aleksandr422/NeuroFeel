"use client";

import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { localizeEmotion, localizeProblem, localizeTag } from "@/lib/localize";
import { NavBar } from "@/components/NavBar";
import { getEntries } from "@/lib/storage";
import { DiaryEntry } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

export default function StatisticsPage() {
  const [entries] = useState<DiaryEntry[]>(() => getEntries());
  const { t, language } = useLanguage();

  const weeklyEmotionData = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const counts = new Map<string, number>();
    entries
      .filter((entry) => new Date(entry.date) >= sevenDaysAgo)
      .forEach((entry) =>
        entry.emotions.forEach((emotion, index) => {
          const label = localizeEmotion(emotion, language, entry.emotionLabels?.[index]);
          counts.set(label, (counts.get(label) ?? 0) + 1);
        }),
      );

    return normalizeChartData(counts).slice(0, 6);
  }, [entries, language]);

  const emotionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) =>
      entry.emotions.forEach((emotion, index) => {
        const label = localizeEmotion(emotion, language, entry.emotionLabels?.[index]);
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }),
    );
    return normalizeChartData(counts).slice(0, 5);
  }, [entries, language]);

  const problemCounts = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      if (entry.problem) {
        const label = localizeProblem(entry.problem, language, entry.problemLabel);
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
    });
    return normalizeChartData(counts).slice(0, 5);
  }, [entries, language]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) =>
      entry.tags.forEach((tag, index) => {
        const label = localizeTag(tag, language, entry.tagLabels?.[index]);
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }),
    );
    return normalizeChartData(counts).slice(0, 5);
  }, [entries, language]);

  const moodTrendData = useMemo(() => {
    const moodToScore: Record<DiaryEntry["mood"], number> = {
      sad: 1,
      anxious: 2,
      angry: 2,
      tired: 2,
      neutral: 3,
      happy: 5,
    };

    return [...entries]
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString(language === "ru" ? "ru-RU" : "en-US", {
          day: "2-digit",
          month: "2-digit",
        }),
        score: moodToScore[entry.mood],
      }));
  }, [entries, language]);

  const hasChartData = emotionCounts.length > 0 || problemCounts.length > 0 || tagCounts.length > 0;

  return (
    <div className="min-h-screen bg-[#f8f3ea]">
      <NavBar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <section className="rounded-3xl border border-[#eadfcf] bg-white p-4 shadow-sm md:p-6">
          <h2 className="text-xl font-semibold text-slate-900">{t.weeklyEmotionDistribution}</h2>

          {weeklyEmotionData.length === 0 ? (
            <p className="mt-3 text-slate-600">{t.weeklyEmotionEmpty}</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="mx-auto h-[260px] w-[260px] overflow-hidden md:h-[300px] md:w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weeklyEmotionData}
                      dataKey="percentage"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="88%"
                      paddingAngle={2}
                      cornerRadius={10}
                      stroke="none"
                    >
                      {weeklyEmotionData.map((item, index) => (
                        <Cell key={item.label} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, _name: string, payload: { payload: DonutDatum }) => [
                        `${value}%`,
                        payload.payload.label,
                      ]}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #eadfcf", background: "#fffdf8" }}
                      wrapperStyle={{ zIndex: 20 }}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-[34px] font-semibold">
                      100%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex w-full flex-col gap-1.5 self-stretch sm:max-w-[230px]">
                {weeklyEmotionData.map((item, index) => (
                  <div key={item.label} className="rounded-lg border border-[#efe4d5] bg-white/80 px-2.5 py-1.5 text-xs leading-tight">
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                      <p className="min-w-0 break-words font-medium [overflow-wrap:anywhere]">
                        {item.label} - {item.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {!hasChartData ? (
          <section className="rounded-3xl border border-[#eadfcf] bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{t.statistics}</h2>
            <p className="mt-3 text-slate-600">{t.statsEmptyDetailed}</p>
          </section>
        ) : (
          <>
            <section className="rounded-3xl border border-[#eadfcf] bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-semibold text-slate-900">{t.moodTrend}</h2>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrendData}>
                    <XAxis dataKey="date" tick={{ fill: "#7f8ba0", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} tick={{ fill: "#7f8ba0", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ stroke: "#d8c9b5", strokeWidth: 1 }}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #eadfcf", background: "#fffdf8" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#7b8cc8"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 0, fill: "#7b8cc8" }}
                      activeDot={{ r: 6, fill: "#6e7fba" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DonutStatsCard title={t.topEmotions} data={emotionCounts} totalLabel={t.total} />
              <DonutStatsCard title={t.topProblems} data={problemCounts} totalLabel={t.total} />
              <DonutStatsCard title={t.recurringTopics} data={tagCounts} totalLabel={t.total} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

type DonutDatum = {
  label: string;
  value: number;
  percentage: number;
};

const DONUT_COLORS = ["#BDA48C", "#DCC8A8", "#AFA7D8", "#94B8D8", "#D9AFC0", "#9FB7A0"];

function normalizeChartData(counts: Map<string, number>): DonutDatum[] {
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [, value]) => sum + value, 0);
  if (!total) return [];
  const withRawPercentages = sorted.map(([label, value], index) => {
    const rawPercentage = (value / total) * 100;
    const floored = Math.floor(rawPercentage);
    return {
      label,
      value,
      percentage: floored,
      remainder: rawPercentage - floored,
      index,
    };
  });

  const missing = 100 - withRawPercentages.reduce((sum, item) => sum + item.percentage, 0);
  if (missing > 0) {
    withRawPercentages
      .sort((a, b) => b.remainder - a.remainder)
      .slice(0, missing)
      .forEach((item) => {
        item.percentage += 1;
      });
  }

  return withRawPercentages
    .sort((a, b) => a.index - b.index)
    .map(({ label, value, percentage }) => ({ label, value, percentage }));
}

function DonutStatsCard({
  title,
  data,
  totalLabel,
}: {
  title: string;
  data: DonutDatum[];
  totalLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-[#eadfcf] bg-[#fffdfa] p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="mx-auto h-[180px] w-[180px] overflow-hidden sm:mx-0 sm:h-[200px] sm:w-[200px] lg:h-[240px] lg:w-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="86%"
                paddingAngle={2}
                cornerRadius={8}
                stroke="none"
              >
                {data.map((item, index) => (
                  <Cell key={item.label} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name: string, payload: { payload: DonutDatum }) => [
                  `${value} (${payload.payload.percentage}%)`,
                  payload.payload.label,
                ]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #eadfcf", background: "#fffdf8" }}
                wrapperStyle={{ zIndex: 20 }}
              />
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px] uppercase tracking-wide">
                {totalLabel}
              </text>
              <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-[28px] font-semibold">
                {data.reduce((sum, item) => sum + item.value, 0)}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-full flex-col gap-1.5 self-stretch sm:max-w-[210px]">
          {data.map((item, index) => (
            <div
              key={item.label}
              className="rounded-lg border border-[#efe4d5] bg-white/80 px-2.5 py-1.5 text-xs leading-tight"
            >
              <div className="flex items-start gap-2 text-slate-700">
                <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                <div className="min-w-0">
                  <p className="font-medium break-words [overflow-wrap:anywhere]">{item.label}</p>
                  <p className="mt-0.5 text-slate-600 break-words [overflow-wrap:anywhere]">
                    {item.value} ({item.percentage}%)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
