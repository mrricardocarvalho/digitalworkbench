# SEO & Favicon Setup Instructions

## Favicon Files Needed

You'll need to create the following favicon files and place them in the `/public` directory:

### Required Files:

1. **favicon.svg** ✅ (Already created)
   - Modern SVG favicon for browsers that support it
   - Located: `/public/favicon.svg`

2. **favicon.png** ❌ (Need to create)
   - Size: 192x192 pixels
   - Format: PNG with transparent background
   - Used for: Modern browsers, PWA icon

3. **apple-touch-icon.png** ❌ (Need to create)
   - Size: 180x180 pixels
   - Format: PNG
   - Used for: iOS home screen icon, Safari bookmarks

4. **og-image.jpg** ❌ (Need to create)
   - Size: 1200x630 pixels
   - Format: JPG or PNG
   - Used for: Social media sharing (LinkedIn, Twitter, Facebook)
   - Should contain: Your name, title, and maybe a professional photo

## How to Create These Files:

### Option 1: Use a Favicon Generator
1. Go to https://realfavicongenerator.net/
2. Upload a high-quality square image (at least 512x512px)
3. Download the generated files
4. Place them in `/public/` directory

### Option 2: Design Your Own
1. Create a square logo/icon design
2. Export in the required sizes
3. Use tools like Figma, Canva, or Photoshop

### Option 3: Use AI Tools
1. Use tools like DALL-E, Midjourney, or Canva AI
2. Generate a professional icon with your initials "RC"
3. Export in required formats

## Social Media Image (og-image.jpg)

Create a 1200x630 image that includes:
- Your name: "Ricardo Carvalho"
- Your title: "Senior Dynamics 365 Business Central Developer"
- Professional background or your photo
- Your brand colors (#007CF0 blue theme)

## Current SEO Features Implemented:

✅ **Meta Tags**
- Title, description, keywords
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Author information

✅ **Structured Data**
- Schema.org Person markup
- Job title and skills
- Professional information

✅ **Technical SEO**
- Robots.txt
- Sitemap.xml
- Canonical URLs
- Mobile viewport
- Theme colors

✅ **Performance**
- Preconnect to Google Fonts
- Web App Manifest (PWA ready)

✅ **Dynamic SEO Component**
- `SEO.tsx` component for page-specific meta tags
- Example implementation in ResumePage

## Next Steps:

1. Create the missing favicon files
2. Update the URLs in `index.html` to match your actual domain
3. Add your real social media links
4. Create the og-image.jpg for social sharing
5. Update Twitter handle in meta tags
6. Test social sharing with Facebook Debugger and Twitter Card Validator

## Testing Your SEO:

- **Google Search Console**: Submit your sitemap
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Rich Results Test**: https://search.google.com/test/rich-results
