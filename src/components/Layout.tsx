import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CommandPalette from './CommandPalette';
// import CustomCursor from './CustomCursor';
import ScrollToTop from './ScrollToTop';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* <CustomCursor /> */}
      <Header />
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      {/* Render the Command Palette */}
      <CommandPalette />
    </div>
  );
};

export default Layout;