import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import InteractiveProjectCard from './InteractiveProjectCard';
import ProjectGalleryControls from './ProjectGalleryControls';
import { useAnalytics } from '../utils/analytics';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  image: string;
  gallery?: string[];
  technologies: string[];
  tags: string[];
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeline?: string;
  date?: string;
  teamSize?: number;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
  category?: string;
  metrics?: {
    stars?: number;
    forks?: number;
    issues?: number;
    contributors?: number;
  };
}

export type ViewMode = 'grid' | 'list' | 'cards';
export type SortOption = 'date' | 'name' | 'category' | 'status' | 'popularity';

export interface ProjectFilters {
  technologies: string[];
  status: string[];
  difficulty: string[];
  featured?: boolean;
}

export interface ProjectGalleryProps {
  projects?: ProjectData[];
  initialViewMode?: ViewMode;
  initialSortBy?: SortOption;
  showFilters?: boolean;
  showControls?: boolean;
  showSearch?: boolean;
  defaultView?: string;
  maxResults?: number;
  showMetrics?: boolean;
  onProjectClick?: (project: ProjectData) => void;
  onTechnologyClick?: (technology: string) => void;
}

// Sample project data
const sampleProjects: ProjectData[] = [
  {
    id: 'digital-workbench',
    title: 'Digital Workbench Portfolio',
    description: 'Modern React portfolio platform with TypeScript, Framer Motion animations, and comprehensive SEO optimization.',
    shortDescription: 'Modern React portfolio platform',
    image: '/projects/digital-workbench.jpg',
    gallery: ['/projects/digital-workbench-1.jpg', '/projects/digital-workbench-2.jpg'],
    technologies: ['React', 'TypeScript', 'Framer Motion', 'Vite'],
    tags: ['Portfolio', 'Web Development', 'Frontend'],
    status: 'completed',
    difficulty: 'advanced',
    timeline: '3 months',
    date: '2025-01-15',
    teamSize: 1,
    githubUrl: 'https://github.com/mrricardocarvalho/digitalworkbench',
    liveUrl: 'https://mrricardocarvalho.github.io/digitalworkbench',
    featured: true,
    category: 'Portfolio',
    metrics: {
      stars: 15,
      forks: 3,
      issues: 2,
      contributors: 1
    }
  },
  {
    id: 'ai-dashboard',
    title: 'AI Analytics Dashboard',
    description: 'Comprehensive analytics dashboard for AI model performance monitoring with real-time metrics and visualizations.',
    shortDescription: 'AI model performance monitoring',
    image: '/projects/ai-dashboard.jpg',
    technologies: ['React', 'D3.js', 'Node.js', 'Python'],
    tags: ['AI', 'Analytics', 'Dashboard'],
    status: 'in-progress',
    difficulty: 'advanced',
    timeline: '6 months',
    date: '2025-03-01',
    teamSize: 1,
    featured: true,
    category: 'AI/ML',
    metrics: {
      stars: 28,
      forks: 7,
      issues: 5,
      contributors: 3
    }
  },
  {
    id: 'data-viz-platform',
    title: 'Data Visualization Platform',
    description: 'Interactive data visualization platform with custom chart components and real-time data streaming.',
    shortDescription: 'Interactive data visualization',
    image: '/projects/data-viz.jpg',
    technologies: ['React', 'D3.js', 'WebSocket', 'Chart.js'],
    tags: ['Data Science', 'Visualization', 'Real-time'],
    status: 'completed',
    difficulty: 'intermediate',
    timeline: '4 months',
    date: '2024-11-20',
    teamSize: 1,
    featured: false,
    category: 'Data Science',
    metrics: {
      stars: 12,
      forks: 2,
      issues: 1,
      contributors: 1
    }
  },
  {
    id: 'task-automation',
    title: 'Task Automation Suite',
    description: 'Comprehensive task automation platform with workflow designer and scheduling capabilities.',
    shortDescription: 'Task automation platform',
    image: '/projects/automation.jpg',
    technologies: ['Node.js', 'Python', 'Docker', 'React'],
    tags: ['Automation', 'Productivity', 'Backend'],
    status: 'planned',
    difficulty: 'advanced',
    timeline: '8 months',
    date: '2025-01-01',
    teamSize: 1,
    featured: false,
    category: 'Productivity',
    metrics: {
      stars: 8,
      forks: 1,
      issues: 0,
      contributors: 1
    }
  }
];

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  projects = sampleProjects,
  initialViewMode = 'grid',
  initialSortBy = 'date',
  showFilters = true,
  showControls = true,
  showSearch = true, // Keep for future use
  onProjectClick,
  onTechnologyClick
}) => {
  const { trackUserJourney } = useAnalytics();
  
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy);
  const [filters, setFilters] = useState<ProjectFilters>({
    technologies: [],
    status: [],
    difficulty: [],
    featured: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Search filter
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Technology filter
      if (filters.technologies.length > 0 && 
          !filters.technologies.some(tech => project.technologies.includes(tech))) {
        return false;
      }
      
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(project.status)) {
        return false;
      }
      
      // Difficulty filter
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(project.difficulty)) {
        return false;
      }
      
      // Featured filter
      if (filters.featured && !project.featured) {
        return false;
      }
      
      return true;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'status':
          return a.status.localeCompare(b.status);
        case 'popularity':
          return (b.metrics?.stars || 0) - (a.metrics?.stars || 0);
        case 'date':
          // Sort by date, most recent first
          const dateA = new Date(a.date || '1970-01-01').getTime();
          const dateB = new Date(b.date || '1970-01-01').getTime();
          return dateB - dateA;
        default:
          return a.featured ? -1 : 1; // Featured first
      }
    });

    return filtered;
  }, [projects, searchQuery, filters, sortBy]);

  // Handle project click
  const handleProjectClick = (project: ProjectData) => {
    trackUserJourney('project_gallery_click', {
      projectId: project.id,
      projectTitle: project.title,
      viewMode,
      fromFilter: Object.keys(filters).some(key => {
        const value = filters[key as keyof ProjectFilters];
        return Array.isArray(value) ? value.length > 0 : value;
      })
    });
    
    onProjectClick?.(project);
  };

  // Handle technology click
  const handleTechnologyClick = (technology: string) => {
    trackUserJourney('technology_filter_click', {
      technology,
      currentFilters: filters.technologies
    });
    
    // Add to filters if not already present
    if (!filters.technologies.includes(technology)) {
      setFilters(prev => ({
        ...prev,
        technologies: [...prev.technologies, technology]
      }));
    }
    
    onTechnologyClick?.(technology);
  };

  // Reset function for future use
  const handleResetFilters = () => {
    if (showFilters) {
      setFilters({
        technologies: [],
        status: [],
        difficulty: [],
        featured: false
      });
      setSearchQuery('');
    }
  };

  // Ensure unused variables are referenced
  void showSearch;
  void handleResetFilters;

  return (
    <motion.div
      className="project-gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Controls */}
      {showControls && (
        <ProjectGalleryControls
          viewMode={viewMode}
          sortBy={sortBy}
          resultsCount={filteredAndSortedProjects.length}
          totalCount={projects.length}
          onViewModeChange={setViewMode}
          onSortChange={setSortBy}
          onToggleFilters={() => setShowFiltersPanel(!showFiltersPanel)}
          showFiltersPanel={showFiltersPanel}
          hasActiveFilters={Object.keys(filters).some(key => {
            const value = filters[key as keyof ProjectFilters];
            return Array.isArray(value) ? value.length > 0 : value;
          })}
        />
      )}

      {/* Project Grid */}
      <motion.div
        className={`project-grid project-grid--${viewMode}`}
        layout
        transition={{ duration: 0.3 }}
      >
        {filteredAndSortedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <InteractiveProjectCard
              project={project}
              index={index}
              viewMode={viewMode}
              onCardClick={() => handleProjectClick(project)}
              onTechnologyClick={handleTechnologyClick}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredAndSortedProjects.length === 0 && (
        <motion.div
          className="project-gallery__empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>No projects found</h3>
          <p>Try adjusting your filters or search query.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectGallery;