import { Helmet } from 'react-helmet-async';

interface SeoHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogUrl?: string;
  type?: 'website' | 'article' | 'product' | 'software';
  noindex?: boolean;
}

const defaultOgImage = 'https://petwellly.com/og-default.svg';
const siteUrl = 'https://petwellly.com';

export function SeoHelmet({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogUrl,
  type = 'website',
  noindex = false,
}: SeoHelmetProps) {
  const fullTitle = title.includes('Petwellly') ? title : `${title} | Petwellly`;
  const fullCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`) : undefined;
  const fullOgUrl = ogUrl ? (ogUrl.startsWith('http') ? ogUrl : `${siteUrl}${ogUrl}`) : fullCanonical;
  const fullOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`) : defaultOgImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type === 'software' ? 'website' : type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Petwellly" />
      <meta property="og:locale" content="es_ES" />
      {fullOgUrl && <meta property="og:url" content={fullOgUrl} />}
      <meta property="og:image" content={fullOgImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  );
}
