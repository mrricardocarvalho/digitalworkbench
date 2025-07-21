import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="404 - Page Not Found | Ricardo Carvalho"
        description="Oops! The page you're looking for doesn't exist. Navigate back to Ricardo Carvalho's portfolio."
        canonical="https://ricardocarvalho.dev/404"
      />
      <div className="container">
        <motion.div 
          className="not-found-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="not-found-content">
            <motion.div 
              className="error-code"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              404
            </motion.div>
            
            <motion.h1 
              className="error-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Page Not Found
            </motion.h1>
            
            <motion.p 
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Looks like this page took a coffee break. Let's get you back on track.
            </motion.p>
            
            <motion.div 
              className="error-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
              <Link to="/resume" className="btn-secondary">
                View Resume
              </Link>
            </motion.div>
            
            <motion.div 
              className="helpful-links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p>Or try one of these:</p>
              <div className="link-grid">
                <Link to="/#projects">Projects</Link>
                <Link to="/#insights">Articles & Insights</Link>
                <Link to="/#contact">Contact</Link>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="error-visual"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="floating-elements">
              <div className="element element-1"></div>
              <div className="element element-2"></div>
              <div className="element element-3"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
