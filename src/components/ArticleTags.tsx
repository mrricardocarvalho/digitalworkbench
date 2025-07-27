import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../utils/analytics';
import './ArticleTags.css';

interface ArticleTagsProps {
  tags?: string[];
  categories?: string[];
  className?: string;
  maxTags?: number;
  showAllLink?: boolean;
  showSearch?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (category: string) => void;
}

export const ArticleTags: React.FC<ArticleTagsProps> = ({
  tags = [],
  categories = [],
  className = '',
  maxTags = 6,
  showAllLink = true,
  showSearch = false,
  variant = 'default',
  onTagClick,
  onCategoryClick
}) => {
  const navigate = useNavigate();
  const { trackUserJourney } = useAnalytics();

  // Don't render if no tags
  if (!tags || tags.length === 0) {
    return null;
  }

  // Handle tag click
  const handleTagClick = (tag: string) => {
    trackUserJourney('article_tag_clicked', {
      tag: tag,
      variant: variant
    });

    // Use custom handler if provided, otherwise navigate to search
    if (onTagClick) {
      onTagClick(tag);
    } else {
      // Navigate to search with tag filter
      navigate(`/search?tag=${encodeURIComponent(tag)}`);
    }
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    trackUserJourney('article_category_clicked', {
      category: category,
      variant: variant
    });

    // Use custom handler if provided, otherwise navigate to search
    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      // Navigate to search with category filter
      navigate(`/search?category=${encodeURIComponent(category)}`);
    }
  };

  // Handle view all tags
  const handleViewAllTags = () => {
    trackUserJourney('view_all_tags_clicked', {
      from_article: 'article_tags_component'
    });

    navigate('/search?type=tag');
  };

  // Determine tags to display
  const displayTags = tags.slice(0, maxTags);
  const remainingCount = Math.max(0, tags.length - maxTags);

  // Get icon for specific tags
  const getTagIcon = (tag: string): string => {
    const lowerTag = tag.toLowerCase();
    
    if (lowerTag.includes('business central') || lowerTag.includes('bc')) return '💼';
    if (lowerTag.includes('al') || lowerTag.includes('development')) return '💻';
    if (lowerTag.includes('performance') || lowerTag.includes('optimization')) return '⚡';
    if (lowerTag.includes('api') || lowerTag.includes('integration')) return '🔌';
    if (lowerTag.includes('security') || lowerTag.includes('compliance')) return '🔒';
    if (lowerTag.includes('cloud') || lowerTag.includes('azure')) return '☁️';
    if (lowerTag.includes('analytics') || lowerTag.includes('reporting')) return '📊';
    if (lowerTag.includes('workflow') || lowerTag.includes('automation')) return '🔄';
    if (lowerTag.includes('migration') || lowerTag.includes('upgrade')) return '🚀';
    if (lowerTag.includes('devops') || lowerTag.includes('ci/cd')) return '⚙️';
    if (lowerTag.includes('ui') || lowerTag.includes('ux')) return '🎨';
    if (lowerTag.includes('ai') || lowerTag.includes('copilot')) return '🤖';
    
    return '🏷️';
  };

  // Get icon for specific categories
  const getCategoryIcon = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('development')) return '💻';
    if (lowerCategory.includes('tutorial')) return '📚';
    if (lowerCategory.includes('best practices')) return '⭐';
    if (lowerCategory.includes('security')) return '🔒';
    if (lowerCategory.includes('performance')) return '⚡';
    if (lowerCategory.includes('integration')) return '🔌';
    if (lowerCategory.includes('ai')) return '🤖';
    if (lowerCategory.includes('migration')) return '🚀';
    if (lowerCategory.includes('testing')) return '🧪';
    if (lowerCategory.includes('ui/ux')) return '🎨';
    if (lowerCategory.includes('data management')) return '💾';
    if (lowerCategory.includes('business intelligence')) return '📊';
    if (lowerCategory.includes('advanced')) return '🎯';
    
    return '📁';
  };

  return (
    <div className={`article-tags ${variant} ${className}`}>
      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <div className="categories-section">
          {variant !== 'minimal' && (
            <span className="categories-label">Categories:</span>
          )}
          <div className="categories-container">
            {categories.map((category, index) => (
              <button
                key={index}
                className="category-button"
                onClick={() => handleCategoryClick(category)}
                title={`View all articles in ${category}`}
              >
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-text">{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Tags Section */}
      {tags && tags.length > 0 && (
        <div className="tags-section">
          {variant !== 'minimal' && (
            <span className="tags-label">Topics:</span>
          )}
          
          <div className="tags-container">
            {displayTags.map((tag, index) => (
              <button
                key={index}
                className="tag-button"
                onClick={() => handleTagClick(tag)}
                title={`View all articles about ${tag}`}
              >
                <span className="tag-icon">{getTagIcon(tag)}</span>
                <span className="tag-text">{tag}</span>
              </button>
            ))}
            
            {remainingCount > 0 && (
              <button
                className="tag-button tag-more"
                onClick={handleViewAllTags}
                title={`View ${remainingCount} more tag${remainingCount !== 1 ? 's' : ''}`}
              >
                <span className="tag-text">+{remainingCount} more</span>
              </button>
            )}
            
            {showAllLink && tags.length > 3 && (
              <button
                className="view-all-tags"
                onClick={handleViewAllTags}
                title="Browse all article topics"
              >
                Browse all topics →
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Search Integration */}
      {showSearch && (tags.length > 0 || categories.length > 0) && (
        <div className="search-integration">
          <button
            className="search-button"
            onClick={() => navigate('/search')}
            title="Search all articles"
          >
            🔍 Search Articles
          </button>
        </div>
      )}
    </div>
  );
};

// Category component for organizing articles
interface ArticleCategoryProps {
  category: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'badge' | 'minimal';
}

export const ArticleCategory: React.FC<ArticleCategoryProps> = ({
  category,
  className = '',
  showIcon = true,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const { trackUserJourney } = useAnalytics();

  // Handle category click
  const handleCategoryClick = () => {
    trackUserJourney('article_category_clicked', {
      category: category,
      variant: variant
    });

    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  // Get category icon and color
  const getCategoryInfo = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    
    if (lowerCat.includes('development') || lowerCat.includes('programming')) {
      return { icon: '💻', color: '#007ACC' };
    }
    if (lowerCat.includes('performance') || lowerCat.includes('optimization')) {
      return { icon: '⚡', color: '#FF6B35' };
    }
    if (lowerCat.includes('integration') || lowerCat.includes('api')) {
      return { icon: '🔌', color: '#28A745' };
    }
    if (lowerCat.includes('security') || lowerCat.includes('compliance')) {
      return { icon: '🔒', color: '#DC3545' };
    }
    if (lowerCat.includes('analytics') || lowerCat.includes('reporting')) {
      return { icon: '📊', color: '#6F42C1' };
    }
    if (lowerCat.includes('workflow') || lowerCat.includes('automation')) {
      return { icon: '🔄', color: '#20C997' };
    }
    if (lowerCat.includes('enterprise') || lowerCat.includes('implementation')) {
      return { icon: '🏢', color: '#6C757D' };
    }
    if (lowerCat.includes('ai') || lowerCat.includes('machine learning')) {
      return { icon: '🤖', color: '#E83E8C' };
    }
    
    return { icon: '📁', color: '#6C757D' };
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <button
      className={`article-category ${variant} ${className}`}
      onClick={handleCategoryClick}
      title={`View all articles in ${category}`}
      style={{ '--category-color': categoryInfo.color } as React.CSSProperties}
    >
      {showIcon && (
        <span className="category-icon">{categoryInfo.icon}</span>
      )}
      <span className="category-text">{category}</span>
    </button>
  );
};

export default ArticleTags;
