//=================== Otakudesu Home ===================//

interface OngoingAnime {
    title: string;
    poster: string;
    episodes: number;
    releaseDay: string;
    latestReleaseDate: string;
    animeId: string;
}

interface CompletedAnime {
    title: string;
    poster: string;
    episodes: number;
    score: string;
    lastReleaseDate: string;
    animeId: string;
}

interface HeroData {
    title: string;
    description: string;
    image: string;
    type: 'anime' | 'film' | 'manga' | 'drakor';
    year: string;
    rating: string;
    animeId: string;
    /** Film id (same as FilmCard: /film/{aquaaquariaId}) */
    aquaaquariaId?: string;
    /** Manga id (same as MangaCard: /manga/{mangaId}) */
    mangaId?: string;
}

interface HomeData {
    ongoingList: OngoingAnime[];
    completedList: CompletedAnime[];
    hero: HeroData;
    heroes?: HeroData[];
}

interface Props {
    episodeId: string;
    initialData?: EpisodeDetailData | null;
    apiBase?: string;
    apiSecret?: string;
    recommendedAnimeList?: RecommendedAnime[];
}

//=================== Otakudesu Detail ===================//

interface GenreItem {
    title: string;
    genreId: string;
    otakudesuUrl: string;
}

interface EpisodeItem {
    title: number;
    episodeId: string;
    otakudesuUrl: string;
}

interface RecommendedAnime {
    title: string;
    poster: string;
    animeId: string;
    otakudesuUrl: string;
}

interface AnimeDetailData {
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

interface EpisodeNavItem {
    title: string;
    episodeId: string;
    otakudesuUrl: string;
}

interface ServerItem {
    title: string;
    serverId: string;
}

interface QualityServer {
    title: string;
    serverList: ServerItem[];
}

interface DownloadLink {
    title: string;
    url: string;
}

interface DownloadQuality {
    title: string;
    size: string;
    urls: DownloadLink[];
}

interface EpisodeInfo {
    credit: string;
    encoder: string;
    duration: string;
    type: string;
    genreList: GenreItem[];
    episodeList: EpisodeItem[];
}

interface EpisodeDetailData {
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

interface ScheduleAnimeItem {
    title: string;
    animeId: string;
    otakudesuUrl: string;
}

interface ScheduleDay {
    day: string;
    animeList: ScheduleAnimeItem[];
}

interface ScheduleData {
    days: ScheduleDay[];
}