// Search utilities for content discovery across the Digital Workbench
import { useState, useEffect, useMemo } from 'react';
import { useAnalytics } from './analytics';

export interface SearchableContent {
  id: string;
  type: 'project' | 'article' | 'case-study';
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  date: string;
  slug: string;
  featured?: boolean;
  technologies?: string[];
  status?: string;
  searchableText?: string; // Added for search indexing
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  tags?: string[];
  technologies?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  featured?: boolean;
}

export interface SearchResult extends SearchableContent {
  score: number;
  highlights: {
    title?: string;
    description?: string;
    content?: string;
  };
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  totalResults: number;
  searchTime: number;
}

class SearchManager {
  private content: SearchableContent[] = [];
  private analytics = useAnalytics();
  private searchCache = new Map<string, SearchResult[]>();

  /**
   * Initialize search with content data
   */
  initialize(content: SearchableContent[]): void {
    this.content = content;
    this.buildSearchIndex();
    console.log(`🔍 Search initialized with ${content.length} items`);
  }

  /**
   * Build search index for better performance
   */
  private buildSearchIndex(): void {
    // Create inverted index for faster text search
    this.content.forEach(item => {
      const searchableText = `${item.title} ${item.description} ${item.content} ${item.tags.join(' ')} ${item.technologies?.join(' ') || ''}`.toLowerCase();
      item.searchableText = searchableText;
    });
  }

  /**
   * Perform search with query and filters
   */
  search(query: string, filters: SearchFilters = {}): SearchResult[] {
    const startTime = performance.now();
    const cacheKey = this.getCacheKey(query, filters);
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      console.log('🚀 Search cache hit');
      return this.searchCache.get(cacheKey)!;
    }

    let results = [...this.content];

    // Apply filters first
    results = this.applyFilters(results, filters);

    // Apply text search
    if (query.trim()) {
      results = this.performTextSearch(results, query.trim().toLowerCase());
    }

    // Sort by relevance score
    results.sort((a, b) => (b as SearchResult).score - (a as SearchResult).score);

    // Cache results
    this.searchCache.set(cacheKey, results as SearchResult[]);

    const searchTime = performance.now() - startTime;

    // Track search analytics
    this.trackSearch(query, filters, results.length, searchTime);

    console.log(`🔍 Search completed: "${query}" → ${results.length} results in ${searchTime.toFixed(2)}ms`);

    return results as SearchResult[];
  }

  /**
   * Apply filters to content
   */
  private applyFilters(content: SearchableContent[], filters: SearchFilters): SearchableContent[] {
    return content.filter(item => {
      // Type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(item.type)) return false;
      }

      // Category filter
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(item.category)) return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => item.tags.includes(tag))) return false;
      }

      // Technologies filter
      if (filters.technologies && filters.technologies.length > 0 && item.technologies) {
        if (!filters.technologies.some(tech => item.technologies!.includes(tech))) return false;
      }

      // Featured filter
      if (filters.featured !== undefined) {
        if (item.featured !== filters.featured) return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        if (itemDate < startDate || itemDate > endDate) return false;
      }

      return true;
    });
  }

  /**
   * Perform text search with scoring
   */
  private performTextSearch(content: SearchableContent[], query: string): SearchResult[] {
    const queryTerms = query.split(/\s+/).filter(term => term.length > 0);
    
    return content.map(item => {
      let score = 0;
      const highlights: SearchResult['highlights'] = {};
      const searchableText = (item as any).searchableText || '';

      queryTerms.forEach(term => {
        // Title matches (highest weight)
        const titleMatches = this.countMatches(item.title.toLowerCase(), term);
        score += titleMatches * 10;
        if (titleMatches > 0) {
          highlights.title = this.highlightText(item.title, term);
        }

        // Description matches (medium weight)
        const descMatches = this.countMatches(item.description.toLowerCase(), term);
        score += descMatches * 5;
        if (descMatches > 0) {
          highlights.description = this.highlightText(item.description, term);
        }

        // Content matches (lower weight)
        const contentMatches = this.countMatches(item.content.toLowerCase(), term);
        score += contentMatches * 2;
        if (contentMatches > 0) {
          highlights.content = this.getContentHighlight(item.content, term);
        }

        // Tag exact matches (high weight)
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(term)) {
            score += 8;
          }
        });

        // Technology matches (medium weight)
        item.technologies?.forEach(tech => {
          if (tech.toLowerCase().includes(term)) {
            score += 6;
          }
        });
      });

      // Boost for featured content
      if (item.featured) {
        score *= 1.2;
      }

      // Boost for exact phrase matches
      if (queryTerms.length > 1 && searchableText.includes(query)) {
        score *= 1.5;
      }

      return {
        ...item,
        score,
        highlights
      } as SearchResult;
    }).filter(item => item.score > 0);
  }

  /**
   * Count term matches in text
   */
  private countMatches(text: string, term: string): number {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return (text.match(regex) || []).length;
  }

  /**
   * Highlight search terms in text
   */
  private highlightText(text: string, term: string): string {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Get content snippet with highlight
   */
  private getContentHighlight(content: string, term: string): string {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const match = content.match(regex);
    
    if (!match) return '';
    
    const index = content.toLowerCase().indexOf(term);
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + term.length + 50);
    
    let snippet = content.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Generate cache key for search query and filters
   */
  private getCacheKey(query: string, filters: SearchFilters): string {
    return `${query}|${JSON.stringify(filters)}`;
  }

  /**
   * Track search analytics
   */
  private trackSearch(query: string, filters: SearchFilters, resultCount: number, searchTime: number): void {
    this.analytics.trackEvent({
      event_name: 'search_performed',
      category: 'search',
      action: 'search',
      label: query,
      value: resultCount,
      custom_parameters: {
        search_query: query,
        search_filters: filters,
        result_count: resultCount,
        search_time_ms: Math.round(searchTime),
        has_filters: Object.keys(filters).length > 0,
        query_length: query.length,
        query_terms: query.split(/\s+/).length
      }
    });
  }

  /**
   * Get search suggestions based on content
   */
  getSuggestions(query: string, limit: number = 5): string[] {
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    this.content.forEach(item => {
      // Add matching titles
      if (item.title.toLowerCase().includes(queryLower)) {
        suggestions.add(item.title);
      }

      // Add matching tags
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });

      // Add matching technologies
      item.technologies?.forEach(tech => {
        if (tech.toLowerCase().includes(queryLower)) {
          suggestions.add(tech);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get all available filter options
   */
  getFilterOptions(): {
    types: string[];
    categories: string[];
    tags: string[];
    technologies: string[];
  } {
    const types = new Set<string>();
    const categories = new Set<string>();
    const tags = new Set<string>();
    const technologies = new Set<string>();

    this.content.forEach(item => {
      types.add(item.type);
      categories.add(item.category);
      item.tags.forEach(tag => tags.add(tag));
      item.technologies?.forEach(tech => technologies.add(tech));
    });

    return {
      types: Array.from(types).sort(),
      categories: Array.from(categories).sort(),
      tags: Array.from(tags).sort(),
      technologies: Array.from(technologies).sort()
    };
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.searchCache.clear();
    console.log('🧹 Search cache cleared');
  }
}

// Create singleton instance
export const searchManager = new SearchManager();

/**
 * React hook for search functionality
 */
export function useSearch(initialContent: SearchableContent[] = []) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {},
    results: [],
    isLoading: false,
    totalResults: 0,
    searchTime: 0
  });

  const { trackUserJourney } = useAnalytics();

  // Initialize search manager with content
  useEffect(() => {
    if (initialContent.length > 0) {
      searchManager.initialize(initialContent);
    }
  }, [initialContent]);

  // Perform search
  const performSearch = useMemo(() => {
    return (query: string, filters: SearchFilters = {}) => {
      setSearchState(prev => ({ ...prev, isLoading: true }));
      
      const startTime = performance.now();
      const results = searchManager.search(query, filters);
      const searchTime = performance.now() - startTime;

      setSearchState({
        query,
        filters,
        results,
        isLoading: false,
        totalResults: results.length,
        searchTime
      });

      // Track search journey
      trackUserJourney('search_performed', {
        query,
        resultCount: results.length,
        hasFilters: Object.keys(filters).length > 0
      });
    };
  }, [trackUserJourney]);

  // Get suggestions
  const getSuggestions = (query: string) => searchManager.getSuggestions(query);

  // Get filter options
  const getFilterOptions = () => searchManager.getFilterOptions();

  // Clear search
  const clearSearch = () => {
    setSearchState({
      query: '',
      filters: {},
      results: [],
      isLoading: false,
      totalResults: 0,
      searchTime: 0
    });
  };

  return {
    searchState,
    performSearch,
    getSuggestions,
    getFilterOptions,
    clearSearch,
    isSearchActive: searchState.query.length > 0 || Object.keys(searchState.filters).length > 0
  };
}
