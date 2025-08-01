import React from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../utils/analytics';
import type { ViewMode, SortOption } from './ProjectGallery';
import './ProjectGalleryControls.css';

interface ProjectGalleryControlsProps {
  viewMode: ViewMode;
  sortBy: SortOption;
  resultsCount: number;
  totalCount: number;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (sort: SortOption) => void;
  onToggleFilters: () => void;
  showFiltersPanel: boolean;
  hasActiveFilters: boolean;
}

const ProjectGalleryControls: React.FC<ProjectGalleryControlsProps> = ({
  viewMode,
  sortBy,
  resultsCount,
  totalCount,
  onViewModeChange,
  onSortChange,
  onToggleFilters,
  showFiltersPanel,
  hasActiveFilters
}) => {
  const { trackUserJourney } = useAnalytics();

  // View mode options
  const viewModes: { mode: ViewMode; icon: string; label: string; description: string }[] = [
    { mode: 'grid', icon: '⚏', label: 'Grid', description: 'Classic grid layout' },
    { mode: 'cards', icon: '🎴', label: 'Cards', description: 'Interactive 3D cards' },
    { mode: 'list', icon: '☰', label: 'List', description: 'Detailed list view' }
  ];

  // Sort options
  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'name', label: 'Name', icon: '🔤' },
    { value: 'category', label: 'Category', icon: '📁' },
    { value: 'status', label: 'Status', icon: '🎯' },
    { value: 'popularity', label: 'Popularity', icon: '⭐' }
  ];

  const handleViewModeChange = (mode: ViewMode) => {
    trackUserJourney('project_gallery_view_changed', {
      old_view: viewMode,
      new_view: mode
    });
    onViewModeChange(mode);
  };

  const handleSortChange = (sort: SortOption) => {
    trackUserJourney('project_gallery_sort_changed', {
      old_sort: sortBy,
      new_sort: sort
    });
    onSortChange(sort);
  };

  const handleToggleFilters = () => {
    trackUserJourney('project_gallery_filters_toggled', {
      filters_visible: !showFiltersPanel,
      has_active_filters: hasActiveFilters
    });
    onToggleFilters();
  };

  return (
    <div className="project-gallery-controls" data-testid="project-gallery-controls">
      {/* Results Summary */}
      <div className="results-summary">
        <span className="results-count">
          {resultsCount === totalCount 
            ? `${totalCount} project${totalCount !== 1 ? 's' : ''}` 
            : `${resultsCount} of ${totalCount} projects`
          }
        </span>
        {hasActiveFilters && (
          <span className="filters-indicator">
            • Filtered
          </span>
        )}
      </div>

      {/* Controls Container */}
      <div className="controls-container">
        {/* View Mode Switcher */}
        <div className="view-mode-switcher">
          <span className="control-label">View:</span>
          <div className="view-mode-buttons">
            {viewModes.map(({ mode, icon, label, description }) => (
              <motion.button
                key={mode}
                className={`view-mode-btn ${viewMode === mode ? 'active' : ''}`}
                onClick={() => handleViewModeChange(mode)}
                title={description}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid={`view-mode-btn-${mode}`}
              >
                <span className="view-icon">{icon}</span>
                <span className="view-label">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sort Selector */}
        <div className="sort-selector">
          <span className="control-label">Sort:</span>
          <div className="sort-dropdown">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="sort-select"
            >
              {sortOptions.map(({ value, label, icon }) => (
                <option key={value} value={value}>
                  {icon} {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Toggle */}
        <motion.button
          className={`filters-toggle ${showFiltersPanel ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
          onClick={handleToggleFilters}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={showFiltersPanel ? 'Hide filters' : 'Show filters'}
          data-testid="filters-toggle-btn"
        >
          <span className="filters-icon">
            {hasActiveFilters ? '🎯' : '⚙️'}
          </span>
          <span className="filters-label">
            {hasActiveFilters ? 'Filters Active' : 'Filters'}
          </span>
          {hasActiveFilters && (
            <span className="active-indicator" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ProjectGalleryControls;
