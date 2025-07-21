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
    solution: "I architected and developed a comprehensive React application using cutting-edge technologies and best practices. Key implementations included: a custom Interactive3D component using CSS3 transforms for hardware-accelerated animations, comprehensive SEO optimization with dynamic meta tags and structured data, real-time Web Vitals monitoring using the PerformanceObserver API, full TypeScript integration for type safety, and a robust testing infrastructure with Vitest and React Testing Library. The application also features responsive design, dark/light theme support, and optimized performance with lazy loading and code splitting.",
    outcome: [
      "Achieved 100% TypeScript coverage with strict type checking for enhanced code reliability.",
      "Implemented comprehensive testing suite with 12+ test cases covering critical components and error scenarios.",
      "Built interactive 3D cube component demonstrating advanced CSS animations and user engagement features.",
      "Established robust development workflow with ESLint, environment validation, and automated performance monitoring.",
      "Created modular, maintainable codebase following React best practices and modern development patterns."
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
          <p>{project.solution}</p>
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