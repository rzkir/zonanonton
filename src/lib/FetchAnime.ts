const API_BASE = import.meta.env.PUBLIC_API_BASE;

const DEFAULT_API_SECRET = import.meta.env.PUBLIC_API_SECRET;

export type ApiEnv = { apiBase?: string; apiSecret?: string };

const defaultHero: HeroData = {
    title: 'StreamHub Anime',
    description: 'Nonton anime ongoing dan completed dengan subtitle Indonesia.',
    image: 'https://otakudesu.best/wp-content/uploads/2025/10/Fumetsu-no-Anata-e-Season-2-Sub.jpg',
    type: 'anime',
    year: '',
    rating: '',
    animeId: '',
};

export async function fetchHomeData(opts?: ApiEnv | string): Promise<HomeData> {
    const apiBase = (typeof opts === 'object' && opts?.apiBase) ?? API_BASE;
    const secret = (typeof opts === 'object' ? opts?.apiSecret : opts) ?? (typeof import.meta !== 'undefined' && import.meta.env?.API_SECRET) ?? DEFAULT_API_SECRET;
    const result: HomeData = {
        ongoingList: [],
        completedList: [],
        hero: { ...defaultHero },
        heroes: [],
    };

    try {
        const res = await fetch(`${apiBase}/otakudesu/home`, {
            headers: {
                'X-API-Key': secret,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return result;

        const json = await res.json();
        if (!json?.ok || !json?.data) return result;

        const { ongoing, completed } = json.data;

        const toHero = (item: { title: string; poster: string; episodes: number; latestReleaseDate?: string; releaseDay?: string; animeId?: string }) => ({
            title: item.title,
            description: `${item.episodes} episode · Terbaru ${item.latestReleaseDate ?? ''} (${item.releaseDay ?? ''})`,
            image: item.poster,
            type: 'anime' as const,
            year: item.latestReleaseDate ?? '',
            rating: '',
            animeId: item.animeId ?? '',
        });

        if (ongoing?.animeList?.length) {
            result.ongoingList = ongoing.animeList;
            const first = ongoing.animeList[0];
            result.hero = toHero(first);
        }

        if (completed?.animeList?.length) {
            result.completedList = completed.animeList;
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
    } catch {
        // Fallback: return default hero and empty lists
        result.heroes = [result.hero];
    }

    return result;
}

export async function fetchAnimeDetail(
    animeId: string,
    opts?: ApiEnv | string
): Promise<AnimeDetailData | null> {
    const apiBase = (typeof opts === 'object' && opts?.apiBase) ?? API_BASE;
    const secret = (typeof opts === 'object' ? opts?.apiSecret : opts) ?? (typeof import.meta !== 'undefined' && import.meta.env?.API_SECRET) ?? DEFAULT_API_SECRET;

    try {
        const res = await fetch(`${apiBase}/otakudesu/anime/${animeId}`, {
            headers: {
                'X-API-Key': secret,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return null;

        const json = await res.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as AnimeDetailData;
    } catch {
        return null;
    }
}

// --- Episode Detail ---

export interface EpisodeNavItem {
    title: string;
    episodeId: string;
    otakudesuUrl: string;
}

export interface ServerItem {
    title: string;
    serverId: string;
}

export interface QualityServer {
    title: string;
    serverList: ServerItem[];
}

export interface DownloadLink {
    title: string;
    url: string;
}

export interface DownloadQuality {
    title: string;
    size: string;
    urls: DownloadLink[];
}

export interface EpisodeInfo {
    credit: string;
    encoder: string;
    duration: string;
    type: string;
    genreList: GenreItem[];
    episodeList: EpisodeItem[];
}

export interface EpisodeDetailData {
    title: string;
    animeId: string;
    releaseTime: string;
    defaultStreamingUrl: string;
    hasPrevEpisode: boolean;
    prevEpisode: EpisodeNavItem | null;
    hasNextEpisode: boolean;
    nextEpisode: EpisodeNavItem | null;
    server: { qualities: QualityServer[] };
    downloadUrl: { qualities: DownloadQuality[] };
    info: EpisodeInfo;
}

export async function fetchEpisodeDetail(
    episodeId: string,
    opts?: ApiEnv | string
): Promise<EpisodeDetailData | null> {
    const apiBase = (typeof opts === 'object' && opts?.apiBase) ?? API_BASE;
    const secret = (typeof opts === 'object' ? opts?.apiSecret : opts) ?? (typeof import.meta !== 'undefined' && import.meta.env?.API_SECRET) ?? DEFAULT_API_SECRET;

    try {
        const res = await fetch(`${apiBase}/otakudesu/episode/${episodeId}`, {
            headers: {
                'X-API-Key': secret,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return null;

        const json = await res.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as EpisodeDetailData;
    } catch {
        return null;
    }
}

// --- Schedule ---

export interface ScheduleAnimeItem {
    title: string;
    animeId: string;
    otakudesuUrl: string;
}

export interface ScheduleDay {
    day: string;
    animeList: ScheduleAnimeItem[];
}

export interface ScheduleData {
    days: ScheduleDay[];
}

export async function fetchSchedule(opts?: ApiEnv | string): Promise<ScheduleData> {
    const apiBase = (typeof opts === 'object' && opts?.apiBase) ?? API_BASE;
    const secret = (typeof opts === 'object' ? opts?.apiSecret : opts) ?? (typeof import.meta !== 'undefined' && import.meta.env?.API_SECRET) ?? DEFAULT_API_SECRET;
    const result: ScheduleData = { days: [] };

    try {
        const res = await fetch(`${apiBase}/otakudesu/schedule`, {
            headers: {
                'X-API-Key': secret,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return result;

        const json = await res.json();
        if (!json?.ok || !json?.data?.days) return result;

        result.days = json.data.days as ScheduleDay[];
    } catch {
        // Fallback: return empty days
    }

    return result;
}
