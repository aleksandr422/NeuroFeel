"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { clearAllEntries, exportEntriesJson, getEntries, getPinHashRecord, getUserPreferences, importEntriesJson, markExportedNow, resetOnboarding, setPinHash } from "@/lib/storage";
import { useLanguage } from "@/lib/useLanguage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SAFETY_RESOURCES } from "@/lib/safety/resources";

export default function SettingsPage() {
  const [pin, setPinValue] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const [isWipeOpen, setIsWipeOpen] = useState(false);
  const [wipeInput, setWipeInput] = useState("");
  const [isPinWarningOpen, setIsPinWarningOpen] = useState(false);
  const [pinAcknowledge, setPinAcknowledge] = useState(false);
  const { t, language } = useLanguage();
  const entries = getEntries();
  const profile = getUserPreferences();
  const requiredWipeWord = language === "ru" ? "УДАЛИТЬ" : "DELETE";
  const pinRecord = getPinHashRecord();
  const resources = SAFETY_RESOURCES[language];
  const isUnder18 = profile?.ageGroup === "under_18";

  const onExport = () => {
    const blob = new Blob([exportEntriesJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t.exportFileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    markExportedNow();
  };

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <Card><h1 className="text-2xl font-semibold">{t.settings}</h1></Card>
      <Card>
        <h3 className="font-semibold text-slate-900">{t.pinProtection}</h3>
        <p className="mt-2 text-sm text-slate-600">{pinRecord ? t.pinAlreadySet : t.pinNotSet}</p>
        {!pinRecord ? <p className="mt-1 text-xs text-amber-700">{t.pinOffWarning}</p> : null}
        <p className="mt-1 text-xs text-slate-500">{t.pinRules}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Input value={pin} onChange={(e) => setPinValue(e.target.value)} placeholder={t.setPin} inputMode="numeric" />
          <Input value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value)} placeholder={t.confirmPin} inputMode="numeric" />
          <Button onClick={() => setIsPinWarningOpen(true)} disabled={!isPinValid(pin, pinConfirm) || !pinAcknowledge} variant="primary">{t.savePin}</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700">
            <input type="checkbox" checked={pinAcknowledge} onChange={(e) => setPinAcknowledge(e.target.checked)} />
            {t.pinRecoveryAck}
          </label>
          <Button onClick={onExport} variant="secondary" size="sm">{t.exportNow}</Button>
        </div>
      </Card>
      {isUnder18 ? (
        <Card tone="muted">
          <h3 className="font-semibold text-slate-900">{t.helpIfNeeded}</h3>
          {/* TODO(notifications): keep push notifications opt-in by default for under-18 profiles with explicit explanation. */}
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {resources.map((item) => (
              <li key={item.name} className="rounded-[var(--radius-md)] bg-white p-3">
                <p className="font-medium">{item.name}</p>
                <p>{item.purpose}</p>
                {item.phone ? <p>{item.phone}</p> : null}
                {item.url ? <p><a href={item.url} className="underline text-[var(--color-primary-600)]">{item.url}</a></p> : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <Card>
        <h3 className="font-semibold text-slate-900">{t.dataManagement}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={onExport} variant="secondary">{t.exportJson}</Button>
          <Button onClick={() => setIsWipeOpen(true)} variant="ghost">{t.clearAllData}</Button>
          <Button onClick={() => { resetOnboarding(); setMessage(t.onboardingResetDone); }} variant="secondary">{t.restartOnboarding}</Button>
        </div>
        <Textarea value={importText} onChange={(e) => setImportText(e.target.value)} className="mt-3 min-h-28" placeholder={t.importPlaceholder} />
        <Button
          onClick={() => {
            try {
              importEntriesJson(importText);
              setMessage(t.entriesImported);
            } catch {
              setMessage(t.importFailed);
            }
          }}
          className="mt-2"
          variant="secondary"
        >
          {t.importJson}
        </Button>
        {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      </Card>
      <Modal open={isWipeOpen} onClose={() => setIsWipeOpen(false)} title={t.clearAllData}>
        <p className="text-sm text-slate-700">{t.wipeSummary.replace("{entries}", String(entries.length)).replace("{days}", String(new Set(entries.map((entry) => entry.date.slice(0, 10))).size)).replace("{profile}", profile ? t.profileExists : t.profileMissing)}</p>
        <p className="mt-3 text-sm text-slate-700">{t.typeConfirmWord.replace("{word}", requiredWipeWord)}</p>
        <Input value={wipeInput} onChange={(e) => setWipeInput(e.target.value)} className="mt-2" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onExport} variant="secondary">{t.exportFirst}</Button>
          <Button
            onClick={() => {
              clearAllEntries();
              setMessage(t.allDataCleared);
              setIsWipeOpen(false);
              setWipeInput("");
            }}
            disabled={wipeInput !== requiredWipeWord}
            variant="danger"
          >
            {t.clearAllData}
          </Button>
        </div>
      </Modal>
      <Modal open={isPinWarningOpen} onClose={() => setIsPinWarningOpen(false)} title={t.pinWarningTitle}>
        <p className="text-sm text-slate-700">{t.pinWarningText}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onExport} variant="secondary">{t.exportNow}</Button>
          <Button
            onClick={async () => {
              await setPinHash(pin);
              setMessage(t.pinUpdated);
              setIsPinWarningOpen(false);
              setPinValue("");
              setPinConfirm("");
            }}
            variant="primary"
          >
            {t.continueAnyway}
          </Button>
        </div>
      </Modal>
    </main>
  );
}

function isPinValid(pin: string, pinConfirm: string): boolean {
  if (!/^\d{4,8}$/.test(pin)) return false;
  return pin === pinConfirm;
}
