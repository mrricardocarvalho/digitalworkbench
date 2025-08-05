/**
 * Content Management System Utilities
 * Handles markdown loading, frontmatter parsing, and content validation
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  featured: boolean;
  tags?: string[];
  categories?: string[];
  author?: string;
  published?: boolean;
}

export interface BlogPostContent extends BlogPost {
  content: string;
  excerpt?: string;
}

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  readingTime?: number;
  featured?: boolean;
  tags?: string[];
  categories?: string[];
  author?: string;
  published?: boolean;
  slug?: string;
}

/**
 * Parse frontmatter from markdown content
 */
export const parseFrontmatter = (markdownContent: string): { frontmatter: Frontmatter; content: string } => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);

  if (!match) {
    // No frontmatter found
    return {
      frontmatter: {
        title: 'Untitled',
        description: '',
        date: new Date().toISOString().split('T')[0] || '',
        published: false
      },
      content: markdownContent
    };
  }

  const [, frontmatterText, content] = match;
  const frontmatter: Partial<Frontmatter> = {};

  // Parse YAML-like frontmatter manually
  if (frontmatterText) {
    frontmatterText.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        const cleanKey = key.trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
          // Remove quotes
          (frontmatter as any)[cleanKey] = value.slice(1, -1);
        } else if (value === 'true' || value === 'false') {
          // Boolean values
          (frontmatter as any)[cleanKey] = value === 'true';
        } else if (!isNaN(Number(value))) {
          // Numeric values
          (frontmatter as any)[cleanKey] = Number(value);
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // Array values
          try {
            (frontmatter as any)[cleanKey] = JSON.parse(value);
          } catch {
            (frontmatter as any)[cleanKey] = value;
          }
        } else {
          (frontmatter as any)[cleanKey] = value;
        }
      }
    });
  }

  // Ensure required fields have defaults
  const completeFrontmatter: Frontmatter = {
    title: frontmatter.title || 'Untitled',
    description: frontmatter.description || '',
    date: frontmatter.date || new Date().toISOString().split('T')[0] || '',
    ...(frontmatter.readingTime !== undefined && { readingTime: frontmatter.readingTime }),
    ...(frontmatter.featured !== undefined && { featured: frontmatter.featured }),
    ...(frontmatter.tags !== undefined && { tags: frontmatter.tags }),
    ...(frontmatter.categories !== undefined && { categories: frontmatter.categories }),
    ...(frontmatter.author !== undefined && { author: frontmatter.author }),
    ...(frontmatter.published !== undefined && { published: frontmatter.published }),
    ...(frontmatter.slug !== undefined && { slug: frontmatter.slug })
  };

  return { frontmatter: completeFrontmatter, content: content || '' };
};

/**
 * Escape HTML entities to prevent XSS
 */
const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Create safe anchor ID from text
 */
const createAnchorId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

/**
 * Process markdown lists with proper nesting
 */
const processLists = (text: string): string => {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const unorderedMatch = line.match(/^(\s*)-\s+(.+)$/);
    const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);

    if (unorderedMatch || orderedMatch) {
      const isOrdered = !!orderedMatch;
      const content = isOrdered ? orderedMatch![3] : unorderedMatch![2];
      const currentListType = isOrdered ? 'ol' : 'ul';

      if (!inList) {
        result.push(`<${currentListType}>`);
        inList = true;
        listType = currentListType;
      } else if (listType !== currentListType) {
        result.push(`</${listType}>`);
        result.push(`<${currentListType}>`);
        listType = currentListType;
      }

      result.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      result.push(line);
    }
  }

  if (inList) {
    result.push(`</${listType}>`);
  }

  return result.join('\n');
};

/**
 * Convert markdown to HTML with enhanced features and proper formatting
 */
export const markdownToHTML = (markdown: string): string => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  let html = markdown;

  // First, protect code blocks from other processing
  const codeBlockPlaceholders = new Map<string, string>();
  let placeholderIndex = 0;

  // Extract and process code blocks
  html = html.replace(/```([a-zA-Z0-9]*)\n?([\s\S]*?)```/g, (_, language, code) => {
    const placeholder = `__CODE_BLOCK_${placeholderIndex++}__`;
    const lang = language ? language.toLowerCase() : '';
    const escapedCode = escapeHTML(code.trim());
    
    const languageClass = lang ? ` language-${lang}` : '';
    const dataLang = lang ? ` data-language="${lang}"` : '';
    const langIndicator = lang ? `<span class="code-language">${lang.toUpperCase()}</span>` : '';
    
    const processedBlock = `<div class="code-block-wrapper">${langIndicator}
      <pre class="code-block${languageClass}"${dataLang}><code>${escapedCode}</code></pre>
    </div>`;
    
    codeBlockPlaceholders.set(placeholder, processedBlock);
    return placeholder;
  });

  // Process inline code (protect from other formatting)
  const inlineCodePlaceholders = new Map<string, string>();
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `__INLINE_CODE_${placeholderIndex++}__`;
    const processedCode = `<code class="inline-code">${escapeHTML(code)}</code>`;
    inlineCodePlaceholders.set(placeholder, processedCode);
    return placeholder;
  });

  // Headers with proper anchor links
  html = html.replace(/^### (.+$)/gim, (_, text) => {
    const id = createAnchorId(text);
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.+$)/gim, (_, text) => {
    const id = createAnchorId(text);
    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/^# (.+$)/gim, (_, text) => {
    const id = createAnchorId(text);
    return `<h1 id="${id}">${text}</h1>`;
  });

  // Bold and italic (avoid conflicts with other formatting)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links with security attributes
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const isExternal = url.startsWith('http') && !url.includes('localhost');
    const attributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${attributes}>${text}</a>`;
  });

  // Blockquotes
  html = html.replace(/^> (.+$)/gim, '<blockquote><p>$1</p></blockquote>');

  // Process lists
  html = processLists(html);

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');

  // Line breaks and paragraphs (more robust handling)
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine === '') {
      if (inParagraph) {
        processedLines.push('</p>');
        inParagraph = false;
      }
      continue;
    }

    // Check if line is a block element
    const isBlockElement = /^<(h[1-6]|blockquote|pre|ul|ol|li|hr|div)/.test(trimmedLine) ||
                          trimmedLine.includes('__CODE_BLOCK_') ||
                          trimmedLine.startsWith('<hr>');

    if (isBlockElement) {
      if (inParagraph) {
        processedLines.push('</p>');
        inParagraph = false;
      }
      processedLines.push(trimmedLine);
    } else {
      if (!inParagraph) {
        processedLines.push('<p>');
        inParagraph = true;
      }
      processedLines.push(trimmedLine);
    }
  }

  if (inParagraph) {
    processedLines.push('</p>');
  }

  html = processedLines.join('\n');

  // Restore code blocks
  codeBlockPlaceholders.forEach((replacement, placeholder) => {
    html = html.replace(placeholder, replacement);
  });

  // Restore inline code
  inlineCodePlaceholders.forEach((replacement, placeholder) => {
    html = html.replace(placeholder, replacement);
  });

  // Clean up extra whitespace and empty paragraphs
  html = html
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return html;
};

/**
 * Calculate reading time based on content
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Generate excerpt from content
 */
export const generateExcerpt = (content: string, maxLength: number = 160): string => {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n+/g, ' ');
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...'
    : plainText;
};

/**
 * Validate blog post data
 */
export const validateBlogPost = (post: Partial<BlogPost>): string[] => {
  const errors: string[] = [];

  if (!post.title || post.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!post.description || post.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!post.date || !isValidDate(post.date)) {
    errors.push('Valid date is required');
  }

  if (!post.slug || post.slug.trim().length === 0) {
    errors.push('Slug is required');
  } else if (!/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  return errors;
};

/**
 * Check if a date string is valid
 */
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Content loading with caching
 */
class ContentManager {
  private cache = new Map<string, BlogPostContent>();
  private contentRegistry = new Map<string, string>();

  /**
   * Register content for a slug
   */
  registerContent(slug: string, markdownContent: string): void {
    console.log(`📋 Registering content for slug: ${slug}, content length: ${markdownContent.length}`);
    this.contentRegistry.set(slug, markdownContent);
  }

  /**
   * Load blog post by slug
   */
  async loadBlogPost(slug: string): Promise<BlogPostContent | null> {
    console.log(`🔍 Loading blog post: ${slug}`);
    
    // Check cache first
    if (this.cache.has(slug)) {
      console.log(`💾 Found in cache: ${slug}`);
      return this.cache.get(slug)!;
    }

    // Get content from registry
    const markdownContent = this.contentRegistry.get(slug);
    if (!markdownContent) {
      console.log(`❌ No content found in registry for: ${slug}`);
      console.log(`📋 Available slugs:`, Array.from(this.contentRegistry.keys()));
      return null;
    }

    console.log(`✅ Found content for ${slug}, length: ${markdownContent.length}`);

    try {
      const { frontmatter, content } = parseFrontmatter(markdownContent);
      
      // Build blog post object
      const blogPost: BlogPostContent = {
        slug: slug,
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        readingTime: frontmatter.readingTime || calculateReadingTime(content),
        featured: frontmatter.featured || false,
        tags: frontmatter.tags || [],
        categories: frontmatter.categories || [],
        author: frontmatter.author || 'Ricardo Carvalho',
        published: frontmatter.published !== false, // Default to true
        content: markdownToHTML(content),
        excerpt: generateExcerpt(content)
      };

      // Validate
      const errors = validateBlogPost(blogPost);
      if (errors.length > 0) {
        console.warn(`Validation errors for blog post ${slug}:`, errors);
      }

      // Cache the result
      this.cache.set(slug, blogPost);
      return blogPost;

    } catch (error) {
      console.error(`Error processing blog post ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get all registered blog posts
   */
  getAllBlogPosts(): BlogPost[] {
    const posts: BlogPost[] = [];
    
    for (const [slug, markdownContent] of this.contentRegistry) {
      try {
        const { frontmatter } = parseFrontmatter(markdownContent);
        
        if (frontmatter.published !== false) {
          posts.push({
            slug,
            title: frontmatter.title,
            description: frontmatter.description,
            date: frontmatter.date,
            readingTime: frontmatter.readingTime || calculateReadingTime(markdownContent),
            featured: frontmatter.featured || false,
            tags: frontmatter.tags || [],
            categories: frontmatter.categories || [],
            author: frontmatter.author || 'Ricardo Carvalho',
            published: true
          });
        }
      } catch (error) {
        console.warn(`Error processing blog post metadata for ${slug}:`, error);
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const contentManager = new ContentManager();
