import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEpisodeDetailClient, fetchServerUrlClient } from '@/lib/api-client';
import type { EpisodeDetailData, ServerItem } from '../../lib/FetchAnime';

export interface EpisodeDetailWithQueryProps {
  episodeId: string;
  initialData?: EpisodeDetailData | null;
}

function getServerId(s: ServerItem): string {
  if (/^https?:\/\//i.test(s.href)) return s.serverId;
  const m = s.href.match(/\/server\/([^/]+)/i);
  return m ? m[1] : s.serverId;
}

export function EpisodeDetailWithQuery({ episodeId, initialData }: EpisodeDetailWithQueryProps) {
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});
  const [loadingServerId, setLoadingServerId] = useState<string | null>(null);

  const { data: episode, isLoading, isError } = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => fetchEpisodeDetailClient(episodeId),
    initialData: initialData ?? undefined,
    staleTime: 60 * 1000,
  });

  if (isLoading && !episode) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 text-center text-zinc-400">
        Memuat…
      </div>
    );
  }

  if (isError && !episode) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-zinc-400 mb-4">Gagal memuat episode.</p>
        <a href="/" className="inline-flex gap-2 text-rose-400 hover:text-rose-300">
          ← Kembali ke beranda
        </a>
      </div>
    );
  }

  if (!episode) return null;

  const animeHref = `/otakudesu/anime/${episode.animeId}`;

  return (
    <article className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <a
          href={animeHref}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Kembali ke anime
        </a>
        <div className="flex gap-2">
          {episode.hasPrevEpisode && episode.prevEpisode && (
            <a
              href={episode.prevEpisode.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="m15 18-6-6 6-6" />
              </svg>
              Episode Sebelumnya
            </a>
          )}
          {episode.hasNextEpisode && episode.nextEpisode && (
            <a
              href={episode.nextEpisode.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-sm font-medium transition-colors"
            >
              Episode Berikutnya
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          )}
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{episode.title}</h1>
      {episode.releaseTime && (
        <p className="text-zinc-500 text-sm mb-6">{episode.releaseTime}</p>
      )}

      <section className="mb-8">
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
          {selectedServerId !== null && !resolvedUrls[selectedServerId] && loadingServerId === selectedServerId && (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">Memuat server…</div>
          )}
          <iframe
            key={selectedServerId ?? 'default'}
            src={
              selectedServerId === null
                ? episode.defaultStreamingUrl
                : resolvedUrls[selectedServerId] || episode.defaultStreamingUrl
            }
            title={episode.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={
              selectedServerId !== null && !resolvedUrls[selectedServerId]
                ? { display: 'none' }
                : undefined
            }
          />
        </div>
      </section>

      {episode.server?.qualities?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Server streaming</h2>
          <div className="space-y-4">
            {episode.server.qualities.map((q, i) => (
              <div key={i}>
                <p className="text-zinc-400 text-sm font-medium mb-2">{q.title}</p>
                <div className="flex flex-wrap gap-2">
                  {q.serverList.map((s) => {
                    const serverId = getServerId(s);
                    const isActive = selectedServerId === serverId;
                    const isLoading = loadingServerId === serverId;
                    const handleClick = async (e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (/^https?:\/\//i.test(s.href)) {
                        setSelectedServerId(serverId);
                        setResolvedUrls((prev) => ({ ...prev, [serverId]: s.href }));
                        return;
                      }
                      if (resolvedUrls[serverId]) {
                        setSelectedServerId(serverId);
                        return;
                      }
                      setLoadingServerId(serverId);
                      const url = await fetchServerUrlClient(serverId);
                      setLoadingServerId(null);
                      if (url) {
                        setResolvedUrls((prev) => ({ ...prev, [serverId]: url }));
                        setSelectedServerId(serverId);
                      }
                    };
                    return (
                      <button
                        key={s.serverId}
                        type="button"
                        onClick={handleClick}
                        disabled={isLoading}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${isActive
                            ? 'bg-rose-500/30 text-white border-rose-500/50'
                            : 'bg-[#1a1a24] border-white/10 text-zinc-300 hover:bg-rose-500/20 hover:text-white hover:border-rose-500/30'
                          } ${isLoading ? 'opacity-60 cursor-wait' : ''}`}
                      >
                        {isLoading ? '…' : s.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {episode.downloadUrl?.qualities?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Download</h2>
          <div className="space-y-3">
            {episode.downloadUrl.qualities.map((q, i) => (
              <details key={i} className="rounded-xl bg-[#1a1a24] border border-white/10 overflow-hidden group">
                <summary className="px-4 py-3 cursor-pointer list-none flex items-center justify-between text-white font-medium hover:bg-white/5 transition-colors">
                  <span>{q.title}</span>
                  <span className="text-zinc-500 text-sm">{q.size}</span>
                </summary>
                <div className="px-4 pb-4 pt-0 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  {q.urls.map((u, j) => (
                    <a
                      key={j}
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-sm transition-colors"
                    >
                      {u.title}
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {episode.info?.episodeList?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-3">Daftar episode</h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {episode.info.episodeList.map((ep) => (
              <a
                key={ep.episodeId}
                href={ep.href}
                className={`flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-colors ${ep.episodeId === episodeId
                  ? 'bg-rose-500/30 text-white border border-rose-500/50'
                  : 'bg-[#1a1a24] border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {ep.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
