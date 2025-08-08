import { useEffect } from 'react';
import { pageSEOConfig, generateArticleSEO, generateProjectSEO, getOGImage, generateArticleStructuredData } from '../utils/seoConfig';

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
  structuredData?: object | object[];
  // Enhanced props for our new system
  pageType?: keyof typeof pageSEOConfig;
  articleSlug?: string;
  projectSlug?: string;
  tags?: string[];
  technologies?: string[];
  // Verification props
  googleSiteVerification?: string;
  bingVerification?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  author = "Ricardo Carvalho",
  publishedTime,
  modifiedTime,
  articleSection = "Technology",
  readingTime,
  structuredData,
  // Enhanced props
  pageType,
  articleSlug,
  projectSlug,
  tags,
  technologies,
  // Verification props
  googleSiteVerification,
  bingVerification
}) => {
  useEffect(() => {
    try {
      if (typeof document === 'undefined') return;

      // Determine SEO data source
      let seoData;
      
      if (pageType && pageSEOConfig[pageType]) {
        // Use predefined page configuration
        seoData = pageSEOConfig[pageType];
      } else if (articleSlug && title && description) {
        // Generate article SEO
        seoData = generateArticleSEO(articleSlug, title, description, tags);
      } else if (projectSlug && title && description) {
        // Generate project SEO
        seoData = generateProjectSEO(projectSlug, title, description, technologies);
      } else {
        // Fall back to provided props or defaults
        seoData = {
          title: title || "Ricardo Carvalho - Senior Dynamics 365 Business Central Developer",
          description: description || "Senior D365 BC Developer with 8+ years experience architecting robust and scalable ERP solutions. Specialized in AL development, Azure DevOps, and enterprise migrations.",
          keywords: keywords || "Dynamics 365, Business Central, AL Developer, ERP Solutions, Microsoft Partner, Azure DevOps, D365 BC Development, Enterprise Software",
          canonical: canonical || "https://mrricardocarvalho.github.io/digitalworkbench/"
        };
      }

      // Override with provided props if available
      const finalTitle = title || seoData.title;
      const finalDescription = description || seoData.description;
      const finalKeywords = keywords || seoData.keywords;
      const finalCanonical = canonical || seoData.canonical;
      const finalOgImage = ogImage || seoData.ogImage || getOGImage('page');

      document.title = finalTitle;

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

      updateMetaTag('meta[name="description"]', finalDescription);
      updateMetaTag('meta[name="keywords"]', finalKeywords);
      updateMetaTag('meta[name="author"]', author);
      updateMetaTag('meta[property="og:title"]', finalTitle);
      updateMetaTag('meta[property="og:description"]', finalDescription);
      updateMetaTag('meta[property="og:image"]', finalOgImage);
      updateMetaTag('meta[property="og:type"]', publishedTime ? 'article' : 'website');
      updateMetaTag('meta[property="og:url"]', finalCanonical);
      updateMetaTag('meta[property="twitter:card"]', 'summary_large_image');
      updateMetaTag('meta[property="twitter:title"]', finalTitle);
      updateMetaTag('meta[property="twitter:description"]', finalDescription);
      updateMetaTag('meta[property="twitter:image"]', finalOgImage);
      updateMetaTag('meta[property="twitter:creator"]', '@ricardocarvalho');

      // Site verification meta tags
      if (googleSiteVerification) {
        updateMetaTag('meta[name="google-site-verification"]', googleSiteVerification);
      }
      if (bingVerification) {
        updateMetaTag('meta[name="msvalidate.01"]', bingVerification);
      }

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

      updateLinkTag('canonical', finalCanonical);

      // Add structured data 
      if (structuredData || articleSlug || pageType) {
        let finalStructuredData;
        
        if (structuredData) {
          // Handle both single objects and arrays of structured data
          finalStructuredData = Array.isArray(structuredData) ? structuredData : [structuredData];
        } else if (articleSlug && tags) {
          finalStructuredData = [generateArticleStructuredData(
            finalTitle, 
            finalDescription, 
            articleSlug, 
            publishedTime, 
            modifiedTime, 
            tags, 
            readingTime
          )];
        }

        if (finalStructuredData) {
          // Remove existing structured data scripts
          const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
          existingScripts.forEach(script => script.remove());

          // Add new structured data scripts
          finalStructuredData.forEach((data, index) => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-schema-index', index.toString());
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
          });
        }
      }

    } catch (error) {
      console.error('SEO component error:', error);
    }
  }, [title, description, keywords, ogImage, canonical, author, publishedTime, modifiedTime, articleSection, readingTime, structuredData, pageType, articleSlug, projectSlug, tags, technologies, googleSiteVerification, bingVerification]);

  return null;
};

export default SEO;
