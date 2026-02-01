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
    href: '#',
};

export async function fetchHomeData(opts?: ApiEnv | string): Promise<HomeData> {
    const apiBase = (typeof opts === 'object' && opts?.apiBase) ?? API_BASE;
    const secret = (typeof opts === 'object' ? opts?.apiSecret : opts) ?? (typeof import.meta !== 'undefined' && import.meta.env?.API_SECRET) ?? DEFAULT_API_SECRET;
    const result: HomeData = {
        ongoingList: [],
        completedList: [],
        hero: { ...defaultHero },
    };

    try {
        const res = await fetch(`${apiBase}/home`, {
            headers: {
                'X-API-Key': secret,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return result;

        const json = await res.json();
        if (!json?.ok || !json?.data) return result;

        const { ongoing, completed } = json.data;

        if (ongoing?.animeList?.length) {
            result.ongoingList = ongoing.animeList;
            const first = ongoing.animeList[0];
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

        if (completed?.animeList?.length) {
            result.completedList = completed.animeList;
        }
    } catch {
        // Fallback: return default hero and empty lists
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
        const res = await fetch(`${apiBase}/anime/${animeId}`, {
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
    href: string;
    otakudesuUrl: string;
}

export interface ServerItem {
    title: string;
    serverId: string;
    href: string;
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
        const res = await fetch(`${apiBase}/episode/${episodeId}`, {
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
    href: string;
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
        const res = await fetch(`${apiBase}/schedule`, {
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
