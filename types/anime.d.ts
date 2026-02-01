interface OngoingAnime {
    title: string;
    poster: string;
    episodes: number;
    releaseDay: string;
    latestReleaseDate: string;
    animeId: string;
    href: string;
}

interface CompletedAnime {
    title: string;
    poster: string;
    episodes: number;
    score: string;
    lastReleaseDate: string;
    animeId: string;
    href: string;
}

interface HeroData {
    title: string;
    description: string;
    image: string;
    type: 'anime';
    year: string;
    rating: string;
    href: string;
}

interface HomeData {
    ongoingList: OngoingAnime[];
    completedList: CompletedAnime[];
    hero: HeroData;
}

interface Props {
    episodeId: string;
    initialData?: EpisodeDetailData | null;
    apiBase?: string;
    apiSecret?: string;
    recommendedAnimeList?: RecommendedAnime[];
}



// --- Anime Detail ---

interface GenreItem {
    title: string;
    genreId: string;
    href: string;
    otakudesuUrl: string;
}

interface EpisodeItem {
    title: number;
    episodeId: string;
    href: string;
    otakudesuUrl: string;
}

interface RecommendedAnime {
    title: string;
    poster: string;
    animeId: string;
    href: string;
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
