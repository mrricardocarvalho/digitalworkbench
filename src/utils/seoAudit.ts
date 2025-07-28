/**
 * SEO Audit Utility
 * Comprehensive SEO analysis and recommendations for Digital Workbench
 */

interface SEOAuditResult {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  passed: SEOCheck[];
  metadata: SEOMetadata;
}

interface SEOIssue {
  type: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  element?: string;
  impact: string;
  fix: string;
}

interface SEORecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
  impact: string;
}

interface SEOCheck {
  category: string;
  description: string;
  value?: string;
}

interface SEOMetadata {
  url: string;
  title: string;
  description: string;
  h1Count: number;
  imageCount: number;
  linkCount: number;
  wordCount: number;
  loadTime?: number;
  lighthouseScore?: number;
}

export class SEOAuditor {
  private static instance: SEOAuditor;
  
  public static getInstance(): SEOAuditor {
    if (!SEOAuditor.instance) {
      SEOAuditor.instance = new SEOAuditor();
    }
    return SEOAuditor.instance;
  }

  /**
   * Run comprehensive SEO audit on current page
   */
  public async auditCurrentPage(): Promise<SEOAuditResult> {
    const startTime = performance.now();
    const issues: SEOIssue[] = [];
    const recommendations: SEORecommendation[] = [];
    const passed: SEOCheck[] = [];

    // Basic metadata audit
    const metadata = this.analyzeMetadata();
    
    // Title tag audit
    this.auditTitle(metadata.title, issues, passed);
    
    // Meta description audit
    this.auditMetaDescription(metadata.description, issues, passed);
    
    // Heading structure audit
    this.auditHeadingStructure(issues, passed);
    
    // Image optimization audit
    this.auditImages(issues, passed, recommendations);
    
    // Link audit
    this.auditLinks(issues, passed);
    
    // Content quality audit
    this.auditContent(metadata, issues, passed, recommendations);
    
    // Technical SEO audit
    this.auditTechnicalSEO(issues, passed, recommendations);
    
    // Structured data audit
    this.auditStructuredData(issues, passed);
    
    // Performance impact on SEO
    await this.auditPerformanceImpact(issues, passed, recommendations);

    const endTime = performance.now();
    metadata.loadTime = endTime - startTime;

    // Calculate overall score
    const score = this.calculateSEOScore(issues, passed);

    return {
      score,
      issues,
      recommendations,
      passed,
      metadata
    };
  }

  private analyzeMetadata(): SEOMetadata {
    const url = window.location.href;
    const title = document.title;
    const descriptionElement = document.querySelector('meta[name="description"]');
    const description = descriptionElement ? descriptionElement.getAttribute('content') || '' : '';
    
    const h1Count = document.querySelectorAll('h1').length;
    const imageCount = document.querySelectorAll('img').length;
    const linkCount = document.querySelectorAll('a[href]').length;
    
    // Calculate word count from main content areas
    const contentSelectors = ['main', 'article', '.content', '#content'];
    let wordCount = 0;
    
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent || '';
        wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        break;
      }
    }

    return {
      url,
      title,
      description,
      h1Count,
      imageCount,
      linkCount,
      wordCount
    };
  }

  private auditTitle(title: string, issues: SEOIssue[], passed: SEOCheck[]): void {
    if (!title || title.trim().length === 0) {
      issues.push({
        type: 'critical',
        category: 'Title',
        message: 'Missing page title',
        impact: 'Critical for search rankings and user experience',
        fix: 'Add a descriptive <title> tag to the page'
      });
    } else if (title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: 'Title too short (less than 30 characters)',
        impact: 'May not fully describe page content',
        fix: 'Expand title to 30-60 characters for better SEO'
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: 'Title too long (over 60 characters)',
        impact: 'May be truncated in search results',
        fix: 'Shorten title to 30-60 characters'
      });
    } else {
      passed.push({
        category: 'Title',
        description: 'Title length is optimal',
        value: `${title.length} characters`
      });
    }
  }

  private auditMetaDescription(description: string, issues: SEOIssue[], passed: SEOCheck[]): void {
    if (!description || description.trim().length === 0) {
      issues.push({
        type: 'critical',
        category: 'Meta Description',
        message: 'Missing meta description',
        impact: 'Search engines will generate description automatically',
        fix: 'Add a meta description tag with 120-160 characters'
      });
    } else if (description.length < 120) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description too short',
        impact: 'Not utilizing full SERP real estate',
        fix: 'Expand description to 120-160 characters'
      });
    } else if (description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description too long',
        impact: 'May be truncated in search results',
        fix: 'Shorten description to 120-160 characters'
      });
    } else {
      passed.push({
        category: 'Meta Description',
        description: 'Meta description length is optimal',
        value: `${description.length} characters`
      });
    }
  }

  private auditHeadingStructure(issues: SEOIssue[], passed: SEOCheck[]): void {
    const h1Elements = document.querySelectorAll('h1');
    const h2Elements = document.querySelectorAll('h2');
    const h3Elements = document.querySelectorAll('h3');
    
    if (h1Elements.length === 0) {
      issues.push({
        type: 'critical',
        category: 'Heading Structure',
        message: 'Missing H1 tag',
        impact: 'Search engines need H1 to understand page topic',
        fix: 'Add one H1 tag that describes the main page content'
      });
    } else if (h1Elements.length > 1) {
      issues.push({
        type: 'warning',
        category: 'Heading Structure',
        message: 'Multiple H1 tags found',
        impact: 'May confuse search engines about page topic',
        fix: 'Use only one H1 tag per page'
      });
    } else {
      passed.push({
        category: 'Heading Structure',
        description: 'H1 tag structure is correct',
        value: '1 H1 tag found'
      });
    }

    // Check for heading hierarchy
    if (h2Elements.length > 0) {
      passed.push({
        category: 'Heading Structure',
        description: 'H2 tags present for content structure',
        value: `${h2Elements.length} H2 tags`
      });
    }

    if (h3Elements.length > 0) {
      passed.push({
        category: 'Heading Structure',
        description: 'H3 tags present for detailed structure',
        value: `${h3Elements.length} H3 tags`
      });
    }
  }

  private auditImages(issues: SEOIssue[], passed: SEOCheck[], recommendations: SEORecommendation[]): void {
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    let optimizedImages = 0;

    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');
      
      if (!alt || alt.trim().length === 0) {
        imagesWithoutAlt++;
        issues.push({
          type: 'warning',
          category: 'Images',
          message: `Image ${index + 1} missing alt text`,
          element: src || 'Unknown image',
          impact: 'Reduces accessibility and SEO value',
          fix: 'Add descriptive alt attribute to image'
        });
      }

      // Check for modern image formats
      if (src && (src.includes('.webp') || src.includes('.avif'))) {
        optimizedImages++;
      }
    });

    if (imagesWithoutAlt === 0 && images.length > 0) {
      passed.push({
        category: 'Images',
        description: 'All images have alt text',
        value: `${images.length} images with alt text`
      });
    }

    if (optimizedImages > 0) {
      passed.push({
        category: 'Images',
        description: 'Using modern image formats',
        value: `${optimizedImages} optimized images`
      });
    }

    if (images.length > optimizedImages) {
      recommendations.push({
        category: 'Performance',
        priority: 'medium',
        title: 'Image Format Optimization',
        description: 'Consider using WebP or AVIF formats for better compression',
        implementation: 'Convert images to WebP/AVIF format with fallbacks',
        impact: 'Reduced page load time improves SEO rankings'
      });
    }
  }

  private auditLinks(issues: SEOIssue[], passed: SEOCheck[]): void {
    const links = document.querySelectorAll('a[href]');
    let externalLinksWithoutNofollow = 0;
    let linksWithoutText = 0;

    links.forEach((link, index) => {
      const href = link.getAttribute('href');
      const text = link.textContent?.trim();
      const rel = link.getAttribute('rel');

      if (!text || text.length === 0) {
        const ariaLabel = link.getAttribute('aria-label');
        if (!ariaLabel) {
          linksWithoutText++;
          issues.push({
            type: 'warning',
            category: 'Links',
            message: `Link ${index + 1} has no text or aria-label`,
            element: href || 'Unknown link',
            impact: 'Poor accessibility and unclear link purpose',
            fix: 'Add descriptive text or aria-label to link'
          });
        }
      }

      // Check external links
      if (href && (href.startsWith('http') && !href.includes(window.location.hostname))) {
        if (!rel || !rel.includes('nofollow')) {
          externalLinksWithoutNofollow++;
        }
      }
    });

    if (linksWithoutText === 0) {
      passed.push({
        category: 'Links',
        description: 'All links have descriptive text',
        value: `${links.length} properly labeled links`
      });
    }

    if (externalLinksWithoutNofollow > 0) {
      issues.push({
        type: 'info',
        category: 'Links',
        message: `${externalLinksWithoutNofollow} external links without nofollow`,
        impact: 'May pass link equity to external sites',
        fix: 'Consider adding rel="nofollow" to external links'
      });
    }
  }

  private auditContent(metadata: SEOMetadata, issues: SEOIssue[], passed: SEOCheck[], recommendations: SEORecommendation[]): void {
    if (metadata.wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'Content',
        message: 'Low word count',
        impact: 'May not provide enough value for search engines',
        fix: 'Expand content to at least 300 words'
      });
    } else {
      passed.push({
        category: 'Content',
        description: 'Adequate content length',
        value: `${metadata.wordCount} words`
      });
    }

    if (metadata.wordCount > 2000) {
      recommendations.push({
        category: 'Content',
        priority: 'low',
        title: 'Consider Content Sections',
        description: 'Long content may benefit from table of contents',
        implementation: 'Add table of contents or section navigation',
        impact: 'Improved user experience and page structure'
      });
    }
  }

  private auditTechnicalSEO(issues: SEOIssue[], passed: SEOCheck[], recommendations: SEORecommendation[]): void {
    // Check for canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      passed.push({
        category: 'Technical SEO',
        description: 'Canonical URL specified',
        value: canonical.getAttribute('href') || ''
      });
    } else {
      issues.push({
        type: 'warning',
        category: 'Technical SEO',
        message: 'Missing canonical URL',
        impact: 'May cause duplicate content issues',
        fix: 'Add canonical link tag'
      });
    }

    // Check for viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      passed.push({
        category: 'Technical SEO',
        description: 'Viewport meta tag present',
        value: viewport.getAttribute('content') || ''
      });
    } else {
      issues.push({
        type: 'critical',
        category: 'Technical SEO',
        message: 'Missing viewport meta tag',
        impact: 'Poor mobile search rankings',
        fix: 'Add viewport meta tag'
      });
    }

    // Check for robots meta tag
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      const content = robots.getAttribute('content');
      if (content?.includes('noindex')) {
        issues.push({
          type: 'critical',
          category: 'Technical SEO',
          message: 'Page set to noindex',
          impact: 'Page will not appear in search results',
          fix: 'Remove noindex directive if page should be indexed'
        });
      } else {
        passed.push({
          category: 'Technical SEO',
          description: 'Robots directive configured',
          value: content || ''
        });
      }
    }

    // Check for sitemap
    recommendations.push({
      category: 'Technical SEO',
      priority: 'medium',
      title: 'XML Sitemap',
      description: 'Ensure XML sitemap is present and submitted to search engines',
      implementation: 'Create and submit sitemap.xml to Google Search Console',
      impact: 'Better crawling and indexing of site content'
    });
  }

  private auditStructuredData(issues: SEOIssue[], passed: SEOCheck[]): void {
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (structuredDataScripts.length > 0) {
      let validStructuredData = 0;
      
      structuredDataScripts.forEach((script, index) => {
        try {
          const data = JSON.parse(script.textContent || '');
          if (data['@context'] && data['@type']) {
            validStructuredData++;
          }
        } catch {
          issues.push({
            type: 'warning',
            category: 'Structured Data',
            message: `Invalid JSON-LD syntax in script ${index + 1}`,
            impact: 'Search engines cannot parse structured data',
            fix: 'Fix JSON syntax in structured data'
          });
        }
      });

      if (validStructuredData > 0) {
        passed.push({
          category: 'Structured Data',
          description: 'Valid structured data found',
          value: `${validStructuredData} JSON-LD scripts`
        });
      }
    } else {
      issues.push({
        type: 'info',
        category: 'Structured Data',
        message: 'No structured data found',
        impact: 'Missing rich snippets opportunities',
        fix: 'Add JSON-LD structured data for better SERP appearance'
      });
    }
  }

  private async auditPerformanceImpact(_issues: SEOIssue[], passed: SEOCheck[], recommendations: SEORecommendation[]): Promise<void> {
    // Check Core Web Vitals if available
    if ('web-vitals' in window || (window as any).webVitals) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        title: 'Core Web Vitals Monitoring',
        description: 'Monitor FCP, LCP, FID, CLS for SEO impact',
        implementation: 'Use Web Vitals library for real-time monitoring',
        impact: 'Core Web Vitals are ranking factors in Google search'
      });
    }

    // Check for lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (lazyImages.length > 0) {
      passed.push({
        category: 'Performance',
        description: 'Image lazy loading implemented',
        value: `${lazyImages.length} lazy loaded images`
      });
    }

    // Check for resource hints
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    if (preloadLinks.length > 0) {
      passed.push({
        category: 'Performance',
        description: 'Resource preloading configured',
        value: `${preloadLinks.length} preload hints`
      });
    }
  }

  private calculateSEOScore(issues: SEOIssue[], passed: SEOCheck[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 5;
          break;
      }
    });

    // Bonus points for passed checks
    const bonusPoints = Math.min(passed.length * 2, 20);
    score += bonusPoints;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate SEO report as text
   */
  public generateReport(audit: SEOAuditResult): string {
    let report = '# SEO Audit Report\n\n';
    report += `**Overall Score: ${audit.score}/100**\n\n`;
    report += `**Page:** ${audit.metadata.url}\n`;
    report += `**Title:** ${audit.metadata.title}\n`;
    report += `**Word Count:** ${audit.metadata.wordCount}\n\n`;

    if (audit.issues.length > 0) {
      report += '## Issues Found\n\n';
      audit.issues.forEach((issue, index) => {
        report += `### ${index + 1}. ${issue.message} (${issue.type.toUpperCase()})\n`;
        report += `**Category:** ${issue.category}\n`;
        report += `**Impact:** ${issue.impact}\n`;
        report += `**Fix:** ${issue.fix}\n\n`;
      });
    }

    if (audit.recommendations.length > 0) {
      report += '## Recommendations\n\n';
      audit.recommendations.forEach((rec, index) => {
        report += `### ${index + 1}. ${rec.title} (${rec.priority.toUpperCase()} PRIORITY)\n`;
        report += `**Description:** ${rec.description}\n`;
        report += `**Implementation:** ${rec.implementation}\n`;
        report += `**Impact:** ${rec.impact}\n\n`;
      });
    }

    if (audit.passed.length > 0) {
      report += '## Passed Checks\n\n';
      audit.passed.forEach((check) => {
        report += `- ${check.description}`;
        if (check.value) {
          report += ` (${check.value})`;
        }
        report += '\n';
      });
    }

    return report;
  }
}

// Export singleton instance
export const seoAuditor = SEOAuditor.getInstance();
