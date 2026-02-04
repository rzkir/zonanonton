/** Genre item (used in lastmovie) */
interface FilmGenre {
    title: string;
    genreId: string;
    href: string;
}

/** Slider item - featured films in carousel */
interface FilmSliderItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    releaseDate?: string;
    quality?: string;
}

/** Box office item - films/series in box office section */
interface FilmBoxOfficeItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    score?: string;
    type?: "Series" | "Movie";
    episode?: string;
    quality?: string;
    tailer?: string;
}

/** Serial TV item - TV series section */
interface FilmSerialTvItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    score?: string;
    episode?: string;
    tailer?: string;
}

/** Popular item - popular films/series */
interface FilmPopularItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    type?: "Series" | "Movie";
    episode?: string;
    score?: string;
    quality?: string;
    tailer?: string;
}

/** Anime item - anime section */
interface FilmAnimeItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    releaseDate?: string;
    episode?: string;
    score?: string;
}

/** Last movie item - recently added (can be Movie or TV Show with genreList) */
interface FilmLastMovieItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    type?: string;
    episode?: string;
    tailer?: string;
    score?: string;
    quality?: string;
    duration?: string;
    genreList?: FilmGenre[];
}

/** Main data payload from film API */
interface FilmData {
    slider: FilmSliderItem[];
    boxoffice: FilmBoxOfficeItem[];
    serialtv: FilmSerialTvItem[];
    popular: FilmPopularItem[];
    anime: FilmAnimeItem[];
    lastmovie: FilmLastMovieItem[];
}

/** Film API response wrapper */
interface FilmApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: FilmData;
}