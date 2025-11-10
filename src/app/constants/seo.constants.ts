/**
 * SEO Configuration for SVG Generator Application
 */

export const SEO_CONFIG = {
  // Site Information
  SITE: {
    name: 'SVG Playground',
    title: 'SVG Generator - Create Beautiful Geometric Shapes & Patterns Online',
    description: 'Create stunning SVG graphics with our free online SVG generator. Design polygons, stars, spirals, and curved shapes with real-time preview. Export as SVG or PNG.',
    url: 'https://svg-playground.youmrabti.com',
    domain: 'svg-playground.youmrabti.com',
    email: 'contact@svg-playground.youmrabti.com',
    author: 'SVG Playground Team'
  },

  // Social Media
  SOCIAL: {
    twitter: '@svgplayground',
    facebook: 'svgplayground',
    linkedin: 'company/svg-playground',
    github: 'svg-playground'
  },

  // Keywords
  KEYWORDS: {
    primary: [
      'SVG generator',
      'online SVG creator', 
      'geometric shapes',
      'vector graphics',
      'polygon generator',
      'star creator',
      'spiral maker',
      'curved star',
      'SVG editor',
      'free design tool'
    ],
    secondary: [
      'SVG graphics',
      'vector design',
      'geometric patterns',
      'shape generator',
      'online design tool',
      'web graphics',
      'scalable vector graphics',
      'SVG creation',
      'design software',
      'graphics editor'
    ]
  },

  // Images
  IMAGES: {
    ogImage: '/assets/icons/apple-touch-icon.png',
    twitterImage: '/assets/icons/apple-touch-icon.png',
    logo: '/assets/icons/logo.svg',
    favicon: '/assets/icons/favicon.svg'
  },

  // Page-specific SEO
  PAGES: {
    home: {
      title: 'SVG Generator - Create Beautiful Geometric Shapes Online',
      description: 'Free online SVG generator with real-time preview. Create polygons, stars, spirals, and curved shapes. Customize colors, sizes, and export instantly.',
      keywords: 'SVG generator, online SVG creator, geometric shapes, free design tool'
    },
    generator: {
      title: 'SVG Generator Tool - Design Custom Vector Graphics',
      description: 'Professional SVG generator with advanced controls. Create custom geometric shapes with real-time preview. Export as SVG or PNG.',
      keywords: 'SVG generator tool, vector graphics editor, geometric design, online SVG maker'
    },
    gallery: {
      title: 'SVG Gallery - Examples & Templates',
      description: 'Browse beautiful SVG examples and templates. Get inspiration for your geometric designs and download ready-to-use SVG graphics.',
      keywords: 'SVG gallery, SVG examples, SVG templates, design inspiration'
    },
    help: {
      title: 'SVG Generator Help & Tutorials',
      description: 'Learn how to use our SVG generator. Complete tutorials, tips, and examples for creating stunning geometric shapes and patterns.',
      keywords: 'SVG help, SVG tutorial, SVG documentation, how to create SVG'
    }
  },

  // Schema.org structured data templates
  SCHEMAS: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'SVG Playground',
      'url': 'https://svg-playground.youmrabti.com',
      'logo': 'https://svg-playground.youmrabti.com/assets/icons/logo.svg',
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        'email': 'contact@svg-playground.youmrabti.com'
      },
      'sameAs': [
        'https://twitter.com/svgplayground',
        'https://github.com/svg-playground'
      ]
    },
    
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'SVG Playground',
      'url': 'https://svg-playground.youmrabti.com',
      'description': 'Create stunning SVG graphics with our free online SVG generator',
      'publisher': {
        '@type': 'Organization',
        'name': 'SVG Playground'
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://svg-playground.youmrabti.com/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    },

    webApplication: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'SVG Generator',
      'description': 'Create stunning SVG graphics with real-time preview',
      'url': 'https://svg-playground.youmrabti.com',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': [
        'Real-time SVG generation',
        'Multiple shape types',
        'Customizable parameters',
        'Export to SVG and PNG',
        'Responsive design',
        'Free to use'
      ]
    }
  },

  // Meta tag defaults
  META_DEFAULTS: {
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    googlebot: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#4CAF50',
    msapplicationTileColor: '#4CAF50',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default'
  },

  // Open Graph defaults
  OPEN_GRAPH: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SVG Playground',
    imageWidth: 1200,
    imageHeight: 630
  },

  // Twitter Card defaults
  TWITTER: {
    card: 'summary_large_image',
    site: '@svgplayground',
    creator: '@svgplayground'
  }
} as const;

/**
 * Get keywords string for meta tag
 */
export function getKeywordsString(additional: string[] = []): string {
  return [...SEO_CONFIG.KEYWORDS.primary, ...additional].join(', ');
}

/**
 * Generate page URL
 */
export function generatePageUrl(path: string): string {
  return `${SEO_CONFIG.SITE.url}${path.startsWith('/') ? path : '/' + path}`;
}

/**
 * Get image URL
 */
export function getImageUrl(imagePath: string): string {
  return `${SEO_CONFIG.SITE.url}${imagePath}`;
}

/**
 * Generate page title
 */
export function generatePageTitle(pageTitle?: string): string {
  return pageTitle ? 
    `${pageTitle} | ${SEO_CONFIG.SITE.name}` : 
    SEO_CONFIG.SITE.title;
}