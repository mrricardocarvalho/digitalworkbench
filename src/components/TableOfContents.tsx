import React, { useState, useEffect } from 'react';
import './TableOfContents.css';

interface TocItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

interface TableOfContentsProps {
  contentSelector?: string;
  className?: string;
  maxLevel?: number;
  sticky?: boolean;
  autoGenerate?: boolean;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  contentSelector = '.insight-body',
  className = '',
  maxLevel = 4,
  sticky = true,
  autoGenerate = true
}) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // Generate TOC items from content
  useEffect(() => {
    if (!autoGenerate) return;

    let timeoutId: number;
    let isGenerating = false;

    const generateToc = () => {
      // Prevent recursive calls
      if (isGenerating) return;
      isGenerating = true;

      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) {
        isGenerating = false;
        return;
      }

      const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: TocItem[] = [];

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement;
        const level = parseInt(element.tagName.substring(1));
        
        if (level <= maxLevel) {
          let id = element.id;
          
          // Generate ID if it doesn't exist
          if (!id) {
            const text = element.textContent || '';
            id = `heading-${index}-${text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .slice(0, 50)}`;
            
            // Only set ID if it doesn't already exist
            if (!document.getElementById(id)) {
              element.id = id;
            }
          }

          items.push({
            id,
            text: element.textContent || '',
            level,
            element
          });
        }
      });

      setTocItems(items);
      isGenerating = false;
    };

    // Throttled version for mutation observer
    const throttledGenerateToc = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(generateToc, 100);
    };

    // Generate on load
    generateToc();
    
    // Use MutationObserver to detect content changes
    const contentElement = document.querySelector(contentSelector);
    if (contentElement) {
      const observer = new MutationObserver(throttledGenerateToc);
      observer.observe(contentElement, { 
        childList: true, 
        subtree: true,
        attributes: false // Don't observe attribute changes to prevent loops
      });
      
      return () => {
        observer.disconnect();
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [contentSelector, maxLevel, autoGenerate]);

  // Track scroll position and update active item
  useEffect(() => {
    if (tocItems.length === 0) return;

    const updateActiveItem = () => {
      const scrollTop = window.pageYOffset;
      const offset = 100; // Offset from top of viewport

      // Find the heading that's currently in view
      let activeItem = tocItems[0];
      
      for (const item of tocItems) {
        const elementTop = item.element.offsetTop;
        if (scrollTop + offset >= elementTop) {
          activeItem = item;
        } else {
          break;
        }
      }

      if (activeItem) {
        setActiveId(activeItem.id);
      }
    };

    updateActiveItem();

    const handleScroll = () => {
      requestAnimationFrame(updateActiveItem);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setIsOpen(false); // Close mobile menu after click
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className={`table-of-contents ${className} ${sticky ? 'table-of-contents--sticky' : ''}`}>
      <div className="toc-header">
        <button 
          className="toc-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="toc-list"
        >
          <span className="toc-icon">📋</span>
          <span className="toc-title">Table of Contents</span>
          <span className={`toc-chevron ${isOpen ? 'toc-chevron--open' : ''}`}>▼</span>
        </button>
      </div>
      
      <ol 
        id="toc-list"
        className={`toc-list ${isOpen ? 'toc-list--open' : ''}`}
      >
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={`toc-item toc-item--level-${item.level} ${
              activeId === item.id ? 'toc-item--active' : ''
            }`}
          >
            <button
              className="toc-link"
              onClick={() => scrollToHeading(item.id)}
              title={item.text}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
