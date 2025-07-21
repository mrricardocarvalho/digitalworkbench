import React from 'react';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import './InsightsPage.css';

// Define the structure for an insight/blog post
type Insight = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number; // in minutes
};

// Create a sample list of all your insights
const allInsights: Insight[] = [
  { 
    slug: "business-central-performance-bottlenecks-guide", 
    title: "Business Central Performance Bottlenecks: The Complete Developer's Guide", 
    description: "Master 7 critical performance bottlenecks that impact Business Central systems. Includes AL code optimizations, SQL tuning techniques, and proven strategies used in enterprise implementations.", 
    date: "July 20, 2025", 
    readingTime: 8 
  },
  { 
    slug: "business-central-cloud-vs-onpremises-migration-guide", 
    title: "Business Central Cloud vs On-Premises: Complete Migration Decision Framework", 
    description: "Strategic guide using the SCALE methodology to make informed migration decisions. Includes TCO calculator, decision matrix, and real-world migration timelines for enterprise implementations.", 
    date: "July 20, 2025", 
    readingTime: 12 
  },
  { 
    slug: "business-central-al-extensions-advanced-patterns", 
    title: "Business Central AL Extensions: Advanced Patterns for Enterprise-Grade Development", 
    description: "Master advanced AL extension patterns used in enterprise implementations. Learn dependency injection, event-driven architecture, and scalable patterns that handle 1000+ concurrent users.", 
    date: "July 20, 2025", 
    readingTime: 10 
  },
  { 
    slug: "business-central-data-migration-zero-downtime-strategies", 
    title: "Business Central Data Migration: Zero-Downtime Strategies for Enterprise Implementations", 
    description: "Complete framework for zero-downtime data migration with parallel loading, delta synchronization, and proven strategies that handle 2TB+ databases without business disruption.", 
    date: "July 20, 2025", 
    readingTime: 15 
  }
];

const InsightsPage: React.FC = () => {
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
      <div className="insights-header">
        <h1>Business Central Articles & Insights</h1>
        <p className="insights-subtitle">Real-world Business Central development techniques, performance tips, and architectural insights from 8+ years in the field.</p>
      </div>

      <motion.div 
        className="insights-grid"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {allInsights.map((insight) => (
          <motion.div key={insight.slug} className="insight-card" variants={itemVariants}>
            <div className="insight-meta">
              <span>{insight.date}</span>
              <span>•</span>
              <span>{insight.readingTime} min read</span>
            </div>
            <h3>{insight.title}</h3>
            <p>{insight.description}</p>
            <Link to={`/insights/${insight.slug}`} className="view-all-link">Read More →</Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InsightsPage;