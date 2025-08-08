/**
 * Environment configuration for SEO and verification
 * Add your verification codes here once you get them from search engines
 */

export const seoConfig = {
  // Google Search Console verification code
  // Get this from Google Search Console > Property > Settings > Verification
  googleSiteVerification: import.meta.env['VITE_GOOGLE_SITE_VERIFICATION'] || '',
  
  // Bing Webmaster Tools verification code  
  // Get this from Bing Webmaster Tools > Site Settings > Verify your site
  bingVerification: import.meta.env['VITE_BING_VERIFICATION'] || '',
  
  // Base site configuration
  siteUrl: import.meta.env['VITE_SITE_URL'] || 'https://mrricardocarvalho.github.io/digitalworkbench',
  siteName: 'Ricardo Carvalho - Digital Workbench',
  
  // Default social media accounts
  social: {
    twitter: '@ricardocarvalho',
    linkedin: 'https://www.linkedin.com/in/ricardo-carvalho-05741519',
    github: 'https://github.com/mrricardocarvalho'
  }
};

export default seoConfig;
