"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { clearAllEntries, exportEntriesJson, getPin, importEntriesJson, setPin } from "@/lib/storage";
import { useLanguage } from "@/lib/useLanguage";

export default function SettingsPage() {
  const [pin, setPinValue] = useState(getPin());
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useLanguage();

  const onExport = () => {
    const blob = new Blob([exportEntriesJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mood-diary-entries.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-4xl space-y-5 px-4 py-8">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="font-semibold text-slate-900">{t.privacySafety}</h2>
          <p className="mt-2 text-sm text-slate-600">{t.privacyText}</p>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="font-semibold text-slate-900">{t.pinProtection}</h3>
          <div className="mt-2 flex gap-2">
            <input value={pin} onChange={(e) => setPinValue(e.target.value)} placeholder={t.setPin} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button
              onClick={() => {
                setPin(pin);
                setMessage(t.pinUpdated);
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white"
            >
              {t.savePin}
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="font-semibold text-slate-900">{t.dataManagement}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={onExport} className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white">{t.exportJson}</button>
            <button
              onClick={() => {
                clearAllEntries();
                setMessage(t.allDataCleared);
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white"
            >
              {t.clearAllData}
            </button>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="mt-3 min-h-28 w-full rounded-xl border border-slate-300 p-3 text-sm"
            placeholder={t.importPlaceholder}
          />
          <button
            onClick={() => {
              try {
                importEntriesJson(importText);
                setMessage(t.entriesImported);
              } catch {
                setMessage(t.importFailed);
              }
            }}
            className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white"
          >
            {t.importJson}
          </button>
          {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
        </section>
      </main>
    </div>
  );
}
