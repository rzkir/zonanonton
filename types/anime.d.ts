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