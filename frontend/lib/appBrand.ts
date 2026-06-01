const DEFAULT_APP_NAME = "Fastnext";

export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || process.env.APP_NAME || DEFAULT_APP_NAME;
}

export function getAppTitleSuffix(): string {
  return getAppName().toUpperCase();
}

export function getPageTitle(pageTitle: string): string {
  return `${pageTitle} - ${getAppTitleSuffix()}`;
}

export function getWelcomeTitle(): string {
  return `Welcome to ${getAppName()}`;
}
