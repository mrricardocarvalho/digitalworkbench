import React from 'react';
import { Link } from 'react-router-dom';
import { analytics } from '../utils/analytics';
import './UserFriendlyErrorPage.css';

interface UserFriendlyErrorPageProps {
  errorType?: '404' | '500' | 'network' | 'generic';
  customMessage?: string;
  showDetails?: boolean;
  onRetry?: () => void;
}

const UserFriendlyErrorPage: React.FC<UserFriendlyErrorPageProps> = ({ 
  errorType = 'generic',
  customMessage,
  showDetails = false,
  onRetry
}) => {
  React.useEffect(() => {
    // Track error page view
    analytics.trackEvent({
      event_name: 'error_page_viewed',
      category: 'error',
      action: 'page_view',
      label: errorType,
      custom_parameters: {
        error_type: errorType,
        has_custom_message: !!customMessage,
        show_details: showDetails
      }
    });
  }, [errorType, customMessage, showDetails]);

  const getErrorContent = () => {
    switch (errorType) {
      case '404':
        return {
          icon: '🔍',
          title: 'Page Not Found',
          message: 'The page you\'re looking for doesn\'t exist or may have been moved.',
          suggestions: [
            'Check the URL for typos',
            'Go back to the homepage',
            'Use the search function',
            'Browse our projects and insights'
          ]
        };
      
      case '500':
        return {
          icon: '⚠️',
          title: 'Server Error',
          message: 'Something went wrong on our end. Our team has been notified and is working on a fix.',
          suggestions: [
            'Try refreshing the page',
            'Wait a few minutes and try again',
            'Contact support if the problem persists',
            'Check our status page for updates'
          ]
        };
      
      case 'network':
        return {
          icon: '📡',
          title: 'Connection Problem',
          message: 'Unable to connect to our servers. Please check your internet connection.',
          suggestions: [
            'Check your internet connection',
            'Try refreshing the page',
            'Disable VPN or proxy if enabled',
            'Contact your network administrator'
          ]
        };
      
      default:
        return {
          icon: '😕',
          title: 'Something Went Wrong',
          message: customMessage || 'An unexpected error occurred. We apologize for the inconvenience.',
          suggestions: [
            'Try refreshing the page',
            'Clear your browser cache',
            'Try a different browser',
            'Contact support if the issue continues'
          ]
        };
    }
  };

  const errorContent = getErrorContent();

  const handleRetry = () => {
    analytics.trackEvent({
      event_name: 'error_page_retry',
      category: 'error',
      action: 'retry_clicked',
      label: errorType
    });
    
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleContactSupport = () => {
    analytics.trackEvent({
      event_name: 'error_page_contact',
      category: 'error',
      action: 'contact_clicked',
      label: errorType
    });
    
    const subject = encodeURIComponent(`Error Report - ${errorType}`);
    const body = encodeURIComponent(`
I encountered an error on your website:

Error Type: ${errorType}
Page: ${window.location.href}
Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}

Additional Details:
${customMessage || 'No additional details provided'}

Please help me resolve this issue.
`);
    
    window.open(`mailto:ricardo.sampaio@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="error-page">
      <div className="error-page__container">
        <div className="error-page__content">
          <div className="error-page__icon">
            {errorContent.icon}
          </div>
          
          <h1 className="error-page__title">
            {errorContent.title}
          </h1>
          
          <p className="error-page__message">
            {errorContent.message}
          </p>

          <div className="error-page__actions">
            <button 
              onClick={handleRetry}
              className="error-page__button error-page__button--primary"
            >
              Try Again
            </button>
            
            <Link 
              to="/"
              className="error-page__button error-page__button--secondary"
            >
              Go Home
            </Link>
            
            <button 
              onClick={handleContactSupport}
              className="error-page__button error-page__button--outline"
            >
              Contact Support
            </button>
          </div>

          <div className="error-page__suggestions">
            <h3>What you can try:</h3>
            <ul>
              {errorContent.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {showDetails && (
            <details className="error-page__details">
              <summary>Technical Details</summary>
              <div className="error-page__technical">
                <p><strong>Error Type:</strong> {errorType}</p>
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
                <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                {customMessage && (
                  <p><strong>Custom Message:</strong> {customMessage}</p>
                )}
              </div>
            </details>
          )}

          <div className="error-page__help">
            <p>
              If this problem persists, you can also reach out to me on{' '}
              <a 
                href="https://www.linkedin.com/in/ricardo-carvalho-05741519"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackEvent({
                  event_name: 'error_page_linkedin',
                  category: 'error',
                  action: 'linkedin_clicked',
                  label: errorType
                })}
              >
                LinkedIn
              </a>{' '}
              or check out my{' '}
              <a 
                href="https://github.com/mrricardocarvalho"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackEvent({
                  event_name: 'error_page_github',
                  category: 'error',
                  action: 'github_clicked',
                  label: errorType
                })}
              >
                GitHub
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFriendlyErrorPage;
