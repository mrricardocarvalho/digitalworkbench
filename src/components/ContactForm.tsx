import React, { useState } from 'react';
import { useAnalytics } from '../utils/analytics';
import './ContactForm.css';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactFormProps {
  variant?: 'full' | 'compact';
  showNewsletter?: boolean;
}

/**
 * Enhanced Contact Form with validation, spam protection, and newsletter signup
 */
const ContactForm: React.FC<ContactFormProps> = ({ 
  variant = 'full', 
  showNewsletter = true 
}) => {
  const { trackEvent } = useAnalytics();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletter: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState(''); // Spam protection

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation (for full form)
    if (variant === 'full') {
      if (!formData.subject.trim()) {
        newErrors.subject = 'Subject is required';
      } else if (formData.subject.trim().length < 5) {
        newErrors.subject = 'Subject must be at least 5 characters';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot spam protection
    if (honeypot) {
      console.warn('Spam detected - form submission blocked');
      return;
    }

    if (!validateForm()) {
      trackEvent({
        event_name: 'contact_form_validation_error',
        category: 'engagement',
        action: 'form_validation',
        label: Object.keys(errors).join(', ')
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission (replace with actual API call)
      await simulateFormSubmission(formData);

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        newsletter: false
      });

      // Analytics tracking
      trackEvent({
        event_name: 'contact_form_submitted',
        category: 'engagement',
        action: 'contact_submission',
        label: variant,
        custom_parameters: {
          newsletter_signup: formData.newsletter,
          form_variant: variant
        }
      });

      if (formData.newsletter) {
        trackEvent({
          event_name: 'newsletter_signup',
          category: 'engagement',
          action: 'newsletter_subscription',
          label: 'contact_form'
        });
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      
      trackEvent({
        event_name: 'contact_form_error',
        category: 'error',
        action: 'submission_failed',
        label: 'contact_form'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate form submission (replace with actual backend integration)
  const simulateFormSubmission = (data: ContactFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          console.log('Form submission successful:', data);
          resolve();
        } else {
          reject(new Error('Submission failed'));
        }
      }, 1500);
    });
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Sending...';
    if (submitStatus === 'success') return 'Message Sent!';
    if (submitStatus === 'error') return 'Try Again';
    return variant === 'compact' ? 'Send' : 'Send Message';
  };

  const getSubmitButtonClass = () => {
    let baseClass = 'contact-form__submit';
    if (isSubmitting) baseClass += ' contact-form__submit--loading';
    if (submitStatus === 'success') baseClass += ' contact-form__submit--success';
    if (submitStatus === 'error') baseClass += ' contact-form__submit--error';
    return baseClass;
  };

  return (
    <form 
      className={`contact-form contact-form--${variant}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Honeypot field for spam protection */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="contact-form__grid">
        <div className="contact-form__field">
          <label htmlFor="contact-name" className="contact-form__label">
            Name *
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
            placeholder="Your full name"
            required
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="contact-form__error" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email" className="contact-form__label">
            Email *
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
            placeholder="your.email@example.com"
            required
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="contact-form__error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {variant === 'full' && (
          <div className="contact-form__field contact-form__field--full-width">
            <label htmlFor="contact-subject" className="contact-form__label">
              Subject *
            </label>
            <input
              type="text"
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`contact-form__input ${errors.subject ? 'contact-form__input--error' : ''}`}
              placeholder="What's this about?"
              required
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && (
              <span id="subject-error" className="contact-form__error" role="alert">
                {errors.subject}
              </span>
            )}
          </div>
        )}

        <div className="contact-form__field contact-form__field--full-width">
          <label htmlFor="contact-message" className="contact-form__label">
            Message *
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={`contact-form__textarea ${errors.message ? 'contact-form__input--error' : ''}`}
            placeholder={variant === 'compact' 
              ? "Tell me about your project..." 
              : "I'd love to hear about your project, challenges, or how I can help you succeed with Business Central..."
            }
            rows={variant === 'compact' ? 3 : 5}
            required
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <span id="message-error" className="contact-form__error" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        {showNewsletter && (
          <div className="contact-form__field contact-form__field--full-width">
            <label className="contact-form__checkbox-label">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="contact-form__checkbox"
              />
              <span className="contact-form__checkbox-text">
                Subscribe to newsletter for Business Central insights and updates
              </span>
            </label>
          </div>
        )}

        <div className="contact-form__field contact-form__field--full-width">
          <button
            type="submit"
            disabled={isSubmitting}
            className={getSubmitButtonClass()}
            aria-describedby={submitStatus !== 'idle' ? 'submit-status' : undefined}
          >
            {getSubmitButtonText()}
          </button>

          {submitStatus === 'success' && (
            <div id="submit-status" className="contact-form__success" role="status">
              Thank you! Your message has been sent successfully. I'll get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div id="submit-status" className="contact-form__error-message" role="alert">
              Sorry, there was an error sending your message. Please try again or email me directly.
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
