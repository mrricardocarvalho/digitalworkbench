import { useState, useEffect, useMemo } from 'react';
import { SearchManager } from '../utils/searchUtils';
import type { SearchableContent, SearchState, SearchFilters } from '../utils/searchUtils';

export const searchManager = new SearchManager();

export function useSearch(initialContent: SearchableContent[] = []) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {},
    results: [],
    isLoading: false,
    totalResults: 0,
    searchTime: 0
  });

  useEffect(() => {
    if (initialContent.length > 0) {
      searchManager.initialize(initialContent);
    }
  }, [initialContent]);

  const performSearch = useMemo(() => {
    return (query: string, filters: SearchFilters = {}) => {
      setSearchState((prev: SearchState) => ({ ...prev, isLoading: true }));
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
    };
  }, []);

  const getSuggestions = (query: string) => searchManager.getSuggestions(query);
  const getFilterOptions = () => searchManager.getFilterOptions();
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
