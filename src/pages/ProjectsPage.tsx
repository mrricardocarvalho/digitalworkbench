import React from 'react';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import './ProjectsPage.css';

// We can reuse the Project type definition
type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
};

// Create a focused list of personal development projects
const allProjects: Project[] = [
  { 
    slug: "digital-workbench-portfolio", 
    title: "Digital Workbench - Modern Portfolio Platform", 
    description: "A high-performance React portfolio showcasing modern web development practices. Built with TypeScript, Vite, and Framer Motion, featuring interactive 3D elements, comprehensive SEO optimization, and real-time performance monitoring.", 
    tech: ["React 19", "TypeScript", "Vite", "Framer Motion", "CSS3 Animations", "Web Vitals API", "Vitest"] 
  },
  // Future personal development projects will be added here
];

const ProjectsPage: React.FC = () => {
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container">
      <div className="projects-header">
        <h1>Development Projects</h1>
        <p className="projects-subtitle">Personal development projects and technical experiments.</p>
      </div>

      <motion.div 
        className="projects-grid"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {allProjects.map((project) => (
          <motion.div key={project.slug} className="project-card" variants={itemVariants}>
            <div className="project-tech">
              {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <Link to={`/projects/${project.slug}`}>View Case Study →</Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectsPage;