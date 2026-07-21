import { Helmet } from "react-helmet-async";

const SITE_NAME = "GIHANGA";
const DEFAULT_DESC =
  "GIHANGA is Rwanda's premium fashion marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali.";
const BASE_URL = "https://gihanga.vrt.rw";

export default function Seo({
  title,
  description = DEFAULT_DESC,
  path = "",
  image = "/images/og-default.jpg",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Rwanda's Premium Fashion Marketplace`;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${BASE_URL}${image}`} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={url} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: BASE_URL,
          description: DEFAULT_DESC,
        })}
      </script>
    </Helmet>
  );
}
