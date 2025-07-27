/**
 * Content Registry
 * Registers all blog post content for the content management system
 */

import { contentManager } from '../utils/contentManager';

// Import markdown content files
import performanceBottlenecksContent from './blog/business-central-performance-bottlenecks-guide.md?raw';
import advancedAlDevelopmentContent from './blog/advanced-al-development-interfaces-abstract-classes.md?raw';

/**
 * Register all blog post content
 * This function should be called during app initialization
 */
export const registerAllContent = (): void => {
  // Register existing markdown files
  contentManager.registerContent('business-central-performance-bottlenecks-guide', performanceBottlenecksContent);
  contentManager.registerContent('advanced-al-development-interfaces-abstract-classes', advancedAlDevelopmentContent);

  // For content that hasn't been migrated yet, we'll register placeholder content
  const placeholderPosts = [
    'exploring-secrettext-feature-business-central',
    'automating-tests-copilot-extensions-business-central',
    'leveraging-ai-resources-business-central-copilot',
    'refactoring-moving-tables-fields-extensions',
    'enhancing-user-interfaces-cardpageid-extension',
    'ai-powered-features-business-central-guide',
    'migrating-dynamics-gp-business-central-guide',
    'mastering-dotnet-assemblies-business-central',
    'crafting-effective-success-messages-business-central',
    'advanced-email-handling-business-central',
    'getting-started-ai-customizing-copilot-business-central',
    'whats-new-developers-business-central-2026-release',
    'building-first-power-app-business-central-data',
    'business-central-cloud-vs-onpremises-migration-guide',
    'deep-dive-business-foundation-module-business-central',
    'mastering-api-integrations-business-central-external-services',
    'performance-tuning-business-central-extensions',
    'from-idea-to-appsource-publishing-business-central-app',
    'new-report-document-features-business-central',
    'automating-business-processes-power-automate-business-central',
    'erp-implementation-best-practices',
    'business-central-al-extensions-advanced-patterns',
    'business-central-data-migration-zero-downtime-strategies',
    'business-central-workflow-automation-guide',
    'business-central-user-experience-optimization',
    'business-central-reporting-analytics-mastery',
    'business-central-cloud-migration-strategies',
    'business-central-business-intelligence-dashboards',
    'devops-cicd-pipelines',
    'business-central-security-compliance-framework'
  ];

  // Register placeholder content for posts that haven't been migrated
  placeholderPosts.forEach(slug => {
    const placeholderContent = createPlaceholderContent(slug);
    contentManager.registerContent(slug, placeholderContent);
  });

  console.log(`Registered ${placeholderPosts.length + 2} blog posts in content management system`);
};

/**
 * Create placeholder content for posts that haven't been migrated to markdown yet
 */
const createPlaceholderContent = (slug: string): string => {
  const title = formatSlugToTitle(slug);
  
  return `---
title: "${title}"
description: "This comprehensive technical article is currently being prepared with detailed insights, code examples, and best practices."
date: "2025-07-21"
readingTime: 10
featured: false
tags: ["Business Central", "AL Development", "Microsoft Dynamics 365"]
categories: ["Development", "Tutorial"]
author: "Ricardo Carvalho"
published: true
---

# ${title}

This comprehensive technical article is currently being prepared with detailed technical insights, code examples, and best practices.

## What to Expect

- **In-depth technical guidance** and implementation details
- **Real-world code examples** and best practices
- **Common pitfalls** and how to avoid them
- **Performance optimization** tips and techniques

## Coming Soon

This article will be available soon as part of our comprehensive Business Central development guide series.

In the meantime, explore other published articles in the [Articles & Insights](/insights) section.

---

*This content is being prepared to provide you with the most accurate and valuable technical insights for Business Central development.*`;
};

/**
 * Convert slug to readable title
 */
const formatSlugToTitle = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Business Central/gi, 'Business Central')
    .replace(/Al /gi, 'AL ')
    .replace(/Api /gi, 'API ')
    .replace(/Ui /gi, 'UI ')
    .replace(/Ux /gi, 'UX ');
};

/**
 * Get all registered content statistics
 */
export const getContentStats = () => {
  const stats = contentManager.getCacheStats();
  const allPosts = contentManager.getAllBlogPosts();
  
  return {
    totalPosts: allPosts.length,
    featuredPosts: allPosts.filter(post => post.featured).length,
    publishedPosts: allPosts.filter(post => post.published).length,
    cacheSize: stats.size,
    cachedPosts: stats.keys
  };
};

/**
 * Content validation and health check
 */
export const validateContent = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const allPosts = contentManager.getAllBlogPosts();
  
  // Check for duplicate slugs
  const slugs = allPosts.map(post => post.slug);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicateSlugs.length > 0) {
    errors.push(`Duplicate slugs found: ${duplicateSlugs.join(', ')}`);
  }
  
  // Check for missing required fields
  allPosts.forEach(post => {
    if (!post.title || post.title.trim().length === 0) {
      errors.push(`Post ${post.slug} is missing title`);
    }
    if (!post.description || post.description.trim().length === 0) {
      errors.push(`Post ${post.slug} is missing description`);
    }
    if (!post.date) {
      errors.push(`Post ${post.slug} is missing date`);
    }
  });
  
  // Check for reasonable reading times
  allPosts.forEach(post => {
    if (post.readingTime < 1 || post.readingTime > 60) {
      errors.push(`Post ${post.slug} has unrealistic reading time: ${post.readingTime} minutes`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
