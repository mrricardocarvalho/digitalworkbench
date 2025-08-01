import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectGalleryControls from '../components/ProjectGalleryControls';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  useAnalytics: () => ({
    trackUserJourney: vi.fn()
  })
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children
}));

describe('ProjectGalleryControls', () => {
  const defaultProps = {
    viewMode: 'grid' as const,
    sortBy: 'date' as const,
    resultsCount: 10,
    totalCount: 25,
    onViewModeChange: vi.fn(),
    onSortChange: vi.fn(),
    onToggleFilters: vi.fn(),
    showFiltersPanel: false,
    hasActiveFilters: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    expect(screen.getByText('10 of 25 projects')).toBeInTheDocument();
  });

  it('displays results summary correctly', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    expect(screen.getByText('10 of 25 projects')).toBeInTheDocument();
  });

  it('shows filter indicator when filters are active', () => {
    const propsWithFilters = {
      ...defaultProps,
      hasActiveFilters: true
    };
    
    render(<ProjectGalleryControls {...propsWithFilters} />);
    
    expect(screen.getByText('• Filtered')).toBeInTheDocument();
  });

  it('displays all view mode buttons', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cards/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument();
  });

  it('highlights the active view mode', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    const gridButton = screen.getByRole('button', { name: /grid/i });
    expect(gridButton).toHaveClass('active');
  });

  it('calls onViewModeChange when view mode button is clicked', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    const cardsButton = screen.getByRole('button', { name: /cards/i });
    fireEvent.click(cardsButton);
    
    expect(defaultProps.onViewModeChange).toHaveBeenCalledWith('cards');
  });

  it('renders sort dropdown with correct value', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    const sortSelect = screen.getByDisplayValue('📅 Date');
    expect(sortSelect).toBeInTheDocument();
  });

  it('calls onSortChange when sort option changes', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    const sortSelect = screen.getByDisplayValue('📅 Date');
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('name');
  });

  it('renders filters toggle button', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
  });

  it('calls onToggleFilters when filters button is clicked', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filtersButton);
    
    expect(defaultProps.onToggleFilters).toHaveBeenCalled();
  });

  it('shows filters button as active when filters panel is open', () => {
    const propsWithFiltersOpen = {
      ...defaultProps,
      showFiltersPanel: true
    };
    
    render(<ProjectGalleryControls {...propsWithFiltersOpen} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    expect(filtersButton).toHaveClass('active');
  });

  it('displays filter indicator when filters are active', () => {
    const propsWithActiveFilters = {
      ...defaultProps,
      hasActiveFilters: true
    };
    
    render(<ProjectGalleryControls {...propsWithActiveFilters} />);
    
    expect(screen.getByText('• Filtered')).toBeInTheDocument();
  });

  it('handles responsive behavior', () => {
    render(<ProjectGalleryControls {...defaultProps} />);
    
    // Check that the component renders without layout issues
    const controls = screen.getByText('10 of 25 projects').closest('.project-gallery-controls');
    expect(controls).toBeInTheDocument();
  });

  it('maintains view mode state correctly', () => {
    const { rerender } = render(<ProjectGalleryControls {...defaultProps} />);
    
    // Initial state
    const gridButton = screen.getByRole('button', { name: /grid/i });
    expect(gridButton).toHaveClass('active');
    
    // Update view mode
    const updatedProps = { ...defaultProps, viewMode: 'list' as const };
    rerender(<ProjectGalleryControls {...updatedProps} />);
    
    const listButton = screen.getByRole('button', { name: /list/i });
    expect(listButton).toHaveClass('active');
  });
});
