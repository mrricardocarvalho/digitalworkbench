/**
 * Dynamic Sitemap Generator for Digital Workbench
 * Generates comprehensive sitemap including all pages, articles, and projects
 */

import { contentManager } from '../utils/contentManager';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const BASE_URL = 'https://mrricardocarvalho.github.io/digitalworkbench';

/**
 * Generate complete sitemap for the application
 */
export const generateSitemap = (): string => {
  const entries: SitemapEntry[] = [];

  // Add static pages (high priority)
  const staticPages = [
    { path: '', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/resume', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/projects', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/insights', priority: 0.9, changefreq: 'daily' as const },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' as const }
  ];

  staticPages.forEach(page => {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0] as string,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Add all blog posts/articles
  try {
    const blogPosts = contentManager.getAllBlogPosts();
    
    blogPosts.forEach(post => {
      entries.push({
        url: `${BASE_URL}/insights/${post.slug}`,
        lastmod: post.date || new Date().toISOString().split('T')[0] as string,
        changefreq: 'monthly',
        priority: post.featured ? 0.8 : 0.7
      });
    });

    console.log(`📄 Added ${blogPosts.length} blog posts to sitemap`);
  } catch (error) {
    console.error('Error loading blog posts for sitemap:', error);
  }

  // Add project pages (when we have project data)
  const projects = [
    'digital-workbench-portfolio'
    // Add more projects as they're created
  ];

  projects.forEach(slug => {
    entries.push({
      url: `${BASE_URL}/projects/${slug}`,
      lastmod: new Date().toISOString().split('T')[0] as string,
      changefreq: 'monthly',
      priority: 0.8
    });
  });

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  entries.forEach(entry => {
    xml += '  <url>\n';
    xml += `    <loc>${entry.url}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  console.log(`🗺️ Generated sitemap with ${entries.length} entries`);
  return xml;
};

/**
 * Get all available routes for navigation
 */
export const getAllRoutes = (): Array<{ path: string; title: string; description: string }> => {
  const routes = [
    {
      path: '/',
      title: 'Ricardo Carvalho - Senior Business Central Developer',
      description: 'Senior D365 BC Developer with 8+ years experience architecting robust and scalable ERP solutions.'
    },
    {
      path: '/resume',
      title: 'Resume - Ricardo Carvalho',
      description: 'Professional experience, skills, and achievements in Business Central development.'
    },
    {
      path: '/projects',
      title: 'Projects - Ricardo Carvalho',
      description: 'Development projects and case studies showcasing technical expertise.'
    },
    {
      path: '/insights',
      title: 'Articles & Insights - Business Central Development',
      description: 'Technical articles, tutorials, and insights on Business Central development.'
    },
    {
      path: '/contact',
      title: 'Contact - Ricardo Carvalho',
      description: 'Get in touch for Business Central development projects and consultations.'
    }
  ];

  // Add blog post routes
  try {
    const blogPosts = contentManager.getAllBlogPosts();
    
    blogPosts.forEach(post => {
      routes.push({
        path: `/insights/${post.slug}`,
        title: post.title,
        description: post.description
      });
    });
  } catch (error) {
    console.error('Error loading blog posts for routes:', error);
  }

  return routes;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/site-sitemap.xml

# Crawl delay for respectful crawling
Crawl-delay: 1

# Disallow development/testing paths
Disallow: /test/
Disallow: /dev/
Disallow: /*.json$
Disallow: /*?*

# Allow important files
Allow: /manifest.json
Allow: /sw.js
`;
};

export default {
  generateSitemap,
  getAllRoutes,
  generateRobotsTxt
};
