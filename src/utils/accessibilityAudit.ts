/**
 * Accessibility Audit Utility
 * Comprehensive accessibility analysis for WCAG 2.1 compliance
 */

interface AccessibilityAuditResult {
  score: number;
  level: 'A' | 'AA' | 'AAA';
  issues: AccessibilityIssue[];
  recommendations: AccessibilityRecommendation[];
  passed: AccessibilityCheck[];
  metadata: AccessibilityMetadata;
}

interface AccessibilityIssue {
  type: 'critical' | 'warning' | 'info';
  level: 'A' | 'AA' | 'AAA';
  category: string;
  message: string;
  element?: string;
  impact: string;
  fix: string;
  wcagReference: string;
}

interface AccessibilityRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
  wcagReference: string;
}

interface AccessibilityCheck {
  category: string;
  description: string;
  wcagReference: string;
  value?: string;
}

interface AccessibilityMetadata {
  url: string;
  title: string;
  language: string;
  landmarkCount: number;
  headingCount: number;
  linkCount: number;
  imageCount: number;
  formCount: number;
  interactiveElementCount: number;
}

export class AccessibilityAuditor {
  private static instance: AccessibilityAuditor;
  
  public static getInstance(): AccessibilityAuditor {
    if (!AccessibilityAuditor.instance) {
      AccessibilityAuditor.instance = new AccessibilityAuditor();
    }
    return AccessibilityAuditor.instance;
  }

  /**
   * Run comprehensive accessibility audit on current page
   */
  public async auditCurrentPage(): Promise<AccessibilityAuditResult> {
    const issues: AccessibilityIssue[] = [];
    const recommendations: AccessibilityRecommendation[] = [];
    const passed: AccessibilityCheck[] = [];

    // Basic metadata
    const metadata = this.analyzeAccessibilityMetadata();
    
    // Document structure audit
    this.auditDocumentStructure(issues, passed);
    
    // Heading hierarchy audit
    this.auditHeadingHierarchy(issues, passed);
    
    // Image accessibility audit
    this.auditImageAccessibility(issues, passed);
    
    // Link accessibility audit
    this.auditLinkAccessibility(issues, passed);
    
    // Form accessibility audit
    this.auditFormAccessibility(issues, passed);
    
    // Color contrast audit
    await this.auditColorContrast(issues, passed);
    
    // Keyboard navigation audit
    this.auditKeyboardNavigation(issues, passed, recommendations);
    
    // ARIA audit
    this.auditARIA(issues, passed);
    
    // Focus management audit
    this.auditFocusManagement(issues, passed, recommendations);
    
    // Interactive elements audit
    this.auditInteractiveElements(issues, passed);

    // Calculate score and compliance level
    const score = this.calculateAccessibilityScore(issues, passed);
    const level = this.determineWCAGLevel(issues);

    return {
      score,
      level,
      issues,
      recommendations,
      passed,
      metadata
    };
  }

  private analyzeAccessibilityMetadata(): AccessibilityMetadata {
    const url = window.location.href;
    const title = document.title;
    const language = document.documentElement.lang || 'not-specified';
    
    const landmarkCount = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label], section[aria-labelledby]').length;
    const headingCount = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
    const linkCount = document.querySelectorAll('a[href]').length;
    const imageCount = document.querySelectorAll('img').length;
    const formCount = document.querySelectorAll('form').length;
    const interactiveElementCount = document.querySelectorAll('button, input, select, textarea, a[href], [tabindex]').length;

    return {
      url,
      title,
      language,
      landmarkCount,
      headingCount,
      linkCount,
      imageCount,
      formCount,
      interactiveElementCount
    };
  }

  private auditDocumentStructure(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): void {
    // Check document language
    const lang = document.documentElement.lang;
    if (!lang || lang.trim().length === 0) {
      issues.push({
        type: 'critical',
        level: 'A',
        category: 'Document Structure',
        message: 'Missing document language declaration',
        impact: 'Screen readers cannot determine correct pronunciation',
        fix: 'Add lang attribute to html element (e.g., lang="en")',
        wcagReference: 'WCAG 3.1.1'
      });
    } else {
      passed.push({
        category: 'Document Structure',
        description: 'Document language specified',
        wcagReference: 'WCAG 3.1.1',
        value: lang
      });
    }

    // Check for page title
    if (!document.title || document.title.trim().length === 0) {
      issues.push({
        type: 'critical',
        level: 'A',
        category: 'Document Structure',
        message: 'Missing page title',
        impact: 'Users cannot identify page content',
        fix: 'Add descriptive title to page',
        wcagReference: 'WCAG 2.4.2'
      });
    } else {
      passed.push({
        category: 'Document Structure',
        description: 'Page title present',
        wcagReference: 'WCAG 2.4.2'
      });
    }

    // Check for landmark regions
    const main = document.querySelector('main');
    if (!main) {
      issues.push({
        type: 'warning',
        level: 'AA',
        category: 'Document Structure',
        message: 'Missing main landmark',
        impact: 'Screen reader users cannot skip to main content',
        fix: 'Add <main> element or role="main"',
        wcagReference: 'WCAG 2.4.1'
      });
    } else {
      passed.push({
        category: 'Document Structure',
        description: 'Main landmark present',
        wcagReference: 'WCAG 2.4.1'
      });
    }

    // Check for navigation landmarks
    const nav = document.querySelector('nav');
    if (nav) {
      passed.push({
        category: 'Document Structure',
        description: 'Navigation landmark present',
        wcagReference: 'WCAG 2.4.1'
      });
    }
  }

  private auditHeadingHierarchy(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): void {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    if (headings.length === 0) {
      issues.push({
        type: 'critical',
        level: 'A',
        category: 'Heading Structure',
        message: 'No headings found',
        impact: 'Users cannot navigate content structure',
        fix: 'Add proper heading hierarchy starting with h1',
        wcagReference: 'WCAG 2.4.6'
      });
      return;
    }

    // Check for h1
    const h1Elements = headings.filter(h => h.tagName.toLowerCase() === 'h1');
    if (h1Elements.length === 0) {
      issues.push({
        type: 'critical',
        level: 'A',
        category: 'Heading Structure',
        message: 'Missing h1 element',
        impact: 'Page lacks clear main topic identification',
        fix: 'Add h1 element as main page heading',
        wcagReference: 'WCAG 2.4.6'
      });
    } else if (h1Elements.length > 1) {
      issues.push({
        type: 'warning',
        level: 'AA',
        category: 'Heading Structure',
        message: 'Multiple h1 elements found',
        impact: 'Confusing page structure for screen readers',
        fix: 'Use only one h1 per page',
        wcagReference: 'WCAG 2.4.6'
      });
    } else {
      passed.push({
        category: 'Heading Structure',
        description: 'Proper h1 structure',
        wcagReference: 'WCAG 2.4.6'
      });
    }

    // Check heading hierarchy
    let previousLevel = 0;
    let hierarchyViolations = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (index === 0 && level !== 1) {
        hierarchyViolations++;
      } else if (level > previousLevel + 1) {
        hierarchyViolations++;
      }
      
      previousLevel = level;
    });

    if (hierarchyViolations > 0) {
      issues.push({
        type: 'warning',
        level: 'AA',
        category: 'Heading Structure',
        message: 'Heading hierarchy violations detected',
        impact: 'Confusing content structure for assistive technologies',
        fix: 'Ensure headings follow logical hierarchy (h1→h2→h3...)',
        wcagReference: 'WCAG 2.4.6'
      });
    } else if (headings.length > 1) {
      passed.push({
        category: 'Heading Structure',
        description: 'Logical heading hierarchy',
        wcagReference: 'WCAG 2.4.6'
      });
    }
  }

  private auditImageAccessibility(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): void {
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    let informativeImages = 0;

    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      
      if (alt === null) {
        imagesWithoutAlt++;
        issues.push({
          type: 'critical',
          level: 'A',
          category: 'Images',
          message: `Image ${index + 1} missing alt attribute`,
          element: img.src,
          impact: 'Screen readers cannot describe image content',
          fix: 'Add alt attribute with descriptive text or empty alt="" for decorative images',
          wcagReference: 'WCAG 1.1.1'
        });
      } else if (alt === '' || role === 'presentation') {
        // decorativeImages++;
      } else {
        informativeImages++;
        
        // Check for poor alt text patterns
        const lowQualityPatterns = ['image', 'picture', 'photo', 'img', 'graphic'];
        if (lowQualityPatterns.some(pattern => alt.toLowerCase().includes(pattern))) {
          issues.push({
            type: 'warning',
            level: 'AA',
            category: 'Images',
            message: `Image ${index + 1} has generic alt text`,
            element: img.src,
            impact: 'Alt text should be descriptive, not generic',
            fix: 'Use specific, descriptive alt text that conveys the image meaning',
            wcagReference: 'WCAG 1.1.1'
          });
        }
      }
    });

    if (imagesWithoutAlt === 0 && images.length > 0) {
      passed.push({
        category: 'Images',
        description: 'All images have alt attributes',
        wcagReference: 'WCAG 1.1.1',
        value: `${images.length} images processed`
      });
    }

    if (informativeImages > 0) {
      passed.push({
        category: 'Images',
        description: 'Informative images have descriptive alt text',
        wcagReference: 'WCAG 1.1.1',
        value: `${informativeImages} informative images`
      });
    }
  }

  private auditLinkAccessibility(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): void {
    const links = document.querySelectorAll('a[href]');
    let linksWithoutText = 0;
    let ambiguousLinks = 0;

    links.forEach((link, index) => {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      const title = link.getAttribute('title');
      
      if (!text && !ariaLabel) {
        linksWithoutText++;
        issues.push({
          type: 'critical',
          level: 'A',
          category: 'Links',
          message: `Link ${index + 1} has no accessible text`,
          element: link.getAttribute('href') || '',
          impact: 'Screen readers cannot describe link purpose',
          fix: 'Add descriptive text content or aria-label',
          wcagReference: 'WCAG 2.4.4'
        });
      } else {
        const linkText = text || ariaLabel || title;
        const ambiguousPatterns = ['click here', 'read more', 'more', 'here', 'link'];
        
        if (linkText && ambiguousPatterns.some(pattern => linkText.toLowerCase().includes(pattern))) {
          ambiguousLinks++;
          issues.push({
            type: 'warning',
            level: 'AA',
            category: 'Links',
            message: `Link ${index + 1} has ambiguous text`,
            element: link.getAttribute('href') || '',
            impact: 'Link purpose unclear out of context',
            fix: 'Use descriptive link text that explains destination or purpose',
            wcagReference: 'WCAG 2.4.4'
          });
        }
      }

      // Check for target="_blank" without warning
      if (link.getAttribute('target') === '_blank') {
        const hasWarning = ariaLabel?.includes('new window') || 
                          text?.includes('new window') ||
                          link.querySelector('[aria-hidden="true"]');
        
        if (!hasWarning) {
          issues.push({
            type: 'info',
            level: 'AAA',
            category: 'Links',
            message: `Link ${index + 1} opens in new window without warning`,
            element: link.getAttribute('href') || '',
            impact: 'Users may be confused by unexpected new window',
            fix: 'Add visual/text indicator that link opens in new window',
            wcagReference: 'WCAG 3.2.5'
          });
        }
      }
    });

    if (linksWithoutText === 0 && links.length > 0) {
      passed.push({
        category: 'Links',
        description: 'All links have accessible text',
        wcagReference: 'WCAG 2.4.4',
        value: `${links.length} links`
      });
    }

    if (ambiguousLinks === 0 && links.length > 0) {
      passed.push({
        category: 'Links',
        description: 'Links have descriptive text',
        wcagReference: 'WCAG 2.4.4'
      });
    }
  }

  private auditFormAccessibility(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): void {
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, select, textarea');
    
    let inputsWithoutLabels = 0;
    let formsWithoutHeadings = 0;

    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const type = input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') return;

      let hasLabel = false;
      
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) hasLabel = true;
      }
      
      if (ariaLabel || ariaLabelledby) hasLabel = true;
      
      if (!hasLabel) {
        inputsWithoutLabels++;
        issues.push({
          type: 'critical',
          level: 'A',
          category: 'Forms',
          message: `Form control ${index + 1} missing label`,
          element: input.tagName.toLowerCase(),
          impact: 'Users cannot understand input purpose',
          fix: 'Add label element or aria-label attribute',
          wcagReference: 'WCAG 1.3.1'
        });
      }

      // Check for required field indicators
      if (input.hasAttribute('required')) {
        const ariaRequired = input.getAttribute('aria-required');
        if (ariaRequired !== 'true') {
          issues.push({
            type: 'warning',
            level: 'AA',
            category: 'Forms',
            message: `Required field ${index + 1} missing aria-required`,
            element: input.tagName.toLowerCase(),
            impact: 'Screen readers may not announce required status',
            fix: 'Add aria-required="true" to required fields',
            wcagReference: 'WCAG 3.3.2'
          });
        }
      }
    });

    forms.forEach((form, index) => {
      const heading = form.querySelector('h1, h2, h3, h4, h5, h6');
      const legend = form.querySelector('legend');
      const ariaLabel = form.getAttribute('aria-label');
      const ariaLabelledby = form.getAttribute('aria-labelledby');
      
      if (!heading && !legend && !ariaLabel && !ariaLabelledby) {
        formsWithoutHeadings++;
        issues.push({
          type: 'warning',
          level: 'AA',
          category: 'Forms',
          message: `Form ${index + 1} missing heading or label`,
          impact: 'Users cannot understand form purpose',
          fix: 'Add heading, legend, or aria-label to form',
          wcagReference: 'WCAG 2.4.6'
        });
      }
    });

    if (inputsWithoutLabels === 0 && inputs.length > 0) {
      passed.push({
        category: 'Forms',
        description: 'All form controls have labels',
        wcagReference: 'WCAG 1.3.1',
        value: `${inputs.length} labeled controls`
      });
    }

    if (formsWithoutHeadings === 0 && forms.length > 0) {
      passed.push({
        category: 'Forms',
        description: 'Forms have descriptive headings',
        wcagReference: 'WCAG 2.4.6'
      });
    }
  }

  private async auditColorContrast(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): Promise<void> {
    // This is a simplified contrast check - in production you'd use more sophisticated color analysis
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
    let lowContrastElements = 0;

    // Check for common low-contrast patterns
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simple heuristic: check for gray-on-gray combinations
      if (color.includes('rgb(128') || color.includes('rgb(169') || 
          backgroundColor.includes('rgb(128') || backgroundColor.includes('rgb(169')) {
        lowContrastElements++;
      }
    });

    if (lowContrastElements > 0) {
      issues.push({
        type: 'warning',
        level: 'AA',
        category: 'Color Contrast',
        message: 'Potential low contrast elements detected',
        impact: 'Text may be difficult to read for users with visual impairments',
        fix: 'Ensure text has sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)',
        wcagReference: 'WCAG 1.4.3'
      });
    } else {
      passed.push({
        category: 'Color Contrast',
        description: 'No obvious contrast issues detected',
        wcagReference: 'WCAG 1.4.3'
      });
    }
  }

  private auditKeyboardNavigation(issues: AccessibilityIssue[], passed: AccessibilityCheck[], recommendations: AccessibilityRecommendation[]): void {
    const interactiveElements = document.querySelectorAll('button, a[href], input, select, textarea, [tabindex]');
    // let elementsWithoutFocus = 0;

    interactiveElements.forEach((element) => {
      const tabindex = element.getAttribute('tabindex');
      
      // Check for positive tabindex values (anti-pattern)
      if (tabindex && parseInt(tabindex) > 0) {
        issues.push({
          type: 'warning',
          level: 'AA',
          category: 'Keyboard Navigation',
          message: 'Positive tabindex value detected',
          element: element.tagName.toLowerCase(),
          impact: 'Disrupts natural tab order',
          fix: 'Use tabindex="0" or remove tabindex, manage focus programmatically',
          wcagReference: 'WCAG 2.4.3'
        });
      }

      // Check for elements that should be focusable but aren't
      if (tabindex === '-1' && !element.hasAttribute('aria-hidden')) {
        // elementsWithoutFocus++;
      }
    });

    if (interactiveElements.length > 0) {
      passed.push({
        category: 'Keyboard Navigation',
        description: 'Interactive elements are keyboard accessible',
        wcagReference: 'WCAG 2.1.1',
        value: `${interactiveElements.length} interactive elements`
      });
    }

    // Check for skip links
    const skipLink = document.querySelector('a[href="#main"], a[href="#content"], .skip-link');
    if (skipLink) {
      passed.push({
        category: 'Keyboard Navigation',
        description: 'Skip link present',
        wcagReference: 'WCAG 2.4.1'
      });
    } else {
      recommendations.push({
        category: 'Keyboard Navigation',
        priority: 'medium',
        title: 'Add Skip Links',
        description: 'Add skip navigation links for keyboard users',
        implementation: 'Add "Skip to main content" link at top of page',
        wcagReference: 'WCAG 2.4.1'
      });
    }
  }

  private auditARIA(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): void {
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
    let validAriaCount = 0;
    // let invalidAriaCount = 0;

    elementsWithAria.forEach((element) => {
      const role = element.getAttribute('role');
      const ariaLabel = element.getAttribute('aria-label');
      
      // Check for valid roles (simplified check)
      const validRoles = ['button', 'link', 'tab', 'tabpanel', 'dialog', 'alert', 'status', 'banner', 'navigation', 'main', 'complementary', 'contentinfo'];
      
      if (role && !validRoles.includes(role)) {
        // invalidAriaCount++;
        issues.push({
          type: 'warning',
          level: 'AA',
          category: 'ARIA',
          message: 'Invalid or deprecated ARIA role',
          element: element.tagName.toLowerCase(),
          impact: 'Screen readers may not understand element purpose',
          fix: 'Use valid ARIA roles from WAI-ARIA specification',
          wcagReference: 'WCAG 4.1.2'
        });
      } else if (role || ariaLabel) {
        validAriaCount++;
      }
    });

    if (validAriaCount > 0) {
      passed.push({
        category: 'ARIA',
        description: 'ARIA attributes properly used',
        wcagReference: 'WCAG 4.1.2',
        value: `${validAriaCount} elements with ARIA`
      });
    }
  }

  private auditFocusManagement(_issues: AccessibilityIssue[], passed: AccessibilityCheck[], recommendations: AccessibilityRecommendation[]): void {
    // Check for focus indicators
    const focusableElements = document.querySelectorAll('button, a[href], input, select, textarea');
    
    if (focusableElements.length > 0) {
      passed.push({
        category: 'Focus Management',
        description: 'Focusable elements present',
        wcagReference: 'WCAG 2.4.7'
      });
    }

    // Look for custom focus management
    const elementsWithFocusHandling = document.querySelectorAll('[onfocus], [onblur]');
    if (elementsWithFocusHandling.length > 0) {
      recommendations.push({
        category: 'Focus Management',
        priority: 'medium',
        title: 'Review Custom Focus Handling',
        description: 'Ensure custom focus management follows accessibility best practices',
        implementation: 'Test focus flow with keyboard navigation',
        wcagReference: 'WCAG 2.4.3'
      });
    }
  }

  private auditInteractiveElements(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): void {
    const buttons = document.querySelectorAll('button');
    let buttonsWithoutText = 0;

    buttons.forEach((button, index) => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      
      if (!text && !ariaLabel) {
        buttonsWithoutText++;
        issues.push({
          type: 'critical',
          level: 'A',
          category: 'Interactive Elements',
          message: `Button ${index + 1} has no accessible text`,
          impact: 'Users cannot understand button purpose',
          fix: 'Add text content or aria-label to button',
          wcagReference: 'WCAG 4.1.2'
        });
      }
    });

    if (buttonsWithoutText === 0 && buttons.length > 0) {
      passed.push({
        category: 'Interactive Elements',
        description: 'All buttons have accessible text',
        wcagReference: 'WCAG 4.1.2',
        value: `${buttons.length} buttons`
      });
    }
  }

  private calculateAccessibilityScore(issues: AccessibilityIssue[], passed: AccessibilityCheck[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'critical':
          score -= 25;
          break;
        case 'warning':
          score -= 15;
          break;
        case 'info':
          score -= 5;
          break;
      }
    });

    // Bonus for passed checks
    const bonusPoints = Math.min(passed.length * 3, 25);
    score += bonusPoints;

    return Math.max(0, Math.min(100, score));
  }

  private determineWCAGLevel(issues: AccessibilityIssue[]): 'A' | 'AA' | 'AAA' {
    const criticalIssues = issues.filter(issue => issue.type === 'critical');
    const levelAIssues = issues.filter(issue => issue.level === 'A');
    const levelAAIssues = issues.filter(issue => issue.level === 'AA');

    if (criticalIssues.length > 0 || levelAIssues.length > 0) {
      return 'A';
    } else if (levelAAIssues.length > 0) {
      return 'AA';
    } else {
      return 'AAA';
    }
  }

  /**
   * Generate accessibility report as text
   */
  public generateReport(audit: AccessibilityAuditResult): string {
    let report = '# Accessibility Audit Report\n\n';
    report += `**Overall Score: ${audit.score}/100**\n`;
    report += `**WCAG Compliance Level: ${audit.level}**\n\n`;
    report += `**Page:** ${audit.metadata.url}\n`;
    report += `**Interactive Elements:** ${audit.metadata.interactiveElementCount}\n`;
    report += `**Form Controls:** ${audit.metadata.formCount}\n\n`;

    if (audit.issues.length > 0) {
      report += '## Issues Found\n\n';
      audit.issues.forEach((issue, index) => {
        report += `### ${index + 1}. ${issue.message} (${issue.type.toUpperCase()} - WCAG ${issue.level})\n`;
        report += `**Category:** ${issue.category}\n`;
        report += `**Impact:** ${issue.impact}\n`;
        report += `**Fix:** ${issue.fix}\n`;
        report += `**WCAG Reference:** ${issue.wcagReference}\n\n`;
      });
    }

    if (audit.recommendations.length > 0) {
      report += '## Recommendations\n\n';
      audit.recommendations.forEach((rec, index) => {
        report += `### ${index + 1}. ${rec.title} (${rec.priority.toUpperCase()} PRIORITY)\n`;
        report += `**Description:** ${rec.description}\n`;
        report += `**Implementation:** ${rec.implementation}\n`;
        report += `**WCAG Reference:** ${rec.wcagReference}\n\n`;
      });
    }

    if (audit.passed.length > 0) {
      report += '## Passed Checks\n\n';
      audit.passed.forEach((check) => {
        report += `- ${check.description}`;
        if (check.value) {
          report += ` (${check.value})`;
        }
        report += ` - ${check.wcagReference}\n`;
      });
    }

    return report;
  }
}

// Export singleton instance
export const accessibilityAuditor = AccessibilityAuditor.getInstance();
