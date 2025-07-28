import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      const nav = mobileNavRef.current;
      const clickedOutside = nav && !nav.contains(e.target as Node);
      // Debug log
      console.log('[Header] Document click (capture phase):', {
        target: e.target,
        nav,
        clickedOutside,
        isMobileMenuOpen
      });
      if (clickedOutside) {
        setIsMobileMenuOpen(false);
      }
    }
    console.log('[Header] useEffect registering document click/touch listeners');
    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('touchstart', handleClick, true);
    return () => {
      document.removeEventListener('mousedown', handleClick, true);
      document.removeEventListener('touchstart', handleClick, true);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="main-header">
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
          </nav>

          <div className="header-right">
            <div className="header-search">
              <GlobalSearch 
                placeholder="Search..." 
                showFilters={false}
                maxResults={5}
              />
            </div>
            <div className="header-status" title="Available for new opportunities">
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
      />

      {/* Mobile Navigation Menu */}
      <nav
        ref={mobileNavRef}
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
      </nav>
    </header>
  );
};

export default Header;
