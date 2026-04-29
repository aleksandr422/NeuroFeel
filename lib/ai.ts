import { AIAnalysis, DiaryEntry, Mood, UserPreferences } from "@/lib/types";
import { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import { getGenderedText } from "@/lib/genderText";

type FallbackBlock = {
  message: string;
};

const fallbackByMood: Record<Language, Record<Mood, FallbackBlock[]>> = {
  en: {
    happy: [
      {
        message:
          "It sounds like this day gave you real emotional space, and that is worth holding onto 😊 Try to note one specific moment that lifted you and one thing you did that helped. Keeping that tiny pattern visible can make it easier to recreate on a harder day ❤️",
      },
    ],
    sad: [
      {
        message:
          "You are carrying a lot right now, and it makes sense that today feels heavy 😔 When days pile up like this, even small acts of care matter more than perfect plans. For today, try one gentle reset step like water, a short walk, or a quiet 10-minute pause 🌿",
      },
    ],
    anxious: [
      {
        message:
          "Your tension sounds very real, and you are not overreacting by noticing it 😔 It may help to split this into what you can act on today and what can wait, so your mind has fewer open loops. Pick one tiny action under 15 minutes and finish only that first 🫶",
      },
    ],
    angry: [
      {
        message:
          "What you wrote sounds intense, and that often means something important for you felt crossed. Before reacting, try writing one calm sentence about what you need so your message stays clear, not explosive 💪 Even that small pause can change how the conversation goes 🌟",
      },
    ],
    neutral: [
      {
        message:
          "You are reading your day with balance, and that is a real strength 🤍 Calm periods are a good time to set one simple habit that can support you when things get harder. Choose one small anchor for tomorrow and put it in your schedule now 🌿",
      },
    ],
    tired: [
      {
        message:
          "Your fatigue comes through clearly, and your pace may need to be gentler today 😔 Try dropping non-essential tasks and focus on one thing that truly matters. A short screen-free break with a few slow breaths can help your nervous system settle before the next step 🌧️",
      },
    ],
  },
  ru: {
    happy: [
      {
        message:
          "Похоже, этот день дал тебе немного опоры, и это правда важно заметить 😊 Попробуй отметить один конкретный момент, когда стало легче, и что именно ты помог себе сделать. Такие маленькие находки потом отлично поддерживают в сложные дни ❤️",
      },
    ],
    sad: [
      {
        message:
          "Сейчас тебе правда непросто, и эта тяжесть звучит очень понятной 😔 Когда напряжения много, лучше не требовать от себя лишнего, а выбрать один мягкий шаг поддержки. На сегодня хватит короткой паузы, воды и одного спокойного действия для себя 🌿",
      },
    ],
    anxious: [
      {
        message:
          "Твое напряжение звучит очень реально, и это не преувеличение 😔 Попробуй разделить это на две части: что можно сделать сегодня и что можно отложить на потом, чтобы стало легче дышать. Выбери один маленький шаг до 15 минут и начни только с него 🫶",
      },
    ],
    angry: [
      {
        message:
          "По твоим словам чувствуется сильное раздражение, и часто за этим стоит важная для тебя граница. Перед разговором попробуй коротко сформулировать, что именно тебе важно защитить, чтобы сказать это спокойнее 💪 Даже одна ясная фраза может сильно изменить результат 🌟",
      },
    ],
    neutral: [
      {
        message:
          "Ты довольно ровно смотришь на свой день, и это хороший признак внутренней устойчивости 🤍 В такие спокойные моменты удобно закладывать маленькие привычки, которые потом поддерживают в стрессе. Выбери одну простую опору на завтра и добавь ее в план уже сейчас 🌿",
      },
    ],
    tired: [
      {
        message:
          "По твоей записи чувствуется усталость, и сейчас правда может не хватать восстановления 😔 Попробуй убрать второстепенные задачи и оставить один главный фокус на сегодня. Короткий перерыв без экрана и несколько медленных вдохов помогут чуть разгрузить состояние 🌧️",
      },
    ],
  },
};

function pickFallback(language: Language, mood: Mood): FallbackBlock {
  const variants = fallbackByMood[language][mood];
  return variants[Math.floor(Math.random() * variants.length)];
}

function personalizeFallbackMessage(baseMessage: string, language: Language, userPreferences: UserPreferences | null) {
  if (!userPreferences) return baseMessage;

  const interests = userPreferences.interests.slice(0, 2).join(", ");
  const goal = userPreferences.goals.trim();
  const lifestyle = userPreferences.lifestyle;
  const lifestylePhrase =
    language === "ru"
      ? lifestyle === "student"
        ? "учебным ритмом"
        : lifestyle === "working"
          ? "рабочим ритмом"
          : lifestyle === "freelancer"
            ? "свободным графиком"
            : lifestyle === "entrepreneur"
              ? "предпринимательской нагрузкой"
              : lifestyle === "parental_leave"
                ? "ритмом заботы о ребенке"
                : lifestyle === "school_student"
                  ? "школьным ритмом"
                  : lifestyle === "unemployed"
                    ? "поиском стабильного ритма"
                    : "текущим ритмом"
      : lifestyle === "student"
        ? "student routine"
        : lifestyle === "working"
          ? "work routine"
          : lifestyle === "freelancer"
            ? "freelance schedule"
            : lifestyle === "entrepreneur"
              ? "entrepreneurial workload"
              : lifestyle === "parental_leave"
                ? "parental leave rhythm"
                : lifestyle === "school_student"
                  ? "school routine"
                  : lifestyle === "unemployed"
                    ? "current transition period"
                    : "current routine";

  const pieces: string[] = [];
  if (goal) {
    if (language === "ru") {
      const goalPrefix = getGenderedText(
        {
          male: "Ты писал, что хочешь",
          female: "Ты писала, что хочешь",
          neutral: "Судя по целям, сейчас важно",
        },
        userPreferences.gender,
        language,
      );
      pieces.push(`${goalPrefix} ${goal.toLowerCase()}, поэтому можно сделать маленький шаг именно в эту сторону.`);
    } else {
      pieces.push(`You mentioned you want to ${goal.toLowerCase()}, so one small step in that direction can make this feel more manageable.`);
    }
  }
  if (interests) {
    pieces.push(
      language === "ru"
        ? `С учетом интересов (${interests}) попробуй выбрать что-то из этого как мягкую поддержку на сегодня.`
        : `Since you enjoy ${interests}, try using one of those as a gentle support action today.`,
    );
  }
  pieces.push(
    language === "ru"
      ? `Можно подстроить это под твой ${lifestylePhrase}, чтобы совет было проще выполнить без лишнего давления.`
      : `You can adapt this to your ${lifestylePhrase} so it feels realistic instead of overwhelming.`,
  );

  return `${baseMessage} ${pieces.join(" ")}`.trim();
}

function buildFallbackAnalysis(manualMood: Mood, language: Language, userPreferences: UserPreferences | null): AIAnalysis {
  const t = translations[language];
  const variant = pickFallback(language, manualMood);
  const personalized = personalizeFallbackMessage(variant.message, language, userPreferences);
  return {
    mood: manualMood,
    moodLabel: t.moods[manualMood],
    emotions: [manualMood],
    emotionLabels: [t.emotionsMap[manualMood]],
    problem: "daily stress",
    problemLabel: t.problemsMap["daily stress"],
    message: personalized,
    advice: personalized,
    tags: ["reflection", "daily-life"],
    tagLabels: [t.tagsMap.reflection, t.tagsMap["daily-life"]],
    tagConfidences: [1, 1],
  };
}

export async function analyzeEntry(
  text: string,
  manualMood: Mood,
  language: Language,
  recentEntries: DiaryEntry[],
  userPreferences: UserPreferences | null,
): Promise<AIAnalysis> {
  const recentContext = recentEntries.slice(0, 5).map((entry) => ({
    date: entry.date,
    mood: entry.mood,
    problem: entry.problem,
    tags: entry.tags,
    text: entry.text.slice(0, 220),
  }));

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, manualMood, language, recentEntries: recentContext, userPreferences }),
  });

  if (response.ok) {
    return (await response.json()) as AIAnalysis;
  }

  return buildFallbackAnalysis(manualMood, language, userPreferences);
}
