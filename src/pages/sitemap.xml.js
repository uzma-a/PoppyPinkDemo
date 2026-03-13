// src/pages/sitemap.xml.js

function generateSiteMap() {
  const baseUrl = "https://poppypinkshoes.com";

  const pages = [
    { url: "/",        priority: "1.0", changefreq: "weekly"  },
    { url: "/products",priority: "0.9", changefreq: "weekly"  },
    { url: "/about",   priority: "0.7", changefreq: "monthly" },
    { url: "/track",   priority: "0.6", changefreq: "monthly" },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(({ url, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>`;
}

export default function SiteMap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(sitemap);
  res.end();

  return { props: {} };
}