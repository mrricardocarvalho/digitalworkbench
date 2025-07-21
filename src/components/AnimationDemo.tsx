import React, { useState } from 'react';
import { 
  useScrollAnimation, 
  useParallax, 
  useMousePosition
} from '../utils/animations';
import './AnimationDemo.css';

/**
 * Animation Demo Component
 * Showcases the advanced animation system and micro-interactions
 */
const AnimationDemo: React.FC = () => {
  const { isInView, setElement } = useScrollAnimation(0.2);
  const parallaxOffset = useParallax(30);
  const mousePosition = useMousePosition();
  const [isLoading, setIsLoading] = useState(false);

  const demoCards = [
    {
      id: 1,
      title: "Fade In Animation",
      description: "Smooth fade-in effect with stagger delay",
      animation: "animate-fade-in"
    },
    {
      id: 2,
      title: "Slide Up Animation",
      description: "Performance-optimized slide up transition",
      animation: "animate-slide-up"
    },
    {
      id: 3,
      title: "Scale Animation",
      description: "Hardware-accelerated scale transformation",
      animation: "animate-scale-in"
    }
  ];

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="animation-demo">
      <div className="demo-header">
        <h1 className="animate-fade-in-up">Advanced Animation System</h1>
        <p className="animate-fade-in-up animation-delay-1">
          Showcasing performance-optimized micro-interactions and animations
        </p>
      </div>

      {/* Parallax Section */}
      <section className="parallax-section">
        <div 
          className="parallax-element"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <h2>Parallax Scroll Effect</h2>
          <p>This element moves based on scroll position</p>
        </div>
      </section>

      {/* Mouse Tracking */}
      <section className="mouse-tracking-section">
        <div className="mouse-tracker">
          <h3>Mouse Position Tracking</h3>
          <p>X: {mousePosition.x}, Y: {mousePosition.y}</p>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
            }}
          />
        </div>
      </section>

      {/* Scroll-triggered animations */}
      <section 
        ref={setElement}
        className={`scroll-triggered ${isInView ? 'in-view' : ''}`}
      >
        <h2 className="animate-fade-in-up">Scroll-Triggered Animations</h2>
        <div className="demo-grid">
          {demoCards.map((card, index) => (
            <div
              key={card.id}
              className={`demo-card card-hover focus-ring ${card.animation}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              tabIndex={0}
            >
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Button Interactions */}
      <section className="button-demo">
        <h2>Button Micro-interactions</h2>
        <div className="button-grid">
          <button className="btn-primary focus-ring">
            Primary Button
          </button>
          <button className="btn-secondary focus-ring">
            Secondary Button
          </button>
          <button 
            className={`btn-primary focus-ring ${isLoading ? 'loading' : ''}`}
            onClick={handleLoadingDemo}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Loading Demo'}
          </button>
        </div>
      </section>

      {/* CSS-Based Animations */}
      <section className="css-demo">
        <h2>CSS-Based Animations</h2>
        <div className="css-grid">
          <div className="css-card animate-fade-in">
            <h3>Fade In</h3>
            <p>Pure CSS fade animation</p>
          </div>

          <div className="css-card animate-slide-up">
            <h3>Slide Up</h3>
            <p>Hardware-accelerated slide</p>
          </div>

          <div className="css-card animate-scale-in">
            <h3>Scale</h3>
            <p>Transform-based scaling</p>
          </div>
        </div>
      </section>

      {/* Performance Indicators */}
      <section className="performance-section">
        <h2>Performance Optimizations</h2>
        <div className="optimization-list">
          <div className="optimization-item animate-fade-in animation-delay-1">
            ✓ Hardware-accelerated transforms
          </div>
          <div className="optimization-item animate-fade-in animation-delay-2">
            ✓ Will-change properties for smooth animations
          </div>
          <div className="optimization-item animate-fade-in animation-delay-3">
            ✓ Reduced motion support
          </div>
          <div className="optimization-item animate-fade-in animation-delay-4">
            ✓ Intersection Observer for scroll triggers
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimationDemo;
