#!/usr/bin/env node

/**
 * Build-time sitemap generator script
 * Generates sitemap.xml and robots.txt files in the public directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// Sitemap generator (simplified for build-time execution)
const generateSitemap = () => {
  const BASE_URL = 'https://mrricardocarvalho.github.io/digitalworkbench';
  const entries = [];
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changefreq: 'weekly' },
    { path: '/resume', priority: 0.9, changefreq: 'monthly' },
    { path: '/projects', priority: 0.9, changefreq: 'weekly' },
    { path: '/insights', priority: 0.9, changefreq: 'daily' },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' }
  ];

  staticPages.forEach(page => {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Blog post slugs (manually maintained until we can import the content manager)
  const blogSlugs = [
    'business-central-performance-bottlenecks-guide',
    'advanced-al-development-interfaces-abstract-classes',
    'automating-tests-copilot-extensions-business-central',
    'mastering-api-integrations-business-central-external-services',
    'performance-tuning-business-central-extensions',
    'from-idea-to-appsource-publishing-business-central-app',
    'business-central-business-intelligence-dashboards',
    'devops-cicd-pipelines',
    'business-central-cloud-migration-strategies',
    'business-central-user-experience-optimization',
    'exploring-secrettext-feature-business-central',
    'leveraging-ai-resources-business-central-copilot',
    'refactoring-moving-tables-fields-extensions',
    'enhancing-user-interfaces-cardpageid-extension',
    'ai-powered-features-business-central-guide',
    'migrating-dynamics-gp-business-central-guide',
    'mastering-dotnet-assemblies-business-central',
    'crafting-effective-success-messages-business-central',
    'advanced-email-handling-business-central',
    'modern-authentication-business-central-security',
    'business-central-cloud-vs-onpremises-migration-guide',
    'business-central-al-extensions-advanced-patterns',
    'business-central-data-migration-zero-downtime-strategies'
  ];

  blogSlugs.forEach(slug => {
    entries.push({
      url: `${BASE_URL}/insights/${slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  // Project pages
  const projects = ['digital-workbench-portfolio'];
  projects.forEach(slug => {
    entries.push({
      url: `${BASE_URL}/projects/${slug}`,
      lastmod: currentDate,
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
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  console.log(`🗺️ Generated sitemap with ${entries.length} entries`);
  return xml;
};

// Generate robots.txt
const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://mrricardocarvalho.github.io/digitalworkbench/sitemap.xml
Sitemap: https://mrricardocarvalho.github.io/digitalworkbench/site-sitemap.xml

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

// Main execution
try {
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate and write sitemap
  const sitemapContent = generateSitemap();
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log(`✅ Sitemap written to: ${sitemapPath}`);

  // Generate and write robots.txt
  const robotsContent = generateRobotsTxt();
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log(`✅ Robots.txt written to: ${robotsPath}`);

  console.log('🚀 SEO files generated successfully!');
} catch (error) {
  console.error('❌ Error generating SEO files:', error);
  process.exit(1);
}
