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
 * Convert markdown to HTML with enhanced features
 */
export const markdownToHTML = (markdown: string): string => {
  return markdown
    // Headers with anchor links
    .replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 id="$1">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks with language detection
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang ? ` class="language-${lang}"` : '';
      return `<pre><code${language}>${code.trim()}</code></pre>`;
    })
    
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    
    // Links with security attributes
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      const isExternal = url.startsWith('http') && !url.includes(window.location.hostname);
      const attributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}"${attributes}>${text}</a>`;
    })
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    
    // Lists
    .replace(/^\* (.+$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.+$)/gim, '<li>$2</li>')
    
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h1-6]|<blockquote|<pre|<ul|<ol|<li)/, '<p>')
    .replace(/(?<!<\/[h1-6]>|<\/blockquote>|<\/pre>|<\/ul>|<\/ol>|<\/li>)$/, '</p>')
    
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[h1-6]>)/g, '$1')
    .replace(/(<\/[h1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<blockquote>)/g, '$1')
    .replace(/(<\/blockquote>)<\/p>/g, '$1')
    .replace(/<p>(<pre>)/g, '$1')
    .replace(/(<\/pre>)<\/p>/g, '$1')
    
    // Wrap lists
    .replace(/(<li>.*<\/li>)/gs, (match) => {
      if (match.includes('<li>')) {
        return `<ul>${match}</ul>`;
      }
      return match;
    });
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
    this.contentRegistry.set(slug, markdownContent);
  }

  /**
   * Load blog post by slug
   */
  async loadBlogPost(slug: string): Promise<BlogPostContent | null> {
    // Check cache first
    if (this.cache.has(slug)) {
      return this.cache.get(slug)!;
    }

    // Get content from registry
    const markdownContent = this.contentRegistry.get(slug);
    if (!markdownContent) {
      return null;
    }

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
