"use client";

import { useState } from "react";
import { fetchNearbyPlaces, shouldSuggestNearbyHelp } from "@/lib/places";
import { PlaceRecommendation } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

export function NearbyHelp({ text, tags }: { text: string; tags: string[] }) {
  const [places, setPlaces] = useState<PlaceRecommendation[]>([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();

  if (!shouldSuggestNearbyHelp(text, tags)) return null;

  const loadNearby = async () => {
    setLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const result = await fetchNearbyPlaces(position.coords.latitude, position.coords.longitude, language);
          setPlaces(result);
          setLoading(false);
        });
      }
    } catch {
      setLoading(false);
    }
  };

  const searchByCity = async () => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const geoData = (await geo.json()) as Array<{ lat: string; lon: string }>;
      if (geoData[0]) {
        const result = await fetchNearbyPlaces(Number(geoData[0].lat), Number(geoData[0].lon), language);
        setPlaces(result);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-semibold text-slate-900">{t.nearbyHelp}</h3>
      <p className="mt-2 text-sm text-slate-700">
        {t.nearbyHelpText}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={loadNearby} className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white">
          {t.useMyLocation}
        </button>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t.enterCity}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
        <button onClick={searchByCity} className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white">
          {t.searchArea}
        </button>
      </div>
      {loading && <p className="mt-2 text-sm text-slate-600">{t.loadingNearby}</p>}
      <div className="mt-3 space-y-2">
        {places.map((p) => (
          <a
            key={p.id}
            className="block rounded-xl border border-slate-200 p-3 text-sm hover:bg-slate-50"
            href={`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="font-medium text-slate-900">{p.name}</p>
            <p className="text-slate-600">{p.category}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
