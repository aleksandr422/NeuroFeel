"use client";

import { useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { getUserPreferences, saveUserPreferences } from "@/lib/storage";
import { UserPreferences } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

export default function Home() {
  const { t } = useLanguage();
  const initialPreferences = getUserPreferences();
  const [interestsInput, setInterestsInput] = useState(() => initialPreferences?.interests.join(", ") ?? "");
  const [lifestyle, setLifestyle] = useState<UserPreferences["lifestyle"]>(() => initialPreferences?.lifestyle ?? "mixed");
  const [goals, setGoals] = useState(() => initialPreferences?.goals ?? "");
  const [helps, setHelps] = useState<UserPreferences["helps"]>(() => initialPreferences?.helps ?? []);
  const [supportStyles, setSupportStyles] = useState<UserPreferences["supportStyles"]>(() => initialPreferences?.supportStyles ?? []);
  const [avoidSuggestions, setAvoidSuggestions] = useState(() => initialPreferences?.avoidSuggestions ?? "");
  const [ageGroup, setAgeGroup] = useState<UserPreferences["ageGroup"]>(() => initialPreferences?.ageGroup);
  const [gender, setGender] = useState<UserPreferences["gender"]>(() => initialPreferences?.gender);
  const [savedPreferences, setSavedPreferences] = useState<UserPreferences | null>(() => initialPreferences);
  const [isEditing, setIsEditing] = useState(() => !initialPreferences);
  const lifestyleLabelMap: Record<UserPreferences["lifestyle"], string> = {
    student: t.lifestyleStudent,
    working: t.lifestyleWorking,
    mixed: t.lifestyleMixed,
    unemployed: t.lifestyleUnemployed,
    freelancer: t.lifestyleFreelancer,
    entrepreneur: t.lifestyleEntrepreneur,
    parental_leave: t.lifestyleParentalLeave,
    school_student: t.lifestyleSchoolStudent,
  };

  const onSave = () => {
    const parsedInterests = interestsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const next: UserPreferences = {
      interests: parsedInterests,
      lifestyle,
      goals: goals.trim(),
      helps,
      supportStyles,
      avoidSuggestions: avoidSuggestions.trim(),
      ageGroup,
      gender,
    };
    saveUserPreferences(next);
    setSavedPreferences(next);
    setIsEditing(false);
  };

  const ageLabelMap: Record<NonNullable<UserPreferences["ageGroup"]>, string> = {
    under_18: t.ageUnder18,
    "18_25": t.age18to25,
    "25_40": t.age25to40,
    "40_plus": t.age40plus,
  };
  const genderLabelMap: Record<NonNullable<UserPreferences["gender"]>, string> = {
    male: t.genderMale,
    female: t.genderFemale,
    prefer_not_to_say: t.genderPreferNotToSay,
  };
  const helpsLabelMap: Record<NonNullable<UserPreferences["helps"]>[number], string> = {
    sport: t.helpsSport,
    music: t.helpsMusic,
    walking: t.helpsWalking,
    talking_to_friends: t.helpsTalkingToFriends,
    games: t.helpsGames,
  };
  const supportStyleLabelMap: Record<NonNullable<UserPreferences["supportStyles"]>[number], string> = {
    supportive_friend: t.supportStyleSupportiveFriend,
    motivational: t.supportStyleMotivational,
    reflective: t.supportStyleReflective,
    practical_advice: t.supportStylePracticalAdvice,
    short_direct: t.supportStyleShortDirect,
    calm_gentle: t.supportStyleCalmGentle,
    deep_reflection: t.supportStyleDeepReflection,
  };
  const helpsOptions: Array<NonNullable<UserPreferences["helps"]>[number]> = ["sport", "music", "walking", "talking_to_friends", "games"];
  const supportStyleOptions: Array<NonNullable<UserPreferences["supportStyles"]>[number]> = [
    "supportive_friend",
    "motivational",
    "reflective",
    "practical_advice",
    "short_direct",
    "calm_gentle",
    "deep_reflection",
  ];
  const toggleSupportStyleOption = (option: NonNullable<UserPreferences["supportStyles"]>[number]) => {
    setSupportStyles((prev) => {
      if (prev.includes(option)) return prev.filter((item) => item !== option);
      if (prev.length >= 2) return prev;
      return [...prev, option];
    });
  };

  const toggleHelpOption = (option: NonNullable<UserPreferences["helps"]>[number]) => {
    setHelps((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">{t.appTitle}</h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            {t.appIntro}
          </p>
          <p className="mt-2 text-sm text-slate-500">{t.disclaimer}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/diary" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">
              {t.startDiary}
            </Link>
            <Link href="/statistics" className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white">
              {t.viewStats}
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-[#e6d8c2] bg-[#f9f3ea] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{t.tellAboutYourself}</h2>

          {!savedPreferences || isEditing ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-[#e2d6c2] bg-white/70 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-900">👤 {t.personalSection}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block max-w-sm text-sm text-slate-700">
                    {t.age}
                    <select
                      value={ageGroup ?? ""}
                      onChange={(e) => setAgeGroup((e.target.value || undefined) as UserPreferences["ageGroup"])}
                      className="mt-1 w-full rounded-xl border border-[#d9ccb5] bg-white px-3 py-2 text-sm outline-none focus:border-[#c8b79c]"
                    >
                      <option value="">-</option>
                      <option value="under_18">{t.ageUnder18}</option>
                      <option value="18_25">{t.age18to25}</option>
                      <option value="25_40">{t.age25to40}</option>
                      <option value="40_plus">{t.age40plus}</option>
                    </select>
                  </label>

                  <label className="block max-w-sm text-sm text-slate-700">
                    {t.gender}
                    <select
                      value={gender ?? ""}
                      onChange={(e) => setGender((e.target.value || undefined) as UserPreferences["gender"])}
                      className="mt-1 w-full rounded-xl border border-[#d9ccb5] bg-white px-3 py-2 text-sm outline-none focus:border-[#c8b79c]"
                    >
                      <option value="">-</option>
                      <option value="male">{t.genderMale}</option>
                      <option value="female">{t.genderFemale}</option>
                      <option value="prefer_not_to_say">{t.genderPreferNotToSay}</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2d6c2] bg-white/70 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-900">🌿 {t.lifestyleSection}</p>
                <div className="grid gap-3">
                  <label className="block max-w-md text-sm text-slate-700">
                    {t.lifestyle}
                    <select
                      value={lifestyle}
                      onChange={(e) => setLifestyle(e.target.value as UserPreferences["lifestyle"])}
                      className="mt-1 w-full rounded-xl border border-[#d9ccb5] bg-white px-3 py-2 text-sm outline-none focus:border-[#c8b79c]"
                    >
                      <option value="student">{t.lifestyleStudent}</option>
                      <option value="working">{t.lifestyleWorking}</option>
                      <option value="mixed">{t.lifestyleMixed}</option>
                      <option value="unemployed">{t.lifestyleUnemployed}</option>
                      <option value="freelancer">{t.lifestyleFreelancer}</option>
                      <option value="entrepreneur">{t.lifestyleEntrepreneur}</option>
                      <option value="parental_leave">{t.lifestyleParentalLeave}</option>
                      <option value="school_student">{t.lifestyleSchoolStudent}</option>
                    </select>
                  </label>

                  <label className="block max-w-md text-sm text-slate-700">
                    {t.interests}
                    <input
                      value={interestsInput}
                      onChange={(e) => setInterestsInput(e.target.value)}
                      placeholder={t.interestsPlaceholder}
                      className="mt-1 w-full rounded-xl border border-[#d9ccb5] bg-white px-3 py-2 text-sm outline-none focus:border-[#c8b79c]"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2d6c2] bg-white/70 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-900">🫶 {t.supportPreferencesSection}</p>
                <div className="space-y-4">
                  <label className="block max-w-md text-sm text-slate-700">
                    {t.goals}
                    <input
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder={t.goalsPlaceholder}
                      className="mt-1 w-full rounded-xl border border-[#d9ccb5] bg-white px-3 py-2 text-sm outline-none focus:border-[#c8b79c]"
                    />
                  </label>

                  <div>
                    <p className="text-sm text-slate-700">{t.whatHelpsYouFeelBetter}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {helpsOptions.map((option) => {
                        const selected = helps.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleHelpOption(option)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                              selected
                                ? "border-[#c8b79c] bg-[#eeddc3] text-slate-900"
                                : "border-[#d9ccb5] bg-white text-slate-700 hover:bg-[#f7efe2]"
                            }`}
                          >
                            {helpsLabelMap[option]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-700">{t.supportStyle}</p>
                    <p className="mt-1 text-xs text-slate-500">{t.supportStyleHint}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {supportStyleOptions.map((option) => {
                        const selected = supportStyles.includes(option);
                        const disabled = !selected && supportStyles.length >= 2;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleSupportStyleOption(option)}
                            disabled={disabled}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                              selected
                                ? "border-[#c8b79c] bg-[#eeddc3] text-slate-900"
                                : disabled
                                  ? "cursor-not-allowed border-[#e8decd] bg-[#f7f2e9] text-slate-400"
                                  : "border-[#d9ccb5] bg-white text-slate-700 hover:bg-[#f7efe2]"
                            }`}
                          >
                            {supportStyleLabelMap[option]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="block max-w-md text-sm text-slate-700">
                    {t.aiAvoidSuggestions}
                    <input
                      value={avoidSuggestions}
                      onChange={(e) => setAvoidSuggestions(e.target.value)}
                      placeholder={t.aiAvoidSuggestionsPlaceholder}
                      className="mt-1 w-full rounded-xl border border-[#d9ccb5] bg-white px-3 py-2 text-sm outline-none focus:border-[#c8b79c]"
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={onSave}
                className="rounded-xl bg-[#d9b37b] px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-[#cda569]"
              >
                {t.save}
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium text-slate-900">{t.preferencesSaved}</p>
              <p>
                {t.interests}: {savedPreferences.interests.join(", ") || "-"}
              </p>
              <p>
                {t.lifestyle}: {lifestyleLabelMap[savedPreferences.lifestyle]}
              </p>
              <p>
                {t.goals}: {savedPreferences.goals || "-"}
              </p>
              <p>
                {t.whatHelpsYouFeelBetter}: {savedPreferences.helps.length ? savedPreferences.helps.map((item) => helpsLabelMap[item]).join(", ") : "-"}
              </p>
              <p>
                {t.supportStyle}: {savedPreferences.supportStyles.length ? savedPreferences.supportStyles.map((item) => supportStyleLabelMap[item]).join(", ") : "-"}
              </p>
              <p>
                {t.aiAvoidSuggestions}: {savedPreferences.avoidSuggestions || "-"}
              </p>
              <p>
                {t.age}: {savedPreferences.ageGroup ? ageLabelMap[savedPreferences.ageGroup] : "-"}
              </p>
              <p>
                {t.gender}: {savedPreferences.gender ? genderLabelMap[savedPreferences.gender] : "-"}
              </p>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-2 rounded-xl border border-[#d9ccb5] bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-[#f1e5d6]"
              >
                {t.editPreferences}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
