"use client";

import { Card } from "@/components/ui/Card";

export default function ScopePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <h1 className="text-2xl font-semibold">Это не терапия</h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          MindDiary помогает замечать повторяющиеся паттерны в дневниковых записях. Сводки и подсказки автоматические, они не заменяют консультацию специалиста и экстренную помощь.
        </p>
      </Card>
    </main>
  );
}
