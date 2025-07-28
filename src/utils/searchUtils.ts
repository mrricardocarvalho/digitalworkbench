// Search types and SearchManager class extracted for Fast Refresh compliance

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  totalResults: number;
  searchTime: number;
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
  searchableText?: string;
}

export interface SearchResult extends SearchableContent {
  score: number;
  highlights: {
    title?: string;
    description?: string;
    content?: string;
  };
}

export class SearchManager {
  private content: SearchableContent[] = [];
  private searchCache = new Map<string, SearchResult[]>();
  private analytics: any = null;

  constructor(analytics?: any) {
    if (analytics) {
      this.analytics = analytics;
    }
  }

  initialize(content: SearchableContent[]): void {
    this.content = content;
    this.buildSearchIndex();
    console.log(`🔍 Search initialized with ${content.length} items`);
  }

  private buildSearchIndex(): void {
    this.content.forEach(item => {
      const searchableText = `${item.title} ${item.description} ${item.content} ${item.tags.join(' ')} ${item.technologies?.join(' ') || ''}`.toLowerCase();
      (item as any).searchableText = searchableText;
    });
  }

  search(query: string, filters: SearchFilters = {}): SearchResult[] {
    const startTime = performance.now();
    const cacheKey = this.getCacheKey(query, filters);
    if (this.searchCache.has(cacheKey)) {
      console.log('🚀 Search cache hit');
      return this.searchCache.get(cacheKey)!;
    }
    let results = [...this.content];
    results = this.applyFilters(results, filters);
    if (query.trim()) {
      results = this.performTextSearch(results, query.trim().toLowerCase());
    }
    results.sort((a, b) => (b as SearchResult).score - (a as SearchResult).score);
    this.searchCache.set(cacheKey, results as SearchResult[]);
    const searchTime = performance.now() - startTime;
    this.trackSearch(query, filters, results.length, searchTime);
    console.log(`🔍 Search completed: "${query}" → ${results.length} results in ${searchTime.toFixed(2)}ms`);
    return results as SearchResult[];
  }

  private applyFilters(content: SearchableContent[], filters: SearchFilters): SearchableContent[] {
    return content.filter(item => {
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(item.type)) return false;
      }
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(item.category)) return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => item.tags.includes(tag))) return false;
      }
      if (filters.technologies && filters.technologies.length > 0 && item.technologies) {
        if (!filters.technologies.some(tech => item.technologies!.includes(tech))) return false;
      }
      if (filters.featured !== undefined) {
        if (item.featured !== filters.featured) return false;
      }
      if (filters.dateRange) {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (itemDate < startDate || itemDate > endDate) return false;
      }
      return true;
    });
  }

  private performTextSearch(content: SearchableContent[], query: string): SearchResult[] {
    const queryTerms = query.split(/\s+/).filter(term => term.length > 0);
    return content.map(item => {
      let score = 0;
      const highlights: SearchResult['highlights'] = {};
      const searchableText = (item as any).searchableText || '';
      queryTerms.forEach(term => {
        const titleMatches = this.countMatches(item.title.toLowerCase(), term);
        score += titleMatches * 10;
        if (titleMatches > 0) {
          highlights.title = this.highlightText(item.title, term);
        }
        const descMatches = this.countMatches(item.description.toLowerCase(), term);
        score += descMatches * 5;
        if (descMatches > 0) {
          highlights.description = this.highlightText(item.description, term);
        }
        const contentMatches = this.countMatches(item.content.toLowerCase(), term);
        score += contentMatches * 2;
        if (contentMatches > 0) {
          highlights.content = this.getContentHighlight(item.content, term);
        }
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(term)) {
            score += 8;
          }
        });
        item.technologies?.forEach(tech => {
          if (tech.toLowerCase().includes(term)) {
            score += 6;
          }
        });
      });
      if (item.featured) {
        score *= 1.2;
      }
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

  private countMatches(text: string, term: string): number {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return (text.match(regex) || []).length;
  }

  private highlightText(text: string, term: string): string {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

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

  private getCacheKey(query: string, filters: SearchFilters): string {
    return `${query}|${JSON.stringify(filters)}`;
  }

  private trackSearch(query: string, filters: SearchFilters, resultCount: number, searchTime: number): void {
    if (this.analytics) {
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
  }

  getSuggestions(query: string, limit: number = 5): string[] {
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();
    this.content.forEach(item => {
      if (item.title.toLowerCase().includes(queryLower)) {
        suggestions.add(item.title);
      }
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
      item.technologies?.forEach(tech => {
        if (tech.toLowerCase().includes(queryLower)) {
          suggestions.add(tech);
        }
      });
    });
    return Array.from(suggestions).slice(0, limit);
  }

  getFilterOptions(): { types: string[]; categories: string[]; tags: string[]; technologies: string[] } {
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

  clearCache(): void {
    this.searchCache.clear();
    console.log('🧹 Search cache cleared');
  }
}

