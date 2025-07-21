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

// Create a more comprehensive list of projects for this page
const allProjects: Project[] = [
  { 
    slug: "digital-workbench-portfolio", 
    title: "Digital Workbench - Modern Portfolio Platform", 
    description: "A high-performance React portfolio showcasing modern web development practices. Built with TypeScript, Vite, and Framer Motion, featuring interactive 3D elements, comprehensive SEO optimization, and real-time performance monitoring.", 
    tech: ["React 19", "TypeScript", "Vite", "Framer Motion", "CSS3 Animations", "Web Vitals API", "Vitest"] 
  },
  {
    slug: "enterprise-bc-migration",
    title: "Enterprise Business Central Migration Platform",
    description: "Led the migration of a Fortune 500 manufacturing company from Dynamics NAV to Business Central, including custom AL extensions, data transformation pipelines, and automated testing frameworks. Reduced operational costs by 40% and improved system performance by 300%.",
    tech: ["AL Language", "Business Central", "Azure DevOps", "SQL Server", "Power BI", "C# Integration", "Azure Functions"]
  },
  {
    slug: "multi-tenant-integration-hub",
    title: "Multi-Tenant API Integration Hub",
    description: "Architected a scalable integration platform connecting Business Central with 15+ external systems, processing 100K+ transactions daily with 99.9% uptime and comprehensive error handling. Features real-time data synchronization and automated conflict resolution.",
    tech: ["AL Extensions", "REST APIs", "OAuth 2.0", "Redis Cache", "Docker", "Kubernetes", "Application Insights"]
  },
  {
    slug: "real-time-inventory-optimization",
    title: "Real-Time Inventory Optimization System",
    description: "Developed an AI-powered inventory optimization system for a retail chain with 200+ locations. Reduced inventory costs by 25% while maintaining 99.5% stock availability through predictive analytics and automated reordering algorithms.",
    tech: ["Business Central", "Machine Learning", "Azure ML", "Power Platform", "Custom AL Extensions", "SQL Analytics"]
  }
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
        <h1>All Projects</h1>
        <p className="projects-subtitle">A collection of my professional work and case studies.</p>
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