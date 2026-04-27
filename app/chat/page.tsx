"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { sendChatMessage } from "@/lib/chat";
import { useLanguage } from "@/lib/useLanguage";
import { AIPersonality, ChatMessage } from "@/lib/types";
import { clearChatMessages, getAIPersonality, getChatMessages, getEntries, getUserPreferences, saveAIPersonality, saveChatMessages } from "@/lib/storage";

const personalities: AIPersonality[] = ["supportive", "motivational", "calm", "analytical"];

function formatTimestamp(value: string, locale: "en-US" | "ru-RU") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ChatPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChatMessages());
  const [personality, setPersonality] = useState<AIPersonality>(() => getAIPersonality());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const locale = language === "ru" ? "ru-RU" : "en-US";
  const personalityOptions = useMemo(
    () => ({
      supportive: t.personalitySupportive,
      motivational: t.personalityMotivational,
      calm: t.personalityCalm,
      analytical: t.personalityAnalytical,
    }),
    [t],
  );

  useEffect(() => {
    saveChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    saveAIPersonality(personality);
  }, [personality]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: userMessage.content,
        language,
        personality,
        chatHistory: messages.slice(-12),
        recentDiaryEntries: getEntries().slice(0, 5),
        userPreferences: getUserPreferences(),
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "ru"
            ? "Не удалось получить ответ от AI. Попробуй еще раз."
            : "Could not get a response from AI. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    clearChatMessages();
    setMessages([]);
    setError("");
    setInput("");
    setIsConfirmOpen(false);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto flex h-[calc(100vh-80px)] max-w-5xl flex-col px-4 py-6">
        <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-semibold text-slate-900">{t.chatTitle}</h1>
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              disabled={messages.length === 0}
            >
              {t.clearChat}
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-600">{t.chatIntro}</p>
          <label className="mt-4 block text-sm text-slate-700">
            {t.aiPersonality}
            <select
              value={personality}
              onChange={(event) => setPersonality(event.target.value as AIPersonality)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-2 outline-none focus:border-blue-400 md:max-w-xs"
            >
              {personalities.map((item) => (
                <option key={item} value={item}>
                  {personalityOptions[item]}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="self-center text-sm text-slate-500">{t.noMessagesYet}</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      message.role === "user" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`mt-1 text-[11px] ${message.role === "user" ? "text-blue-100" : "text-slate-500"}`}>
                      {formatTimestamp(message.createdAt, locale)}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && <p className="text-xs text-slate-500">{t.aiTyping}</p>}
          </div>
          {error && <p className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>}

          <form onSubmit={handleSend} className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t.chatPlaceholder}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {t.send}
              </button>
            </div>
          </form>
        </section>
      </main>
      {isConfirmOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <p className="text-sm text-slate-800">{t.confirmClearChat}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {t.cancel}
              </button>
              <button type="button" onClick={handleClearChat} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white transition hover:bg-rose-700">
                {t.clear}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
