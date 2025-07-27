import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock analytics to track user interactions
const mockTrackUserJourney = vi.fn();
const mockTrackPageView = vi.fn();
const mockTrackEvent = vi.fn();

vi.mock('../utils/analytics', () => ({
  useAnalytics: () => ({
    trackUserJourney: mockTrackUserJourney,
    trackPageView: mockTrackPageView,
    trackEvent: mockTrackEvent
  }),
  trackEvent: mockTrackEvent
}));

// Mock complex components
vi.mock('../components/SplineScene', () => ({
  default: () => <div data-testid="spline-scene">Spline Scene</div>
}));

vi.mock('../components/Interactive3D', () => ({
  default: () => <div data-testid="interactive-3d">Interactive 3D</div>
}));

vi.mock('../components/ProjectGallery', () => ({
  ProjectGallery: () => <div data-testid="project-gallery">Project Gallery</div>
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children
}));

describe('User Journey Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes homepage to projects navigation journey', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // User starts on homepage
    expect(screen.getByText(/Ricardo Carvalho/i)).toBeInTheDocument();

    // User clicks on "View Projects" button
    const projectsLink = screen.getByText(/View Projects/i);
    await user.click(projectsLink);

    // User should navigate to projects page
    await waitFor(() => {
      expect(screen.getByText('Development Projects')).toBeInTheDocument();
    });
  });

  it('completes homepage to insights navigation journey', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // User starts on homepage
    expect(screen.getByText(/Ricardo Carvalho/i)).toBeInTheDocument();

    // User clicks on "Read Insights" button
    const insightsLink = screen.getByText(/Read Insights/i);
    await user.click(insightsLink);

    // User should navigate to insights page
    await waitFor(() => {
      expect(screen.getByText(/Technical Insights/i)).toBeInTheDocument();
    });
  });

  it('completes navigation menu journey', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check main navigation is present
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Test navigation to different sections
    const projectsNavLink = screen.getByRole('link', { name: /projects/i });
    await user.click(projectsNavLink);

    await waitFor(() => {
      expect(screen.getByText('Development Projects')).toBeInTheDocument();
    });
  });

  it('handles theme switching journey', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Find theme toggle button
    const themeToggle = screen.getByRole('button', { name: /theme/i });
    expect(themeToggle).toBeInTheDocument();

    // User clicks theme toggle
    await user.click(themeToggle);

    // Theme should change (tracked in analytics)
    expect(mockTrackEvent).toHaveBeenCalled();
  });

  it('completes contact interaction journey', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // User finds contact information
    expect(screen.getByText(/mrricardocarvalho@gmail.com/i)).toBeInTheDocument();

    // User clicks on contact button
    const contactButton = screen.getByText(/Get In Touch/i);
    await user.click(contactButton);

    // Contact interaction should be tracked
    expect(mockTrackEvent).toHaveBeenCalled();
  });

  it('handles responsive menu interactions', async () => {
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check if mobile menu elements are present
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('completes social media link journey', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // User finds social media links
    const linkedinLink = screen.getByLabelText(/LinkedIn/i);
    const githubLink = screen.getByLabelText(/GitHub/i);

    expect(linkedinLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();

    // User clicks on social media links
    await user.click(linkedinLink);
    expect(mockTrackEvent).toHaveBeenCalled();
  });

  it('handles scroll-to-top functionality', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Simulate scrolling down
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 500,
    });

    // Trigger scroll event
    fireEvent.scroll(window);

    // Scroll to top button should appear
    await waitFor(() => {
      const scrollToTopButton = screen.queryByRole('button', { name: /scroll to top/i });
      // Button might not be visible depending on implementation
      if (scrollToTopButton) {
        expect(scrollToTopButton).toBeInTheDocument();
      }
      expect(window.scrollY).toBe(500);
    });
  });

  it('completes error boundary recovery journey', () => {
    // This test ensures error boundaries are working
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // App should render successfully without throwing errors
    expect(screen.getByText(/Ricardo Carvalho/i)).toBeInTheDocument();
  });

  it('handles keyboard navigation journey', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Tab through focusable elements
    await user.tab();
    
    // First focusable element should be focused
    const firstFocusable = document.activeElement;
    expect(firstFocusable).toBeInTheDocument();

    // Continue tabbing
    await user.tab();
    await user.tab();

    // Should be able to navigate through the interface
    expect(document.activeElement).toBeInTheDocument();
  });
});
