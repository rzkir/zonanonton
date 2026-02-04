const API_BASE = import.meta.env.PUBLIC_API_BASE;

const DEFAULT_API_SECRET = import.meta.env.PUBLIC_API_SECRET;

export type ApiEnv = { apiBase?: string; apiSecret?: string };

export async function fetchMangaHomeData(opts?: ApiEnv | string): Promise<MangaHomeData> {
    const apiBase = (typeof opts === 'object' && opts?.apiBase) ?? API_BASE;
    const secret = (typeof opts === 'object' ? opts?.apiSecret : opts) ?? (typeof import.meta !== 'undefined' && import.meta.env?.API_SECRET) ?? DEFAULT_API_SECRET;
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
        const res = await fetch(`${apiBase}/komiku/home`, {
            headers: {
                'X-API-Key': secret,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return result;

        const json = await res.json();
        if (!json?.ok || !json?.data) return result;

        const { recent, komiku_popular, manga_popular, manhua_popular, manhwa_popular } = json.data;

        if (recent?.komikuList?.length) {
            result.recent = recent;
        }

        if (komiku_popular?.mangaList?.length) {
            result.komiku_popular = komiku_popular;
        }

        if (manga_popular?.mangaList?.length) {
            result.manga_popular = manga_popular;
        }

        if (manhua_popular?.mangaList?.length) {
            result.manhua_popular = manhua_popular;
        }

        if (manhwa_popular?.mangaList?.length) {
            result.manhwa_popular = manhwa_popular;
        }
    } catch {
        // Fallback: return empty lists
    }

    return result;
}
