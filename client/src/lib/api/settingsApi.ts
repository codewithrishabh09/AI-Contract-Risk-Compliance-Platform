import { apiRequest } from "./api";

export interface SettingsAccount {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsOrganization {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsSecurity {
  authentication: string;
  session: string;
  account_created_at: string;
}

export interface SettingsResponse {
  account: SettingsAccount;
  organization: SettingsOrganization;
  security: SettingsSecurity;
}

export async function getSettings(): Promise<SettingsResponse> {
  return apiRequest<SettingsResponse>("/settings");
}