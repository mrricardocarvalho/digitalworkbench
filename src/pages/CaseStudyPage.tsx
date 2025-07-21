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
  {
    slug: "enterprise-bc-migration",
    title: "Enterprise Business Central Migration Platform",
    description: "Complex enterprise migration from legacy Dynamics NAV to modern Business Central cloud infrastructure.",
    tech: ["AL Language", "Business Central", "Azure DevOps", "SQL Server", "Power BI", "C# Integration", "Azure Functions"],
    problem: "A Fortune 500 manufacturing company with 15 years of heavily customized Dynamics NAV 2018 needed to migrate to Business Central cloud. The system contained 500+ custom objects, complex integrations with manufacturing equipment, and critical business processes that couldn't afford downtime. Previous migration attempts by other consultants had failed due to data corruption and performance issues.",
    solution: "I designed and executed a comprehensive migration strategy involving: custom data transformation pipelines using Azure Functions to ensure data integrity, complete AL rewrite of 200+ custom NAV objects following modern BC patterns, parallel environment setup allowing side-by-side testing, automated regression testing framework covering 95% of business processes, and a phased rollout plan minimizing business disruption. The solution included custom AL extensions for manufacturing integration, optimized performance patterns, and comprehensive error handling.",
    outcome: [
      "Successfully migrated 2TB+ of historical data with zero data loss and 99.9% accuracy validation.",
      "Reduced system response times by 300% through optimized AL code and improved database indexing.",
      "Decreased operational costs by 40% by eliminating on-premises infrastructure and maintenance overhead.",
      "Implemented automated CI/CD pipeline reducing deployment time from days to hours.",
      "Delivered comprehensive training program enabling internal team to maintain and extend the solution.",
      "Achieved 100% business process continuity with zero unplanned downtime during migration."
    ]
  },
  {
    slug: "multi-tenant-integration-hub",
    title: "Multi-Tenant API Integration Hub",
    description: "Scalable integration platform connecting Business Central with multiple external systems in real-time.",
    tech: ["AL Extensions", "REST APIs", "OAuth 2.0", "Redis Cache", "Docker", "Kubernetes", "Application Insights"],
    problem: "A growing SaaS company needed to integrate their Business Central instance with 15+ external systems including e-commerce platforms, shipping providers, payment gateways, and CRM systems. The existing point-to-point integrations were fragile, difficult to maintain, and couldn't handle the growing transaction volume of 100K+ daily transactions. Data inconsistencies and failed synchronizations were causing customer service issues and revenue loss.",
    solution: "I architected a robust integration hub using modern cloud-native patterns: microservices architecture deployed on Kubernetes for scalability, centralized authentication using OAuth 2.0 with token caching, event-driven architecture with reliable message queuing, comprehensive error handling with automatic retry mechanisms, and real-time monitoring with Application Insights. The solution featured custom AL extensions for BC integration, Redis caching for performance, and Docker containers for consistent deployment across environments.",
    outcome: [
      "Achieved 99.9% uptime processing 100K+ daily transactions with sub-second response times.",
      "Reduced integration maintenance overhead by 80% through standardized patterns and monitoring.",
      "Eliminated data inconsistencies with ACID-compliant transaction management and conflict resolution.",
      "Enabled rapid onboarding of new integrations, reducing setup time from weeks to days.",
      "Implemented comprehensive observability with real-time dashboards and automated alerting.",
      "Scaled seamlessly to support 3x transaction growth without performance degradation."
    ]
  },
  {
    slug: "real-time-inventory-optimization",
    title: "Real-Time Inventory Optimization System",
    description: "AI-powered inventory management system with predictive analytics and automated reordering.",
    tech: ["Business Central", "Machine Learning", "Azure ML", "Power Platform", "Custom AL Extensions", "SQL Analytics"],
    problem: "A retail chain with 200+ locations was struggling with inventory management challenges: overstocking slow-moving items, frequent stockouts of popular products, and manual reordering processes that couldn't keep up with demand fluctuations. The company was losing $2M annually due to inventory inefficiencies, and customer satisfaction was declining due to product unavailability. Their existing BC setup had basic inventory tracking but no predictive capabilities.",
    solution: "I developed an intelligent inventory optimization system combining Business Central with Azure ML: custom AL extensions capturing real-time sales data and inventory movements, machine learning models predicting demand patterns based on historical data, seasonal trends, and external factors, automated reordering algorithms with supplier lead time optimization, Power BI dashboards providing actionable insights to inventory managers, and integration with POS systems for real-time inventory updates across all locations. The system learned from sales patterns and continuously improved its predictions.",
    outcome: [
      "Reduced inventory carrying costs by 25% while maintaining 99.5% product availability.",
      "Decreased stockouts by 60% through accurate demand forecasting and proactive reordering.",
      "Automated 85% of reordering decisions, freeing managers to focus on strategic planning.",
      "Improved inventory turnover rate by 40% through optimized stock level recommendations.",
      "Generated $1.8M annual savings through reduced waste and improved cash flow management.",
      "Increased customer satisfaction scores by 15% due to better product availability."
    ]
  }
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