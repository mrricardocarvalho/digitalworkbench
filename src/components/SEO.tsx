import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  readingTime?: number;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Ricardo Carvalho - Senior Dynamics 365 Business Central Developer",
  description = "Senior D365 BC Developer with 8+ years experience architecting robust and scalable ERP solutions. Specialized in AL development, Azure DevOps, and enterprise migrations.",
  keywords = "Dynamics 365, Business Central, AL Developer, ERP Solutions, Microsoft Partner, Azure DevOps, D365 BC Development, Enterprise Software",
  ogImage = "https://mrricardocarvalho.github.io/digitalworkbench/og-image.jpg",
  canonical = "https://mrricardocarvalho.github.io/digitalworkbench/",
  author = "Ricardo Carvalho",
  publishedTime,
  modifiedTime,
  articleSection = "Technology",
  readingTime,
  structuredData
}) => {
  useEffect(() => {
    try {
      // Ensure we're in browser environment
      if (typeof document === 'undefined') return;

      // Update document title
      document.title = title;

      // Helper function to safely update meta tags
      const updateMetaTag = (selector: string, content: string) => {
        try {
          const element = document.querySelector(selector);
          if (element) {
            element.setAttribute('content', content);
          }
        } catch (error) {
          console.warn(`Failed to update meta tag ${selector}:`, error);
        }
      };

      // Helper function to safely create or update link tags
      const updateLinkTag = (rel: string, href: string) => {
        try {
          let link = document.querySelector(`link[rel="${rel}"]`);
          if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', rel);
            document.head.appendChild(link);
          }
          link.setAttribute('href', href);
        } catch (error) {
          console.warn(`Failed to update link tag ${rel}:`, error);
        }
      };

      // Update meta tags safely
      updateMetaTag('meta[name="description"]', description);
      updateMetaTag('meta[name="keywords"]', keywords);
      updateMetaTag('meta[name="author"]', author);
      updateMetaTag('meta[property="og:title"]', title);
      updateMetaTag('meta[property="og:description"]', description);
      updateMetaTag('meta[property="og:image"]', ogImage);
      updateMetaTag('meta[property="og:type"]', publishedTime ? 'article' : 'website');
      updateMetaTag('meta[property="og:url"]', canonical);
      updateMetaTag('meta[property="twitter:card"]', 'summary_large_image');
      updateMetaTag('meta[property="twitter:title"]', title);
      updateMetaTag('meta[property="twitter:description"]', description);
      updateMetaTag('meta[property="twitter:image"]', ogImage);
      updateMetaTag('meta[property="twitter:creator"]', '@ricardocarvalho');

      // Article-specific meta tags
      if (publishedTime) {
        updateMetaTag('meta[property="article:published_time"]', publishedTime);
        updateMetaTag('meta[property="article:author"]', author);
        updateMetaTag('meta[property="article:section"]', articleSection);
        if (modifiedTime) {
          updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
        }
        if (readingTime) {
          updateMetaTag('meta[name="twitter:label1"]', 'Reading time');
          updateMetaTag('meta[name="twitter:data1"]', `${readingTime} min read`);
        }
      }

      // Update canonical URL safely
      updateLinkTag('canonical', canonical);

      // Add structured data for articles
      if (structuredData || publishedTime) {
        const defaultStructuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": title,
          "description": description,
          "author": {
            "@type": "Person",
            "name": author,
            "url": "https://mrricardocarvalho.github.io/digitalworkbench/"
          },
          "publisher": {
            "@type": "Person",
            "name": author,
            "url": "https://mrricardocarvalho.github.io/digitalworkbench/"
          },
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "image": ogImage,
          "url": canonical,
          "mainEntityOfPage": canonical,
          "articleSection": articleSection,
          ...(readingTime && { "timeRequired": `PT${readingTime}M` })
        };

        const schemaData = structuredData || defaultStructuredData;
        
        // Remove existing structured data
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaData);
        document.head.appendChild(script);
      }

    } catch (error) {
      console.error('SEO component error:', error);
    }
  }, [title, description, keywords, ogImage, canonical, author, publishedTime, modifiedTime, articleSection, readingTime, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;
