//=================== Aquaaquaria Home ===================//

interface FilmGenre {
    title: string;
    genreId: string;
    href: string;
}

interface FilmSliderItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    releaseDate?: string;
    quality?: string;
}

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

interface FilmSerialTvItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    score?: string;
    episode?: string;
    tailer?: string;
}

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

interface FilmAnimeItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    releaseDate?: string;
    episode?: string;
    score?: string;
}

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

interface FilmData {
    slider: FilmSliderItem[];
    boxoffice: FilmBoxOfficeItem[];
    serialtv: FilmSerialTvItem[];
    popular: FilmPopularItem[];
    anime: FilmAnimeItem[];
    lastmovie: FilmLastMovieItem[];
}

interface FilmApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: FilmData;
}

//=================== Aquaaquaria Detail ===================//

interface AquariaDetailsDirector {
    title: string;
    directorId: string;
    href: string;
}

interface AquariaDetailsCastItem {
    title: string;
    castId: string;
    href: string;
}

interface AquariaDetailsRelatedItem {
    title: string;
    poster: string;
    aquaaquariaId: string;
    href: string;
    genres: string[];
    releaseDate: string;
}

interface AquariaDetailsServerListItem {
    title: string;
    serverId: string;
    href: string;
}

interface AquariaDetailsQuality {
    title: string;
    serverList: AquariaDetailsServerListItem[];
}

interface AquariaDetailsServer {
    qualities: AquariaDetailsQuality[];
}

interface AquariaDetailsEpisodeItem {
    title: string;
    episodeNumber: number;
    episodeId: string;
    href: string;
}

interface AquariaDetailsData {
    title: string;
    aquaaquariaId: string;
    score: string;
    director: AquariaDetailsDirector;
    aired: string;
    duration: string;
    episodes: number | string | null;
    defaultStream: string;
    country: string;
    poster: string;
    description: string;
    cast: AquariaDetailsCastItem[];
    genreList: FilmGenre[];
    relatedList: AquariaDetailsRelatedItem[];
    server: AquariaDetailsServer;
    episodeList: AquariaDetailsEpisodeItem[];
}

interface AquariaDetails {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: AquariaDetailsData;
}

//=================== Aquaaquaria Episode Details ===================//

interface AquariaEpisodeDetailsData {
    title: string;
    aquaaquariaId: string;
    episodes: number | string | null;
    defaultStream: string;
    server: AquariaDetailsServer;
    episodeList: AquariaDetailsEpisodeItem[];
}

interface AquariaEpisodeDetails {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
}

//=================== Aquaaquaria Server ===================//

/** API response when resolving a server stream URL */
interface ServerUrlApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: { url: string };
}
