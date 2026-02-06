import { buildAuthHeaders, type ApiEnv } from "@/lib/api-auth";

import { fetchEnvironment } from "@/lib/FetchEnvironment";

export type { ApiEnv } from "@/lib/api-auth";

export async function fetchMangaHomeData(opts?: ApiEnv | string): Promise<MangaHomeData> {
    const result: MangaHomeData = {
        recent: {
            href: '',
            komikuUrl: '',
            komikuList: [],
        },
        komiku_popular: {
            href: '',
            komikuUrl: '',
            mangaList: [],
        },
        manga_popular: {
            href: '',
            komikuUrl: '',
            mangaList: [],
        },
        manhua_popular: {
            href: '',
            komikuUrl: '',
            mangaList: [],
        },
        manhwa_popular: {
            href: '',
            komikuUrl: '',
            mangaList: [],
        },
    };

    try {
        const environment = await fetchEnvironment();
        const baseURL = environment.data[0].baseURL;
        const response = await fetch(`${baseURL}/komiku/home`, {
            headers: buildAuthHeaders(opts),
        });
        if (!response.ok) return result;

        const json = await response.json();
        if (!json?.ok || !json?.data) return result;

        const data = json.data as Record<string, unknown>;

        type Section = Record<string, unknown> & { komikuList?: unknown[]; mangaList?: unknown[] };
        const pick = (key: string): Section | null => {
            const section = data[key] as Record<string, unknown> | undefined;
            if (!section) return null;
            const list = section.komikuList ?? section.komiku_list ?? section.mangaList ?? section.manga_list;
            return Array.isArray(list) && list.length ? { ...section, komikuList: list, mangaList: list } : null;
        };

        const recentRaw = (data.recent ?? data) as Record<string, unknown> | undefined;
        const recentList = recentRaw?.komikuList ?? recentRaw?.komiku_list;
        if (Array.isArray(recentList) && recentList.length && recentRaw) {
            result.recent = { href: String(recentRaw.href ?? ''), komikuUrl: String(recentRaw.komikuUrl ?? recentRaw.komiku_url ?? ''), komikuList: recentList };
        }

        const komikuPopular = pick("komiku_popular");
        if (komikuPopular) result.komiku_popular = { href: String(komikuPopular.href ?? ''), komikuUrl: String(komikuPopular.komikuUrl ?? komikuPopular.komiku_url ?? ''), mangaList: (komikuPopular.mangaList ?? komikuPopular.komikuList ?? []) as typeof result.komiku_popular.mangaList };

        const mangaPopular = pick("manga_popular");
        if (mangaPopular) result.manga_popular = { href: String(mangaPopular.href ?? ''), komikuUrl: String(mangaPopular.komikuUrl ?? mangaPopular.komiku_url ?? ''), mangaList: (mangaPopular.mangaList ?? mangaPopular.komikuList ?? []) as typeof result.manga_popular.mangaList };

        const manhuaPopular = pick("manhua_popular");
        if (manhuaPopular) result.manhua_popular = { href: String(manhuaPopular.href ?? ''), komikuUrl: String(manhuaPopular.komikuUrl ?? manhuaPopular.komiku_url ?? ''), mangaList: (manhuaPopular.mangaList ?? manhuaPopular.komikuList ?? []) as typeof result.manhua_popular.mangaList };

        const manhwaPopular = pick("manhwa_popular");
        if (manhwaPopular) result.manhwa_popular = { href: String(manhwaPopular.href ?? ''), komikuUrl: String(manhwaPopular.komikuUrl ?? manhwaPopular.komiku_url ?? ''), mangaList: (manhwaPopular.mangaList ?? manhwaPopular.komikuList ?? []) as typeof result.manhwa_popular.mangaList };
    } catch {
        // Fallback: return empty lists
    }

    return result;
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