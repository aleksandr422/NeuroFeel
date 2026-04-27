import { NextRequest, NextResponse } from "next/server";
import { Language } from "@/lib/i18n";
import { AIPersonality, ChatMessage, DiaryEntry, UserPreferences } from "@/lib/types";

const SYSTEM_PROMPT = `You are an AI companion in a private journaling app.
Your task is to continue a natural messenger-style conversation.

Response requirements:
- Natural conversation style, not structured sections.
- 2-5 sentences.
- Use light emojis (1-2 max).
- Reference user's situation when relevant.
- Keep tone supportive and human.
- Do not diagnose.
- Do not replace professional help.
- If severe distress is implied, gently encourage seeking professional support.
- Respect conversation continuity and recent context.
- Respond only in the selected language.
- Avoid repeating the same response templates.
- Ask one gentle follow-up question only when it is genuinely useful.
- User gender is provided as male | female | prefer_not_to_say.
- If language is Russian, adapt grammar to selected gender:
  - male: use masculine forms, e.g. "ты устал", "ты написал", "ты почувствовал"
  - female: use feminine forms, e.g. "ты устала", "ты написала", "ты почувствовала"
  - prefer_not_to_say: use neutral wording and avoid gendered verbs when possible.
- Gender affects grammar only. Do not use stereotypes or personality assumptions.
- Do not mention user's gender explicitly unless relevant.
- Additional preferences may include:
  - helps: activities user says are helpful (sport/music/walking/talking_to_friends/games)
  - supportStyles: one or two selected styles (supportive_friend/motivational/reflective/practical_advice/short_direct/calm_gentle/deep_reflection)
  - avoidSuggestions: suggestions user wants to avoid
- Respect avoidSuggestions strictly and avoid those recommendations.
- If helps list exists, prefer those in practical suggestions.
- Adapt verbosity and style to supportStyles.

Adjust tone based on personality:
- Supportive: warm, empathetic
- Motivational: encouraging, energizing
- Calm: short, neutral
- Analytical: more explanation and reasoning
`;

function personalityHint(language: Language, personality: AIPersonality) {
  if (language === "ru") {
    if (personality === "motivational") return "Стиль: энергичный, ободряющий, с фокусом на действие.";
    if (personality === "calm") return "Стиль: короткий, спокойный, мягкий и нейтральный.";
    if (personality === "analytical") return "Стиль: вдумчивый, с ясной логикой и объяснением причинно-следственных связей.";
    return "Стиль: теплый, эмпатичный, дружелюбный, поддерживающий.";
  }
  if (personality === "motivational") return "Style: energetic, encouraging, action-oriented.";
  if (personality === "calm") return "Style: short, soft, peaceful, neutral.";
  if (personality === "analytical") return "Style: thoughtful with clear reasoning.";
  return "Style: warm, caring, friendly, empathetic.";
}

function formatUserPreferencesBlock(userPreferences: UserPreferences | null | undefined) {
  if (!userPreferences) return "User preferences: none";
  const interests = userPreferences.interests.length ? userPreferences.interests.join(", ") : "none";
  const goals = userPreferences.goals?.trim() || "none";
  const lifestyle = userPreferences.lifestyle || "none";
  const helps = userPreferences.helps?.length ? userPreferences.helps.join(", ") : "none";
  const supportStyles = userPreferences.supportStyles?.length ? userPreferences.supportStyles.join(", ") : "none";
  const avoidSuggestions = userPreferences.avoidSuggestions?.trim() || "none";
  const ageGroup = userPreferences.ageGroup || "none";
  const gender = userPreferences.gender || "none";
  return `User preferences:
Interests: ${interests}
Goals: ${goals}
Lifestyle: ${lifestyle}
Helps: ${helps}
Support styles: ${supportStyles}
Avoid suggestions: ${avoidSuggestions}
Age group: ${ageGroup}
Gender: ${gender}`;
}

function formatDiaryContext(entries: DiaryEntry[]) {
  return entries.slice(0, 5).map((entry) => ({
    date: entry.date,
    mood: entry.mood,
    problem: entry.problem,
    emotions: entry.emotions.slice(0, 3),
    text: entry.text.slice(0, 220),
  }));
}

function formatConversation(messages: ChatMessage[]) {
  return messages.slice(-12).map((message) => ({
    role: message.role,
    content: message.content.slice(0, 700),
    createdAt: message.createdAt,
  }));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    message: string;
    language: Language;
    personality: AIPersonality;
    chatHistory?: ChatMessage[];
    messages?: ChatMessage[];
    recentDiaryEntries?: DiaryEntry[];
    diaryEntries?: DiaryEntry[];
    userPreferences: UserPreferences | null;
  };

  const safeLanguage: Language = body.language === "ru" ? "ru" : "en";
  const safePersonality: AIPersonality =
    body.personality === "motivational" || body.personality === "calm" || body.personality === "analytical"
      ? body.personality
      : "supportive";
  const rawApiKey = process.env.OPENAI_API_KEY ?? "";
  const apiKey = rawApiKey.trim().replace(/^['"]|['"]$/g, "");
  const chatHistory = Array.isArray(body.chatHistory) ? body.chatHistory : Array.isArray(body.messages) ? body.messages : [];
  const recentDiaryEntries = Array.isArray(body.recentDiaryEntries)
    ? body.recentDiaryEntries
    : Array.isArray(body.diaryEntries)
      ? body.diaryEntries
      : [];

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          safeLanguage === "ru"
            ? "Ключ OpenAI не найден. Добавь OPENAI_API_KEY в .env.local и перезапусти сервер."
            : "OpenAI API key is missing. Add OPENAI_API_KEY to .env.local and restart the server.",
      },
      { status: 500 },
    );
  }

  // OpenAI keys are ASCII-only. Corrupted encoding causes fetch header failures.
  if (/[^\x00-\x7F]/.test(apiKey)) {
    return NextResponse.json(
      {
        error:
          safeLanguage === "ru"
            ? "OPENAI_API_KEY содержит поврежденные символы. Впиши ключ вручную в .env.local (ASCII), сохрани файл в UTF-8 и перезапусти сервер."
            : "OPENAI_API_KEY contains corrupted characters. Re-enter the key manually in .env.local (ASCII), save the file as UTF-8, and restart the server.",
      },
      { status: 500 },
    );
  }

  try {
    const contextMessage = `Language: ${safeLanguage}
${personalityHint(safeLanguage, safePersonality)}
Recent diary entries (private context, may be referenced naturally): ${JSON.stringify(formatDiaryContext(recentDiaryEntries))}
${formatUserPreferencesBlock(body.userPreferences)}`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextMessage },
      ...formatConversation(chatHistory).map((message) => ({
        role: message.role,
        content: message.content,
      })),
      { role: "user", content: body.message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.8,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error:
            safeLanguage === "ru"
              ? `OpenAI временно недоступен. Попробуй снова через минуту. ${errorText ? `(${errorText.slice(0, 120)})` : ""}`
              : `OpenAI is temporarily unavailable. Please try again in a minute. ${errorText ? `(${errorText.slice(0, 120)})` : ""}`,
        },
        { status: 502 },
      );
    }

    const payload = await response.json();
    const text = payload.choices?.[0]?.message?.content as string | undefined;

    if (!text || !text.trim()) {
      return NextResponse.json(
        {
          error:
            safeLanguage === "ru"
              ? "OpenAI не вернул текстовый ответ. Попробуй отправить сообщение еще раз."
              : "OpenAI returned an empty response. Please try sending your message again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: text.trim() });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat API connection error:", error);
    return NextResponse.json(
      {
        error:
          safeLanguage === "ru"
            ? `Ошибка соединения с OpenAI: ${details}. Проверь ключ API, интернет и попробуй снова.`
            : `Connection error while reaching OpenAI: ${details}. Check API key, network, and try again.`,
      },
      { status: 500 },
    );
  }
}
