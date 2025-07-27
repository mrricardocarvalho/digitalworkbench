import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InsightsPage from '../pages/InsightsPage';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  useAnalytics: () => ({
    trackUserJourney: vi.fn(),
    trackPageView: vi.fn(),
    trackEvent: vi.fn()
  }),
  trackEvent: vi.fn()
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn()
  }),
  useInView: () => [vi.fn(), true]
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('InsightsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays the page title and description', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/Technical Insights/i)).toBeInTheDocument();
    expect(screen.getByText(/In-depth articles and guides/i)).toBeInTheDocument();
  });

  it('displays featured articles section', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/Featured Articles/i)).toBeInTheDocument();
  });

  it('displays recent insights section', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/Recent Insights/i)).toBeInTheDocument();
  });

  it('shows Business Central articles', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should show Business Central related content
    expect(screen.getByText(/Business Central Performance Bottlenecks/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced AL Extension Patterns/i)).toBeInTheDocument();
  });

  it('includes category filtering', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should have category filters
    expect(screen.getByText(/Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Development/i)).toBeInTheDocument();
    expect(screen.getByText(/AI\/ML/i)).toBeInTheDocument();
  });

  it('has proper article structure', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should have article cards
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThan(0);
  });

  it('displays article metadata', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should show article dates, read times, etc.
    expect(screen.getByText(/min read/i)).toBeInTheDocument();
    expect(screen.getByText(/July 2025/i)).toBeInTheDocument();
  });

  it('includes search functionality', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should have search input
    const searchInput = screen.getByPlaceholderText(/Search articles/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('shows article tags', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should display article tags
    expect(screen.getByText(/Business Central/i)).toBeInTheDocument();
    expect(screen.getByText(/AL/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance/i)).toBeInTheDocument();
  });

  it('handles responsive layout', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Check for main container structure
    const main = screen.getByRole('main');
    expect(main).toHaveClass('container');
  });

  it('includes newsletter signup', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should have newsletter signup section
    expect(screen.getByText(/Stay Updated/i)).toBeInTheDocument();
    expect(screen.getByText(/Subscribe/i)).toBeInTheDocument();
  });

  it('displays reading time estimates', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should show reading time for articles
    const readingTimes = screen.getAllByText(/\d+ min read/i);
    expect(readingTimes.length).toBeGreaterThan(0);
  });

  it('shows article author information', () => {
    render(
      <TestWrapper>
        <InsightsPage />
      </TestWrapper>
    );

    // Should display author info
    expect(screen.getByText(/Ricardo Carvalho/i)).toBeInTheDocument();
  });
});
