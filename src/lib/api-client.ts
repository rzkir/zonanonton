/**
 * Client-side API (browser). Pakai PUBLIC_ env agar tersedia di client.
 * Untuk build/deploy: set PUBLIC_API_BASE dan PUBLIC_API_SECRET di Cloudflare Pages (Environment variables).
 */

import type {
  AnimeDetailData,
  EpisodeDetailData,
  ScheduleData,
} from "@/lib/FetchAnime";

// Di browser hanya PUBLIC_* yang tersedia (Vite/Astro)
const getBase = () =>
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_BASE) || '';
const getSecret = () =>
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_SECRET) || '';

async function clientFetch<T>(
  path: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T }> {
  const base = getBase();
  const secret = getSecret();
  if (!base || !secret) {
    return { ok: false };
  }
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'X-API-Key': secret,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) return { ok: false };
  const json = await res.json();
  if (!json?.ok || !json?.data) return { ok: false };
  return { ok: true, data: json.data as T };
}

export async function fetchHomeDataClient(): Promise<HomeData> {
  const { ok, data } = await clientFetch<HomeData>('/home');
  const result: HomeData = {
    ongoingList: [],
    completedList: [],
    hero: {
      title: 'StreamHub Anime',
      description: 'Nonton anime ongoing dan completed dengan subtitle Indonesia.',
      image:
        'https://otakudesu.best/wp-content/uploads/2025/10/Fumetsu-no-Anata-e-Season-2-Sub.jpg',
      type: 'anime',
      year: '',
      rating: '',
      href: '#',
    },
  };
  if (!ok || !data) return result;
  const { ongoingList, completedList } = data;
  if (ongoingList?.length) {
    result.ongoingList = ongoingList;
    const first = result.ongoingList[0];
    result.hero = {
      title: first.title,
      description: `${first.episodes} episode · Terbaru ${first.latestReleaseDate} (${first.releaseDay})`,
      image: first.poster,
      type: 'anime',
      year: first.latestReleaseDate,
      rating: '',
      href: first.href ?? '#',
    };
  }
  if (completedList?.length) {
    result.completedList = completedList;
  }
  return result;
}

export async function fetchAnimeDetailClient(animeId: string): Promise<AnimeDetailData | null> {
  const { ok, data } = await clientFetch<AnimeDetailData>(`/anime/${animeId}`);
  return ok && data ? data : null;
}

export async function fetchEpisodeDetailClient(
  episodeId: string
): Promise<EpisodeDetailData | null> {
  const { ok, data } = await clientFetch<EpisodeDetailData>(`/episode/${episodeId}`);
  return ok && data ? data : null;
}

/** Resolve server path/id to embed URL. API returns { data: { url: "https://..." } }. */
export async function fetchServerUrlClient(serverIdOrPath: string): Promise<string | null> {
  const id = serverIdOrPath.replace(/^.*\/server\//i, '').replace(/\/$/, '') || serverIdOrPath;
  const { ok, data } = await clientFetch<{ url: string }>(`/server/${id}`);
  return ok && data?.url ? data.url : null;
}

/** Fetch schedule (days + anime per day). */
export async function fetchScheduleClient(): Promise<ScheduleData> {
  const { ok, data } = await clientFetch<ScheduleData>("/schedule");
  const result: ScheduleData = { days: [] };
  if (!ok || !data?.days) return result;
  result.days = data.days;
  return result;
}
