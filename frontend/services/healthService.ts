import { fetchBackendStatus } from "../repositories/healthRepository";
import type { BackendStatus } from "../types/home";

export function getInitialBackendStatus(): BackendStatus {
  return {
    status: "checking",
    detail: "Checking backend connection...",
  };
}

export async function getBackendStatus(apiPrefix: string): Promise<BackendStatus> {
  return fetchBackendStatus(apiPrefix);
}
