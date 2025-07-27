import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../utils/analytics';
import './GlobalSearch.css';

// Search result types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'article' | 'page';
  url: string;
  category?: string;
  tags?: string[];
  date?: string;
  featured?: boolean;
  score: number; // Relevance score
}

export interface SearchFilters {
  types: string[];
  categories: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  featured?: boolean;
}

interface GlobalSearchProps {
  placeholder?: string;
  showFilters?: boolean;
  maxResults?: number;
  autoFocus?: boolean;
  onSearchChange?: (query: string, results: SearchResult[]) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = "Search projects, articles, and more...",
  showFilters = true,
  maxResults = 50,
  autoFocus = false,
  onSearchChange
}) => {
  const navigate = useNavigate();
  const { trackUserJourney } = useAnalytics();
  
  // State management
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    categories: [],
    featured: false
  });
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  // Sample data - in a real app, this would come from an API
  const searchData = useMemo(() => [
    // Projects
    {
      id: 'p1',
      title: 'Digital Workbench Platform',
      description: 'Modern portfolio platform built with React, TypeScript, and Vite',
      type: 'project' as const,
      url: '/projects',
      category: 'Web Development',
      tags: ['React', 'TypeScript', 'Vite'],
      date: '2025-07-20',
      featured: true
    },
    {
      id: 'p2',
      title: 'Business Central Extension',
      description: 'Enterprise AL extension for advanced reporting and analytics',
      type: 'project' as const,
      url: '/projects',
      category: 'Enterprise Software',
      tags: ['AL', 'Business Central', 'Power BI'],
      date: '2025-06-15',
      featured: true
    },
    {
      id: 'p3',
      title: 'API Integration Framework',
      description: 'Robust framework for connecting Business Central to external services',
      type: 'project' as const,
      url: '/projects',
      category: 'Integration',
      tags: ['API', 'REST', 'OAuth'],
      date: '2025-05-10',
      featured: false
    },
    // Articles
    {
      id: 'a1',
      title: 'Business Central Performance Bottlenecks: The Complete Developer\'s Guide',
      description: 'Complete guide to identifying and fixing the 7 most critical performance bottlenecks',
      type: 'article' as const,
      url: '/insights/business-central-performance-bottlenecks-guide',
      category: 'Performance',
      tags: ['Business Central', 'Performance', 'AL'],
      date: '2025-07-22',
      featured: true
    },
    {
      id: 'a2',
      title: 'Advanced AL Extension Patterns for Enterprise Business Central Development',
      description: 'Master advanced AL extension patterns for enterprise development',
      type: 'article' as const,
      url: '/insights/business-central-al-extensions-advanced-patterns',
      category: 'Development',
      tags: ['AL', 'Extensions', 'Patterns'],
      date: '2025-07-22',
      featured: true
    },
    {
      id: 'a3',
      title: 'Leveraging AI Resources in Your Business Central Copilot Extensions',
      description: 'Explore Azure AI integration in Business Central 2025',
      type: 'article' as const,
      url: '/insights/leveraging-ai-resources-business-central-copilot',
      category: 'AI/ML',
      tags: ['AI', 'Copilot', 'Azure'],
      date: '2025-07-21',
      featured: true
    },
    // Pages
    {
      id: 'pg1',
      title: 'About Ricardo Carvalho',
      description: 'Senior Dynamics 365 Business Central Developer with 20+ years of experience',
      type: 'page' as const,
      url: '/resume',
      category: 'About',
      tags: ['Resume', 'Experience'],
      date: '2025-07-20',
      featured: false
    },
    {
      id: 'pg2',
      title: 'Projects Portfolio',
      description: 'Explore my portfolio of projects, case studies, and experiments',
      type: 'page' as const,
      url: '/projects',
      category: 'Portfolio',
      tags: ['Projects', 'Portfolio'],
      date: '2025-07-20',
      featured: false
    }
  ], []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Auto focus
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounced search function
  const performSearch = useMemo(() => {
    return (searchQuery: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      
      // Simulate API delay
      setTimeout(() => {
        const filteredResults = searchData
          .filter(item => {
            // Text search
            const searchLower = searchQuery.toLowerCase();
            const matchesText = 
              item.title.toLowerCase().includes(searchLower) ||
              item.description.toLowerCase().includes(searchLower) ||
              item.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
              item.category?.toLowerCase().includes(searchLower);

            if (!matchesText) return false;

            // Type filter
            if (searchFilters.types.length > 0 && !searchFilters.types.includes(item.type)) {
              return false;
            }

            // Category filter
            if (searchFilters.categories.length > 0 && item.category && !searchFilters.categories.includes(item.category)) {
              return false;
            }

            // Featured filter
            if (searchFilters.featured && !item.featured) {
              return false;
            }

            return true;
          })
          .map(item => ({
            ...item,
            score: calculateRelevanceScore(item, searchQuery)
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, maxResults);

        setResults(filteredResults);
        setShowResults(true);
        setIsSearching(false);
        setSelectedIndex(-1);

        // Call callback if provided
        if (onSearchChange) {
          onSearchChange(searchQuery, filteredResults);
        }

        // Track search
        trackUserJourney('global_search_performed', {
          query: searchQuery,
          results_count: filteredResults.length,
          has_filters: searchFilters.types.length > 0 || searchFilters.categories.length > 0 || searchFilters.featured
        });
      }, 200);
    };
  }, [searchData, maxResults, onSearchChange, trackUserJourney]);

  // Calculate relevance score
  const calculateRelevanceScore = (item: any, searchQuery: string): number => {
    const query = searchQuery.toLowerCase();
    let score = 0;

    // Title match (highest weight)
    if (item.title.toLowerCase().includes(query)) {
      score += 100;
      if (item.title.toLowerCase().startsWith(query)) {
        score += 50; // Bonus for prefix match
      }
    }

    // Description match
    if (item.description.toLowerCase().includes(query)) {
      score += 50;
    }

    // Tag matches
    if (item.tags) {
      item.tags.forEach((tag: string) => {
        if (tag.toLowerCase().includes(query)) {
          score += 30;
        }
      });
    }

    // Category match
    if (item.category && item.category.toLowerCase().includes(query)) {
      score += 40;
    }

    // Featured bonus
    if (item.featured) {
      score += 10;
    }

    // Recency bonus (newer items score higher)
    if (item.date) {
      const daysSince = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 20 - daysSince); // Up to 20 points for recent items
    }

    return score;
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    
    // Clear existing timeout
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = window.setTimeout(() => {
      performSearch(value, filters);
    }, 300);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim() && results.length > 0) {
      const selectedResult = selectedIndex >= 0 ? results[selectedIndex] : results[0];
      if (selectedResult) {
        handleResultClick(selectedResult);
      }
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));

    // Track click
    trackUserJourney('search_result_clicked', {
      query,
      result_id: result.id,
      result_type: result.type,
      result_position: results.indexOf(result),
      score: result.score
    });

    // Navigate to result
    navigate(result.url);
    setShowResults(false);
    setQuery('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (query.trim()) {
      performSearch(query, newFilters);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(searchData.map(item => item.type))];
    const categories = [...new Set(searchData.map(item => item.category).filter(Boolean))];
    return { types, categories };
  }, [searchData]);

  return (
    <div className="global-search">
      <div className="search-input-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setShowResults(true)}
              placeholder={placeholder}
              className="search-input"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="search-clear"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {showFilters && (
          <button
            className={`search-filters-toggle ${filters.types.length || filters.categories.length || filters.featured ? 'active' : ''}`}
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            title="Search filters"
          >
            ⚙️
          </button>
        )}
      </div>

      {/* Search Filters Panel */}
      {showFilters && showFiltersPanel && (
        <SearchFiltersPanel
          filters={filters}
          filterOptions={filterOptions}
          onFiltersChange={handleFilterChange}
          onClose={() => setShowFiltersPanel(false)}
        />
      )}

      {/* Search Results */}
      {showResults && (
        <div ref={resultsRef} className="search-results">
          {isSearching && (
            <div className="search-loading">
              <span className="loading-spinner"></span>
              Searching...
            </div>
          )}

          {!isSearching && results.length === 0 && query && (
            <div className="search-no-results">
              <p>No results found for "{query}"</p>
              <div className="search-suggestions">
                <p>Try:</p>
                <ul>
                  <li>Using different keywords</li>
                  <li>Checking for typos</li>
                  <li>Using broader search terms</li>
                  {filters.types.length > 0 || filters.categories.length > 0 && (
                    <li>Removing some filters</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <>
              <div className="search-results-header">
                <span className="results-count">
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </span>
              </div>
              
              <div className="search-results-list">
                {results.map((result, index) => (
                  <SearchResultItem
                    key={result.id}
                    result={result}
                    isSelected={index === selectedIndex}
                    onClick={() => handleResultClick(result)}
                    query={query}
                  />
                ))}
              </div>
            </>
          )}

          {!query && recentSearches.length > 0 && (
            <div className="recent-searches">
              <div className="recent-searches-header">Recent searches</div>
              <div className="recent-searches-list">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="recent-search-item"
                    onClick={() => {
                      setQuery(search);
                      handleSearchChange(search);
                    }}
                  >
                    <span className="recent-search-icon">🕐</span>
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Search Result Item Component
interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  query: string;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  isSelected,
  onClick,
  query
}) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return '🚀';
      case 'article': return '📄';
      case 'page': return '📋';
      default: return '📄';
    }
  };

  return (
    <div
      className={`search-result-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="result-icon">
        {getTypeIcon(result.type)}
      </div>
      
      <div className="result-content">
        <div className="result-header">
          <h4 className="result-title">
            {highlightText(result.title, query)}
          </h4>
          <div className="result-meta">
            <span className="result-type">{result.type}</span>
            {result.category && (
              <>
                <span className="meta-separator">•</span>
                <span className="result-category">{result.category}</span>
              </>
            )}
            {result.featured && (
              <>
                <span className="meta-separator">•</span>
                <span className="result-featured">⭐ Featured</span>
              </>
            )}
          </div>
        </div>
        
        <p className="result-description">
          {highlightText(result.description, query)}
        </p>
        
        {result.tags && result.tags.length > 0 && (
          <div className="result-tags">
            {result.tags.slice(0, 3).map(tag => (
              <span key={tag} className="result-tag">
                {highlightText(tag, query)}
              </span>
            ))}
            {result.tags.length > 3 && (
              <span className="result-tag-more">
                +{result.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="result-score" title={`Relevance: ${result.score}`}>
        {Math.round(result.score)}
      </div>
    </div>
  );
};

// Search Filters Panel Component
interface SearchFiltersPanelProps {
  filters: SearchFilters;
  filterOptions: {
    types: string[];
    categories: string[];
  };
  onFiltersChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

const SearchFiltersPanel: React.FC<SearchFiltersPanelProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClose
}) => {
  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.types, type]
      : filters.types.filter(t => t !== type);
    
    onFiltersChange({
      ...filters,
      types: newTypes
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      types: [],
      categories: [],
      featured: false
    });
  };

  const activeFilterCount = filters.types.length + filters.categories.length + (filters.featured ? 1 : 0);

  return (
    <div className="search-filters-panel">
      <div className="filters-header">
        <h3>Search Filters</h3>
        <div className="filters-actions">
          {activeFilterCount > 0 && (
            <button onClick={clearAllFilters} className="clear-filters">
              Clear All ({activeFilterCount})
            </button>
          )}
          <button onClick={onClose} className="close-filters">
            ✕
          </button>
        </div>
      </div>

      <div className="filters-content">
        {/* Content Types */}
        <div className="filter-group">
          <h4>Content Type</h4>
          <div className="filter-options">
            {filterOptions.types.map(type => (
              <label key={type} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={(e) => handleTypeChange(type, e.target.checked)}
                />
                <span className="filter-label">
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="filter-group">
          <h4>Category</h4>
          <div className="filter-options">
            {filterOptions.categories.map(category => (
              <label key={category} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                />
                <span className="filter-label">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="filter-group">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.featured || false}
              onChange={(e) => onFiltersChange({
                ...filters,
                featured: e.target.checked
              })}
            />
            <span className="filter-label">⭐ Featured content only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
