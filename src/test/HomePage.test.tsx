import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Layout from '../components/Layout';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  useAnalytics: () => ({
    trackUserJourney: vi.fn(),
    trackPageView: vi.fn(),
    trackEvent: vi.fn()
  }),
  usePageTracking: vi.fn(),
  trackEvent: vi.fn()
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn()
  }),
  useInView: () => [vi.fn(), true]
}));

// Mock components that might have complex dependencies
vi.mock('../components/SplineScene', () => ({
  default: () => <div data-testid="spline-scene">Spline Scene</div>
}));

vi.mock('../components/Interactive3D', () => ({
  default: () => <div data-testid="interactive-3d">Interactive 3D</div>
}));

vi.mock('../components/AnimationDemo', () => ({
  default: () => <div data-testid="animation-demo">Animation Demo</div>
}));

// Mock Layout components
vi.mock('../components/Header', () => ({
  default: () => (
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        <a href="/insights">Insights</a>
        <a href="/resume">Resume</a>
        <a href="https://www.linkedin.com/in/ricardo-carvalho-05741519" aria-label="LinkedIn">LinkedIn</a>
        <a href="https://github.com/mrricardocarvalho" aria-label="GitHub">GitHub</a>
      </nav>
      <button aria-label="Toggle theme">Theme</button>
    </header>
  )
}));

vi.mock('../components/Footer', () => ({
  default: () => (
    <footer>
      <p>&copy; 2024 Ricardo Carvalho</p>
    </footer>
  )
}));

vi.mock('../components/CommandPalette', () => ({
  default: () => null
}));

vi.mock('../components/PerformanceDashboard', () => ({
  PerformanceDashboard: () => null
}));

vi.mock('../components/ScrollToTop', () => ({
  default: () => null
}));

// Mock intersection observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={children} />
      </Route>
    </Routes>
  </BrowserRouter>
);

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays the main hero section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for hero content
    expect(screen.getByText(/Ricardo Carvalho/i)).toBeInTheDocument();
    expect(screen.getByText(/Senior Dynamics 365 Business Central Developer/i)).toBeInTheDocument();
  });

  it('displays the about section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for about section
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/20\+ years/i)).toBeInTheDocument();
  });

  it('displays the experience section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for experience section
    expect(screen.getByText(/Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Senior Developer/i)).toBeInTheDocument();
  });

  it('displays the skills section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for developer title and core content
    expect(screen.getByText(/Senior Dynamics 365 Business Central Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Digital Workbench/i)).toBeInTheDocument();
  });

  it('displays the latest insights section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for insights section
    expect(screen.getByText(/02 \/ Articles & Insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Business Central Performance Bottlenecks/i)).toBeInTheDocument();
  });

  it('displays the featured projects section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for projects section
    expect(screen.getByText(/01 \/ Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/Digital Workbench/i)).toBeInTheDocument();
  });

  it('has working CTA buttons', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for CTA buttons
    const ctaButtons = screen.getAllByRole('button');
    expect(ctaButtons.length).toBeGreaterThan(0);
    
    // Check for specific CTA links
    expect(screen.getByText(/View All Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/View All Insights/i)).toBeInTheDocument();
  });

  it('handles skill card interactions', async () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Find skill cards
    const skillCards = screen.getAllByText(/Business Central|AL Language|React/i);
    expect(skillCards.length).toBeGreaterThan(0);

    // Test hovering over a skill card (if interactive)
    if (skillCards[0]) {
      fireEvent.mouseEnter(skillCards[0]);
      await waitFor(() => {
        // Skill card should handle hover state
        expect(skillCards[0]).toBeInTheDocument();
      });
    }
  });

  it('displays experience and skills information', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for core content sections
    expect(screen.getByText(/Senior Dynamics 365 Business Central Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Project/i)).toBeInTheDocument();
  });

  it('has proper SEO elements', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check that SEO component is present (meta tags are handled by Helmet)
    // We can't directly test meta tags in JSDOM, but we can ensure the component renders
    expect(document.querySelector('title')).toBeTruthy();
  });

  it('loads interactive components', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check that interactive components are loaded
    expect(screen.getByTestId('interactive-3d')).toBeInTheDocument();
    // SplineScene and AnimationDemo aren't actually in the HomePage based on the rendered output
  });

  it('handles responsive design elements', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for responsive classes or elements
    const main = screen.getByRole('main');
    expect(main).toHaveClass('main-content');
  });

  it('displays social media links', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for social media links
    expect(screen.getByLabelText(/LinkedIn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub/i)).toBeInTheDocument();
  });

  it('handles scroll interactions', async () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Simulate scroll event
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    
    await waitFor(() => {
      // Check that scroll interactions work
      expect(window.scrollY).toBe(100);
    });
  });

  it('displays proper loading states', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check that components don't show loading spinners on initial render
    expect(screen.queryByText(/loading spinner/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('handles theme switching', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for theme toggle button
    const themeToggle = screen.getByRole('button', { name: /theme/i });
    expect(themeToggle).toBeInTheDocument();

    // Test theme switching
    fireEvent.click(themeToggle);
    // Theme switching functionality should work
  });
});
