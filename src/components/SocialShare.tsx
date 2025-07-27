import React, { useState } from 'react';
import { useAnalytics } from '../utils/analytics';
import './SocialShare.css';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

interface SharePlatform {
  name: string;
  icon: string;
  shareUrl: (url: string, title: string, description: string, hashtags: string[]) => string;
  color: string;
}

const shareButtons: SharePlatform[] = [
  {
    name: 'Twitter',
    icon: '𝕏',
    shareUrl: (url, title, _, hashtags) => {
      const text = `${title} ${hashtags.map(tag => `#${tag}`).join(' ')}`;
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    },
    color: '#1DA1F2'
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    shareUrl: (url, title, description) => {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    },
    color: '#0077B5'
  },
  {
    name: 'Facebook',
    icon: '📘',
    shareUrl: (url) => {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    },
    color: '#1877F2'
  },
  {
    name: 'Reddit',
    icon: '🤖',
    shareUrl: (url, title) => {
      return `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    },
    color: '#FF4500'
  },
  {
    name: 'Email',
    icon: '📧',
    shareUrl: (url, title, description) => {
      const subject = `Check out: ${title}`;
      const body = `${description}\n\nRead more: ${url}`;
      return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    },
    color: '#666666'
  }
];

export const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = document.title,
  description = '',
  hashtags = ['BusinessCentral', 'Dynamics365', 'Development'],
  className = '',
  showLabels = true,
  variant = 'default'
}) => {
  const [copied, setCopied] = useState(false);
  const { trackUserJourney } = useAnalytics();

  const handleShare = (platform: SharePlatform) => {
    const shareUrl = platform.shareUrl(url, title, description, hashtags);
    
    // Track sharing activity
    trackUserJourney('content_shared', {
      platform: platform.name.toLowerCase(),
      content_title: title,
      content_url: url
    });

    // Open share window
    if (platform.name === 'Email') {
      window.location.href = shareUrl;
    } else {
      window.open(
        shareUrl,
        'share-window',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Track copy action
      trackUserJourney('content_copied', {
        content_title: title,
        content_url: url
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const shareData = { title, text: description, url };
  const canShare = 'share' in navigator && 
                   'canShare' in navigator && 
                   navigator.canShare(shareData);

  const handleNativeShare = async () => {
    if (canShare) {
      try {
        await navigator.share(shareData);
        
        trackUserJourney('content_shared', {
          platform: 'native',
          content_title: title,
          content_url: url
        });
      } catch (err) {
        console.error('Native sharing failed:', err);
      }
    }
  };

  return (
    <div className={`social-share social-share--${variant} ${className}`}>
      <h4 className="social-share__title">Share this article</h4>
      
      <div className="social-share__buttons">
        {/* Native Share (mobile) */}
        {canShare && (
          <button
            className="social-share__button social-share__button--native"
            onClick={handleNativeShare}
            title="Share via device"
          >
            <span className="social-share__icon">📱</span>
            {showLabels && variant !== 'minimal' && (
              <span className="social-share__label">Share</span>
            )}
          </button>
        )}

        {/* Platform-specific sharing */}
        {shareButtons.map((platform) => (
          <button
            key={platform.name}
            className="social-share__button"
            onClick={() => handleShare(platform)}
            title={`Share on ${platform.name}`}
            style={{ '--platform-color': platform.color } as React.CSSProperties}
          >
            <span className="social-share__icon">{platform.icon}</span>
            {showLabels && variant !== 'minimal' && (
              <span className="social-share__label">{platform.name}</span>
            )}
          </button>
        ))}

        {/* Copy Link */}
        <button
          className={`social-share__button social-share__button--copy ${copied ? 'social-share__button--copied' : ''}`}
          onClick={copyToClipboard}
          title="Copy link to clipboard"
        >
          <span className="social-share__icon">{copied ? '✅' : '🔗'}</span>
          {showLabels && variant !== 'minimal' && (
            <span className="social-share__label">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
