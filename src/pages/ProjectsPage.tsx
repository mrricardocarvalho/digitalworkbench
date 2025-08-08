import React from 'react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { ProjectGallery, type ProjectData } from '../components/ProjectGallery';
import SEO from '../components/SEO';
import './ProjectsPage.css';

// Enhanced project data for the gallery
const projectsData: ProjectData[] = [
  {
    id: "digital-workbench-portfolio",
    title: "Digital Workbench - Modern Portfolio Platform", 
    description: "A high-performance React portfolio showcasing modern web development practices. Built with TypeScript, Vite, and Framer Motion, featuring interactive 3D elements, comprehensive SEO optimization, and real-time performance monitoring. This platform demonstrates cutting-edge web technologies including advanced CSS animations, intersection observers for performance optimization, and comprehensive analytics integration.",
    shortDescription: "A high-performance React portfolio showcasing modern web development practices with interactive 3D elements and comprehensive SEO optimization.",
    image: "/vite.svg",
    gallery: [
      "/vite.svg",
      "/vite.svg",
      "/vite.svg"
    ],
    technologies: ["React 19", "TypeScript", "Vite", "Framer Motion", "CSS3 Animations", "Web Vitals API", "Vitest", "ESLint", "Prettier"],
    category: "Web Development",
    status: "in-progress",
    featured: true,
    date: "2025-01-15",
    githubUrl: "https://github.com/mrricardocarvalho/digitalworkbench",
    liveUrl: "https://ricardocarvalho.dev",
    tags: ["Portfolio", "React", "TypeScript", "Performance", "SEO", "3D Graphics", "Analytics"],
    metrics: {
      stars: 42,
      forks: 8,
      issues: 3,
      contributors: 1
    },
    difficulty: "advanced",
    timeline: "3 months",
    teamSize: 1
  }
];

const ProjectsPage: React.FC = () => {
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <>
      <SEO pageType="projects" />
      <div className="container">
      <motion.div 
        className="projects-page"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="projects-header">
          <h1>Development Projects</h1>
          <p className="projects-subtitle">
            Explore my portfolio of personal development projects, technical experiments, and innovative solutions. 
            Each project showcases different aspects of modern software development, from full-stack web applications 
            to blockchain implementations and AI-powered tools.
          </p>
        </div>

        <ProjectGallery 
          projects={projectsData}
          showControls={true}
          showSearch={true}
          initialViewMode="cards"
          maxResults={50}
          showMetrics={true}
        />
      </motion.div>
    </div>
    </>
  );
};

export default ProjectsPage;