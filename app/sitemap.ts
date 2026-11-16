import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "stories/", "guide/", "tools/", "memorial/", "share/"].map((p) => ({ url: `${SITE_URL}/${p}`, changeFrequency: "weekly" as const }));
  const stories = (await getArticles()).map((a) => ({ url: `${SITE_URL}/stories/${a.slug}/`, changeFrequency: "monthly" as const }));
  return [...pages, ...stories];
}
