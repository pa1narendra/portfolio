import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl.toString(), lastModified: new Date(), priority: 1 }];
}
