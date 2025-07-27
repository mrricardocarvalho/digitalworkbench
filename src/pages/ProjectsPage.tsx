import React from 'react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { ProjectGallery, type ProjectData } from '../components/ProjectGallery';
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
    caseStudyUrl: "/projects/digital-workbench-portfolio",
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
  },
  {
    id: "ai-code-assistant",
    title: "AI-Powered Code Assistant",
    description: "An intelligent code assistant leveraging modern AI APIs to provide context-aware code suggestions, automated documentation generation, and intelligent refactoring capabilities. Features real-time code analysis, natural language to code conversion, and integration with popular IDEs.",
    shortDescription: "An intelligent code assistant with AI-powered suggestions and automated documentation generation.",
    image: "/vite.svg",
    technologies: ["Python", "OpenAI API", "FastAPI", "React", "TypeScript", "Docker", "PostgreSQL"],
    category: "AI/ML",
    status: "planned",
    featured: true,
    date: "2025-03-01",
    tags: ["AI", "Machine Learning", "Code Analysis", "Documentation", "IDE Integration"],
    difficulty: "advanced",
    timeline: "4 months",
    teamSize: 1
  },
  {
    id: "microservices-dashboard",
    title: "Microservices Monitoring Dashboard",
    description: "A comprehensive monitoring and management dashboard for microservices architectures. Provides real-time metrics, health checks, service discovery, and distributed tracing visualization. Built with modern DevOps practices and containerization.",
    shortDescription: "A comprehensive monitoring dashboard for microservices with real-time metrics and health checks.",
    image: "/vite.svg",
    technologies: ["React", "TypeScript", "Node.js", "Express", "Docker", "Kubernetes", "Prometheus", "Grafana"],
    category: "DevOps",
    status: "completed",
    featured: false,
    date: "2024-11-20",
    githubUrl: "https://github.com/mrricardocarvalho/microservices-dashboard",
    tags: ["Microservices", "Monitoring", "DevOps", "Kubernetes", "Docker"],
    metrics: {
      stars: 28,
      forks: 12,
      issues: 5,
      contributors: 3
    },
    difficulty: "intermediate",
    timeline: "2 months",
    teamSize: 1
  },
  {
    id: "blockchain-voting-system",
    title: "Secure Blockchain Voting System",
    description: "A decentralized voting system built on blockchain technology ensuring transparency, security, and immutability. Features smart contracts for vote management, cryptographic security, and a user-friendly interface for voters and administrators.",
    shortDescription: "A decentralized voting system with blockchain technology ensuring transparency and security.",
    image: "/vite.svg",
    technologies: ["Solidity", "Web3.js", "React", "TypeScript", "Ethereum", "MetaMask", "Hardhat"],
    category: "Blockchain",
    status: "completed",
    featured: false,
    date: "2024-09-15",
    githubUrl: "https://github.com/mrricardocarvalho/blockchain-voting",
    tags: ["Blockchain", "Smart Contracts", "Security", "Decentralized", "Voting"],
    metrics: {
      stars: 15,
      forks: 6,
      issues: 2,
      contributors: 1
    },
    difficulty: "advanced",
    timeline: "3 months",
    teamSize: 1
  },
  {
    id: "real-time-chat-app",
    title: "Real-time Chat Application",
    description: "A modern real-time chat application with support for multiple rooms, file sharing, message encryption, and presence indicators. Built with WebSocket technology and featuring responsive design for all devices.",
    shortDescription: "A modern real-time chat application with multiple rooms and file sharing capabilities.",
    image: "/vite.svg",
    technologies: ["React", "Socket.io", "Node.js", "Express", "MongoDB", "JWT", "WebRTC"],
    category: "Web Development",
    status: "completed",
    featured: false,
    date: "2024-08-10",
    githubUrl: "https://github.com/mrricardocarvalho/realtime-chat",
    liveUrl: "https://chat.ricardocarvalho.dev",
    tags: ["Chat", "Real-time", "WebSocket", "Messaging", "WebRTC"],
    metrics: {
      stars: 22,
      forks: 9,
      issues: 1,
      contributors: 1
    },
    difficulty: "intermediate",
    timeline: "6 weeks",
    teamSize: 1
  },
  {
    id: "data-visualization-platform",
    title: "Interactive Data Visualization Platform",
    description: "A powerful data visualization platform supporting multiple chart types, real-time data updates, and interactive dashboards. Features drag-and-drop interface, custom visualizations, and export capabilities for various formats.",
    shortDescription: "A powerful data visualization platform with interactive dashboards and real-time updates.",
    image: "/vite.svg",
    technologies: ["React", "D3.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Redis"],
    category: "Data Science",
    status: "in-progress",
    featured: false,
    date: "2025-01-01",
    tags: ["Data Visualization", "Analytics", "Dashboard", "Charts", "Interactive"],
    difficulty: "intermediate",
    timeline: "2 months",
    teamSize: 1
  }
];

const ProjectsPage: React.FC = () => {
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
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
          showFilters={true}
          showSearch={true}
          defaultView="grid"
          maxResults={50}
          showMetrics={true}
        />
      </motion.div>
    </div>
  );
};

export default ProjectsPage;