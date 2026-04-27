import { PlaceRecommendation } from "@/lib/types";
import { Language } from "@/lib/i18n";

const CATEGORIES = [
  { key: "psychologist", query: "[\"healthcare\"~\"psychologist|counselling\"]" },
  { key: "massage", query: "[\"shop\"=\"massage\"]" },
  { key: "yoga_or_gym", query: "[\"leisure\"~\"fitness_centre|sports_centre\"]" },
  { key: "clinic", query: "[\"amenity\"=\"clinic\"]" },
];

export function shouldSuggestNearbyHelp(text: string, tags: string[]) {
  const source = `${text} ${tags.join(" ")}`.toLowerCase();
  return /(fatigue|pain|stress|anxious|anxiety|depressed|mental|health|sleep|стресс|тревог|депресс|здоров|боль|устал|сон)/.test(source);
}

export async function fetchNearbyPlaces(lat: number, lon: number, language: Language): Promise<PlaceRecommendation[]> {
  const radius = 5000;
  const queryBody = CATEGORIES.map(
    (c) => `node${c.query}(around:${radius},${lat},${lon});way${c.query}(around:${radius},${lat},${lon});`,
  ).join("\n");
  const query = `[out:json][timeout:25];(${queryBody});out center 30;`;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  if (!response.ok) return [];
  const data = await response.json();
  const elements = (data.elements ?? []) as Array<Record<string, unknown>>;

  return elements.slice(0, 20).map((el, index) => {
    const tags = (el.tags as Record<string, string> | undefined) ?? {};
    const latValue = (el.lat as number | undefined) ?? (el.center as { lat?: number } | undefined)?.lat ?? lat;
    const lonValue = (el.lon as number | undefined) ?? (el.center as { lon?: number } | undefined)?.lon ?? lon;

    return {
      id: String(el.id ?? index),
      name: tags.name ?? (language === "ru" ? "Без названия" : "Unnamed place"),
      category: tags.healthcare ?? tags.shop ?? tags.leisure ?? tags.amenity ?? (language === "ru" ? "Поддержка" : "Support"),
      address: [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" "),
      lat: latValue,
      lon: lonValue,
    };
  });
}
