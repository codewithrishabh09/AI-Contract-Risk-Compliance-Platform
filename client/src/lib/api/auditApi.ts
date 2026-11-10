import type {
  AuditFilters,
  AuditLogListResponse,
} from "../../types/audit";

import { apiRequest } from "./api";

export async function getAuditLogs(
  filters: AuditFilters = {},
): Promise<AuditLogListResponse> {
  const params = new URLSearchParams();

  if (filters.action) {
    params.set("action", filters.action);
  }

  if (filters.resource_type) {
    params.set("resource_type", filters.resource_type);
  }

  if (filters.user_id) {
    params.set("user_id", filters.user_id);
  }

  if (filters.date_from) {
    params.set("date_from", filters.date_from);
  }

  if (filters.date_to) {
    params.set("date_to", filters.date_to);
  }

  params.set(
    "page",
    String(filters.page ?? 1),
  );

  params.set(
    "page_size",
    String(filters.page_size ?? 25),
  );

  const query = params.toString();

  return apiRequest<AuditLogListResponse>(
    `/audit?${query}`,
  );
}