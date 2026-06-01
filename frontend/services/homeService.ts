import { getHomepageContent } from "../repositories/homeRepository";
import type { HomepageViewModel } from "../types/home";
import { getAppName, getAppTitleSuffix } from "../lib/appBrand";

export function getHomepageViewModel(): HomepageViewModel {
  const appName = getAppName();
  const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || "/api";
  const content = getHomepageContent();

  return {
    ...content,
    hero: {
      ...content.hero,
      eyebrow: `${getAppTitleSuffix()} starter kit`,
      title: appName,
    },
    appName,
    apiPrefix,
  };
}
