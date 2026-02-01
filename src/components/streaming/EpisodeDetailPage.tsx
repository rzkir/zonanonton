import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EpisodeDetailWithQuery } from './EpisodeDetailWithQuery';
import type { EpisodeDetailData } from '../../lib/FetchAnime';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, refetchOnWindowFocus: true },
  },
});

export interface EpisodeDetailPageProps {
  episodeId: string;
  initialData?: EpisodeDetailData | null;
}

export function EpisodeDetailPage({ episodeId, initialData }: EpisodeDetailPageProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <EpisodeDetailWithQuery episodeId={episodeId} initialData={initialData} />
    </QueryClientProvider>
  );
}
