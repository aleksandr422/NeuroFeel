"use client";

import { Language } from "@/lib/i18n";
import { AIPersonality, ChatMessage, DiaryEntry, UserPreferences } from "@/lib/types";

type ChatResponse = {
  message: string;
};

export async function sendChatMessage(params: {
  message: string;
  language: Language;
  personality: AIPersonality;
  chatHistory: ChatMessage[];
  recentDiaryEntries: DiaryEntry[];
  userPreferences: UserPreferences | null;
}): Promise<ChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errorMessage = "Failed to send chat message";
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload?.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Keep default error text when response has no JSON body.
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as ChatResponse;
}
