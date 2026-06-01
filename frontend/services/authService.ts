import { fetchCurrentUser, loginUser, logoutUser, updateCurrentUser as updateCurrentUserApi } from "../repositories/authRepository";
import type { AuthUser, ProfileUpdatePayload } from "../types/auth";

const CSRF_COOKIE_NAME = "begos_finance_csrf";

export function getApiPrefix(): string {
  return process.env.NEXT_PUBLIC_API_PREFIX || "/api";
}

export async function clearToken(): Promise<void> {
  await logoutUser(getApiPrefix(), getCsrfToken());
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const response = await loginUser(getApiPrefix(), email, password);
  return response.user;
}

export async function getCurrentUser(): Promise<AuthUser> {
  return fetchCurrentUser(getApiPrefix());
}

export async function updateCurrentUser(payload: ProfileUpdatePayload): Promise<AuthUser> {
  return updateCurrentUserApi(getApiPrefix(), getCsrfToken(), payload);
}

function getCsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const csrfCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${CSRF_COOKIE_NAME}=`));

  return csrfCookie ? decodeURIComponent(csrfCookie.split("=").slice(1).join("=")) : null;
}
