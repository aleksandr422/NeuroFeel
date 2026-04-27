import { NextRequest, NextResponse } from "next/server";
import { Mood, UserPreferences } from "@/lib/types";
import { Language, translations } from "@/lib/i18n";
import { getGenderedText } from "@/lib/genderText";

const SYSTEM_PROMPT = `You are a supportive journaling assistant.
Analyze user's diary text and return strict JSON:
{
  "mood": "sad|neutral|happy|angry|anxious|tired",
  "moodLabel": "...",
  "emotions": ["..."],
  "emotionLabels": ["..."],
  "problem": "...",
  "problemLabel": "...",
  "message": "...",
  "tags": ["..."],
  "tagLabels": ["..."]
}
Safety rules:
- no diagnosis
- no treatment prescriptions
- no guaranteed outcomes
- include practical and gentle emotional support
- Respond only in the selected language.
- If language is ru, all user-facing fields must be in Russian.
- If language is en, all user-facing fields must be in English.
- Keep internal keys in English for logic fields: mood, emotions, problem, tags.
- Return ONE natural continuous message in "message", with no section labels.
- Message length must be 2-5 sentences.
- Tone must feel warm, calm, supportive, conversational, and human.
- Use 1-3 emojis max naturally (not after every sentence).
- Avoid repetitive wording and avoid generic lines unless paired with a concrete action.
- Make the response specific to the current diary text and use recent entries only as private context.
- Do not quote or reveal previous entries directly.
- If physical or mental health concerns appear, include the required safety sentence in "message".
- Use user preferences (interests, lifestyle, goals) to personalize suggestions when relevant.
- Additional preferences may include:
  - helps: activities that usually improve user's state (sport/music/walking/talking_to_friends/games)
  - supportStyles: one or two selected styles (supportive_friend/motivational/reflective/practical_advice/short_direct/calm_gentle/deep_reflection)
  - avoidSuggestions: suggestions user wants to avoid
- If interests exist, suggest related actions naturally when appropriate.
- If goals exist, connect the advice direction to those goals.
- If lifestyle exists, adapt examples and tone to that context (study/work/freelance/etc.).
- If helps list exists, prioritize these in examples.
- Respect avoidSuggestions strictly.
- Adapt response density and tone to supportStyles when provided.
- Mention preferences naturally and only when relevant; avoid forced references.
- If age group is provided, adapt complexity and examples to life stage.
- User gender is provided as male | female | prefer_not_to_say.
- If language is Russian, adapt grammar to the user's selected gender:
  - male: use masculine forms, e.g. "ты устал", "ты написал", "ты почувствовал"
  - female: use feminine forms, e.g. "ты устала", "ты написала", "ты почувствовала"
  - prefer_not_to_say: use neutral wording and avoid gendered verbs when possible.
- Gender should affect grammar only. Do not change advice quality or assumptions based on gender.
- Do not mention the user's gender explicitly unless directly relevant.
- Do not assume stereotypes and do not make strong gender-based conclusions.
`;

type FallbackBlock = {
  message: string;
};

const fallbackTemplates: Record<Language, Record<Mood, FallbackBlock[]>> = {
  en: {
    happy: [
      {
        message:
          "It sounds like there was a real spark in your day, and it is great that you noticed it 😊 Try to capture one thing you did and one situation that helped you feel this way. That little note can become a reliable support point for tougher days ❤️",
      },
    ],
    sad: [
      {
        message:
          "What you describe sounds really heavy, and your reaction makes sense 😔 When days feel like this, it helps to lower pressure and focus on one gentle stabilizing step. Give yourself a short quiet pause today and do one caring action for your body or mind 🌿",
      },
    ],
    anxious: [
      {
        message:
          "Your tension sounds very real, and you are already helping yourself by naming it 😔 It may feel easier if you split this into what you can do now and what can wait for later, so your mind has fewer open loops. Pick one tiny action under 15 minutes and finish just that first 🫶",
      },
    ],
    angry: [
      {
        message:
          "It sounds like something important to you was crossed, and that intensity is understandable. Before replying, try writing one calm sentence about what you need so your boundary is clear and constructive 💪 Even a short pause can shift the whole conversation in your favor 🌟",
      },
    ],
    neutral: [
      {
        message:
          "You are describing things with good balance, and that is a strong sign of self-awareness 🤍 This is a great moment to set one small routine that protects your energy when stress rises. Choose one simple anchor for tomorrow and put it into your plan now 🌿",
      },
    ],
    tired: [
      {
        message:
          "Your entry really sounds like fatigue has been building, and your system may need a gentler pace 😔 Try to drop non-essential tasks and keep just one meaningful priority for today. A short screen-free pause and a few slow breaths can help you reset before the next step 🌧️",
      },
    ],
  },
  ru: {
    happy: [
      {
        message:
          "Похоже, в этом дне было много тепла, и здорово, что ты это заметил 😊 Попробуй коротко записать, что именно помогло тебе почувствовать себя лучше — одно твое действие и один внешний момент. Такая заметка потом хорошо поддерживает в более сложные дни ❤️",
      },
    ],
    sad: [
      {
        message:
          "По твоим словам видно, что сейчас правда тяжело, и это очень понятная реакция 😔 Когда такого много, лучше снизить требования к себе и выбрать один мягкий поддерживающий шаг. Дай себе короткую паузу и сделай что-то спокойное и заботливое для себя 🌿",
      },
    ],
    anxious: [
      {
        message:
          "Твое напряжение звучит очень реально, и ты уже молодец, что прямо это проговорил 😔 Попробуй разделить мысли на «что могу сделать сегодня» и «к чему вернусь позже», чтобы стало чуть легче дышать. Выбери один маленький шаг до 15 минут и начни только с него 🫶",
      },
    ],
    angry: [
      {
        message:
          "Судя по записи, тебя сильно задела ситуация, и в этом обычно есть важная для тебя граница. Перед ответом попробуй одной фразой сформулировать, что именно тебе важно защитить, чтобы сказать это спокойнее и точнее 💪 Иногда даже такая пауза уже меняет исход разговора 🌟",
      },
    ],
    neutral: [
      {
        message:
          "Ты довольно спокойно смотришь на свой день, и это классная опора 🤍 В такие моменты удобно закреплять простые привычки, которые потом помогают в стрессовые периоды. Выбери одну маленькую опорную штуку на завтра и добавь ее в план уже сейчас 🌿",
      },
    ],
    tired: [
      {
        message:
          "По записи чувствуется накопившаяся усталость, и сейчас правда может не хватать восстановления 😔 Попробуй убрать второстепенные задачи и оставить только один главный приоритет на сегодня. Короткий перерыв без экрана и несколько медленных вдохов помогут чуть разгрузиться 🌧️",
      },
    ],
  },
};

function pickRandomVariant(language: Language, mood: Mood) {
  const variants = fallbackTemplates[language][mood];
  return variants[Math.floor(Math.random() * variants.length)];
}

function needsSpecialistSafety(text: string, tags: string[], emotions: string[], problem: string) {
  const source = `${text} ${problem} ${tags.join(" ")} ${emotions.join(" ")}`.toLowerCase();
  return /(pain|panic|depress|anxiety|mental|health|insomnia|suicid|self-harm|стресс|тревог|депресс|паник|боль|псих|суицид|самоповреж)/.test(source);
}

function safeFallback(manualMood: Mood, language: Language, userPreferences?: UserPreferences | null) {
  const t = translations[language];
  const variant = pickRandomVariant(language, manualMood);
  const gender = userPreferences?.gender;
  const message =
    language === "ru"
      ? getGenderedText(
          {
            male: variant.message.replaceAll("заметил ", "заметил ").replaceAll("проговорил ", "проговорил "),
            female: variant.message.replaceAll("заметил ", "заметила ").replaceAll("проговорил ", "проговорила "),
            neutral: variant.message
              .replaceAll("заметил ", "это заметно ")
              .replaceAll("проговорил ", "обозначил это ")
              .replaceAll("ты уже молодец, что прямо это ", "здорово, что получилось это "),
          },
          gender,
          language,
        )
      : variant.message;

  return {
    mood: manualMood,
    moodLabel: t.moods[manualMood],
    emotions: [manualMood],
    emotionLabels: [t.emotionsMap[manualMood]],
    problem: "daily stress",
    problemLabel: t.problemsMap["daily stress"],
    message,
    advice: message,
    tags: ["reflection", "daily-life"],
    tagLabels: [t.tagsMap.reflection, t.tagsMap["daily-life"]],
  };
}

function normalizeResponse(raw: unknown, manualMood: Mood, language: Language, entryText: string) {
  const t = translations[language];
  const safe = safeFallback(manualMood, language);
  if (!raw || typeof raw !== "object") return safe;
  const data = raw as Record<string, unknown>;

  const moodCandidates: Mood[] = ["sad", "neutral", "happy", "angry", "anxious", "tired"];
  const mood = typeof data.mood === "string" && moodCandidates.includes(data.mood as Mood) ? (data.mood as Mood) : manualMood;
  const emotions = Array.isArray(data.emotions) ? data.emotions.filter((v): v is string => typeof v === "string") : [mood];
  const tags = Array.isArray(data.tags) ? data.tags.filter((v): v is string => typeof v === "string") : ["reflection", "daily-life"];

  const emotionLabels = Array.isArray(data.emotionLabels) ? data.emotionLabels.filter((v): v is string => typeof v === "string") : [];
  const tagLabels = Array.isArray(data.tagLabels) ? data.tagLabels.filter((v): v is string => typeof v === "string") : [];

  let message = typeof data.message === "string" ? data.message : safe.message;
  if (needsSpecialistSafety(entryText, tags, emotions, typeof data.problem === "string" ? data.problem : safe.problem)) {
    const specialistNote = t.specialistNote;
    if (!message?.includes(specialistNote)) {
      message = `${message} ${specialistNote}`;
    }
  }

  return {
    mood,
    moodLabel: typeof data.moodLabel === "string" ? data.moodLabel : t.moods[mood],
    emotions,
    emotionLabels: emotions.map((emotion, index) => emotionLabels[index] ?? t.emotionsMap[emotion as keyof typeof t.emotionsMap] ?? emotion),
    problem: typeof data.problem === "string" ? data.problem : safe.problem,
    problemLabel:
      typeof data.problemLabel === "string"
        ? data.problemLabel
        : t.problemsMap[(typeof data.problem === "string" ? data.problem.toLowerCase() : safe.problem) as keyof typeof t.problemsMap] ?? safe.problemLabel,
    message,
    advice: typeof data.advice === "string" && data.advice.trim() ? data.advice : message,
    tags,
    tagLabels: tags.map((tag, index) => tagLabels[index] ?? t.tagsMap[tag as keyof typeof t.tagsMap] ?? tag),
  };
}

function formatUserPreferencesBlock(userPreferences: UserPreferences | null | undefined) {
  if (!userPreferences) return "User preferences: none";
  const interests = userPreferences.interests.length ? userPreferences.interests.join(", ") : "none";
  const lifestyle = userPreferences.lifestyle || "none";
  const goals = userPreferences.goals?.trim() || "none";
  const helps = userPreferences.helps?.length ? userPreferences.helps.join(", ") : "none";
  const supportStyles = userPreferences.supportStyles?.length ? userPreferences.supportStyles.join(", ") : "none";
  const avoidSuggestions = userPreferences.avoidSuggestions?.trim() || "none";
  const ageGroup = userPreferences.ageGroup || "none";
  const gender = userPreferences.gender || "none";
  return `User preferences:
Interests: ${interests}
Lifestyle: ${lifestyle}
Goals: ${goals}
Helps: ${helps}
Support styles: ${supportStyles}
Avoid suggestions: ${avoidSuggestions}
User profile:
Age group: ${ageGroup}
Gender: ${gender}`;
}

export async function POST(request: NextRequest) {
  const { text, manualMood, language, recentEntries, userPreferences } = (await request.json()) as {
    text: string;
    manualMood: Mood;
    language: Language;
    recentEntries?: Array<{ date: string; mood: Mood; problem: string; tags: string[]; text: string }>;
    userPreferences?: UserPreferences | null;
  };
  const safeLanguage: Language = language === "ru" ? "ru" : "en";
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(safeFallback(manualMood, safeLanguage, userPreferences));
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Language: ${safeLanguage}
Diary entry: ${text}
Manual mood: ${manualMood}
Recent entries for context only (do not quote directly): ${JSON.stringify(recentEntries ?? []).slice(0, 3000)}
${formatUserPreferencesBlock(userPreferences)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(safeFallback(manualMood, safeLanguage, userPreferences));
    }

    const payload = await response.json();
    const content = payload.output?.[0]?.content?.[0]?.text as string | undefined;
    if (!content) return NextResponse.json(safeFallback(manualMood, safeLanguage, userPreferences));

    const parsed = JSON.parse(content);
    return NextResponse.json(normalizeResponse(parsed, manualMood, safeLanguage, text));
  } catch {
    return NextResponse.json(safeFallback(manualMood, safeLanguage, userPreferences));
  }
}
