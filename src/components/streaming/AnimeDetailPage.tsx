import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimeDetailWithQuery } from './AnimeDetailWithQuery';
import type { AnimeDetailData } from '../../lib/FetchAnime';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, refetchOnWindowFocus: true },
  },
});

export interface AnimeDetailPageProps {
  animeId: string;
  initialData?: AnimeDetailData | null;
}

export function AnimeDetailPage({ animeId, initialData }: AnimeDetailPageProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimeDetailWithQuery animeId={animeId} initialData={initialData} />
    </QueryClientProvider>
  );
}
