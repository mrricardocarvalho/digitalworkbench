import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import ThemeToggle from './ThemeToggle';
import './Header.css';


const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close menu on outside click (capture phase)
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

  return (
    <header className="main-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-name" aria-label="Ricardo Carvalho - Home">
            Ricardo Carvalho
          </Link>
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
              <span>Available</span>
            </div>
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              onClick={toggleMobileMenu}
            >
              <span aria-hidden="true">&#9776;</span>
            </button>
          </div>
        </div>
        {/* Mobile Navigation Overlay */}
        <div
          className={`mobile-nav-overlay${isMobileMenuOpen ? ' active' : ''}`}
          onClick={closeMobileMenu}
          aria-hidden={!isMobileMenuOpen}
        />
        {/* Mobile Navigation Menu */}
        <nav
          ref={mobileNavRef}
          id="mobile-nav"
          className={`mobile-nav${isMobileMenuOpen ? ' active' : ''}`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <NavLink to="/" className="nav-link" onClick={closeMobileMenu} end>
            Home
          </NavLink>
          <NavLink to="/projects" className="nav-link" onClick={closeMobileMenu}>
            Projects
          </NavLink>
          <NavLink to="/insights" className="nav-link" onClick={closeMobileMenu}>
            Insights
          </NavLink>
          <NavLink to="/resume" className="nav-link" onClick={closeMobileMenu}>
            Resume
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={closeMobileMenu}>
            Contact
          </NavLink>
          <div className="mobile-theme-toggle">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
