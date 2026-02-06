//=================== Komiku Home ===================// 
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

//=================== Komiku Details ===================//

/** Sinopsis manga (paragraf + gambar preview) */
interface KomikuSynopsis {
    paragraphs: string[];
    images: string[];
}

/** Genre item di halaman detail */
interface KomikuDetailGenre {
    title: string;
    genreId: string;
    href: string;
    komikuUrl: string;
}

/** Item chapter di daftar chapter */
interface KomikuDetailChapter {
    title: string;
    chapterId: string;
    href: string;
    komikuUrl: string;
    views: number;
    releaseDate: string;
}

/** Item manga serupa (similar) */
interface KomikuSimilarManga {
    title: string;
    poster: string;
    mangaId: string;
    href: string;
    komikuUrl: string;
    type: string;
    views: string;
    description: string;
}

/** Data payload response manga detail */
interface MangaDetailData {
    title: string;
    poster: string;
    status: string;
    synopsis: KomikuSynopsis;
    genreList: KomikuDetailGenre[];
    indonesianTitle: string;
    mangaType: string;
    author: string;
    readerAge: string;
    readingDirection: string;
    firstChapter: string;
    latestChapter: string;
    chapterList: KomikuDetailChapter[];
    similarMangaList: KomikuSimilarManga[];
}

/** Response API manga detail */
interface MangaDetailResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: MangaDetailData;
}

//=================== Komiku Chapter ===================//

/** Gambar satu halaman di chapter */
interface KomikuChapterImage {
    src: string;
    alt: string;
    id: string;
    fallbackSrc: string;
}

/** Sinopsis chapter (hanya paragraf) */
interface KomikuChapterSynopsis {
    paragraphs: string[];
}

/** Item rekomendasi di halaman chapter */
interface KomikuChapterRecommended {
    title: string;
    poster: string;
    mangaId: string;
    href: string;
    komikuUrl: string;
    updateStatus: string;
}

/** Data payload response chapter */
interface KomikuChapterData {
    title: string;
    komikuId: string;
    poster: string;
    releasedOn: string;
    synopsis: KomikuChapterSynopsis;
    readingDirection: string;
    chapterImages: KomikuChapterImage[];
    totalImages: number;
    chapterNumber: string;
    recommendedChapters: KomikuChapterRecommended[];
}

/** Response API chapter */
interface KomikuChapterResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: KomikuChapterData;
}
