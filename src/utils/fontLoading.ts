/**
 * Font Loading Optimization
 * Implements font display strategies and preloading for better performance
 */

// Font loading strategies
type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

interface FontConfig {
  family: string;
  src: string[];
  weight?: string | number;
  style?: 'normal' | 'italic' | 'oblique';
  display?: FontDisplay;
  unicodeRange?: string;
  fallback?: string[];
}

interface FontLoadingOptions {
  timeout?: number;
  display?: FontDisplay;
  preload?: boolean;
}

class FontManager {
  private static instance: FontManager;
  private loadedFonts: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<FontFace[]>> = new Map();
  
  static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  /**
   * Preload critical fonts
   */
  preloadCriticalFonts(fonts: FontConfig[]): Promise<FontFace[][]> {
    return Promise.all(
      fonts.map(font => this.loadFont(font, { preload: true, display: 'swap' }))
    );
  }

  /**
   * Load a font with optimized strategy
   */
  async loadFont(config: FontConfig, options: FontLoadingOptions = {}): Promise<FontFace[]> {
    const fontKey = `${config.family}-${config.weight || 'normal'}-${config.style || 'normal'}`;
    
    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve([]);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey)!;
    }

    const loadPromise = this._loadFontImpl(config, options);
    this.loadingPromises.set(fontKey, loadPromise);

    try {
      const result = await loadPromise;
      this.loadedFonts.add(fontKey);
      this.loadingPromises.delete(fontKey);
      return result;
    } catch (error) {
      this.loadingPromises.delete(fontKey);
      throw error;
    }
  }

  private async _loadFontImpl(config: FontConfig, options: FontLoadingOptions): Promise<FontFace[]> {
    const { timeout = 3000, display = 'swap', preload = false } = options;
    
    const fontFaces: FontFace[] = [];

    for (const src of config.src) {
      try {
        // Create font face with proper descriptor type
        const descriptors: FontFaceDescriptors = {
          weight: config.weight?.toString() || 'normal',
          style: config.style || 'normal',
          display: display,
          ...(config.unicodeRange && { unicodeRange: config.unicodeRange })
        };
        const fontFace = new FontFace(config.family, `url(${src})`, descriptors);

        // Add preload link if requested
        if (preload) {
          this.addPreloadLink(src, config.family);
        }

        // Load with timeout
        const loadPromise = fontFace.load();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Font load timeout')), timeout);
        });

        await Promise.race([loadPromise, timeoutPromise]);
        
        // Add to document fonts
        document.fonts.add(fontFace);
        fontFaces.push(fontFace);
        
        console.log(`✅ Font loaded: ${config.family} from ${src}`);
        break; // Use first successful font

      } catch (error) {
        console.warn(`⚠️ Failed to load font from ${src}:`, error);
        // Continue to next source
      }
    }

    if (fontFaces.length === 0) {
      throw new Error(`Failed to load font: ${config.family}`);
    }

    return fontFaces;
  }

  /**
   * Add preload link for faster font loading
   */
  private addPreloadLink(href: string, fontFamily: string): void {
    // Check if preload link already exists
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = href;
    
    // Add font family for better debugging
    link.setAttribute('data-font-family', fontFamily);
    
    document.head.appendChild(link);
  }

  /**
   * Check if font is loaded
   */
  isFontLoaded(family: string, weight?: string | number, style?: string): boolean {
    const fontKey = `${family}-${weight || 'normal'}-${style || 'normal'}`;
    return this.loadedFonts.has(fontKey);
  }

  /**
   * Get font loading progress
   */
  getLoadingProgress(): number {
    const total = this.loadingPromises.size + this.loadedFonts.size;
    const loaded = this.loadedFonts.size;
    return total > 0 ? (loaded / total) * 100 : 100;
  }
}

/**
 * React hook for font loading
 */
export const useFontLoading = () => {
  // This will be implemented in a separate React hook file
  return { isLoading: false, loadedFonts: [], error: null };
};

/**
 * Critical font configurations for the application
 */
export const CRITICAL_FONTS: FontConfig[] = [
  {
    family: 'Inter',
    src: [
      '/digitalworkbench/fonts/inter-var.woff2',
      '/fonts/inter-regular.woff2',
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
    ],
    weight: '100 900',
    style: 'normal',
    display: 'swap',
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
  },
  {
    family: 'JetBrains Mono',
    src: [
      '/digitalworkbench/fonts/jetbrains-mono.woff2',
      'https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2'
    ],
    weight: '400',
    style: 'normal',
    display: 'swap',
    fallback: ['Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace']
  }
];

/**
 * Initialize font loading optimization
 */
export const initializeFontLoading = async (): Promise<void> => {
  const fontManager = FontManager.getInstance();
  
  try {
    // Preload critical fonts
    await fontManager.preloadCriticalFonts(CRITICAL_FONTS);
    console.log('✅ Critical fonts preloaded');
    
    // Add font display CSS if not present
    addFontDisplayCSS();
    
  } catch (error) {
    console.warn('⚠️ Some critical fonts failed to load:', error);
  }
};

/**
 * Add font-display CSS for better loading performance
 */
function addFontDisplayCSS(): void {
  const cssId = 'font-display-optimization';
  
  if (document.getElementById(cssId)) {
    return; // Already added
  }

  const css = `
    /* Font display optimization */
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('/digitalworkbench/fonts/inter-var.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'JetBrains Mono';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/digitalworkbench/fonts/jetbrains-mono.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* Fallback font optimization */
    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    code, pre, .font-mono {
      font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
    }

    /* Reduce layout shift during font loading */
    .font-loading {
      visibility: hidden;
    }

    .font-loaded {
      visibility: visible;
    }
  `;

  const style = document.createElement('style');
  style.id = cssId;
  style.textContent = css;
  document.head.appendChild(style);
}

export default FontManager;
