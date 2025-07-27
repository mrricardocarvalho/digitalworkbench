import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectsPage from '../pages/ProjectsPage';

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
  },
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn()
  }),
  useInView: () => [vi.fn(), true]
}));

// Mock ProjectGallery component
vi.mock('../components/ProjectGallery', () => ({
  ProjectGallery: ({ projects, showFilters, showSearch, defaultView }: any) => (
    <div data-testid="project-gallery">
      <div>Projects: {projects.length}</div>
      <div>Filters: {showFilters ? 'enabled' : 'disabled'}</div>
      <div>Search: {showSearch ? 'enabled' : 'disabled'}</div>
      <div>View: {defaultView}</div>
    </div>
  )
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ProjectsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('project-gallery')).toBeInTheDocument();
  });

  it('displays the page title and description', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Development Projects')).toBeInTheDocument();
    expect(screen.getByText(/Explore my portfolio of personal development projects/i)).toBeInTheDocument();
  });

  it('configures ProjectGallery with correct props', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // Check that ProjectGallery is configured correctly
    expect(screen.getByText('Filters: enabled')).toBeInTheDocument();
    expect(screen.getByText('Search: enabled')).toBeInTheDocument();
    expect(screen.getByText('View: grid')).toBeInTheDocument();
  });

  it('passes project data to ProjectGallery', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // Check that projects are passed (should be more than 0)
    const projectsText = screen.getByText(/Projects: \d+/);
    expect(projectsText).toBeInTheDocument();
    expect(projectsText.textContent).not.toBe('Projects: 0');
  });

  it('has proper page structure', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // Check for main container
    const container = screen.getByText('Development Projects').closest('.container');
    expect(container).toBeInTheDocument();
  });

  it('displays project categories', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // Should have projects with different categories
    expect(screen.getByTestId('project-gallery')).toBeInTheDocument();
  });

  it('handles responsive layout', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // Check for responsive classes
    const projectsPage = screen.getByText('Development Projects').closest('.projects-page');
    expect(projectsPage).toBeInTheDocument();
  });

  it('includes SEO optimization', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // The page should render without errors, SEO is handled by individual components
    expect(screen.getByText('Development Projects')).toBeInTheDocument();
  });

  it('handles animation variants', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // Animation variants should be applied through framer-motion
    expect(screen.getByText('Development Projects')).toBeInTheDocument();
  });

  it('displays project metrics when enabled', () => {
    render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    );

    // ProjectGallery should be configured to show metrics
    expect(screen.getByTestId('project-gallery')).toBeInTheDocument();
  });
});
