const deployedHost =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL;

export const siteUrl = new URL(
  deployedHost
    ? deployedHost.startsWith("http")
      ? deployedHost
      : `https://${deployedHost}`
    : "http://localhost:3000",
);
