/**
 * SEO Configuration for Digital Workbench
 * Centralized SEO data for all pages and routes
 */

const BASE_URL = 'https://mrricardocarvalho.github.io/digitalworkbench';

interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage?: string;
  type?: 'website' | 'article';
}

/**
 * SEO configurations for static pages
 */
export const pageSEOConfig: Record<string, PageSEO> = {
  home: {
    title: "Ricardo Carvalho - Senior Dynamics 365 Business Central Developer",
    description: "Senior D365 BC Developer with 8+ years experience architecting robust and scalable ERP solutions. Specialized in AL development, Azure DevOps, and enterprise migrations.",
    keywords: "Dynamics 365, Business Central, AL Developer, ERP Solutions, Microsoft Partner, Azure DevOps, D365 BC Development, Enterprise Software",
    canonical: `${BASE_URL}/`,
    type: 'website'
  },
  
  resume: {
    title: "Resume - Ricardo Carvalho | Senior Business Central Developer",
    description: "Professional experience, certifications, and achievements of a senior Business Central developer with 8+ years in ERP development, AL programming, and Azure DevOps.",
    keywords: "Ricardo Carvalho Resume, Business Central Developer Experience, AL Programming, ERP Development, Azure DevOps, Microsoft Dynamics 365",
    canonical: `${BASE_URL}/resume`,
    type: 'website'
  },
  
  projects: {
    title: "Projects Portfolio - Ricardo Carvalho | Business Central Solutions",
    description: "Development projects and case studies showcasing technical expertise in Business Central, AL extensions, integrations, and enterprise ERP solutions.",
    keywords: "Business Central Projects, AL Extensions, ERP Solutions, Technical Portfolio, Integration Projects, Microsoft Dynamics 365 Development",
    canonical: `${BASE_URL}/projects`,
    type: 'website'
  },
  
  insights: {
    title: "Business Central Articles & Insights - Technical Development Blog",
    description: "Technical articles, tutorials, and insights on Business Central development, AL programming, performance optimization, and enterprise implementation strategies.",
    keywords: "Business Central Articles, AL Programming Tutorials, ERP Development Blog, Performance Optimization, Technical Insights, Dynamics 365 Tips",
    canonical: `${BASE_URL}/insights`,
    type: 'website'
  },
  
  contact: {
    title: "Contact Ricardo Carvalho - Business Central Development Consultation",
    description: "Get in touch for Business Central development projects, AL programming consultation, ERP implementations, and technical advisory services.",
    keywords: "Business Central Consultant, AL Developer Contact, ERP Development Services, Technical Consultation, Dynamics 365 Expert",
    canonical: `${BASE_URL}/contact`,
    type: 'website'
  }
};

/**
 * Generate SEO data for blog articles
 */
export const generateArticleSEO = (
  slug: string, 
  title: string, 
  description: string, 
  tags?: string[]
): PageSEO => {
  // Optimize title for SEO (60 chars max for good display)
  let seoTitle = title;
  if (title.length > 55) {
    seoTitle = title.substring(0, 52) + '...';
  }

  // Optimize description (120-160 chars for good display)
  let seoDescription = description;
  if (description.length > 160) {
    seoDescription = description.substring(0, 157) + '...';
  } else if (description.length < 120) {
    seoDescription = `${description} Learn advanced Business Central development techniques from a senior AL developer with 8+ years of experience.`;
  }

  // Generate keywords from tags + common terms
  const baseKeywords = [
    'Business Central',
    'AL Development', 
    'Microsoft Dynamics 365',
    'ERP Solutions'
  ];
  
  const articleKeywords = tags ? [...baseKeywords, ...tags] : baseKeywords;

  return {
    title: `${seoTitle} - Ricardo Carvalho`,
    description: seoDescription,
    keywords: articleKeywords.join(', '),
    canonical: `${BASE_URL}/insights/${slug}`,
    type: 'article'
  };
};

/**
 * Generate SEO data for project pages
 */
export const generateProjectSEO = (
  slug: string,
  title: string,
  description: string,
  technologies?: string[]
): PageSEO => {
  let seoTitle = title;
  if (title.length > 55) {
    seoTitle = title.substring(0, 52) + '...';
  }

  let seoDescription = description;
  if (description.length > 160) {
    seoDescription = description.substring(0, 157) + '...';
  }

  const baseKeywords = [
    'Development Project',
    'Technical Portfolio',
    'Software Development',
    'Ricardo Carvalho'
  ];

  const projectKeywords = technologies ? [...baseKeywords, ...technologies] : baseKeywords;

  return {
    title: `${seoTitle} - Project Case Study`,
    description: seoDescription,
    keywords: projectKeywords.join(', '),
    canonical: `${BASE_URL}/projects/${slug}`,
    type: 'article'
  };
};

/**
 * Get appropriate OG image for different content types
 */
export const getOGImage = (type: 'home' | 'article' | 'project' | 'page' = 'page'): string => {
  const images = {
    home: `${BASE_URL}/og-home.jpg`,
    article: `${BASE_URL}/og-article.jpg`,
    project: `${BASE_URL}/og-project.jpg`,
    page: `${BASE_URL}/og-default.jpg`
  };

  return images[type];
};

/**
 * Generate structured data for articles
 */
export const generateArticleStructuredData = (
  title: string,
  description: string,
  slug: string,
  publishedTime?: string,
  modifiedTime?: string,
  tags?: string[],
  readingTime?: number
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": "Ricardo Carvalho",
      "url": "https://mrricardocarvalho.github.io/digitalworkbench/",
      "jobTitle": "Senior Dynamics 365 Business Central Developer",
      "knowsAbout": ["Dynamics 365", "Business Central", "AL Development", "ERP Solutions", "Azure DevOps"],
      "sameAs": [
        "https://www.linkedin.com/in/ricardo-carvalho-05741519",
        "https://github.com/mrricardocarvalho"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Ricardo Carvalho - Digital Workbench",
        "url": "https://mrricardocarvalho.github.io/digitalworkbench/"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ricardo Carvalho - Digital Workbench",
      "url": "https://mrricardocarvalho.github.io/digitalworkbench/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mrricardocarvalho.github.io/digitalworkbench/favicon.svg",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://www.linkedin.com/in/ricardo-carvalho-05741519",
        "https://github.com/mrricardocarvalho"
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/insights/${slug}`
    },
    "image": {
      "@type": "ImageObject",
      "url": getOGImage('article'),
      "width": 1200,
      "height": 630
    },
    "url": `${BASE_URL}/insights/${slug}`,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "articleSection": "Technology",
    "wordCount": readingTime ? readingTime * 200 : undefined,
    "timeRequired": readingTime ? `PT${readingTime}M` : undefined,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "genre": ["Technology", "Software Development", "Business Central"],
    "keywords": tags?.join(', ') || "Business Central, AL Development, Microsoft Dynamics 365",
    "about": [
      {
        "@type": "Thing",
        "name": "Microsoft Dynamics 365 Business Central",
        "description": "Cloud-based ERP solution for small to medium-sized businesses"
      },
      {
        "@type": "Thing", 
        "name": "AL Programming Language",
        "description": "Programming language for Business Central development"
      }
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Business Central Developers"
    },
    "educationalLevel": "Advanced",
    "learningResourceType": "Article"
  };
};

/**
 * Generate Website structured data for homepage
 */
export const generateWebsiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ricardo Carvalho - Digital Workbench",
    "alternateName": "Digital Workbench",
    "url": BASE_URL,
    "description": "Professional portfolio and technical blog of Ricardo Carvalho, Senior Dynamics 365 Business Central Developer with 8+ years of experience in ERP solutions and AL development.",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "author": {
      "@type": "Person",
      "name": "Ricardo Carvalho",
      "jobTitle": "Senior Dynamics 365 Business Central Developer",
      "url": BASE_URL,
      "sameAs": [
        "https://www.linkedin.com/in/ricardo-carvalho-05741519",
        "https://github.com/mrricardocarvalho"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ricardo Carvalho - Digital Workbench",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/favicon.svg`,
        "width": 512,
        "height": 512
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Blog",
      "name": "Business Central Articles & Insights",
      "description": "Technical articles, tutorials, and insights on Business Central development, AL programming, and enterprise implementation strategies.",
      "url": `${BASE_URL}/insights`,
      "inLanguage": "en-US",
      "about": [
        {
          "@type": "Thing",
          "name": "Microsoft Dynamics 365 Business Central"
        },
        {
          "@type": "Thing",
          "name": "AL Programming Language"
        },
        {
          "@type": "Thing",
          "name": "ERP Development"
        }
      ]
    }
  };
};

/**
 * Generate Organization structured data
 */
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization", 
    "name": "Ricardo Carvalho - Digital Workbench",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/favicon.svg`,
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://www.linkedin.com/in/ricardo-carvalho-05741519",
      "https://github.com/mrricardocarvalho"
    ],
    "founder": {
      "@type": "Person",
      "name": "Ricardo Carvalho",
      "jobTitle": "Senior Dynamics 365 Business Central Developer",
      "knowsAbout": ["Dynamics 365", "Business Central", "AL Development", "ERP Solutions", "Azure DevOps"]
    },
    "description": "Professional services in Dynamics 365 Business Central development, AL programming, and enterprise ERP solutions.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PT"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Professional Services",
      "availableLanguage": ["English", "Portuguese"]
    }
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export default {
  pageSEOConfig,
  generateArticleSEO,
  generateProjectSEO,
  getOGImage,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData
};
