"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { OnboardingFlow } from "@/components/app/OnboardingFlow";
import { getOnboardingCompletedAt, isAuthenticated } from "@/lib/storage";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authenticated = typeof window !== "undefined" && isAuthenticated();
  const [showOnboarding, setShowOnboarding] = useState(() => (typeof window !== "undefined" ? !getOnboardingCompletedAt() : false));

  useEffect(() => {
    if (!authenticated) {
      router.replace("/");
    }
  }, [authenticated, router]);

  if (!authenticated) return null;
  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }
  return <AppShell>{children}</AppShell>;
}
