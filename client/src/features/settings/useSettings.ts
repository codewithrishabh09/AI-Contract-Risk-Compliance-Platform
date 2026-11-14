import { useQuery } from "@tanstack/react-query";

import { getSettings } from "../../lib/api/settingsApi";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 60_000,
  });
}