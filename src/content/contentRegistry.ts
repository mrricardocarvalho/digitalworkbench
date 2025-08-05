/**
 * Content Registry
 * Registers all blog post content for the content management system
 */

import { contentManager } from '../utils/contentManager';

// Import markdown content files
import performanceBottlenecksContent from './blog/business-central-performance-bottlenecks-guide.md?raw';
import advancedAlDevelopmentContent from './blog/advanced-al-development-interfaces-abstract-classes.md?raw';
import secretTextFeatureContent from './blog/exploring-secrettext-feature-business-central.md?raw';
import automatingTestsContent from './blog/automating-tests-copilot-extensions-business-central.md?raw';
import apiIntegrationsContent from './blog/mastering-api-integrations-business-central-external-services.md?raw';
import performanceTuningContent from './blog/performance-tuning-business-central-extensions.md?raw';
import appSourcePublishingContent from './blog/from-idea-to-appsource-publishing-business-central-app.md?raw';
import businessIntelligenceContent from './blog/business-central-business-intelligence-dashboards.md?raw';
import devOpsPipelinesContent from './blog/devops-cicd-pipelines.md?raw';
import cloudMigrationContent from './blog/business-central-cloud-migration-strategies.md?raw';
import userExperienceContent from './blog/business-central-user-experience-optimization.md?raw';
import reportingAnalyticsContent from './blog/business-central-reporting-analytics-mastery.md?raw';
import securityComplianceContent from './blog/business-central-security-compliance-framework.md?raw';
import workflowAutomationContent from './blog/business-central-workflow-automation-guide.md?raw';
import alExtensionsAdvancedContent from './blog/business-central-al-extensions-advanced-patterns.md?raw';
import dataMigrationZeroDowntimeContent from './blog/business-central-data-migration-zero-downtime-strategies.md?raw';
import leveragingAiResourcesContent from './blog/leveraging-ai-resources-business-central-copilot.md?raw';
import refactoringMovingTablesContent from './insights/refactoring-moving-tables-fields-extensions.md?raw';

/**
 * Register all blog post content
 * This function should be called during app initialization
 */
export const registerAllContent = (): void => {
  console.log('🔄 Starting content registration...');
  
  // Register existing markdown files
  console.log('📝 Registering real markdown content...');
  contentManager.registerContent('business-central-performance-bottlenecks-guide', performanceBottlenecksContent);
  console.log('✅ Registered: business-central-performance-bottlenecks-guide');
  contentManager.registerContent('advanced-al-development-interfaces-abstract-classes', advancedAlDevelopmentContent);
  contentManager.registerContent('exploring-secrettext-feature-business-central', secretTextFeatureContent);
  console.log('✅ Registered: exploring-secrettext-feature-business-central');
  contentManager.registerContent('automating-tests-copilot-extensions-business-central', automatingTestsContent);
  contentManager.registerContent('mastering-api-integrations-business-central-external-services', apiIntegrationsContent);
  contentManager.registerContent('performance-tuning-business-central-extensions', performanceTuningContent);
  contentManager.registerContent('from-idea-to-appsource-publishing-business-central-app', appSourcePublishingContent);
  contentManager.registerContent('business-central-business-intelligence-dashboards', businessIntelligenceContent);
  contentManager.registerContent('devops-cicd-pipelines', devOpsPipelinesContent);
  contentManager.registerContent('business-central-cloud-migration-strategies', cloudMigrationContent);
  contentManager.registerContent('business-central-user-experience-optimization', userExperienceContent);
  contentManager.registerContent('business-central-reporting-analytics-mastery', reportingAnalyticsContent);
  contentManager.registerContent('business-central-security-compliance-framework', securityComplianceContent);
  contentManager.registerContent('business-central-workflow-automation-guide', workflowAutomationContent);
  contentManager.registerContent('business-central-al-extensions-advanced-patterns', alExtensionsAdvancedContent);
  contentManager.registerContent('business-central-data-migration-zero-downtime-strategies', dataMigrationZeroDowntimeContent);
  contentManager.registerContent('leveraging-ai-resources-business-central-copilot', leveragingAiResourcesContent);
  contentManager.registerContent('refactoring-moving-tables-fields-extensions', refactoringMovingTablesContent);

  // For content that hasn't been migrated yet, we'll register placeholder content
  const placeholderPosts = [
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
    'new-report-document-features-business-central',
    'automating-business-processes-power-automate-business-central',
    'erp-implementation-best-practices'
  ];

  // Register placeholder content for posts that haven't been migrated
  placeholderPosts.forEach(slug => {
    const placeholderContent = createPlaceholderContent(slug);
    contentManager.registerContent(slug, placeholderContent);
  });

  console.log(`Registered ${18} real posts + ${placeholderPosts.length} placeholder posts in content management system`);
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
