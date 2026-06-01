import type { BackendStatus } from "../types/home";

type HealthResponse = {
  status?: string;
  service?: string;
  environment?: string;
};

export async function fetchBackendStatus(apiPrefix: string): Promise<BackendStatus> {
  try {
    const response = await fetch(`${apiPrefix}/v1/health`, { cache: "no-store" });

    if (!response.ok) {
      return { status: "unreachable", detail: `HTTP ${response.status}` };
    }

    const data = (await response.json()) as HealthResponse;

    return {
      status: data.status ?? "unknown",
      detail: data.service ?? "Unknown service",
      environment: data.environment,
    };
  } catch {
    return { status: "unreachable", detail: "Backend is not running" };
  }
}
