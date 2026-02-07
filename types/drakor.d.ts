//=================== Drakor Home ===================//

interface DrakorGenre {
    title: string;
    genreId: string;
    href: string;
}

interface DrakorCountry {
    title: string;
    countriesId: string;
    href: string;
}

interface DrakorAnimeItem {
    title: string;
    poster: string;
    episodes: number;
    score: string;
    latestReleaseDate: string;
    duration: string;
    countryList: DrakorCountry[];
    genreList: DrakorGenre[];
    animeId: string;
    href: string;
}

interface DrakorAnimeSection {
    href: string;
    animeList: DrakorAnimeItem[];
}

interface DrakorData {
    ongoing: DrakorAnimeSection;
    drama_terbaru: DrakorAnimeSection;
}

interface DrakorApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: DrakorData;
}

//=================== Drakor Detail ===================//

interface DrakorStatus {
    title: string;
    statusId: string;
    href: string;
}

interface DrakorAired {
    title: string;
    yearId: string;
    href: string;
}

interface DrakorStudio {
    title: string;
    studioId: string;
    href: string;
}

interface DrakorReleaseDay {
    title: string;
    dayId: string;
    href: string;
}

interface DrakorAgeRating {
    title: string;
    ratingId: string;
    href: string;
}

interface DrakorSynopsis {
    paragraphs: string[];
}

interface DrakorEpisodeItem {
    title: number;
    episodeTitle: string;
    episodeId: string;
    href: string;
}

interface DrakorType {
    title: string;
    typeId: string;
    href: string;
}

interface DrakorRecommendedItem {
    title: string;
    poster: string;
    animeId: string;
    href: string;
    latestReleaseDate: string;
    episodes: number;
    score: string;
    rating: string;
    duration: string;
    countryList: DrakorCountry[];
    genreList: DrakorGenre[];
}

interface DrakorDetailData {
    title: string;
    poster: string;
    japanese: string;
    score: string;
    producers: string;
    status: DrakorStatus[];
    episodes: number;
    duration: string;
    aired: DrakorAired[];
    original_network: DrakorStudio[];
    banner: string[];
    releaseDays: DrakorReleaseDay[];
    ageRating: DrakorAgeRating[];
    synopsis: DrakorSynopsis;
    genreList: DrakorGenre[];
    episodeList: DrakorEpisodeItem[];
    recommendedAnimeList: DrakorRecommendedItem[];
    type: DrakorType;
}

interface DrakorDetailApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: DrakorDetailData;
}

//=================== Drakor Episode Detail ===================//
interface DrakorEpisodeServer {
    title: string;
    serverId: string;
    href: string;
}

interface DrakorEpisodeQuality {
    title: string;
    serverList: DrakorEpisodeServer[];
}

interface DrakorEpisodeNav {
    title: string;
    episodeId: string;
    href: string;
}

interface DrakorEpisodeListItem {
    title: number;
    episodeTitle: string;
    episodeId: string;
    href: string;
    is_active: boolean;
}

interface DrakorEpisodeDetailData {
    defaultStreamingUrl: string;
    qualities: DrakorEpisodeQuality[];
    prevEpisode: DrakorEpisodeNav | null;
    nextEpisode: DrakorEpisodeNav | null;
    episodeList: DrakorEpisodeListItem[];
}

interface DrakorEpisodeDetailApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: DrakorEpisodeDetailData;
}

/** API response when resolving a server stream URL (GET /dramaid/server/...) */
interface DrakorServerUrlApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: { url: string };
}

/** Server stream data from GET /dramaid/server/{serverId}?serverHref=&serverId= */
interface DrakorServerData {
    url: string;
}

interface DrakorServerApiResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: DrakorServerData;
}
