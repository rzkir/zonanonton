import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeWithQuery } from './HomeWithQuery';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

export interface HomePageProps {
  initialData?: HomeData | null;
}

export function HomePage({ initialData }: HomePageProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeWithQuery initialData={initialData} />
    </QueryClientProvider>
  );
}
