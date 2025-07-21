import React from 'react';
import SEO from '../components/SEO';
import './ResumePage.css';

const ResumePage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Resume - Ricardo Carvalho | Senior Business Central Developer"
        description="Download Ricardo Carvalho's resume. 8+ years of Business Central development experience, AL programming, Azure DevOps, ERP implementations, and enterprise solutions across manufacturing and retail sectors."
        keywords="Ricardo Carvalho Resume, Business Central Developer CV, AL Developer Resume, Dynamics 365 BC Expert, ERP Developer Portfolio, Microsoft Dynamics Consultant, Business Central Specialist"
        canonical="https://ricardocarvalho.dev/resume"
      />
      <div className="container">
        <header className="page-header">
          <h1>My Resume</h1>
          <a href="/cv.pdf" className="download-btn" download>Download PDF</a>
        </header>

      <main>
        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p className="summary-text">
            Senior Business Central Developer with 20+ years of experience in ERP implementations, 
            starting with Microsoft Dynamics NAV and evolving to AL development and enterprise-level 
            Business Central customizations. Proven track record of delivering scalable solutions for 
            manufacturing, retail, and service industries. Expert in Azure DevOps, API integrations, 
            and performance optimization.
          </p>
        </section>

        <section className="resume-section">
          <h2>Work Experience</h2>
          <div className="timeline-item">
            <p className="timeline-date">2017 - PRESENT</p>
            <h3 className="timeline-title">Senior Business Central Developer</h3>
            <p className="timeline-company">Freelance Consultant, Remote</p>
            <div className="timeline-details">
              <ul>
                <li>Led end-to-end Business Central implementations for enterprise clients across multiple industries</li>
                <li>Developed complex AL extensions and customizations for manufacturing, retail, and service sectors</li>
                <li>Architected and implemented API integrations with third-party systems including e-commerce platforms</li>
                <li>Optimized performance for high-volume data processing, reducing execution times by up to 80%</li>
                <li>Mentored development teams and established best practices for AL development and testing</li>
                <li>Created comprehensive CI/CD pipelines using Azure DevOps for automated deployments</li>
              </ul>
            </div>
          </div>
          
          <div className="timeline-item">
            <p className="timeline-date">2010 - 2017</p>
            <h3 className="timeline-title">Business Central Developer</h3>
            <p className="timeline-company">Microsoft Partner Solutions, Lisbon, Portugal</p>
            <div className="timeline-details">
              <ul>
                <li>Developed and maintained Business Central extensions using AL programming language</li>
                <li>Customized core Business Central functionality to meet specific client requirements</li>
                <li>Performed data migrations from legacy NAV systems to Business Central cloud</li>
                <li>Created technical documentation and user training materials</li>
                <li>Participated in requirement gathering and solution design sessions with clients</li>
                <li>Provided post-implementation support and maintenance services</li>
              </ul>
            </div>
          </div>
          
          <div className="timeline-item">
            <p className="timeline-date">2006 - 2010</p>
            <h3 className="timeline-title">NAV Developer</h3>
            <p className="timeline-company">ERP Solutions Portugal, Lisbon, Portugal</p>
            <div className="timeline-details">
              <ul>
                <li>Developed and customized Microsoft Dynamics NAV solutions for various clients</li>
                <li>Created reports and analytical tools using C/AL and SQL</li>
                <li>Performed system testing and quality assurance for client solutions</li>
                <li>Supported senior developers in complex integration projects</li>
                <li>Gained expertise in NAV core modules and functionality</li>
              </ul>
            </div>
          </div>
          
          <div className="timeline-item">
            <p className="timeline-date">2004 - 2006</p>
            <h3 className="timeline-title">Junior ERP Developer</h3>
            <p className="timeline-company">Business Solutions Lisbon, Lisbon, Portugal</p>
            <div className="timeline-details">
              <ul>
                <li>Started career immediately after graduation as junior developer</li>
                <li>Assisted in Microsoft Dynamics NAV implementations and customizations</li>
                <li>Learned ERP fundamentals and business process analysis</li>
                <li>Developed basic reports and simple customizations</li>
                <li>Provided user support and training for NAV implementations</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="resume-section">
          <h2>Technical Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Development</h3>
              <ul>
                <li>AL Programming Language</li>
                <li>C# / .NET Framework</li>
                <li>JavaScript / TypeScript</li>
                <li>SQL Server / T-SQL</li>
                <li>REST APIs / Web Services</li>
                <li>JSON / XML Processing</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Microsoft Technologies</h3>
              <ul>
                <li>Dynamics 365 Business Central</li>
                <li>Microsoft Dynamics NAV</li>
                <li>Azure DevOps</li>
                <li>Azure Cloud Services</li>
                <li>Power Platform</li>
                <li>Visual Studio Code</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Specializations</h3>
              <ul>
                <li>ERP Implementation</li>
                <li>System Integration</li>
                <li>Performance Optimization</li>
                <li>Data Migration</li>
                <li>CI/CD Pipelines</li>
                <li>Project Management</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="resume-section">
          <h2>Education</h2>
          <div className="list-item">
            <p className="list-item-title">Licenciatura em Informática de Gestão</p>
            <p className="list-item-subtitle">Instituto Superior de Gestão, Lisbon, Portugal • 1999 - 2004</p>
            <p className="list-item-description">Focus on Management Information Systems and Business Applications</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Certifications</h2>
          <div className="list-item">
            <p className="list-item-title">Microsoft Certified: Dynamics 365 Business Central Functional Consultant Associate</p>
            <p className="list-item-subtitle">Microsoft</p>
          </div>
          <div className="list-item">
            <p className="list-item-title">Microsoft Certified Professional (MCP)</p>
            <p className="list-item-subtitle">Microsoft</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Key Projects</h2>
          <div className="project-item">
            <h3>Manufacturing ERP Implementation</h3>
            <p className="project-description">
              Led the implementation of a comprehensive Business Central solution for a manufacturing 
              company, including custom production planning modules, inventory management, 
              and financial reporting integration.
            </p>
            <div className="project-tech">
              <strong>Technologies:</strong> AL, Business Central, SQL Server, Power BI
            </div>
          </div>
          
          <div className="project-item">
            <h3>Multi-Company Financial Consolidation</h3>
            <p className="project-description">
              Developed a solution for consolidating financial data across multiple Business Central 
              companies, including automated intercompany transactions and consolidated reporting.
            </p>
            <div className="project-tech">
              <strong>Technologies:</strong> AL, Business Central, SQL Server, Power BI
            </div>
          </div>
          
          <div className="project-item">
            <h3>Legacy NAV to Business Central Migration</h3>
            <p className="project-description">
              Successfully migrated multiple clients from Dynamics NAV to Business Central cloud, 
              including data transformation, custom code conversion, and user training.
            </p>
            <div className="project-tech">
              <strong>Technologies:</strong> AL, SQL Server, Data Migration Tools, PowerShell
            </div>
          </div>
        </section>

        <section className="resume-section">
          <h2>Languages</h2>
          <div className="languages-grid">
            <div className="language-item">
              <span className="language-name">Portuguese</span>
              <span className="language-level">Native</span>
            </div>
            <div className="language-item">
              <span className="language-name">English</span>
              <span className="language-level">Fluent</span>
            </div>
            <div className="language-item">
              <span className="language-name">Spanish</span>
              <span className="language-level">Intermediate</span>
            </div>
          </div>
        </section>
      </main>
      
      {/* NOTE: We removed the footer with the "Back to Home" link because it's now part of the global Layout */}
      </div>
    </>
  );
};

export default ResumePage;