import type { Metadata } from "next";
import { getAppName, getAppTitleSuffix } from "../lib/appBrand";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: getAppTitleSuffix(),
    template: `%s - ${getAppTitleSuffix()}`,
  },
  description: `${getAppName()} starter template dengan FastAPI backend dan Next.js frontend.`,
  icons: {
    icon: "/fastnext-logo-no-text.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
