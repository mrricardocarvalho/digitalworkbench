# Google Search Console Verification Guide

## Option 1: HTML File Verification (Recommended)
1. Google Search Console will provide a verification file (e.g., `google1234567890abcdef.html`)
2. Download this file and place it in the `/public` folder
3. Commit and push to GitHub
4. Wait for GitHub Pages to deploy (usually 1-2 minutes)
5. Click "Verify" in Google Search Console

## Option 2: HTML Tag Verification
1. Google will provide a meta tag like:
   ```html
   <meta name="google-site-verification" content="your-verification-code" />
   ```
2. Add this to the `<head>` section of your main HTML file
3. The SEO component can handle this automatically

## Option 3: Google Analytics Verification
If you have Google Analytics already set up, you can use that for verification.

## Option 4: Google Tag Manager Verification
If you use Google Tag Manager, you can verify through that.

## What Happens After Verification?
- Google will start crawling your site within 24-48 hours
- You can submit your sitemap: `https://mrricardocarvalho.github.io/digitalworkbench/sitemap.xml`
- Monitor indexing status and search performance
- Get insights on search queries and click-through rates

## Key Actions After Setup:
1. Submit sitemap in the "Sitemaps" section
2. Check "Coverage" to see indexed pages
3. Monitor "Performance" for search analytics
4. Use "URL Inspection" to test specific pages
