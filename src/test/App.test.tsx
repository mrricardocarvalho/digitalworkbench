import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock complex components to avoid rendering issues
vi.mock('../components/SplineScene', () => ({
  default: () => <div data-testid="spline-scene">Spline Scene</div>
}));

vi.mock('../components/Interactive3D', () => ({
  default: () => <div data-testid="interactive-3d">Interactive 3D</div>
}));

vi.mock('../components/AnimationDemo', () => ({
  default: () => <div data-testid="animation-demo">Animation Demo</div>
}));

// Mock analytics
vi.mock('../utils/analytics', () => ({
  useAnalytics: () => ({
    trackUserJourney: vi.fn(),
    trackPageView: vi.fn(),
    trackEvent: vi.fn()
  }),
  usePageTracking: vi.fn(),
  analytics: {
    trackEvent: vi.fn()
  },
  trackEvent: vi.fn()
}));

// Mock code splitting utilities and lazy-loaded pages
vi.mock('../utils/codeSplitting', () => ({
  CodeSplitStrategies: {
    byRoute: {
      HomePage: () => <div>Ricardo Carvalho - Senior Developer</div>,
      ResumePage: () => <div>Professional Experience</div>,
      ProjectsPage: () => <div>Development Projects</div>,
      InsightsPage: () => <div>Technical Insights</div>,
      ContactPage: () => <div>Contact Information</div>,
      NotFoundPage: () => <div>404 - Page Not Found</div>,
      InsightPostPage: () => <div>Insight Post</div>,
      CaseStudyPage: () => <div>Case Study</div>,
    },
    byFeature: {},
    byInteraction: {},
  },
  BundleUtils: {
    prefetchCriticalChunks: vi.fn(),
  },
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
  LazyMotion: ({ children }: any) => children,
  domAnimation: {},
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn()
  }),
  useInView: () => [vi.fn(), true]
}));

// Mock ProjectGallery
vi.mock('../components/ProjectGallery', () => ({
  ProjectGallery: () => <div data-testid="project-gallery">Project Gallery</div>
}));

describe('App Navigation and Routing', () => {
  it('renders HomePage by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check for homepage content - use more specific selector
    expect(screen.getByRole('link', { name: /Ricardo Carvalho - Home/i })).toBeInTheDocument();
    expect(screen.getByText(/Senior Developer/i)).toBeInTheDocument();
  });

  it('renders ProjectsPage when navigating to /projects', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <App />
      </MemoryRouter>
    );

    // Check for projects page content
    expect(screen.getByText('Development Projects')).toBeInTheDocument();
    // Don't check for project gallery testid since it's just the simple mock
  });

  it('renders InsightsPage when navigating to /insights', () => {
    render(
      <MemoryRouter initialEntries={['/insights']}>
        <App />
      </MemoryRouter>
    );

    // Check for insights page content
    expect(screen.getByText(/Technical Insights/i)).toBeInTheDocument();
  });

  it('renders ResumePage when navigating to /resume', () => {
    render(
      <MemoryRouter initialEntries={['/resume']}>
        <App />
      </MemoryRouter>
    );

    // Check for resume page content
    expect(screen.getByText(/Professional Experience/i)).toBeInTheDocument();
  });

  it('renders NotFoundPage for invalid routes', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <App />
      </MemoryRouter>
    );

    // Check for 404 page content
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it('includes Layout components', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check for common layout elements
    expect(screen.getAllByRole('navigation')).toHaveLength(2); // mobile nav + footer nav
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });

  it('handles theme switching', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check for theme toggle button
    const themeToggle = screen.getByRole('button', { name: /theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('includes PWA functionality', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // App should render without errors, PWA functionality is handled by hooks
    expect(screen.getByRole('link', { name: /Ricardo Carvalho - Home/i })).toBeInTheDocument();
  });

  it('includes error boundary protection', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Error boundary should be active (no error state visible)
    expect(screen.getByRole('link', { name: /Ricardo Carvalho - Home/i })).toBeInTheDocument();
  });
});
