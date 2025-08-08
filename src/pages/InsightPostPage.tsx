import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import ReadingProgress from '../components/ReadingProgress';
import TableOfContents from '../components/TableOfContents';
import SocialShare from '../components/SocialShare';
import RelatedArticles from '../components/RelatedArticles';
import ArticleTags from '../components/ArticleTags';
import ArticleFeedback from '../components/ArticleFeedback';
import { useAnalytics } from '../utils/analytics';
import { contentManager } from '../utils/contentManager';
import './InsightPostPage.css';

// Helper function to get tags and categories for articles
const getArticleMetadata = (slug: string) => {
  const commonTags = ['Business Central', 'AL Development', 'Microsoft Dynamics 365'];
  const metadataMap: Record<string, { tags: string[]; categories: string[] }> = {
    'exploring-secrettext-feature-business-central': {
      tags: [...commonTags, 'SecretText', 'Control Add-ins', 'Security'],
      categories: ['Development', 'Security', 'Tutorial']
    },
    'automating-tests-copilot-extensions-business-central': {
      tags: [...commonTags, 'Copilot', 'Testing', 'AI Integration'],
      categories: ['Development', 'Testing', 'AI']
    },
    'leveraging-ai-resources-business-central-copilot': {
      tags: [...commonTags, 'Azure AI', 'Copilot', 'Machine Learning'],
      categories: ['Development', 'AI', 'Tutorial']
    },
    'refactoring-moving-tables-fields-extensions': {
      tags: [...commonTags, 'Refactoring', 'Data Migration', 'Extensions'],
      categories: ['Development', 'Best Practices', 'Data Management']
    },
    'enhancing-user-interfaces-cardpageid-extension': {
      tags: [...commonTags, 'UI/UX', 'Page Extensions', 'Navigation'],
      categories: ['Development', 'UI/UX', 'Tutorial']
    },
    'ai-powered-features-business-central-guide': {
      tags: [...commonTags, 'AI Features', 'Predictive Analytics', 'Azure AI'],
      categories: ['Development', 'AI', 'Business Intelligence']
    },
    'migrating-dynamics-gp-business-central-guide': {
      tags: [...commonTags, 'Migration', 'Dynamics GP', 'Cloud Migration'],
      categories: ['Migration', 'Tutorial', 'Best Practices']
    },
    'mastering-dotnet-assemblies-business-central': {
      tags: [...commonTags, '.NET Assemblies', 'Integration', 'External APIs'],
      categories: ['Development', 'Integration', 'Advanced']
    },
    'crafting-effective-success-messages-business-central': {
      tags: [...commonTags, 'User Experience', 'Error Handling', 'UI/UX'],
      categories: ['Development', 'UI/UX', 'Best Practices']
    },
    'advanced-email-handling-business-central': {
      tags: [...commonTags, 'Email Integration', 'SMTP', 'Microsoft Graph'],
      categories: ['Development', 'Integration', 'Advanced']
    },
    'business-central-performance-bottlenecks-guide': {
      tags: [...commonTags, 'Performance', 'Optimization', 'Database'],
      categories: ['Development', 'Performance', 'Best Practices']
    },
    'advanced-al-development-interfaces-abstract-classes': {
      tags: [...commonTags, 'Interfaces', 'Abstract Classes', 'OOP'],
      categories: ['Development', 'Advanced', 'Design Patterns']
    }
  };
  
  return metadataMap[slug] || { tags: commonTags, categories: ['Development'] };
};

// Get all blog posts from content management system
// This will be moved inside the component to ensure it runs after content registration
// const blogPosts = contentManager.getAllBlogPosts();

// Function to get markdown content for each post using content management system
const getPostContent = async (slug: string): Promise<string> => {
  try {
    console.log(`🔍 Loading content for slug: ${slug}`);
    const blogPost = await contentManager.loadBlogPost(slug);
    console.log(`📄 Blog post found:`, blogPost ? 'YES' : 'NO');
    if (blogPost) {
      console.log(`📝 Content length:`, blogPost.content?.length || 0);
    }
    return blogPost?.content || '';
  } catch (error) {
    console.error(`❌ Error loading content for slug: ${slug}`, error);
    return '';
  }
};

const InsightPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [startTime] = useState<number>(Date.now());
  const [scrollDepth, setScrollDepth] = useState<number>(0);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  
  const { trackArticleEngagement, trackUserJourney, trackError } = useAnalytics();

  // Load blog posts after content registration
  useEffect(() => {
    const posts = contentManager.getAllBlogPosts();
    setBlogPosts(posts);
    console.log('📋 Loaded blog posts:', posts.length, 'posts found');
  }, []);

  const currentPost = blogPosts.find(post => post.slug === slug);

  // Smart back navigation that handles referrals and browser history
  const handleBackNavigation = useCallback(() => {
    const referrer = document.referrer;
    const isInternalReferrer = referrer.includes(window.location.origin);
    
    if (window.history.length > 1 && isInternalReferrer) {
      navigate(-1);
    } else {
      navigate('/insights');
    }
    
    trackUserJourney('article_back_navigation', {
      article_slug: slug,
      referrer_type: isInternalReferrer ? 'internal' : 'external',
      navigation_method: 'back_button'
    });
  }, [navigate, slug, trackUserJourney]);

  // Track scroll depth for engagement analytics
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollDepth(Math.max(scrollDepth, scrollPercent));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDepth]);

  // Load content and track engagement
  useEffect(() => {
    if (!slug) {
      navigate('/insights');
      return;
    }

    const loadContent = async () => {
      setLoading(true);
      setError('');

      try {
        const markdownContent = await getPostContent(slug);
        
        if (!markdownContent) {
          setError('Article content not found');
          trackError(new Error('content_not_found'), { slug });
        } else {
          setContent(markdownContent);
          
          // Track article view
          trackArticleEngagement('article_view', {
            article_slug: slug,
            article_title: currentPost?.title || 'Unknown',
            reading_time_estimate: currentPost?.readingTime || 0
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load article: ${errorMessage}`);
        trackError(err instanceof Error ? err : new Error(errorMessage), { slug, error: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug, navigate, trackArticleEngagement, trackError, currentPost]);

  // Track reading completion and engagement on unmount
  useEffect(() => {
    return () => {
      const readingTime = (Date.now() - startTime) / 1000;
      
      trackArticleEngagement('article_engagement', {
        article_slug: slug,
        reading_time_seconds: readingTime,
        scroll_depth_percent: scrollDepth,
        completion_rate: scrollDepth > 90 ? 'completed' : 'partial'
      });
    };
  }, [slug, startTime, scrollDepth, trackArticleEngagement]);

  // Error handling
  if (error) {
    return (
      <div className="insight-post-page">
        <div className="error-container">
          <h1>Article Not Found</h1>
          <p>{error}</p>
          <button onClick={handleBackNavigation} className="back-button">
            ← Back to Articles
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="insight-post-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  // Post not found
  if (!currentPost) {
    return (
      <div className="insight-post-page">
        <div className="error-container">
          <h1>Article Not Found</h1>
          <p>The requested article could not be found.</p>
          <button onClick={handleBackNavigation} className="back-button">
            ← Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const articleMetadata = getArticleMetadata(slug || '');

  return (
    <div className="insight-post-page">
      <SEO 
        {...(slug && { articleSlug: slug })}
        title={currentPost.title}
        description={currentPost.description}
        publishedTime={currentPost.date}
        readingTime={currentPost.readingTime}
        tags={articleMetadata.tags}
      />
      
      <ReadingProgress />
      
      <div className="post-container">
        <header className="post-header">
          <button onClick={handleBackNavigation} className="back-button">
            ← Back to Articles
          </button>
          
          <div className="post-meta">
            <h1>{currentPost.title}</h1>
            <p className="post-description">{currentPost.description}</p>
            <div className="post-info">
              <span className="post-date">{currentPost.date}</span>
              <span className="reading-time">{currentPost.readingTime} min read</span>
              {currentPost.featured && <span className="featured-badge">Featured</span>}
            </div>
          </div>
        </header>

        <div className="post-content-wrapper">
          <aside className="post-sidebar">
            <TableOfContents contentSelector=".markdown-content" />
          </aside>

          <main className="post-content">
            <div 
              dangerouslySetInnerHTML={{ __html: content }}
              className="markdown-content"
            />
            
            <ArticleTags 
              tags={articleMetadata.tags}
              categories={articleMetadata.categories}
            />
            
            <ArticleFeedback 
              articleSlug={slug || ''} 
              articleTitle={currentPost.title}
            />
            
            <SocialShare 
              url={window.location.href}
              title={currentPost.title}
              description={currentPost.description}
            />
          </main>
        </div>

        <RelatedArticles 
          currentSlug={slug || ''}
          articles={blogPosts.map(post => ({
            slug: post.slug,
            title: post.title,
            description: post.description,
            date: post.date,
            readingTime: post.readingTime,
            featured: post.featured,
            tags: post.tags || []
          }))}
          maxResults={3}
        />
      </div>
    </div>
  );
};

export default InsightPostPage;
