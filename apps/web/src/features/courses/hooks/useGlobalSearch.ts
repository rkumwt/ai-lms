import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchAll } from '@/api/search';
import { queryKeys } from '@/lib/queryKeys';

export function useGlobalSearch(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: queryKeys.search(q),
    queryFn: () => searchAll(q),
    enabled: q.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
