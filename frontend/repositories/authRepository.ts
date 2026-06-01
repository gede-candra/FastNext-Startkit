import type { AuthUser, LoginResponse, ProfileUpdatePayload } from "../types/auth";

export async function loginUser(
  apiPrefix: string,
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${apiPrefix}/v1/auth/login`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || "Login gagal.");
  }

  return (await response.json()) as LoginResponse;
}

export async function logoutUser(apiPrefix: string, csrfToken: string | null): Promise<void> {
  const response = await fetch(`${apiPrefix}/v1/auth/logout`, {
    credentials: "include",
    headers: csrfToken ? { "X-CSRF-Token": csrfToken } : undefined,
    method: "POST",
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || "Logout gagal.");
  }
}

export async function fetchCurrentUser(apiPrefix: string): Promise<AuthUser> {
  const response = await fetch(`${apiPrefix}/v1/auth/me`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || "Sesi tidak valid.");
  }

  return (await response.json()) as AuthUser;
}

export async function updateCurrentUser(
  apiPrefix: string,
  csrfToken: string | null,
  payload: ProfileUpdatePayload,
): Promise<AuthUser> {
  const response = await fetch(`${apiPrefix}/v1/auth/me`, {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || "Gagal memperbarui profil.");
  }

  return (await response.json()) as AuthUser;
}

async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = (await response.json()) as { detail?: unknown };
    return typeof data.detail === "string" ? data.detail : null;
  } catch {
    return null;
  }
}
