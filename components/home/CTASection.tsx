"use client";

import Link from "next/link";
import { HomeTranslation } from "@/components/home/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function CTASection({ t }: { t: HomeTranslation }) {
  return (
    <Card tone="accent" className="shadow-xl shadow-violet-300/60" padding="lg">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold">{t.ctaTitle}</h2>
          <p className="mt-2 text-sm text-violet-100">{t.ctaSubtitle}</p>
        </div>
        <Link href="/diary"><Button variant="secondary" size="lg">{t.ctaButton}</Button></Link>
      </div>
    </Card>
  );
}
