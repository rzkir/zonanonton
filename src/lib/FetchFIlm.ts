import { buildAuthHeaders, type ApiEnv } from "@/lib/api-auth";

import { fetchEnvironment } from "@/lib/FetchEnvironment";

export type { ApiEnv } from "@/lib/api-auth";

const emptyFilmData: FilmData = {
    slider: [],
    boxoffice: [],
    serialtv: [],
    popular: [],
    anime: [],
    lastmovie: [],
};

export async function fetchFilmHomeData(opts?: ApiEnv | string): Promise<FilmData> {
    try {
        const environment = await fetchEnvironment();
        const firstEnv = environment?.data?.[0];
        if (!firstEnv?.baseURL) {
            console.error("[FetchFilm] fetchFilmHomeData: no baseURL in environment", {
                dataLength: environment?.data?.length,
            });
            return emptyFilmData;
        }

        const baseURL = firstEnv.baseURL;
        const response = await fetch(`${baseURL}/aquaaquaria/home`, {
            headers: buildAuthHeaders(opts),
        });

        if (!response.ok) {
            console.error("[FetchFilm] fetchFilmHomeData: API not ok", response.status, baseURL);
            return emptyFilmData;
        }

        const json: FilmApiResponse = await response.json();

        if (!json?.ok || !json?.data) {
            console.error("[FetchFilm] fetchFilmHomeData: invalid response", {
                ok: json?.ok,
                hasData: !!json?.data,
            });
            return emptyFilmData;
        }

        return json.data;
    } catch (err) {
        console.error(
            "[FetchFilm] fetchFilmHomeData error:",
            err instanceof Error ? err.message : err
        );
        return emptyFilmData;
    }
}

export async function fetchFilmDetail(
    aquaaquariaId: string,
    opts?: ApiEnv | string
): Promise<AquariaDetailsData | null> {
    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/aquaaquaria/${aquaaquariaId}`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return null;

        const json = await response.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as AquariaDetailsData;
    } catch {
        return null;
    }
}

export async function fetchFilmEpisodeDetail(
    episodeId: string,
    opts?: ApiEnv | string
): Promise<AquariaEpisodeDetailsData | null> {
    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/aquaaquaria/episode/${episodeId}`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return null;

        const json = await response.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as AquariaEpisodeDetailsData;
    } catch {
        return null;
    }
}

export async function fetchFilmServerStreamUrl(
    serverId: string,
    opts?: ApiEnv | string
): Promise<string | null> {
    try {
        const environment = await fetchEnvironment();
        const baseURL = environment?.data?.[0]?.baseURL;
        if (!baseURL) return null;
        const response = await fetch(`${baseURL}/aquaaquaria/server/${serverId}`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return null;
        const json: ServerUrlApiResponse = await response.json();
        if (!json?.ok || !json?.data?.url) return null;
        return json.data.url;
    } catch {
        return null;
    }
}