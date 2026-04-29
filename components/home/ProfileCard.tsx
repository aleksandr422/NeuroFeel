"use client";

import { UserPreferences } from "@/lib/types";
import { HomeTranslation } from "@/components/home/types";

interface ProfileCardProps {
  t: HomeTranslation;
  savedPreferences: UserPreferences | null;
  isEditing: boolean;
  ageGroup: UserPreferences["ageGroup"];
  gender: UserPreferences["gender"];
  lifestyle: UserPreferences["lifestyle"];
  interestsInput: string;
  goals: string;
  helps: UserPreferences["helps"];
  supportStyles: UserPreferences["supportStyles"];
  avoidSuggestions: string;
  ageLabelMap: Record<NonNullable<UserPreferences["ageGroup"]>, string>;
  genderLabelMap: Record<NonNullable<UserPreferences["gender"]>, string>;
  lifestyleLabelMap: Record<UserPreferences["lifestyle"], string>;
  helpsLabelMap: Record<NonNullable<UserPreferences["helps"]>[number], string>;
  supportStyleLabelMap: Record<NonNullable<UserPreferences["supportStyles"]>[number], string>;
  helpsOptions: Array<NonNullable<UserPreferences["helps"]>[number]>;
  supportStyleOptions: Array<NonNullable<UserPreferences["supportStyles"]>[number]>;
  setAgeGroup: (v: UserPreferences["ageGroup"]) => void;
  setGender: (v: UserPreferences["gender"]) => void;
  setLifestyle: (v: UserPreferences["lifestyle"]) => void;
  setInterestsInput: (v: string) => void;
  setGoals: (v: string) => void;
  setAvoidSuggestions: (v: string) => void;
  toggleHelpOption: (option: NonNullable<UserPreferences["helps"]>[number]) => void;
  toggleSupportStyleOption: (option: NonNullable<UserPreferences["supportStyles"]>[number]) => void;
  onSave: () => void;
  onEdit: () => void;
}

export function ProfileCard(props: ProfileCardProps) {
  const {
    t,
    savedPreferences,
    isEditing,
    ageGroup,
    gender,
    lifestyle,
    interestsInput,
    goals,
    helps,
    supportStyles,
    avoidSuggestions,
    ageLabelMap,
    genderLabelMap,
    lifestyleLabelMap,
    helpsLabelMap,
    supportStyleLabelMap,
    helpsOptions,
    supportStyleOptions,
    setAgeGroup,
    setGender,
    setLifestyle,
    setInterestsInput,
    setGoals,
    setAvoidSuggestions,
    toggleHelpOption,
    toggleSupportStyleOption,
    onSave,
    onEdit,
  } = props;

  return (
    <section className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/70 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">{t.profileEyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{!savedPreferences || isEditing ? t.tellAboutYourself : t.profileTitle}</h2>
          {!isEditing && savedPreferences ? <p className="mt-2 text-sm text-slate-600">{t.profileSubtitle}</p> : null}
        </div>
        {!isEditing && savedPreferences ? (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-2xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            {t.editPreferences}
          </button>
        ) : null}
      </div>

      {!savedPreferences || isEditing ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-3xl border border-violet-100 bg-violet-50/40 p-4">
            <p className="text-sm font-semibold text-violet-800">{t.personalSection}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-700">
                {t.age}
                <select
                  value={ageGroup ?? ""}
                  onChange={(e) => setAgeGroup((e.target.value || undefined) as UserPreferences["ageGroup"])}
                  className="mt-1.5 w-full rounded-2xl border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                >
                  <option value="">-</option>
                  <option value="under_18">{t.ageUnder18}</option>
                  <option value="18_25">{t.age18to25}</option>
                  <option value="25_40">{t.age25to40}</option>
                  <option value="40_plus">{t.age40plus}</option>
                </select>
              </label>
              <label className="text-sm text-slate-700">
                {t.gender}
                <select
                  value={gender ?? ""}
                  onChange={(e) => setGender((e.target.value || undefined) as UserPreferences["gender"])}
                  className="mt-1.5 w-full rounded-2xl border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                >
                  <option value="">-</option>
                  <option value="male">{t.genderMale}</option>
                  <option value="female">{t.genderFemale}</option>
                  <option value="prefer_not_to_say">{t.genderPreferNotToSay}</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-violet-50/40 p-4">
            <p className="text-sm font-semibold text-violet-800">{t.lifestyleSection}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-700">
                {t.lifestyle}
                <select
                  value={lifestyle}
                  onChange={(e) => setLifestyle(e.target.value as UserPreferences["lifestyle"])}
                  className="mt-1.5 w-full rounded-2xl border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
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
              <label className="text-sm text-slate-700">
                {t.interests}
                <input
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder={t.interestsPlaceholder}
                  className="mt-1.5 w-full rounded-2xl border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-violet-50/40 p-4">
            <p className="text-sm font-semibold text-violet-800">{t.supportPreferencesSection}</p>
            <div className="mt-3 space-y-4">
              <label className="block text-sm text-slate-700">
                {t.goals}
                <input
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder={t.goalsPlaceholder}
                  className="mt-1.5 w-full rounded-2xl border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
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
                            ? "border-violet-300 bg-violet-200 text-violet-900"
                            : "border-violet-200 bg-white text-slate-700 hover:bg-violet-50"
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
                            ? "border-violet-300 bg-violet-200 text-violet-900"
                            : disabled
                              ? "cursor-not-allowed border-violet-100 bg-violet-50 text-slate-400"
                              : "border-violet-200 bg-white text-slate-700 hover:bg-violet-50"
                        }`}
                      >
                        {supportStyleLabelMap[option]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block text-sm text-slate-700">
                {t.aiAvoidSuggestions}
                <input
                  value={avoidSuggestions}
                  onChange={(e) => setAvoidSuggestions(e.target.value)}
                  placeholder={t.aiAvoidSuggestionsPlaceholder}
                  className="mt-1.5 w-full rounded-2xl border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={onSave}
            className="rounded-2xl bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:-translate-y-0.5"
          >
            {t.save}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t.interests}</p>
            <p className="mt-2 text-sm text-slate-800">{savedPreferences.interests.join(", ") || t.notSpecified}</p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t.lifestyle}</p>
            <p className="mt-2 text-sm text-slate-800">{lifestyleLabelMap[savedPreferences.lifestyle] || t.notSpecified}</p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t.goals}</p>
            <p className="mt-2 text-sm text-slate-800">{savedPreferences.goals || t.notSpecified}</p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t.age}</p>
            <p className="mt-2 text-sm text-slate-800">{savedPreferences.ageGroup ? ageLabelMap[savedPreferences.ageGroup] : t.notSpecified}</p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t.gender}</p>
            <p className="mt-2 text-sm text-slate-800">{savedPreferences.gender ? genderLabelMap[savedPreferences.gender] : t.notSpecified}</p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t.supportStyle}</p>
            <p className="mt-2 text-sm text-slate-800">
              {savedPreferences.supportStyles.length ? savedPreferences.supportStyles.map((item) => supportStyleLabelMap[item]).join(", ") : t.notSpecified}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
