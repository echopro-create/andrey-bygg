const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const serviceSlugs = [
  "windows-doors",
  "kitchen-assembly",
  "bathroom-renovation",
  "tiling",
  "painting",
  "roofing-woodwork",
];

const locales = ["sv", "en", "ru", "uk"];

const staticImages = [
  { path: "/images/hero-bg-v3.webp", caption: "BYGG I SYD — Hero Background" },
  { path: "/images/og-image.webp", caption: "BYGG I SYD — OG Image" },
  { path: "/images/builder-portrait-v3.webp", caption: "BYGG I SYD — Builder Portrait" },
];

const galleryImages = Array.from({ length: 10 }, (_, i) => ({
  path: `/images/gallery/gallery-${i + 1}_v2.webp`,
  caption: `BYGG I SYD — Gallery Image ${i + 1}`,
}));

function escapeXml(str: string): string {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function imageEntry(path: string, caption: string): string {
  return `    <image:image>
      <image:loc>${escapeXml(`${SITE_URL}${path}`)}</image:loc>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>`;
}

export async function GET() {
  const entries: string[] = [];

  for (const lng of locales) {
    const localeUrl = `${SITE_URL}/${lng}`;
    const allStatic = [...staticImages, ...galleryImages]
      .map((img) => imageEntry(img.path, img.caption))
      .join("\n");
    entries.push(`  <url>
    <loc>${escapeXml(localeUrl)}</loc>
${allStatic}
  </url>`);

    for (const service of serviceSlugs) {
      const serviceUrl = `${localeUrl}/services/${service}`;
      const imgPath = `/images/services/${service}.webp`;
      entries.push(`  <url>
    <loc>${escapeXml(serviceUrl)}</loc>
${imageEntry(imgPath, `${service.replace(/-/g, " ")} — BYGG I SYD`)}
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
