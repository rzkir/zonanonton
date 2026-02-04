/** Item dalam daftar recent (komikuList) */
interface KomikuListItem {
    title: string;
    poster: string;
    komikuId: string;
    href: string;
    komikuUrl: string;
    type: string;
    latestChapter: string;
    latestChapterUrl: string;
    episodes: string;
    releasedOn: string;
}

/** Bagian recent di data */
interface KomikuRecentSection {
    href: string;
    komikuUrl: string;
    komikuList: KomikuListItem[];
}

/** Item manga popular (tanpa views, dipakai di komiku_popular) */
interface MangaPopularItem {
    title: string;
    poster: string;
    mangaId: string;
    href: string;
    komikuUrl: string;
    type: string;
    latestChapter: string;
    latestChapterUrl: string;
    isHot: boolean;
}

/** Item manga popular dengan views (manga_popular, manhua_popular, manhwa_popular) */
interface MangaPopularItemWithViews extends MangaPopularItem {
    views: string;
}

/** Section popular (komiku_popular, manga_popular, manhua_popular, manhwa_popular) */
interface KomikuPopularSection {
    href: string;
    komikuUrl: string;
    mangaList: MangaPopularItem[] | MangaPopularItemWithViews[];
}

/** Data payload response manga home */
interface MangaHomeData {
    recent: KomikuRecentSection;
    komiku_popular: KomikuPopularSection;
    manga_popular: KomikuPopularSection;
    manhua_popular: KomikuPopularSection;
    manhwa_popular: KomikuPopularSection;
}

/** Response API manga home */
interface MangaHomeResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: MangaHomeData;
}
