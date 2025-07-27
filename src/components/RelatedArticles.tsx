import React from 'react';
import { Link } from 'react-router-dom';
import './RelatedArticles.css';

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  featured?: boolean;
  category?: string;
  tags?: string[];
}

interface RelatedArticlesProps {
  currentSlug: string;
  articles: Article[];
  maxResults?: number;
  className?: string;
  title?: string;
}

// Function to calculate article similarity based on title keywords and tags
const calculateSimilarity = (current: Article, candidate: Article): number => {
  let score = 0;
  
  // Extract keywords from titles (remove common words)
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'around', 'near', 'within', 'without', 'against', 'toward', 'towards', 'upon', 'across', 'behind', 'beyond', 'underneath', 'beneath', 'alongside', 'throughout', 'inside', 'outside', 'onto', 'under', 'over', 'via', 'within'];
  
  const extractKeywords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
  };
  
  const currentKeywords = extractKeywords(current.title + ' ' + current.description);
  const candidateKeywords = extractKeywords(candidate.title + ' ' + candidate.description);
  
  // Title keyword matching (higher weight)
  const titleMatches = currentKeywords.filter(keyword => 
    candidateKeywords.includes(keyword)
  ).length;
  score += titleMatches * 3;
  
  // Category matching
  if (current.category && candidate.category && current.category === candidate.category) {
    score += 2;
  }
  
  // Tag matching
  if (current.tags && candidate.tags) {
    const tagMatches = current.tags.filter(tag => 
      candidate.tags?.includes(tag)
    ).length;
    score += tagMatches * 2;
  }
  
  // Boost featured articles slightly
  if (candidate.featured) {
    score += 0.5;
  }
  
  return score;
};

// Function to get related articles
const getRelatedArticles = (
  currentSlug: string, 
  articles: Article[], 
  maxResults: number = 3
): Article[] => {
  const currentArticle = articles.find(article => article.slug === currentSlug);
  
  if (!currentArticle) {
    return articles.slice(0, maxResults);
  }
  
  // Calculate similarity scores for all other articles
  const scoredArticles = articles
    .filter(article => article.slug !== currentSlug)
    .map(article => ({
      ...article,
      similarity: calculateSimilarity(currentArticle, article)
    }))
    .sort((a, b) => b.similarity - a.similarity);
  
  return scoredArticles.slice(0, maxResults);
};

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentSlug,
  articles,
  maxResults = 3,
  className = '',
  title = 'Related Articles'
}) => {
  const relatedArticles = getRelatedArticles(currentSlug, articles, maxResults);
  
  if (relatedArticles.length === 0) {
    return null;
  }
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <section className={`related-articles ${className}`}>
      <h3 className="related-articles__title">{title}</h3>
      
      <div className="related-articles__grid">
        {relatedArticles.map((article) => (
          <Link
            key={article.slug}
            to={`/insights/${article.slug}`}
            className="related-article-card"
          >
            <div className="related-article-card__content">
              <div className="related-article-card__header">
                {article.featured && (
                  <span className="related-article-card__badge">⭐ Featured</span>
                )}
                <div className="related-article-card__meta">
                  <span className="related-article-card__date">
                    {formatDate(article.date)}
                  </span>
                  <span className="related-article-card__reading-time">
                    {article.readingTime} min read
                  </span>
                </div>
              </div>
              
              <h4 className="related-article-card__title">
                {article.title}
              </h4>
              
              <p className="related-article-card__description">
                {article.description}
              </p>
              
              <div className="related-article-card__footer">
                <span className="related-article-card__link">
                  Read article →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
