import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, type Variants } from 'framer-motion';
import { useAnalytics } from '../utils/analytics';
import type { ProjectData } from './ProjectGallery';
import './InteractiveProjectCard.css';

interface InteractiveProjectCardProps {
  project: ProjectData;
  index: number;
  viewMode: 'grid' | 'list' | 'cards';
  onCardClick?: (project: ProjectData) => void;
  onTechnologyClick?: (technology: string) => void;
  showMetrics?: boolean;
}

export const InteractiveProjectCard: React.FC<InteractiveProjectCardProps> = ({
  project,
  index,
  viewMode,
  onCardClick,
  onTechnologyClick,
  showMetrics = true
}) => {
  const { trackUserJourney } = useAnalytics();
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  
  // State for interactive features
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Animation variants
  const cardVariants: Variants = {
    hidden: viewMode === 'cards' ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  };

  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.3 }
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  // Mouse tracking for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    // Calculate tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    if (viewMode === 'cards' && isHovered) {
      controls.start({
        rotateX: rotateX,
        rotateY: rotateY,
        transition: { duration: 0.1 }
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (viewMode === 'cards') {
      controls.start({
        rotateX: 0,
        rotateY: 0,
        transition: { duration: 0.3 }
      });
    }
  };

  // Image cycling on hover
  useEffect(() => {
    if (!isHovered || !project.gallery || project.gallery.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => 
        (prev + 1) % (project.gallery?.length || 1)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, project.gallery]);

  // Track interactions
  const handleCardClick = () => {
    trackUserJourney('project_card_clicked', {
      project_id: project.id,
      project_title: project.title,
      view_mode: viewMode,
      position: index
    });
    
    if (onCardClick) {
      onCardClick(project);
    }
  };

  const handleTechnologyClick = (tech: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    trackUserJourney('project_technology_clicked', {
      technology: tech,
      project_id: project.id,
      view_mode: viewMode
    });
    
    if (onTechnologyClick) {
      onTechnologyClick(tech);
    }
  };

  const handleQuickAction = (action: string, url?: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    trackUserJourney('project_quick_action', {
      action,
      project_id: project.id,
      project_title: project.title
    });
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--success-color)';
      case 'in-progress': return 'var(--warning-color)';
      case 'planned': return 'var(--info-color)';
      case 'archived': return 'var(--muted-color)';
      default: return 'var(--text-color)';
    }
  };

  // Difficulty styling
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`interactive-project-card ${viewMode} ${project.featured ? 'featured' : ''}`}
      variants={cardVariants}
      initial={viewMode === 'cards' ? false : 'hidden'}
      animate={isInView ? controls : 'hidden'}
      {...(viewMode === 'cards' ? { whileHover: 'hover' } : {})}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      role="article"
      tabIndex={0}
      aria-label={`${project.title} project`}
      data-testid={`project-card-${project.id}`}
    >
      {/* Status Badge */}
      <div className="project-status-badge">
        <span 
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(project.status) }}
        />
        <span className="status-text">{project.status}</span>
        {project.featured && <span className="featured-badge">⭐</span>}
      </div>

      {/* Project Image with Gallery */}
      <div className="project-image-container">
        <motion.div 
          className="project-image"
          style={{
            backgroundImage: `url(${project.gallery?.[currentImageIndex] || project.image})`
          }}
          variants={imageVariants}
          animate="center"
        />
        
        {/* Image Indicators */}
        {project.gallery && project.gallery.length > 1 && (
          <div className="image-indicators">
            {project.gallery.map((_: string, idx: number) => (
              <button
                key={idx}
                className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick Actions Overlay */}
        <motion.div 
          className="quick-actions-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {project.githubUrl && (
            <button
              className="quick-action-btn"
              onClick={(e) => handleQuickAction('github', project.githubUrl, e)}
              title="View on GitHub"
            >
              <span className="icon">⚡</span>
              <span className="text">Code</span>
            </button>
          )}
          
          {project.liveUrl && (
            <button
              className="quick-action-btn"
              onClick={(e) => handleQuickAction('live', project.liveUrl, e)}
              title="View Live Demo"
            >
              <span className="icon">🚀</span>
              <span className="text">Demo</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Project Content */}
      <div className="project-content">
        <div className="project-header">
          <h3 className="project-title">{project.title}</h3>
          
          <div className="project-meta">
            <span className="difficulty">
              {getDifficultyIcon(project.difficulty)} {project.difficulty}
            </span>
            {project.timeline && (
              <span className="timeline">⏱️ {project.timeline}</span>
            )}
          </div>
        </div>

        <p className="project-description">
          {showDetails ? project.description : project.shortDescription || project.description}
        </p>

        {/* Technology Stack */}
        <div className="technology-stack">
          <span className="tech-label">Tech:</span>
          <div className="tech-tags">
            {project.technologies.slice(0, showDetails ? project.technologies.length : 4).map((tech: string, idx: number) => (
              <button
                key={idx}
                className="tech-tag"
                onClick={(e) => handleTechnologyClick(tech, e)}
                title={`Filter by ${tech}`}
              >
                {tech}
              </button>
            ))}
            {!showDetails && project.technologies.length > 4 && (
              <button
                className="tech-tag more"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                +{project.technologies.length - 4}
              </button>
            )}
          </div>
        </div>

        {/* Project Metrics */}
        {showMetrics && project.metrics && (
          <motion.div 
            className="project-metrics"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {project.metrics.stars !== undefined && (
              <div className="metric">
                <span className="metric-icon">⭐</span>
                <span className="metric-value">{project.metrics.stars}</span>
              </div>
            )}
            {project.metrics.forks !== undefined && (
              <div className="metric">
                <span className="metric-icon">🔀</span>
                <span className="metric-value">{project.metrics.forks}</span>
              </div>
            )}
            {project.metrics.issues !== undefined && (
              <div className="metric">
                <span className="metric-icon">🐛</span>
                <span className="metric-value">{project.metrics.issues}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Interactive Tags */}
        <div className="project-tags">
          {project.tags?.slice(0, 3).map((tag: string, idx: number) => (
            <span key={idx} className="project-tag">
              {tag}
            </span>
          ))}
          {project.tags && project.tags.length > 3 && (
            <span className="project-tag more">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="hover-glow"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1 : 0.5
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* 3D Transform Container for Cards View */}
      {viewMode === 'cards' && (
        <div 
          className="card-3d-effect"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}
        />
      )}
    </motion.div>
  );
};

export default InteractiveProjectCard;
