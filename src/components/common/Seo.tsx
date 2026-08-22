import { useEffect } from 'react';

type StructuredData = Record<string, unknown> | Record<string, unknown>[];

export interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  imagePath?: string;
  noindex?: boolean;
  structuredData?: StructuredData;
}

const SITE_NAME = 'Status 200';

function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'https://status-200.vercel.app';
}

function toAbsoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  return new URL(pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`, getBaseUrl()).toString();
}

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  const tag = existing ?? document.createElement('meta');

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });

  tag.setAttribute('content', content);
  tag.setAttribute('data-seo', 'true');

  if (!existing) {
    document.head.appendChild(tag);
  }
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  const existing = document.head.querySelector<HTMLLinkElement>(selector);
  const tag = existing ?? document.createElement('link');

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });

  tag.setAttribute('data-seo', 'true');

  if (!existing) {
    document.head.appendChild(tag);
  }
}

export function Seo({
  title,
  description,
  canonicalPath,
  imagePath,
  noindex = false,
  structuredData,
}: SeoProps) {
  useEffect(() => {
    const baseUrl = getBaseUrl();
    const canonicalUrl = toAbsoluteUrl(canonicalPath ?? window.location.pathname) ?? baseUrl;
    const imageUrl = toAbsoluteUrl(imagePath);

    document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    upsertMeta('meta[name="description"]', { name: 'description' }, description);
    upsertMeta(
      'meta[name="robots"]',
      { name: 'robots' },
      noindex
        ? 'noindex,nofollow'
        : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    );
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, document.title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME);
    upsertMeta(
      'meta[name="twitter:card"]',
      { name: 'twitter:card' },
      imageUrl ? 'summary_large_image' : 'summary'
    );
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, document.title);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);

    if (imageUrl) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl);
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl);
    }

    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    });

    if (structuredData) {
      const payloads = Array.isArray(structuredData) ? structuredData : [structuredData];

      payloads.forEach((payload, index) => {
        const scriptId = `seo-structured-data-${index}`;
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;

        if (!script) {
          script = document.createElement('script');
          script.type = 'application/ld+json';
          script.id = scriptId;
          script.setAttribute('data-seo', 'true');
          document.head.appendChild(script);
        }

        script.textContent = JSON.stringify(payload);
      });
    }

    return () => {
      document.head.querySelectorAll('[data-seo="true"]').forEach((node) => node.remove());
    };
  }, [canonicalPath, description, imagePath, noindex, structuredData, title]);

  return null;
}
