import { buildAuthHeaders, type ApiEnv } from "@/lib/api-auth";

import { fetchEnvironment } from "@/lib/FetchEnvironment";

export type { ApiEnv } from "@/lib/api-auth";

export async function fetchMangaHomeData(opts?: ApiEnv | string): Promise<MangaHomeData> {
    const empty: MangaHomeData = {
        recent: [],
        komiku_popular: [],
        manga_popular: [],
        manhua_popular: [],
        manhwa_popular: [],
    };

    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/komiku/home`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return empty;

        const json = (await response.json()) as MangaHomeResponse;
        if (!json?.ok || !json?.data) return empty;

        const { recent, komiku_popular, manga_popular, manhua_popular, manhwa_popular } =
            json.data;

        return {
            recent: Array.isArray(recent) ? (recent as KomikuListItem[]) : [],
            komiku_popular: Array.isArray(komiku_popular)
                ? (komiku_popular as MangaPopularItem[])
                : [],
            manga_popular: Array.isArray(manga_popular)
                ? (manga_popular as MangaPopularItemWithViews[])
                : [],
            manhua_popular: Array.isArray(manhua_popular)
                ? (manhua_popular as MangaPopularItemWithViews[])
                : [],
            manhwa_popular: Array.isArray(manhwa_popular)
                ? (manhwa_popular as MangaPopularItemWithViews[])
                : [],
        };
    } catch {
        // Fallback: return empty lists
        return empty;
    }
}

export async function fetchMangaDetail(
    komikuId: string,
    opts?: ApiEnv | string
): Promise<MangaDetailData | null> {
    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/komiku/manga/${komikuId}`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return null;

        const json = await response.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as MangaDetailData;
    } catch {
        return null;
    }
}

export async function fetchMangaChapter(
    chapterId: string,
    opts?: ApiEnv | string
): Promise<KomikuChapterData | null> {
    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/komiku/manga/chapter/${chapterId}`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return null;

        const json = await response.json();
        if (!json?.ok || !json?.data) return null;

        return json.data as KomikuChapterData;
    } catch {
        return null;
    }
}