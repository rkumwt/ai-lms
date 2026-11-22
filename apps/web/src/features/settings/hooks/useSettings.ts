import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getSettings, updateSettings, type SettingsPatch } from '@/api/settings';
import { queryKeys } from '@/lib/queryKeys';

export function useSettings() {
  return useQuery({ queryKey: queryKeys.settings, queryFn: getSettings, staleTime: Infinity });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: SettingsPatch) => updateSettings(patch),
    onSuccess: (settings) => queryClient.setQueryData(queryKeys.settings, settings),
  });
}
