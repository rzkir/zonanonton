import { buildAuthHeaders, type ApiEnv } from "@/lib/api-auth";

import { fetchEnvironment } from "@/lib/FetchEnvironment";

export type { ApiEnv } from "@/lib/api-auth";

const emptyDrakorData: DrakorData = {
    ongoing: { href: "", animeList: [] },
    drama_terbaru: { href: "", animeList: [] },
};

export async function fetchDrakor(opts?: ApiEnv | string): Promise<DrakorData> {
    try {
        const environment = await fetchEnvironment();
        const firstEnv = environment?.data?.[0];
        if (!firstEnv?.baseURL) {
            console.error("[FetchDrakor] fetchDrakor: no baseURL in environment", {
                dataLength: environment?.data?.length,
            });
            return emptyDrakorData;
        }

        const baseURL = firstEnv.baseURL;
        const response = await fetch(`${baseURL}/dramaid/home`, {
            headers: buildAuthHeaders(opts),
        });

        if (!response.ok) {
            console.error("[FetchDrakor] fetchDrakor: API not ok", response.status, baseURL);
            return emptyDrakorData;
        }

        const json: DrakorApiResponse = await response.json();

        if (!json?.ok || !json?.data) {
            console.error("[FetchDrakor] fetchDrakor: invalid response", {
                ok: json?.ok,
                hasData: !!json?.data,
            });
            return emptyDrakorData;
        }

        return json.data;
    } catch (err) {
        console.error(
            "[FetchDrakor] fetchDrakor error:",
            err instanceof Error ? err.message : err
        );
        return emptyDrakorData;
    }
}

export async function fetchDrakorDetail(
    animeId: string,
    opts?: ApiEnv | string
): Promise<DrakorDetailData | null> {
    try {
        const environment = await fetchEnvironment();
        const firstEnv = environment?.data?.[0];
        if (!firstEnv?.baseURL) {
            console.error("[FetchDrakor] fetchDrakorDetail: no baseURL", {
                hasData: !!environment?.data,
                dataLength: environment?.data?.length,
            });
            return null;
        }

        const baseURL = firstEnv.baseURL;
        const url = `${baseURL}/dramaid/anime/${encodeURIComponent(animeId)}`;
        const response = await fetch(url, {
            headers: buildAuthHeaders(opts),
        });

        if (!response.ok) {
            console.error("[FetchDrakor] fetchDrakorDetail: API not ok", response.status, url);
            return null;
        }

        const json = await response.json();
        if (!json?.ok || !json?.data) {
            console.error("[FetchDrakor] fetchDrakorDetail: invalid response", {
                ok: json?.ok,
                hasData: !!json?.data,
            });
            return null;
        }

        return json.data as DrakorDetailData;
    } catch (err) {
        console.error(
            "[FetchDrakor] fetchDrakorDetail error:",
            err instanceof Error ? err.message : err
        );
        return null;
    }
}

export async function fetchDrakorEpisodeDetail(
    animeId: string,
    episodeId: string,
    opts?: ApiEnv | string
): Promise<DrakorEpisodeDetailData | null> {
    try {
        const environment = await fetchEnvironment();
        const firstEnv = environment?.data?.[0];
        if (!firstEnv?.baseURL) {
            console.error("[FetchDrakor] fetchDrakorEpisodeDetail: no baseURL", {
                hasData: !!environment?.data,
            });
            return null;
        }

        const baseURL = firstEnv.baseURL;
        const url = `${baseURL}/dramaid/episode/${encodeURIComponent(animeId)}/${encodeURIComponent(episodeId)}`;
        const response = await fetch(url, {
            headers: buildAuthHeaders(opts),
        });

        if (!response.ok) {
            console.error("[FetchDrakor] fetchDrakorEpisodeDetail: API not ok", response.status, url);
            return null;
        }

        const json: DrakorEpisodeDetailApiResponse = await response.json();
        if (!json?.ok || !json?.data) {
            console.error("[FetchDrakor] fetchDrakorEpisodeDetail: invalid response", {
                ok: json?.ok,
                hasData: !!json?.data,
            });
            return null;
        }

        return json.data;
    } catch (err) {
        console.error(
            "[FetchDrakor] fetchDrakorEpisodeDetail error:",
            err instanceof Error ? err.message : err
        );
        return null;
    }
}

/**
 * Resolve stream URL for a server. API returns { ok, data: { url } }.
 * Optional serverHref is sent as query param if the backend requires it.
 */
export async function fetchDrakorServerStreamUrl(
    serverId: string,
    serverHref?: string | null,
    opts?: ApiEnv | string
): Promise<string | null> {
    try {
        const environment = await fetchEnvironment();
        const firstEnv = environment?.data?.[0];
        if (!firstEnv?.baseURL) return null;

        const baseURL = firstEnv.baseURL;
        const encodedId = encodeURIComponent(serverId);
        const url = new URL(`${baseURL}/dramaid/server/${encodedId}`);
        if (serverHref) {
            url.searchParams.set("serverHref", serverHref);
            url.searchParams.set("serverId", serverId);
        }
        const response = await fetch(url.toString(), {
            headers: buildAuthHeaders(opts),
        });

        if (!response.ok) return null;

        const json: DrakorServerApiResponse = await response.json();
        if (!json?.ok || !json?.data?.url) return null;
        return json.data.url;
    } catch (err) {
        console.error(
            "[FetchDrakor] fetchDrakorServerStreamUrl error:",
            err instanceof Error ? err.message : err
        );
        return null;
    }
}