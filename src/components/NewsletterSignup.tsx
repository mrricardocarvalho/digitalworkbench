import React, { useState } from 'react';
import { useAnalytics } from '../utils/analytics';
import './NewsletterSignup.css';

interface NewsletterFormData {
  email: string;
  firstName: string;
}

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'sidebar';
  showName?: boolean;
  title?: string;
  description?: string;
}

/**
 * Newsletter Signup Component with validation and analytics
 */
const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'inline',
  showName = false,
  title = 'Stay Updated',
  description = 'Get the latest Business Central insights and expert tips delivered to your inbox.'
}) => {
  const { trackEvent } = useAnalytics();
  
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    firstName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (showName && !formData.firstName.trim()) {
      setErrorMessage('Name is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Simulate newsletter subscription (replace with actual API call)
      await simulateNewsletterSignup(formData);

      setSubmitStatus('success');
      setFormData({ email: '', firstName: '' });

      // Analytics tracking
      trackEvent({
        event_name: 'newsletter_signup',
        category: 'engagement',
        action: 'newsletter_subscription',
        label: variant,
        custom_parameters: {
          source: variant,
          has_name: showName && !!formData.firstName
        }
      });

    } catch (error) {
      console.error('Newsletter signup error:', error);
      setSubmitStatus('error');
      setErrorMessage('Sorry, there was an error. Please try again.');
      
      trackEvent({
        event_name: 'newsletter_signup_error',
        category: 'error',
        action: 'subscription_failed',
        label: variant
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate newsletter subscription (replace with actual backend integration)
  const simulateNewsletterSignup = (data: NewsletterFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          console.log('Newsletter signup successful:', data);
          resolve();
        } else {
          reject(new Error('Subscription failed'));
        }
      }, 1000);
    });
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Subscribing...';
    if (submitStatus === 'success') return 'Subscribed!';
    if (submitStatus === 'error') return 'Try Again';
    return variant === 'inline' ? 'Subscribe' : 'Join Newsletter';
  };

  const getSubmitButtonClass = () => {
    let baseClass = 'newsletter-signup__submit';
    if (isSubmitting) baseClass += ' newsletter-signup__submit--loading';
    if (submitStatus === 'success') baseClass += ' newsletter-signup__submit--success';
    if (submitStatus === 'error') baseClass += ' newsletter-signup__submit--error';
    return baseClass;
  };

  return (
    <div className={`newsletter-signup newsletter-signup--${variant}`}>
      <div className="newsletter-signup__content">
        <div className="newsletter-signup__header">
          <h3 className="newsletter-signup__title">{title}</h3>
          <p className="newsletter-signup__description">{description}</p>
        </div>

        <form className="newsletter-signup__form" onSubmit={handleSubmit} noValidate>
          <div className="newsletter-signup__fields">
            {showName && (
              <div className="newsletter-signup__field">
                <label htmlFor="newsletter-firstName" className="newsletter-signup__label sr-only">
                  First Name
                </label>
                <input
                  type="text"
                  id="newsletter-firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="newsletter-signup__input"
                  placeholder="First name"
                  aria-describedby={errorMessage ? 'newsletter-error' : undefined}
                />
              </div>
            )}

            <div className="newsletter-signup__field newsletter-signup__field--email">
              <label htmlFor="newsletter-email" className="newsletter-signup__label sr-only">
                Email Address
              </label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="newsletter-signup__input"
                placeholder="your.email@example.com"
                required
                aria-describedby={errorMessage ? 'newsletter-error' : undefined}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={getSubmitButtonClass()}
              aria-describedby={submitStatus !== 'idle' ? 'newsletter-status' : undefined}
            >
              {getSubmitButtonText()}
            </button>
          </div>

          {errorMessage && (
            <div id="newsletter-error" className="newsletter-signup__error" role="alert">
              {errorMessage}
            </div>
          )}

          {submitStatus === 'success' && (
            <div id="newsletter-status" className="newsletter-signup__success" role="status">
              🎉 Welcome! Check your email to confirm your subscription.
            </div>
          )}
        </form>

        <div className="newsletter-signup__privacy">
          <p>No spam, unsubscribe anytime. View our <a href="/privacy" target="_blank">privacy policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
