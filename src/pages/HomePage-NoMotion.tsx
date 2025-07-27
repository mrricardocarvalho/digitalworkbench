import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Interactive3D from '../components/Interactive3D';
import './HomePage.css';

// ... (type definitions remain the same)
type Project = { slug: string; title: string; description: string; };
type Insight = { slug:string; title: string; description: string; };

const HomePage: React.FC = () => {
  const projects: Project[] = [
    { 
      slug: "digital-workbench-portfolio", 
      title: "Digital Workbench - Modern Portfolio Platform", 
      description: "Built a high-performance React portfolio with interactive 3D elements, comprehensive SEO optimization, and modern development practices. Features TypeScript, Framer Motion animations, and custom performance monitoring." 
    }
  ];

  const insights: Insight[] = [
    {
      slug: "exploring-secrettext-feature-business-central",
      title: "Exploring the New SecretText Feature in Business Central Control Add-ins",
      description: "Master the SecretText feature introduced in 2025 release wave 1. Complete guide to secure data handling in control add-ins and JSON objects with AL code examples and compliance best practices."
    },
    {
      slug: "automating-tests-copilot-extensions-business-central",
      title: "Automating Tests for Copilot Extensions Using Business Central Test Toolkit",
      description: "Comprehensive guide to testing AI-driven features in Business Central. Learn setup, test scripts, and interpretation with practical examples that save time and improve Copilot reliability."
    },
    {
      slug: "leveraging-ai-resources-business-central-copilot",
      title: "Leveraging AI Resources in Your Business Central Copilot Extensions",
      description: "Explore Azure AI integration in Business Central 2025. Build intelligent extensions with predictive analytics, natural language processing, and sample projects demonstrating AI capabilities."
    }
  ];

  return (
    <>
      <SEO 
        title="Senior Dynamics 365 Business Central Developer | Digital Workbench"
        description="Expert Dynamics 365 Business Central developer specializing in AL programming, cloud migrations, and enterprise integrations. Explore my portfolio of successful projects and technical insights."
        canonical="https://mrricardocarvalho.github.io/digitalworkbench/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Ricardo Carvalho",
          "jobTitle": "Senior Dynamics 365 Business Central Developer",
          "url": "https://mrricardocarvalho.github.io/digitalworkbench/",
          "sameAs": [
            "https://www.linkedin.com/in/ricardo-carvalho-05741519",
            "https://github.com/mrricardocarvalho"
          ],
          "description": "Expert Dynamics 365 Business Central developer specializing in AL programming, cloud migrations, and enterprise integrations."
        }}
      />
      <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="bento-grid">
          <div className="bento-box box-title">
            <h1>Senior Dynamics 365 Business Central Developer</h1>
            <p>Architecting robust and scalable solutions for complex business ecosystems.</p>
          </div>
          <div className="bento-box box-3d">
            <Interactive3D />
          </div>
          <div className="bento-box box-stats">
            <div className="stat-item">
              <span className="stat-number">12+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">25+</span>
              <span className="stat-label">Clients Worldwide</span>
            </div>
          </div>
          <div className="bento-box box-cta">
            <h3>Ready to Transform Your Business?</h3>
            <p>Let's discuss how I can help optimize your Dynamics 365 Business Central implementation.</p>
            <div className="cta-buttons">
              <a href="mailto:ricardo.sampaio@gmail.com" className="btn btn-primary">
                Get In Touch
              </a>
              <Link to="/resume" className="btn btn-secondary">
                View Resume
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Other sections without motion */}
      <section id="projects" className="projects-section">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <p>Showcasing recent work and technical achievements</p>
        </div>
        
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.slug} className="project-card">
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <Link to={`/projects/${project.slug}`} className="btn btn-outline">
                  View Project →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="section-footer">
          <Link to="/projects" className="btn btn-primary">
            View All Projects
          </Link>
        </div>
      </section>

      <section id="insights" className="insights-section">
        <div className="section-header">
          <h2>Latest Insights</h2>
          <p>Technical articles and industry perspectives</p>
        </div>
        
        <div className="insights-grid">
          {insights.map((insight) => (
            <article key={insight.slug} className="insight-card">
              <div className="insight-content">
                <h3>{insight.title}</h3>
                <p>{insight.description}</p>
                <Link to={`/insights/${insight.slug}`} className="btn btn-outline">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="section-footer">
          <Link to="/insights" className="btn btn-primary">
            Read All Insights
          </Link>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Let's Work Together</h2>
            <p>Ready to optimize your Business Central implementation or discuss a new project? I'd love to hear from you.</p>
            
            <div className="contact-methods">
              <a href="mailto:ricardo.sampaio@gmail.com" className="contact-method">
                <span className="method-icon">✉️</span>
                <div className="method-details">
                  <span className="method-label">Email</span>
                  <span className="method-value">ricardo.sampaio@gmail.com</span>
                </div>
              </a>
              
              <a href="https://www.linkedin.com/in/ricardo-carvalho-05741519" target="_blank" rel="noopener noreferrer" className="contact-method">
                <span className="method-icon">💼</span>
                <div className="method-details">
                  <span className="method-label">LinkedIn</span>
                  <span className="method-value">Connect with me</span>
                </div>
              </a>
              
              <a href="https://github.com/mrricardocarvalho" target="_blank" rel="noopener noreferrer" className="contact-method">
                <span className="method-icon">🐱</span>
                <div className="method-details">
                  <span className="method-label">GitHub</span>
                  <span className="method-value">View my code</span>
                </div>
              </a>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Quick Contact</h3>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} required></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default HomePage;
