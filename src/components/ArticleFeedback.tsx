import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../utils/analytics';
import './ArticleFeedback.css';

interface ArticleFeedbackProps {
  articleSlug: string;
  articleTitle: string;
  className?: string;
  position?: 'bottom' | 'floating' | 'inline';
}

interface FeedbackData {
  rating: number;
  comment?: string;
  helpful: boolean;
  category?: string;
  email?: string;
}

export const ArticleFeedback: React.FC<ArticleFeedbackProps> = ({
  articleSlug,
  articleTitle,
  className = '',
  position = 'bottom'
}) => {
  const { trackUserJourney } = useAnalytics();
  const [currentStep, setCurrentStep] = useState<'initial' | 'rating' | 'comment' | 'complete'>('initial');
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    helpful: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Check if user has already provided feedback
  useEffect(() => {
    const existingFeedback = localStorage.getItem(`feedback-${articleSlug}`);
    if (existingFeedback) {
      setHasSubmitted(true);
      setCurrentStep('complete');
    }
  }, [articleSlug]);

  // Handle helpful/not helpful quick feedback
  const handleQuickFeedback = async (helpful: boolean) => {
    const feedbackData = { ...feedback, helpful };
    setFeedback(feedbackData);

    // Track quick feedback
    trackUserJourney('article_quick_feedback', {
      article_slug: articleSlug,
      article_title: articleTitle,
      helpful: helpful,
      feedback_type: 'quick'
    });

    // Save to localStorage
    localStorage.setItem(`feedback-${articleSlug}`, JSON.stringify({
      ...feedbackData,
      timestamp: Date.now(),
      type: 'quick'
    }));

    setHasSubmitted(true);
    setCurrentStep('complete');

    // Show detailed form if not helpful
    if (!helpful) {
      setTimeout(() => {
        setCurrentStep('rating');
        setShowForm(true);
      }, 1500);
    }
  };

  // Handle star rating
  const handleRating = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
    setCurrentStep('comment');
  };

  // Handle comment submission
  const handleCommentSubmission = async () => {
    setIsSubmitting(true);

    try {
      // Track detailed feedback
      trackUserJourney('article_detailed_feedback', {
        article_slug: articleSlug,
        article_title: articleTitle,
        rating: feedback.rating,
        has_comment: !!feedback.comment,
        comment_length: feedback.comment?.length || 0,
        category: feedback.category,
        helpful: feedback.helpful,
        feedback_type: 'detailed'
      });

      // Save to localStorage
      localStorage.setItem(`feedback-${articleSlug}`, JSON.stringify({
        ...feedback,
        timestamp: Date.now(),
        type: 'detailed'
      }));

      // Simulate API call (replace with actual API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStep('complete');
      setHasSubmitted(true);
      setShowForm(false);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle showing detailed form
  const handleShowDetailedForm = () => {
    setShowForm(true);
    setCurrentStep('rating');
    
    trackUserJourney('article_feedback_form_opened', {
      article_slug: articleSlug,
      trigger: 'user_initiated'
    });
  };

  // Reset feedback (for testing or if user wants to change)
  const handleResetFeedback = () => {
    localStorage.removeItem(`feedback-${articleSlug}`);
    setFeedback({ rating: 0, helpful: false });
    setCurrentStep('initial');
    setHasSubmitted(false);
    setShowForm(false);
  };

  return (
    <div className={`article-feedback ${position} ${className} ${showForm ? 'expanded' : ''}`}>
      {!hasSubmitted && currentStep === 'initial' && (
        <div className="feedback-initial">
          <div className="feedback-header">
            <h4>Was this article helpful?</h4>
            <p>Your feedback helps us improve our content</p>
          </div>
          
          <div className="quick-feedback-buttons">
            <button 
              className="feedback-btn helpful"
              onClick={() => handleQuickFeedback(true)}
            >
              <span className="btn-icon">👍</span>
              <span className="btn-text">Yes, helpful</span>
            </button>
            
            <button 
              className="feedback-btn not-helpful"
              onClick={() => handleQuickFeedback(false)}
            >
              <span className="btn-icon">👎</span>
              <span className="btn-text">Needs improvement</span>
            </button>
          </div>
          
          <button 
            className="detailed-feedback-link"
            onClick={handleShowDetailedForm}
          >
            Leave detailed feedback
          </button>
        </div>
      )}

      {showForm && currentStep === 'rating' && (
        <div className="feedback-rating">
          <div className="feedback-header">
            <h4>Rate this article</h4>
            <p>How would you rate the overall quality and usefulness?</p>
          </div>
          
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star ${feedback.rating >= star ? 'filled' : ''}`}
                onClick={() => handleRating(star)}
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                ⭐
              </button>
            ))}
          </div>
          
          <div className="rating-labels">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
      )}

      {showForm && currentStep === 'comment' && (
        <div className="feedback-comment">
          <div className="feedback-header">
            <h4>Tell us more</h4>
            <p>What specific improvements would you suggest?</p>
          </div>
          
          <div className="comment-form">
            <div className="feedback-category">
              <label htmlFor="feedback-category">Category (optional):</label>
              <select 
                id="feedback-category"
                value={feedback.category || ''}
                onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select a category</option>
                <option value="content-accuracy">Content accuracy</option>
                <option value="code-examples">Code examples</option>
                <option value="clarity">Clarity and explanation</option>
                <option value="missing-info">Missing information</option>
                <option value="technical-depth">Technical depth</option>
                <option value="formatting">Formatting and structure</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="comment-input">
              <label htmlFor="feedback-comment">Comments (optional):</label>
              <textarea
                id="feedback-comment"
                value={feedback.comment || ''}
                onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your thoughts, suggestions, or corrections..."
                rows={4}
                maxLength={1000}
              />
              <div className="character-count">
                {feedback.comment?.length || 0}/1000
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="submit-btn"
                onClick={handleCommentSubmission}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
              
              <button 
                className="skip-btn"
                onClick={() => handleCommentSubmission()}
              >
                Skip & Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'complete' && (
        <div className="feedback-complete">
          <div className="success-message">
            <span className="success-icon">✅</span>
            <div className="success-content">
              <h4>Thank you for your feedback!</h4>
              <p>
                {feedback.helpful 
                  ? "We're glad this article was helpful to you."
                  : "We appreciate your suggestions and will work to improve this content."
                }
              </p>
            </div>
          </div>
          
          {/* Development/testing only - remove in production */}
          {import.meta.env.DEV && (
            <button 
              className="reset-feedback"
              onClick={handleResetFeedback}
              title="Reset feedback (development only)"
            >
              Reset Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleFeedback;
