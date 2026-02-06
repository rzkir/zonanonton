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

interface KomikuRecentSection {
    href: string;
    komikuUrl: string;
    komikuList: KomikuListItem[];
}

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

interface MangaPopularItemWithViews extends MangaPopularItem {
    views: string;
}

interface KomikuPopularSection {
    href: string;
    komikuUrl: string;
    mangaList: MangaPopularItem[] | MangaPopularItemWithViews[];
}

interface MangaHomeData {
    recent: KomikuRecentSection;
    komiku_popular: KomikuPopularSection;
    manga_popular: KomikuPopularSection;
    manhua_popular: KomikuPopularSection;
    manhwa_popular: KomikuPopularSection;
}

interface MangaHomeResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: MangaHomeData;
}

//=================== Komiku Details ===================//

interface KomikuSynopsis {
    paragraphs: string[];
    images: string[];
}

interface KomikuDetailGenre {
    title: string;
    genreId: string;
    href: string;
    komikuUrl: string;
}

interface KomikuDetailChapter {
    title: string;
    chapterId: string;
    href: string;
    komikuUrl: string;
    views: number;
    releaseDate: string;
}

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

interface MangaDetailResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: MangaDetailData;
}

//=================== Komiku Chapter ===================//

interface KomikuChapterImage {
    src: string;
    alt: string;
    id: string;
    fallbackSrc: string;
}

interface KomikuChapterSynopsis {
    paragraphs: string[];
}

interface KomikuChapterRecommended {
    title: string;
    poster: string;
    mangaId: string;
    href: string;
    komikuUrl: string;
    updateStatus: string;
}

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

interface KomikuChapterResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: KomikuChapterData;
}
