import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultSEO: SEOData = {
    title: 'SVG Generator - Create Beautiful Geometric Shapes & Patterns Online',
    description: 'Create stunning SVG graphics with our free online SVG generator. Design polygons, stars, spirals, and curved shapes with real-time preview. Export as SVG or PNG.',
    keywords: 'SVG generator, online SVG creator, geometric shapes, vector graphics, polygon generator, star creator, spiral maker, curved star, SVG editor, free design tool',
    image: 'https://svg-playground.com/assets/images/og-preview.png',
    url: 'https://svg-playground.com/',
    type: 'website',
    author: 'SVG Playground'
  };

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {
    // Update SEO data on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateSEOForRoute(event.urlAfterRedirects);
    });
  }

  /**
   * Update all SEO meta tags
   */
  updateSEO(data: Partial<SEOData> = {}): void {
    const seoData = { ...this.defaultSEO, ...data };
    
    // Update title
    if (seoData.title) {
      this.title.setTitle(seoData.title);
    }

    // Update basic meta tags
    this.updateOrCreateMeta('description', seoData.description);
    this.updateOrCreateMeta('keywords', seoData.keywords);
    this.updateOrCreateMeta('author', seoData.author);
    this.updateOrCreateMeta('robots', 'index, follow');

    // Update Open Graph tags
    this.updateOrCreateProperty('og:title', seoData.title);
    this.updateOrCreateProperty('og:description', seoData.description);
    this.updateOrCreateProperty('og:image', seoData.image);
    this.updateOrCreateProperty('og:url', seoData.url);
    this.updateOrCreateProperty('og:type', seoData.type);
    this.updateOrCreateProperty('og:site_name', 'SVG Playground');

    // Update Twitter tags
    this.updateOrCreateProperty('twitter:card', 'summary_large_image');
    this.updateOrCreateProperty('twitter:title', seoData.title);
    this.updateOrCreateProperty('twitter:description', seoData.description);
    this.updateOrCreateProperty('twitter:image', seoData.image);

    // Update canonical URL
    this.updateCanonicalUrl(seoData.url || window.location.href);
  }

  /**
   * Update SEO for specific routes
   */
  private updateSEOForRoute(url: string): void {
    const baseUrl = 'https://svg-playground.com';
    
    switch (true) {
      case url === '/' || url === '/generator':
        this.updateSEO({
          title: 'SVG Generator - Create Beautiful Geometric Shapes Online',
          description: 'Design and create stunning SVG graphics with real-time preview. Generate polygons, stars, spirals, and curved shapes. Free online SVG creator and editor.',
          url: `${baseUrl}${url}`,
          keywords: 'SVG generator, online SVG creator, geometric shapes, vector graphics, design tool'
        });
        break;
        
      case url.includes('/gallery'):
        this.updateSEO({
          title: 'SVG Gallery - Inspiring Examples & Templates',
          description: 'Browse beautiful SVG examples and templates created with our generator. Get inspiration for your geometric designs and patterns.',
          url: `${baseUrl}${url}`,
          keywords: 'SVG gallery, SVG examples, SVG templates, design inspiration'
        });
        break;
        
      case url.includes('/help'):
        this.updateSEO({
          title: 'SVG Generator Help & Documentation',
          description: 'Learn how to use our SVG generator. Complete guide with tutorials, tips, and examples for creating geometric shapes and patterns.',
          url: `${baseUrl}${url}`,
          keywords: 'SVG help, SVG tutorial, how to create SVG, SVG documentation'
        });
        break;
        
      default:
        this.updateSEO({
          url: `${baseUrl}${url}`
        });
    }
  }

  /**
   * Update meta tag with name attribute
   */
  private updateOrCreateMeta(name: string, content?: string): void {
    if (!content) return;
    
    if (this.meta.getTag(`name="${name}"`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  /**
   * Update meta tag with property attribute
   */
  private updateOrCreateProperty(property: string, content?: string): void {
    if (!content) return;
    
    if (this.meta.getTag(`property="${property}"`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  /**
   * Get current page title
   */
  getTitle(): string {
    return this.title.getTitle();
  }

  /**
   * Add structured data (JSON-LD)
   */
  addStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbs(items: Array<{ name: string; url: string }>): void {
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };

    this.addStructuredData(breadcrumbs);
  }

  /**
   * Update SEO for social sharing
   */
  updateSocialSharing(data: {
    title: string;
    description: string;
    image: string;
    url: string;
  }): void {
    this.updateSEO({
      title: data.title,
      description: data.description,
      image: data.image,
      url: data.url
    });
  }

  /**
   * Set meta tag for specific content
   */
  setMetaTag(name: string, content: string): void {
    this.updateOrCreateMeta(name, content);
  }

  /**
   * Remove meta tag
   */
  removeMetaTag(name: string): void {
    const tag = this.meta.getTag(`name="${name}"`);
    if (tag) {
      this.meta.removeTag(`name="${name}"`);
    }
  }

  /**
   * Get default SEO data
   */
  getDefaultSEO(): SEOData {
    return { ...this.defaultSEO };
  }
}