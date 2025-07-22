import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import './CaseStudyPage.css';

// We need a shared data source. For now, we'll redefine it here.
// In a real large-scale app, this would come from a single file or an API.
type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  // Add new detailed fields for the case study
  problem: string;
  solution: string;
  outcome: string[];
};

const allProjects: Project[] = [
  { 
    slug: "digital-workbench-portfolio", 
    title: "Digital Workbench - Modern Portfolio Platform", 
    description: "A high-performance React portfolio showcasing modern web development practices and interactive user experiences.", 
    tech: ["React 19", "TypeScript", "Vite", "Framer Motion", "CSS3 Animations", "Web Vitals API", "Vitest", "ESLint"],
    problem: "Creating a professional portfolio that demonstrates modern web development skills while showcasing both D365 BC expertise and full-stack capabilities. The challenge was building a platform that performs excellently, follows accessibility standards, and provides an engaging user experience that stands out in a competitive market.",
    solution: "I architected and developed a comprehensive React application using cutting-edge technologies and modern development practices. The solution encompasses multiple technical layers: <strong>Frontend Architecture</strong> - Built with React 19 and TypeScript using Vite for optimal build performance and developer experience. <strong>Interactive Features</strong> - Custom Interactive3D component using CSS3 transforms for hardware-accelerated animations and engaging user interactions. <strong>Performance Optimization</strong> - Implemented code splitting, lazy loading, and real-time Web Vitals monitoring using the PerformanceObserver API. <strong>SEO & Accessibility</strong> - Comprehensive meta tag optimization, structured data (JSON-LD), and ARIA-compliant accessibility features. <strong>Quality Assurance</strong> - Robust testing infrastructure with Vitest covering 12 focused test cases across critical components, plus ESLint configuration with strict TypeScript checking.",
    outcome: [
      "Achieved measurable performance metrics: Lighthouse scores of 86+ performance, 94+ accessibility, 96+ best practices, and 100 SEO.",
      "Implemented comprehensive TypeScript integration with strict compiler settings for enhanced code reliability and maintainability.",
      "Built focused testing suite with 12 test cases covering critical components (SEO, Interactive3D, CustomCursor) and error scenarios.",
      "Created interactive 3D cube component demonstrating advanced CSS animations and responsive user engagement features.",
      "Established modern development workflow with ESLint, environment validation, and automated performance monitoring via Web Vitals API.",
      "Delivered production-ready codebase following React best practices with optimized bundle sizing (~96KB gzipped initial bundle)."
    ]
  },
  // Future personal development projects will be documented here
];

const CaseStudyPage: React.FC = () => {
  // 1. Get the 'slug' from the URL using the useParams hook
  const { slug } = useParams<{ slug: string }>();

  // 2. Find the project data that matches the slug
  const project = allProjects.find(p => p.slug === slug);

  const pageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // 3. Handle the case where the project is not found
  if (!project) {
    return (
      <div className="container case-study-not-found">
        <h1>Project Not Found</h1>
        <p>Sorry, we couldn't find the case study you were looking for.</p>
        <Link to="/projects" className="view-all-link">View All Projects</Link>
      </div>
    );
  }

  // 4. Render the project details if found
  return (
    <motion.div 
      className="container case-study-container"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="case-study-header">
        <h1>{project.title}</h1>
        <div className="project-tech-header">
          {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
        </div>
      </div>

      <div className="case-study-content">
        <div className="case-study-section">
          <h2>The Business Problem</h2>
          <p>{project.problem}</p>
        </div>

        <div className="case-study-section">
          <h2>My Solution</h2>
          <p dangerouslySetInnerHTML={{ __html: project.solution }}></p>
        </div>

        <div className="case-study-section outcome-section">
          <h2>Outcome & Impact</h2>
          <ul>
            {project.outcome.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyPage;