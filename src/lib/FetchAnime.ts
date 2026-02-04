import { buildAuthHeaders, type ApiEnv } from "@/lib/api-auth";

import { fetchEnvironment } from "@/lib/FetchEnvironment";

export type { ApiEnv } from "@/lib/api-auth";

export async function fetchHomeData(opts?: ApiEnv | string): Promise<HomeData> {
    const result: HomeData = {
        ongoingList: [],
        completedList: [],
        hero: { title: '', description: '', image: '', type: 'anime', year: '', rating: '', animeId: '' },
        heroes: [],
    };

    try {
        const environment = await fetchEnvironment();
        const firstEnv = environment?.data?.[0];
        if (!firstEnv?.baseURL) {
            console.error("[FetchAnime] fetchHomeData: no baseURL in environment", { dataLength: environment?.data?.length });
            return result;
        }
        const baseURL = firstEnv.baseURL;
        const response = await fetch(`${baseURL}/otakudesu/home`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) {
            console.error("[FetchAnime] fetchHomeData: home API not ok", response.status, baseURL);
            return result;
        }

        const json = await response.json();
        if (!json?.ok || !json?.data) {
            console.error("[FetchAnime] fetchHomeData: invalid home response", { ok: json?.ok, hasData: !!json?.data });
            return result;
        }

        const data = json.data as Record<string, unknown>;
        const ongoing = (data.ongoing ?? data) as { animeList?: unknown[]; anime_list?: unknown[] };
        const completed = (data.completed ?? data) as { animeList?: unknown[]; anime_list?: unknown[] };
        const ongoingList = ongoing?.animeList ?? ongoing?.anime_list ?? [];
        const completedListRaw = completed?.animeList ?? completed?.anime_list ?? [];

        const toHero = (item: { title: string; poster: string; episodes: number; latestReleaseDate?: string; releaseDay?: string; animeId?: string }) => ({
            title: item.title,
            description: `${item.episodes} episode · Terbaru ${item.latestReleaseDate ?? ''} (${item.releaseDay ?? ''})`,
            image: item.poster,
            type: 'anime' as const,
            year: item.latestReleaseDate ?? '',
            rating: '',
            animeId: item.animeId ?? '',
        });

        if (ongoingList?.length) {
            result.ongoingList = ongoingList as typeof result.ongoingList;
            const first = ongoingList[0] as Parameters<typeof toHero>[0];
            result.hero = toHero(first);
        }

        if (completedListRaw?.length) {
            result.completedList = completedListRaw as typeof result.completedList;
        }

        // Build up to 3 heroes for carousel: from ongoing first, then completed
        const heroes: HeroData[] = [];
        if (result.ongoingList?.length) {
            for (let i = 0; i < Math.min(3, result.ongoingList.length); i++) {
                heroes.push(toHero(result.ongoingList[i]));
            }
        }
        let completedIdx = 0;
        while (heroes.length < 3 && result.completedList?.length && completedIdx < result.completedList.length) {
            const c = result.completedList[completedIdx++];
            heroes.push({
                title: c.title,
                description: `${c.episodes} episode · Score ${c.score}`,
                image: c.poster,
                type: 'anime',
                year: c.lastReleaseDate ?? '',
                rating: c.score,
                animeId: c.animeId ?? '',
            });
        }
        result.heroes = heroes.length ? heroes : [result.hero];
    } catch (err) {
        console.error("[FetchAnime] fetchHomeData error:", err instanceof Error ? err.message : err);
        result.heroes = [result.hero];
    }

    return result;
}

export async function fetchAnimeDetail(
    animeId: string,
    opts?: ApiEnv | string
): Promise<AnimeDetailData | null> {
    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/otakudesu/anime/${animeId}`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return null;

        const json = await response.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as AnimeDetailData;
    } catch {
        return null;
    }
}

export async function fetchEpisodeDetail(
    episodeId: string,
    opts?: ApiEnv | string
): Promise<EpisodeDetailData | null> {
    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/otakudesu/episode/${episodeId}`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return null;

        const json = await response.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as EpisodeDetailData;
    } catch {
        return null;
    }
}

export async function fetchSchedule(opts?: ApiEnv | string): Promise<ScheduleData> {
    const result: ScheduleData = { days: [] };

    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/otakudesu/schedule`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return result;

        const json = await response.json();
        if (!json?.ok || !json?.data?.days) return result;

        result.days = json.data.days as ScheduleDay[];
    } catch {
        // Fallback: return empty days
    }

    return result;
}