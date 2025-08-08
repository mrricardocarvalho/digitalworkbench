import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './InsightsPage.css';
import NewsletterSignup from '../components/NewsletterSignup';
import { contentManager } from '../utils/contentManager';

// Define the structure for an insight/blog post
type Insight = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number; // in minutes
};

const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = () => {
      try {
        // Get all registered blog posts from content manager
        const allPosts = contentManager.getAllBlogPosts();
        
        // Convert BlogPost to Insight format
        const insightPosts: Insight[] = allPosts.map(post => ({
          slug: post.slug,
          title: post.title,
          description: post.description,
          date: post.date,
          readingTime: post.readingTime
        }));

        console.log(`📚 Loaded ${insightPosts.length} insights from content manager`);
        setInsights(insightPosts);
      } catch (error) {
        console.error('Error loading insights:', error);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <SEO pageType="insights" />
      <main className="container" id="main-content" role="main">
      <div className="insights-header">
        <h1>Business Central Articles & Insights</h1>
        <p className="insights-subtitle">Real-world Business Central development techniques, performance tips, and architectural insights from 8+ years in the field.</p>
      </div>

      {loading ? (
        <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading articles...</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No articles available at the moment.</p>
        </div>
      ) : (
        <motion.div 
          className="insights-grid"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {insights.map((insight: Insight) => (
            <motion.div key={insight.slug} className="insight-card" variants={itemVariants}>
              <div className="insight-meta">
                <span>{insight.date}</span>
                <span>•</span>
                <span>{insight.readingTime} min read</span>
              </div>
              <h3>{insight.title}</h3>
              <p>{insight.description}</p>
              <span className="insight-author">Ricardo Carvalho</span>
              <span className="insight-tags">Business Central, AL, Performance</span>
              <Link to={`/insights/${insight.slug}`} className="view-all-link">Read More →</Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <section className="newsletter-section">
        <NewsletterSignup 
          variant="inline" 
          showName={true}
          title="Stay Updated"
          description="Get exclusive insights, performance tips, and implementation strategies delivered directly to your inbox. Join 1,000+ Business Central professionals."
        />
      </section>
    </main>
    </>
  );
};

export default InsightsPage;