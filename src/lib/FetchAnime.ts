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

// --- Anime Detail ---

export interface GenreItem {
    title: string;
    genreId: string;
    href: string;
    otakudesuUrl: string;
}

export interface EpisodeItem {
    title: number;
    episodeId: string;
    href: string;
    otakudesuUrl: string;
}

export interface RecommendedAnime {
    title: string;
    poster: string;
    animeId: string;
    href: string;
    otakudesuUrl: string;
}

export interface AnimeDetailData {
    title: string;
    poster: string;
    japanese: string;
    score: string;
    producers: string;
    status: string;
    episodes: number;
    duration: string;
    aired: string;
    studios: string;
    batch: string | null;
    synopsis: { paragraphs: string[]; connections: unknown[] };
    genreList: GenreItem[];
    episodeList: EpisodeItem[];
    recommendedAnimeList: RecommendedAnime[];
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
