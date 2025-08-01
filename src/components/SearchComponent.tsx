import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch, type SearchFilters, type SearchableContent } from '../utils/search';
import { useAnalytics } from '../utils/analytics';
import './SearchComponent.css';

interface SearchComponentProps {
  content: SearchableContent[];
  placeholder?: string;
  showFilters?: boolean;
  maxResults?: number;
  compact?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  content,
  placeholder = "Search projects, articles, and case studies...",
  showFilters = true,
  maxResults = 50,
  compact = false
}) => {
  const navigate = useNavigate();
  const { trackUserJourney } = useAnalytics();
  const {
    searchState,
    performSearch,
    getSuggestions,
    getFilterOptions,
    clearSearch,
    isSearchActive
  } = useSearch(content);

  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  // Get filter options
  const filterOptions = getFilterOptions();

  // Handle input change with debounced search
  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Get suggestions immediately
    if (value.length > 0) {
      const newSuggestions = getSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Debounced search
    debounceRef.current = setTimeout(() => {
      if (value.trim().length > 0 || Object.keys(activeFilters).length > 0) {
        performSearch(value.trim(), activeFilters);
      } else {
        clearSearch();
      }
    }, 300);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof SearchFilters, value: string, checked: boolean) => {
    const newFilters = { ...activeFilters };

    // Handle array-based filters only
    if (filterType === 'dateRange' || filterType === 'featured') {
      return; // Skip non-array filters
    }

    if (!newFilters[filterType]) {
      (newFilters as any)[filterType] = [];
    }

    const filterArray = (newFilters as any)[filterType] as string[];
    
    if (checked) {
      if (!filterArray.includes(value)) {
        filterArray.push(value);
      }
    } else {
      const index = filterArray.indexOf(value);
      if (index > -1) {
        filterArray.splice(index, 1);
      }
    }

    // Remove empty filter arrays
    if (filterArray.length === 0) {
      delete newFilters[filterType];
    }

    setActiveFilters(newFilters);
    performSearch(inputValue, newFilters);

    // Track filter usage
    trackUserJourney('search_filter_applied', {
      filterType,
      filterValue: value,
      filterCount: Object.keys(newFilters).length
    });
  };

  // Handle result click
  const handleResultClick = (result: SearchableContent) => {
    trackUserJourney('search_result_clicked', {
      resultType: result.type,
      resultId: result.id,
      resultTitle: result.title,
      searchQuery: searchState.query,
      resultPosition: searchState.results.findIndex(r => r.id === result.id) + 1
    });

    // Navigate to result
    switch (result.type) {
      case 'project':
        navigate(`/projects/${result.slug}`);
        break;
      case 'article':
        navigate(`/insights/${result.slug}`);
        break;
      case 'case-study':
        navigate(`/projects/${result.slug}`);
        break;
    }

    // Clear search if compact mode
    if (compact) {
      setInputValue('');
      clearSearch();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion, activeFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({});
    performSearch(inputValue, {});
  };

  // Get active filter count
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterArray) => {
    return count + (Array.isArray(filterArray) ? filterArray.length : 0);
  }, 0);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format result type for display
  const formatResultType = (type: string) => {
    switch (type) {
      case 'project': return '🚀 Project';
      case 'article': return '📝 Article';
      case 'case-study': return '📊 Case Study';
      default: return type;
    }
  };

  // Render highlight with HTML
  const renderHighlight = (text: string | undefined) => {
    if (!text) return null;
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className={`search-component ${compact ? 'search-component--compact' : ''}`}>
      {/* Search Input */}
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
        />
        
        <div className="search-input-actions">
          {showFilters && (
            <button
              className={`search-filter-toggle ${activeFilterCount > 0 ? 'search-filter-toggle--active' : ''}`}
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              title={`Filters ${activeFilterCount > 0 ? `(${activeFilterCount})` : ''}`}
            >
              🔍 {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
          )}
          
          {(inputValue || isSearchActive) && (
            <button
              className="search-clear"
              onClick={() => {
                setInputValue('');
                clearSearch();
                clearAllFilters();
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="search-suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                🔍 {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="search-filters">
          <div className="search-filters-header">
            <h3>Filters</h3>
            {activeFilterCount > 0 && (
              <button className="search-filters-clear" onClick={clearAllFilters}>
                Clear All ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="search-filters-grid">
            {/* Type Filter */}
            {filterOptions.types.length > 0 && (
              <div className="search-filter-group">
                <h4>Type</h4>
                {filterOptions.types.map(type => (
                  <label key={type} className="search-filter-item">
                    <input
                      type="checkbox"
                      checked={activeFilters.type?.includes(type) || false}
                      onChange={(e) => handleFilterChange('type', type, e.target.checked)}
                    />
                    {formatResultType(type)}
                  </label>
                ))}
              </div>
            )}

            {/* Category Filter */}
            {filterOptions.categories.length > 0 && (
              <div className="search-filter-group">
                <h4>Category</h4>
                {filterOptions.categories.map(category => (
                  <label key={category} className="search-filter-item">
                    <input
                      type="checkbox"
                      checked={activeFilters.category?.includes(category) || false}
                      onChange={(e) => handleFilterChange('category', category, e.target.checked)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}

            {/* Technologies Filter */}
            {filterOptions.technologies.length > 0 && (
              <div className="search-filter-group">
                <h4>Technologies</h4>
                <div className="search-filter-tags">
                  {filterOptions.technologies.slice(0, 10).map(tech => (
                    <label key={tech} className="search-filter-tag">
                      <input
                        type="checkbox"
                        checked={activeFilters.technologies?.includes(tech) || false}
                        onChange={(e) => handleFilterChange('technologies', tech, e.target.checked)}
                      />
                      {tech}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {filterOptions.tags.length > 0 && (
              <div className="search-filter-group">
                <h4>Tags</h4>
                <div className="search-filter-tags">
                  {filterOptions.tags.slice(0, 10).map(tag => (
                    <label key={tag} className="search-filter-tag">
                      <input
                        type="checkbox"
                        checked={activeFilters.tags?.includes(tag) || false}
                        onChange={(e) => handleFilterChange('tags', tag, e.target.checked)}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearchActive && (
        <div className="search-results">
          <div className="search-results-header">
            <h3>
              {searchState.isLoading ? (
                'Searching...'
              ) : (
                `${searchState.totalResults} result${searchState.totalResults !== 1 ? 's' : ''} ${
                  searchState.query ? `for "${searchState.query}"` : ''
                } ${searchState.searchTime > 0 ? `(${searchState.searchTime.toFixed(2)}ms)` : ''}`
              )}
            </h3>
          </div>

          {searchState.isLoading ? (
            <div className="search-loading">
              <div className="search-loading-spinner"></div>
              Searching...
            </div>
          ) : (
            <div className="search-results-list">
              {searchState.results.slice(0, maxResults).map((result) => (
                <div
                  key={result.id}
                  className="search-result"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="search-result-header">
                    <span className="search-result-type">
                      {formatResultType(result.type)}
                    </span>
                    {result.featured && (
                      <span className="search-result-featured">⭐ Featured</span>
                    )}
                  </div>
                  
                  <h4 className="search-result-title">
                    {renderHighlight(result.highlights.title) || result.title}
                  </h4>
                  
                  <p className="search-result-description">
                    {renderHighlight(result.highlights.description) || result.description}
                  </p>
                  
                  {result.highlights.content && (
                    <p className="search-result-content">
                      {renderHighlight(result.highlights.content)}
                    </p>
                  )}
                  
                  <div className="search-result-meta">
                    <span className="search-result-date">
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                    <span className="search-result-category">
                      {result.category}
                    </span>
                    {result.technologies && result.technologies.length > 0 && (
                      <div className="search-result-technologies">
                        {result.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="search-result-tech">
                            {tech}
                          </span>
                        ))}
                        {result.technologies.length > 3 && (
                          <span className="search-result-tech-more">
                            +{result.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {searchState.results.length === 0 && (
                <div className="search-no-results">
                  <h4>No results found</h4>
                  <p>Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
