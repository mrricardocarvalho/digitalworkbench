import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or on overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle window resize to close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`main-header ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`} role="banner">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-name" aria-label="Ricardo Carvalho - Home">
            Ricardo Carvalho
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/resume" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Resume
            </NavLink>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Projects
            </NavLink>
            <NavLink 
              to="/insights" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Articles & Insights
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Contact
            </NavLink>
            <NavLink 
              to="/search" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Search
            </NavLink>
          </nav>

          <div className="header-right">
            <div className="header-search">
              <GlobalSearch 
                placeholder="Search..." 
                showFilters={false}
                maxResults={5}
              />
            </div>
            <div className="header-status">
              <span className="status-dot" aria-hidden="true"></span>
              <span>Available for new opportunities</span>
            </div>
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <nav
        className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobileMenu}
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/resume" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          Resume
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          Projects
        </NavLink>
        <NavLink 
          to="/insights" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          Articles & Insights
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          Contact
        </NavLink>
        <NavLink 
          to="/search" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          Search
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;