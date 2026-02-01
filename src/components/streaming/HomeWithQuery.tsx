import { useQuery } from '@tanstack/react-query';

import { fetchHomeDataClient } from '@/lib/api-client';

import { MediaCard } from '@/components/streaming/MediaCard';

function HeroBanner({
  title,
  description,
  image,
  type,
  year,
  rating,
  href,
}: {
  title: string;
  description?: string;
  image: string;
  type: 'anime' | 'drama' | 'film';
  year: string;
  rating?: string;
  href?: string;
}) {
  const typeLabel = { anime: 'Anime', drama: 'Drama', film: 'Film' };
  return (
    <section className="relative h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
      </div>
      <div className="relative z-10 h-full flex items-end max-w-[1600px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-3">
            {typeLabel[type]} · {year}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-3 drop-shadow-lg">
            {title}
          </h1>
          {description && (
            <p className="text-zinc-300 text-base sm:text-lg mb-6 line-clamp-2">{description}</p>
          )}
          <div className="flex flex-wrap gap-3">
            <a
              href={href ?? '#'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors shadow-lg shadow-rose-500/25"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Tonton Sekarang
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Daftar Nonton
            </button>
          </div>
          {rating && (
            <p className="mt-4 text-sm text-zinc-400 flex items-center gap-1">
              <span className="text-amber-400">★</span> {rating}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ContentRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 px-4 sm:px-6">{title}</h2>
      <div
        className="content-row flex gap-3 overflow-x-auto pb-2 px-4 sm:px-6 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {children}
      </div>
    </section>
  );
}

export interface HomeWithQueryProps {
  initialData?: HomeData | null;
}

export function HomeWithQuery({ initialData }: HomeWithQueryProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['home'],
    queryFn: fetchHomeDataClient,
    initialData: initialData ?? undefined,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 text-center text-zinc-400">
        Memuat data…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-zinc-400 mb-2">Gagal memuat data.</p>
        <p className="text-zinc-500 text-sm mb-4">
          Pastikan <code className="bg-white/10 px-1 rounded">PUBLIC_API_BASE</code> dan <code className="bg-white/10 px-1 rounded">PUBLIC_API_SECRET</code> ada di file .env (dev) atau Environment variables (Cloudflare).
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const { ongoingList, completedList, hero } = data;

  return (
    <>
      <HeroBanner
        title={hero.title}
        description={hero.description}
        image={hero.image}
        type={hero.type}
        year={hero.year}
        rating={hero.rating}
        href={hero.href}
      />
      <div className="max-w-[1600px] mx-auto -mt-8 relative z-20">
        <ContentRow title="Ongoing Anime">
          {ongoingList.map((item: OngoingAnime) => (
            <MediaCard
              key={item.animeId}
              title={item.title}
              image={item.poster}
              year={item.latestReleaseDate}
              rating={item.episodes ? `${item.episodes} eps` : ''}
              type="anime"
              href={item.href}
            />
          ))}
        </ContentRow>
        <ContentRow title="Completed Anime">
          {completedList.map((item: CompletedAnime) => (
            <MediaCard
              key={item.animeId}
              title={item.title}
              image={item.poster}
              year={item.lastReleaseDate}
              rating={item.score ?? ''}
              type="anime"
              href={item.href}
            />
          ))}
        </ContentRow>
      </div>
    </>
  );
}
