import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SEO from '../components/SEO';
import Interactive3D from '../components/Interactive3D';
import './HomePage.css';

// ... (type definitions remain the same)
type Project = { slug: string; title: string; description: string; };
type Insight = { slug:string; title: string; description: string; };

const HomePage: React.FC = () => {
  const projects: Project[] = [
    { 
      slug: "digital-workbench-portfolio", 
      title: "Digital Workbench - Modern Portfolio Platform", 
      description: "Built a high-performance React portfolio with interactive 3D elements, comprehensive SEO optimization, and modern development practices. Features TypeScript, Framer Motion animations, and custom performance monitoring." 
    }
  ];
  const insights: Insight[] = [
    { 
      slug: "business-central-performance-bottlenecks-guide", 
      title: "Business Central Performance Bottlenecks: The Complete Developer's Guide", 
      description: "Master 7 critical performance bottlenecks that impact Business Central systems. Includes AL code optimizations, SQL tuning techniques, and proven strategies used in enterprise implementations." 
    },
    {
      slug: "business-central-cloud-vs-onpremises-migration-guide",
      title: "Business Central Cloud vs On-Premises: Complete Migration Decision Framework",
      description: "Strategic guide using the SCALE methodology to make informed migration decisions. Includes TCO calculator, decision matrix, and real-world migration timelines for enterprise implementations."
    },
    {
      slug: "business-central-al-extensions-advanced-patterns",
      title: "Business Central AL Extensions: Advanced Patterns for Enterprise-Grade Development",
      description: "Master advanced AL extension patterns used in enterprise implementations. Learn dependency injection, event-driven architecture, and scalable patterns that handle 1000+ concurrent users."
    },
    {
      slug: "business-central-data-migration-zero-downtime-strategies",
      title: "Business Central Data Migration: Zero-Downtime Strategies for Enterprise Implementations",
      description: "Complete framework for zero-downtime data migration with parallel loading, delta synchronization, and proven strategies that handle 2TB+ databases without business disruption."
    }
  ];

  // Animation variants for sections - optimized for performance
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, // Reduced from 0.6
      ease: "easeOut"
    } 
  },
};

// Animation variants for bento boxes - subtle but engaging
const bentoVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1, // Stagger effect
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

// Animation variants for content cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -4,
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

  return (
    <>
      <SEO 
        title="Ricardo Carvalho - Senior Dynamics 365 Business Central Developer"
        description="Senior D365 BC Developer with 20+ years experience architecting robust and scalable ERP solutions. Specialized in AL development, NAV migrations, and enterprise implementations."
        canonical="https://ricardocarvalho.dev/"
      />
      <div className="container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="bento-grid">
          <motion.div 
            className="bento-box box-title"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={bentoVariants}
          >
            <h1>Senior Dynamics 365 Business Central Developer</h1>
            <p>Architecting robust and scalable solutions for complex business ecosystems.</p>
          </motion.div>
          <motion.div 
            className="bento-box box-3d"
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={bentoVariants}
          >
            <Interactive3D />
          </motion.div>
          <motion.div 
            className="bento-box box-project clickable" 
            custom={2}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={bentoVariants}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Navigate to Featured Projects section"
          >
            <h3>Featured Project</h3>
            <p>Digital Workbench Portfolio →</p>
          </motion.div>
          <motion.div 
            className="bento-box box-philosophy clickable"
            custom={3}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={bentoVariants}
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Navigate to Experience and Philosophy section"
          >
            <h3>My Philosophy</h3>
            <p>"Code is a craft of precision and empathy. I build systems that are not only powerful but also intuitive."</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Wrap other sections in motion.section */}
      <motion.section
        id="projects"
        className="content-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <h2>01 / Projects</h2>
        {/* ... project mapping ... */}
        {projects.map((project, index) => (
          <motion.div 
            key={project.slug} 
            className="summary-card card-hover focus-ring"
            custom={index}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true }}
            variants={cardVariants}
            role="article"
            tabIndex={0}
          >
            <div className="card-content">
              <h3 className="animate-fade-in-up">{project.title}</h3>
              <p className="animate-fade-in-up animation-delay-1">{project.description}</p>
              <Link 
                to={`/projects/${project.slug}`} 
                className="btn-primary focus-ring"
                aria-label={`View ${project.title} case study`}
              >
                View Case Study →
              </Link>
            </div>
          </motion.div>
        ))}
        <a href="/projects" className="view-all-link">View All Projects</a>
      </motion.section>

      <motion.section
        id="insights"
        className="content-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <h2>02 / Articles & Insights</h2>
        {/* ... insight mapping ... */}
        {insights.map((insight, index) => (
          <motion.div 
            key={insight.slug} 
            className="summary-card card-hover focus-ring"
            custom={index}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true }}
            variants={cardVariants}
            role="article"
            tabIndex={0}
          >
            <div className="card-content">
              <h3 className="animate-fade-in-up">{insight.title}</h3>
              <p className="animate-fade-in-up animation-delay-1">{insight.description}</p>
              <Link 
                to={`/insights/${insight.slug}`} 
                className="btn-primary focus-ring"
                aria-label={`Read more about ${insight.title}`}
              >
                Read More →
              </Link>
            </div>
          </motion.div>
        ))}
        <Link to="/insights" className="view-all-link">View All Posts</Link>
      </motion.section>

      <motion.section
        id="experience"
        className="content-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <h2>03 / Experience & Skills</h2>
        {/* ... experience content ... */}
        <motion.div 
          className="experience-summary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          custom={0}
        >
          <p>With over 20 years of dedicated experience in the Microsoft Dynamics ecosystem, I've evolved from NAV implementations to becoming a Business Central specialist, architecting enterprise-level solutions across diverse industries.</p>
        </motion.div>
        <div className="skills-grid">
          <motion.div 
            className="skill-category"
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            variants={cardVariants}
            custom={1}
          >
            <h3>Expert</h3>
            <ul><li>AL Programming Language</li><li>Business Central Architecture</li><li>Microsoft Dynamics NAV</li><li>ERP Implementation</li></ul>
          </motion.div>
          <motion.div 
            className="skill-category"
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            variants={cardVariants}
            custom={2}
          >
            <h3>Proficient</h3>
            <ul><li>Azure DevOps & CI/CD</li><li>SQL Server & T-SQL</li><li>Data Migration</li><li>Performance Optimization</li></ul>
          </motion.div>
        </div>
        <Link to="/resume" className="view-all-link">View Full Resume →</Link>
      </motion.section>
      </div>
    </>
  );
};

export default HomePage;