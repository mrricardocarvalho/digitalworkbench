import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import NewsletterSignup from '../components/NewsletterSignup';
import SEO from '../components/SEO';
import { useAnalytics } from '../utils/analytics';
import './ContactPage.css';

/**
 * Dedicated Contact Page with enhanced contact form and newsletter signup
 */
const ContactPage: React.FC = () => {
  const { trackEvent } = useAnalytics();

  const handleContactMethodClick = (method: string) => {
    trackEvent({
      event_name: 'contact_method_click',
      category: 'engagement',
      action: 'contact_interaction',
      label: method
    });
  };

  const contactMethods = [
    {
      icon: '📧',
      label: 'Email',
      value: 'ricardo.sampaio@gmail.com',
      href: 'mailto:ricardo.sampaio@gmail.com',
      description: 'Best for detailed project discussions'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'Connect professionally',
      href: 'https://www.linkedin.com/in/ricardo-carvalho-05741519',
      description: 'Professional networking and quick messages'
    },
    {
      icon: '📱',
      label: 'WhatsApp',
      value: '+351 XXX XXX XXX',
      href: '#',
      description: 'Quick questions and project updates'
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'Portugal (Remote Available)',
      href: '#',
      description: 'Available for remote and on-site work'
    }
  ];

  const faqs = [
    {
      question: 'What types of Business Central projects do you handle?',
      answer: 'I specialize in end-to-end Business Central implementations, customizations, integrations, performance optimization, and cloud migrations. From small business setups to enterprise-level solutions.'
    },
    {
      question: 'How quickly can you respond to inquiries?',
      answer: 'I typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention "URGENT" in your subject line.'
    },
    {
      question: 'Do you work with international clients?',
      answer: 'Yes! I work with clients globally and have experience with multiple time zones. I can accommodate meetings in your preferred timezone.'
    },
    {
      question: 'What information should I include in my project inquiry?',
      answer: 'Please include your current Business Central version, specific challenges you\'re facing, project timeline, and any existing customizations. The more details, the better I can assist you.'
    }
  ];

  return (
    <>
      <SEO pageType="contact" />
      <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero__content">
          <h1 className="contact-hero__title">
            Let's Discuss Your <span className="gradient-text">Business Central</span> Project
          </h1>
          <p className="contact-hero__description">
            Ready to optimize your Business Central implementation or start a new project? 
            I'm here to help you achieve your business goals with expert guidance and proven solutions.
          </p>
          
          <div className="contact-hero__stats">
            <div className="stat">
              <span className="stat__number">20+</span>
              <span className="stat__label">Years Experience</span>
            </div>
            <div className="stat">
              <span className="stat__number">100+</span>
              <span className="stat__label">Projects Delivered</span>
            </div>
            <div className="stat">
              <span className="stat__number">24hr</span>
              <span className="stat__label">Response Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods">
        <div className="contact-methods__header">
          <h2>Get in Touch</h2>
          <p>Choose your preferred way to connect</p>
        </div>
        
        <div className="contact-methods__grid">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.href}
              className="contact-method-card"
              onClick={() => handleContactMethodClick(method.label.toLowerCase())}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <div className="contact-method-card__icon">
                {method.icon}
              </div>
              <div className="contact-method-card__content">
                <h3>{method.label}</h3>
                <p className="contact-method-card__value">{method.value}</p>
                <p className="contact-method-card__description">{method.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-header">
            <h2>Send a Message</h2>
            <p>
              Tell me about your project, challenges, or how I can help you succeed with Business Central. 
              I'll get back to you within 24 hours.
            </p>
          </div>
          
          <ContactForm variant="full" showNewsletter={true} />
        </div>

        <div className="contact-sidebar">
          <div className="contact-availability">
            <h3>Availability</h3>
            <div className="availability-status">
              <div className="status-indicator status-indicator--available"></div>
              <span>Available for new projects</span>
            </div>
            <p>Currently accepting new Business Central projects starting in Q1 2025.</p>
          </div>

          <div className="contact-expertise">
            <h3>Areas of Expertise</h3>
            <ul>
              <li>Business Central Implementation</li>
              <li>AL Development & Customization</li>
              <li>Performance Optimization</li>
              <li>Cloud Migration</li>
              <li>API Integrations</li>
              <li>Training & Support</li>
            </ul>
          </div>

          <NewsletterSignup 
            variant="sidebar" 
            showName={false}
            title="Expert Insights"
            description="Get Business Central tips and industry insights in your inbox."
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq">
        <div className="contact-faq__header">
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to common questions about working together</p>
        </div>
        
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="contact-cta__content">
          <h2>Ready to Get Started?</h2>
          <p>
            Let's transform your Business Central experience together. 
            Whether you need a quick consultation or a full implementation, I'm here to help.
          </p>
          <div className="contact-cta__actions">
            <a 
              href="mailto:ricardo.sampaio@gmail.com" 
              className="btn btn-primary"
              onClick={() => handleContactMethodClick('email_cta')}
            >
              Send Email Now
            </a>
            <Link to="/resume" className="btn btn-secondary">
              View Experience
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ContactPage;
