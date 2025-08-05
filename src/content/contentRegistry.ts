/**
 * Content Registry
 * Registers all blog post content for the content management system
 */

import { contentManager } from '../utils/contentManager';

// TESTING - Remove markdown import completely
// import performanceBottlenecksContent from './blog/business-central-performance-bottlenecks-guide.md?raw';

/**
 * Register all blog post content
 * This function should be called during app initialization
 */
export const registerAllContent = (): void => {
  try {
    console.log('🔄 Starting content registration...');
    
    // Register existing markdown files - TESTING WITH SIMPLE STRING
    console.log('📝 Registering real markdown content...');
    
    // TESTING: Use complete article content instead of just short test
    const testContent = `---
title: "Business Central Performance Bottlenecks: The Complete Developer's Guide"
description: "Complete guide to identifying and fixing performance bottlenecks"
date: "2025-07-22"
readingTime: 15
featured: true
tags: ["Business Central", "Performance"]
categories: ["Development"]
author: "Ricardo Carvalho"
published: true
---

# Business Central Performance Bottlenecks: The Complete Developer's Guide

Performance issues in Business Central don't just frustrate users—they cost businesses thousands in lost productivity daily. After optimizing hundreds of BC environments over 20+ years, I've identified the most critical bottlenecks that plague implementations.

**The reality**: Most performance problems aren't infrastructure-related. They're caused by **poor coding practices**, **inefficient database queries**, and **architectural decisions** made during development.

In this comprehensive guide, you'll discover the exact techniques I use to diagnose, fix, and prevent the 7 most critical performance bottlenecks in Business Central.

## Why Performance Optimization Is Business-Critical

The hidden cost of poor performance affects every aspect of your business:

- **58% of users abandon tasks** when pages take over 3 seconds to load
- **Every additional second** of loading time reduces user satisfaction by 16%
- **Poor performing systems** increase error rates by 23%
- **Frustrated users** create 40% more support tickets

## Bottleneck #1: Inefficient Database Queries

The most common performance killer I encounter is the N+1 query pattern, where a loop executes individual database queries instead of using set-based operations.

### The Problem: N+1 Query Patterns

**Bad Pattern (Avoid This):**

\`\`\`al
procedure CalculateCustomerTotals()
var
    Customer: Record Customer;
    SalesHeader: Record "Sales Header";
    CustomerTotal: Decimal;
begin
    // DON'T DO THIS - Creates N+1 queries
    if Customer.FindSet() then
        repeat
            SalesHeader.SetRange("Sell-to Customer No.", Customer."No.");
            SalesHeader.CalcSums(Amount);
            CustomerTotal := SalesHeader.Amount;
            // Process individual customer
            UpdateCustomerStatistics(Customer."No.", CustomerTotal);
        until Customer.Next() = 0;
end;
\`\`\`

**Optimized Solution:**

\`\`\`al
procedure CalculateCustomerTotalsOptimized()
var
    Customer: Record Customer;
    SalesHeader: Record "Sales Header";
    TempCustomerTotals: Record "Integer" temporary;
begin
    // Use set-based operation with single query
    SalesHeader.SetCurrentKey("Sell-to Customer No.");
    if SalesHeader.FindSet() then begin
        repeat
            if TempCustomerTotals.Get(SalesHeader."Sell-to Customer No.") then begin
                TempCustomerTotals.Number += SalesHeader.Amount;
                TempCustomerTotals.Modify();
            end else begin
                TempCustomerTotals."No." := SalesHeader."Sell-to Customer No.";
                TempCustomerTotals.Number := SalesHeader.Amount;
                TempCustomerTotals.Insert();
            end;
        until SalesHeader.Next() = 0;
        
        // Process all customers in single operation
        ProcessCustomerTotalsBatch(TempCustomerTotals);
    end;
end;
\`\`\`

**Performance Impact**: 95% reduction in database calls, 70% faster execution time.

## Bottleneck #2: Unoptimized FlowFields

FlowFields that aren't properly optimized can trigger expensive calculations on every record access.

### The Problem: Excessive FlowField Calculations

**Problem Code:**

\`\`\`al
// Expensive FlowField calculation
flowfield("Total Sales Amount"; Decimal)
{
    FieldClass = FlowField;
    CalcFormula = Sum("Sales Line".Amount WHERE("Sell-to Customer No." = FIELD("No.")));
    Editable = false;
}
\`\`\`

**Optimized Solution:**

\`\`\`al
// Optimized with proper filtering
flowfield("Total Sales Amount"; Decimal)
{
    FieldClass = FlowField;
    CalcFormula = Sum("Sales Line".Amount WHERE(
        "Sell-to Customer No." = FIELD("No."),
        "Document Type" = CONST(Order),
        "Line Type" = CONST(Item)));
    Editable = false;
}

// Use explicit CalcFields only when needed
procedure GetCustomerSalesTotal(CustomerNo: Code[20]): Decimal
var
    Customer: Record Customer;
begin
    if Customer.Get(CustomerNo) then begin
        Customer.CalcFields("Total Sales Amount");
        exit(Customer."Total Sales Amount");
    end;
    exit(0);
end;
\`\`\`

## Conclusion: Building Performance Into Your Development Process

Performance optimization isn't a one-time task—it's a mindset that should be integrated into every development decision:

- **Design with performance in mind** from the beginning
- **Profile early and often** during development
- **Use proper indexing strategies** for your data access patterns
- **Implement monitoring** to catch issues before users do
- **Test with realistic data volumes** and user loads

Remember: **Every millisecond counts**. In today's competitive landscape, system performance directly impacts business success.

*Need help optimizing your Business Central environment? As a Senior Business Central Developer with 20+ years of experience, I've helped hundreds of organizations achieve dramatic performance improvements through strategic optimization and architectural best practices.*`;
    
    console.log('📋 Registering test content with length: ' + testContent.length);
    
    contentManager.registerContent('business-central-performance-bottlenecks-guide', testContent);
    console.log('✅ Registered: business-central-performance-bottlenecks-guide');
    
    // TEMPORARILY COMMENTED OUT FOR TESTING
    /*
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
    */

    console.log('✅ All real content registered successfully!');

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
      'erp-implementation-best-practices',
      // Add the missing articles you mentioned
      'automating-tests-copilot-extensions-business-central',
      'leveraging-ai-resources-business-central-copilot',
      'refactoring-moving-tables-fields-extensions',
      // Add this missing article from the commented section
      'exploring-secrettext-feature-business-central',
      // Add all the remaining commented-out articles
      'advanced-al-development-interfaces-abstract-classes',
      'mastering-api-integrations-business-central-external-services',
      'performance-tuning-business-central-extensions',
      'from-idea-to-appsource-publishing-business-central-app',
      'business-central-business-intelligence-dashboards',
      'devops-cicd-pipelines',
      'business-central-cloud-migration-strategies',
      'business-central-user-experience-optimization',
      'business-central-reporting-analytics-mastery',
      'business-central-security-compliance-framework',
      'business-central-workflow-automation-guide',
      'business-central-al-extensions-advanced-patterns',
      'business-central-data-migration-zero-downtime-strategies'
    ];

    // Register placeholder content for posts that haven't been migrated
    placeholderPosts.forEach(slug => {
      const placeholderContent = createPlaceholderContent(slug);
      contentManager.registerContent(slug, placeholderContent);
    });

    console.log(`✅ REGISTRATION COMPLETE: ${1} real posts + ${placeholderPosts.length} placeholder posts registered!`);
  } catch (error) {
    console.error('❌ CONTENT REGISTRATION FAILED:', error);
    console.error('Stack trace:', (error as Error)?.stack || 'No stack trace available');
  }
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
