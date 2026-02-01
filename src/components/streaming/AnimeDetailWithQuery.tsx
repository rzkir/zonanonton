import { useQuery } from '@tanstack/react-query';
import { fetchAnimeDetailClient } from '@/lib/api-client';
import { MediaCard } from '@/components/streaming/MediaCard';
import type { AnimeDetailData } from '../../lib/FetchAnime';

export interface AnimeDetailWithQueryProps {
  animeId: string;
  initialData?: AnimeDetailData | null;
}

export function AnimeDetailWithQuery({ animeId, initialData }: AnimeDetailWithQueryProps) {
  const { data: anime, isLoading, isError, refetch } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => fetchAnimeDetailClient(animeId),
    initialData: initialData ?? undefined,
    staleTime: 60 * 1000,
  });

  if (isLoading && !anime) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 text-center text-zinc-400">
        Memuat…
      </div>
    );
  }

  if (isError && !anime) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-zinc-400 mb-4">Gagal memuat data anime.</p>
        <a
          href="/"
          className="inline-flex gap-2 text-rose-400 hover:text-rose-300"
        >
          ← Kembali ke beranda
        </a>
      </div>
    );
  }

  if (!anime) return null;

  return (
    <article className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-16">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 py-8">
        <div className="shrink-0 w-full lg:w-72 aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a24] border border-white/10">
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover"
            width={288}
            height={432}
          />
        </div>
        <div className="flex-1 min-w-0">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m15 18-6-6 6-6" />
            </svg>
            Kembali
          </a>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            {anime.title}
          </h1>
          {anime.japanese && (
            <p className="text-zinc-400 text-lg mb-6">{anime.japanese}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genreList?.map((g) => (
              <a
                key={g.genreId}
                href={g.href}
                className="px-3 py-1 rounded-lg text-sm bg-white/10 text-zinc-300 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors"
              >
                {g.title}
              </a>
            ))}
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {anime.score && (
              <>
                <dt className="text-zinc-500">Score</dt>
                <dd className="text-white">{anime.score}</dd>
              </>
            )}
            {anime.status && (
              <>
                <dt className="text-zinc-500">Status</dt>
                <dd className="text-white">{anime.status}</dd>
              </>
            )}
            {anime.episodes > 0 && (
              <>
                <dt className="text-zinc-500">Episode</dt>
                <dd className="text-white">{anime.episodes}</dd>
              </>
            )}
            {anime.duration && (
              <>
                <dt className="text-zinc-500">Durasi</dt>
                <dd className="text-white">{anime.duration}</dd>
              </>
            )}
            {anime.aired && (
              <>
                <dt className="text-zinc-500">Tayang</dt>
                <dd className="text-white">{anime.aired}</dd>
              </>
            )}
            {anime.studios && (
              <>
                <dt className="text-zinc-500">Studio</dt>
                <dd className="text-white">{anime.studios}</dd>
              </>
            )}
            {anime.producers && (
              <>
                <dt className="text-zinc-500">Produser</dt>
                <dd className="text-white">{anime.producers}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      {anime.synopsis?.paragraphs?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Sinopsis</h2>
          <div className="text-zinc-300 space-y-3 max-w-3xl">
            {anime.synopsis.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {anime.episodeList?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Daftar Episode</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {anime.episodeList.map((ep) => (
              <a
                key={ep.episodeId}
                href={ep.href}
                className="flex items-center justify-center py-3 rounded-lg bg-[#1a1a24] border border-white/10 text-white font-medium hover:bg-rose-500/20 hover:border-rose-500/30 transition-colors"
              >
                {ep.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {anime.recommendedAnimeList?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 px-4 sm:px-6">Rekomendasi</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 sm:px-6 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
            {anime.recommendedAnimeList.map((rec) => (
              <MediaCard
                key={rec.animeId}
                title={rec.title}
                image={rec.poster}
                type="anime"
                href={rec.href}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
