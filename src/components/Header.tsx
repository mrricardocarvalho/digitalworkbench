import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle'; // Import the toggle
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="main-header" role="banner">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-name" aria-label="Ricardo Carvalho - Home">Ricardo Carvalho</Link>
          
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
          </nav>

          <div className="header-right">
            <div className="header-status">
              <span className="status-dot" aria-hidden="true"></span>
              <span>Available for new opportunities</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;