import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReadReward from "@/components/ReadReward";
import { AccountButton } from "@/components/Chrome";
import { excerpt, getArticles } from "@/lib/articles";
import { AKC_URL } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getArticles()).find((x) => x.slug === slug);
  if (!a) return {};
  const description = excerpt(a, 150);
  return {
    title: a.title,
    description,
    alternates: { canonical: `/stories/${a.slug}/` },
    openGraph: { type: "article", title: a.title, description, url: `${SITE_URL}/stories/${a.slug}/`, siteName: SITE_NAME, locale: "th_TH", images: [a.cover || "/og.png"] },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getArticles();
  const i = all.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const a = all[i], prev = all[i - 1], next = all[i + 1];

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article", headline: a.title, inLanguage: "th",
    description: excerpt(a, 150), ...(a.cover ? { image: `${SITE_URL}${a.cover}` } : {}), mainEntityOfPage: `${SITE_URL}/stories/${a.slug}/`,
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
  };

  return (
    <article className="reader">
      <header className="phead">
        <AccountButton className="ph-acct" />
        <img src="/img/s39.png" alt="" />
        <div><p className="eb"><Link href="/stories/">เรื่องเล่า</Link> · {a.kind} · อ่าน {a.minutes} นาที</p><h1>{a.title}</h1></div>
      </header>
      <div className="pad stack prose">
        {a.cover && <img className="cover" src={a.cover} alt={a.title} />}
        {a.body.map((p, k) => <p key={k}>{p}</p>)}
        {a.body.some((p) => p.includes("AKC")) && (
          <p className="src">ที่มา: <a href={AKC_URL} target="_blank" rel="noopener noreferrer">American Kennel Club · Chow Chow</a></p>
        )}
        <ReadReward slug={a.slug} />
        <nav className="pn" aria-label="เรื่องก่อนหน้าและถัดไป">
          {prev ? <Link href={`/stories/${prev.slug}/`}>‹ {prev.title}</Link> : <span />}
          {next ? <Link href={`/stories/${next.slug}/`}>{next.title} ›</Link> : <Link href="/stories/">กลับไปหน้าเรื่องเล่า ›</Link>}
        </nav>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
