import { useQuery } from "@tanstack/react-query";

import {
  getAuditLogs,
} from "../../lib/api/auditApi";

import type {
  AuditFilters,
} from "../../types/audit";


export function useAuditLogs(
  filters: AuditFilters,
) {
  return useQuery({
    queryKey: [
      "audit-logs",
      filters,
    ],
    queryFn: () => getAuditLogs(filters),
    staleTime: 30_000,
  });
}