export type Mood = "sad" | "neutral" | "happy" | "angry" | "anxious" | "tired";

export interface AIAnalysis {
  mood: Mood;
  moodLabel?: string;
  emotions: string[];
  emotionLabels?: string[];
  problem: string;
  problemLabel?: string;
  message?: string;
  advice: string;
  tags: string[];
  tagLabels?: string[];
}

export interface DiaryEntry extends AIAnalysis {
  id: string;
  date: string;
  text: string;
  energy: number;
  manualMood: Mood;
  updatedAt?: string;
  isEdited: boolean;
}

export interface PatternInsight {
  key: string;
  count: number;
  message: string;
}

export interface RecurringProblemSupport {
  problem: string;
  count: number;
  explanation: string;
  possibleCause: string;
  steps: string[];
}

export interface PlaceRecommendation {
  id: string;
  name: string;
  category: string;
  address?: string;
  lat: number;
  lon: number;
}

export interface UserPreferences {
  interests: string[];
  lifestyle: "student" | "working" | "mixed" | "unemployed" | "freelancer" | "entrepreneur" | "parental_leave" | "school_student";
  goals: string;
  helps: Array<"sport" | "music" | "walking" | "talking_to_friends" | "games">;
  supportStyles: Array<
    | "supportive_friend"
    | "motivational"
    | "reflective"
    | "practical_advice"
    | "short_direct"
    | "calm_gentle"
    | "deep_reflection"
  >;
  avoidSuggestions?: string;
  ageGroup?: "under_18" | "18_25" | "25_40" | "40_plus";
  gender?: "male" | "female" | "prefer_not_to_say";
}

export type ChatRole = "user" | "assistant";

export type AIPersonality = "supportive" | "motivational" | "calm" | "analytical";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}
