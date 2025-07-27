import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import GlobalSearch from '../components/GlobalSearch';
import type { SearchResult } from '../components/GlobalSearch';
import { useAnalytics } from '../utils/analytics';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const { trackUserJourney } = useAnalytics();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchStats, setSearchStats] = useState({
    totalSearches: 0,
    averageResults: 0,
    mostSearchedTerms: [] as string[]
  });

  // Track page view
  useEffect(() => {
    trackUserJourney('search_page_visited', {
      timestamp: Date.now()
    });
  }, [trackUserJourney]);

  // Load search statistics from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('search-stats');
    if (savedStats) {
      try {
        setSearchStats(JSON.parse(savedStats));
      } catch (e) {
        console.warn('Failed to parse search stats:', e);
      }
    }
  }, []);

  // Handle search changes
  const handleSearchChange = (query: string, results: SearchResult[]) => {
    setCurrentQuery(query);
    setSearchResults(results);

    if (query && results.length >= 0) {
      // Update search statistics
      const newStats = {
        totalSearches: searchStats.totalSearches + 1,
        averageResults: Math.round(
          (searchStats.averageResults * searchStats.totalSearches + results.length) / 
          (searchStats.totalSearches + 1)
        ),
        mostSearchedTerms: updateMostSearchedTerms(query, searchStats.mostSearchedTerms)
      };
      
      setSearchStats(newStats);
      localStorage.setItem('search-stats', JSON.stringify(newStats));
    }
  };

  // Update most searched terms
  const updateMostSearchedTerms = (term: string, currentTerms: string[]): string[] => {
    const termLower = term.toLowerCase().trim();
    if (!termLower || termLower.length < 2) return currentTerms;

    const updatedTerms = [termLower, ...currentTerms.filter(t => t !== termLower)];
    return updatedTerms.slice(0, 5); // Keep only top 5
  };

  // Group results by type
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type]!.push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'project': return 'Projects';
      case 'article': return 'Articles';
      case 'page': return 'Pages';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return '🚀';
      case 'article': return '📄';
      case 'page': return '📋';
      default: return '📄';
    }
  };

  return (
    <>
      <SEO 
        title="Search | Ricardo Carvalho"
        description="Search through projects, articles, and content on Ricardo Carvalho's digital portfolio. Find insights on Business Central development, AL programming, and enterprise solutions."
        canonical="https://ricardocarvalho.dev/search"
      />
      
      <div className="container">
        <div className="search-page">
          {/* Search Page Header */}
          <header className="search-page-header">
            <h1>Search</h1>
            <p>Find projects, articles, and insights across my digital portfolio</p>
          </header>

          {/* Enhanced Search Component */}
          <div className="search-page-main">
            <GlobalSearch
              placeholder="Search projects, articles, case studies, and more..."
              showFilters={true}
              maxResults={50}
              autoFocus={true}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Search Results */}
          {currentQuery && (
            <div className="search-results-section">
              <div className="search-results-header">
                <h2>
                  {searchResults.length > 0 
                    ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${currentQuery}"`
                    : `No results found for "${currentQuery}"`
                  }
                </h2>
                
                {searchResults.length > 0 && (
                  <div className="search-results-stats">
                    {Object.keys(groupedResults).map(type => (
                      <span key={type} className="result-type-count">
                        {getTypeIcon(type)} {groupedResults[type]?.length || 0} {getTypeDisplayName(type)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="search-results-content">
                  {Object.entries(groupedResults).map(([type, results]) => (
                    <div key={type} className="result-type-section">
                      <h3 className="result-type-header">
                        <span className="result-type-icon">{getTypeIcon(type)}</span>
                        {getTypeDisplayName(type)} ({results.length})
                      </h3>
                      
                      <div className="result-type-grid">
                        {results.map(result => (
                          <SearchResultCard key={result.id} result={result} query={currentQuery} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Tips & Statistics */}
          {!currentQuery && (
            <div className="search-tips-section">
              <div className="search-tips-grid">
                <div className="search-tips-card">
                  <h3>🔍 Search Tips</h3>
                  <ul>
                    <li>Try specific keywords like "Business Central", "AL development", or "API integration"</li>
                    <li>Use filters to narrow down by content type or category</li>
                    <li>Search for technologies like "React", "TypeScript", or "Power BI"</li>
                    <li>Look for project names or article titles</li>
                  </ul>
                </div>

                <div className="search-tips-card">
                  <h3>📊 Popular Content</h3>
                  <ul>
                    <li>Business Central Performance Optimization</li>
                    <li>Advanced AL Extension Patterns</li>
                    <li>API Integration Frameworks</li>
                    <li>Enterprise Development Projects</li>
                  </ul>
                </div>

                {searchStats.totalSearches > 0 && (
                  <div className="search-tips-card">
                    <h3>📈 Search Statistics</h3>
                    <ul>
                      <li>Total searches: {searchStats.totalSearches}</li>
                      <li>Average results: {searchStats.averageResults}</li>
                      {searchStats.mostSearchedTerms.length > 0 && (
                        <li>
                          Popular terms: {searchStats.mostSearchedTerms.slice(0, 3).join(', ')}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="search-quick-links">
            <h3>Quick Access</h3>
            <div className="quick-links-grid">
              <a href="/projects" className="quick-link-card">
                <span className="quick-link-icon">🚀</span>
                <span className="quick-link-title">All Projects</span>
                <span className="quick-link-description">Browse my complete portfolio</span>
              </a>
              
              <a href="/insights" className="quick-link-card">
                <span className="quick-link-icon">📄</span>
                <span className="quick-link-title">Latest Articles</span>
                <span className="quick-link-description">Recent insights and tutorials</span>
              </a>
              
              <a href="/resume" className="quick-link-card">
                <span className="quick-link-icon">👨‍💻</span>
                <span className="quick-link-title">About Me</span>
                <span className="quick-link-description">Experience and expertise</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Search Result Card Component
interface SearchResultCardProps {
  result: SearchResult;
  query: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, query }) => {
  const { trackUserJourney } = useAnalytics();

  const handleCardClick = () => {
    trackUserJourney('search_result_card_clicked', {
      result_id: result.id,
      result_type: result.type,
      result_title: result.title,
      query: query,
      score: result.score
    });
  };

  // Highlight matching text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index}>{part}</mark> : 
        part
    );
  };

  return (
    <a 
      href={result.url} 
      className="search-result-card"
      onClick={handleCardClick}
    >
      <div className="search-result-card-header">
        <h4 className="search-result-card-title">
          {highlightText(result.title, query)}
        </h4>
        
        <div className="search-result-card-meta">
          {result.category && (
            <span className="result-category">{result.category}</span>
          )}
          {result.featured && (
            <span className="result-featured">⭐ Featured</span>
          )}
          <span className="result-score" title={`Relevance: ${result.score}`}>
            {Math.round(result.score)}
          </span>
        </div>
      </div>
      
      <p className="search-result-card-description">
        {highlightText(result.description, query)}
      </p>
      
      {result.tags && result.tags.length > 0 && (
        <div className="search-result-card-tags">
          {result.tags.slice(0, 4).map(tag => (
            <span key={tag} className="result-tag">
              {highlightText(tag, query)}
            </span>
          ))}
          {result.tags.length > 4 && (
            <span className="result-tag-more">
              +{result.tags.length - 4}
            </span>
          )}
        </div>
      )}
      
      {result.date && (
        <div className="search-result-card-date">
          {new Date(result.date).toLocaleDateString()}
        </div>
      )}
    </a>
  );
};

export default SearchPage;
