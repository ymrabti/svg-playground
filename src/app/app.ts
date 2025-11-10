import { Component, signal, OnInit } from '@angular/core';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'fat-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('SVG Generator');

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Initialize SEO with default data
    this.seoService.updateSEO();
    
    // Add application structured data
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'SVG Generator',
      'description': 'Create stunning SVG graphics with our free online SVG generator. Design polygons, stars, spirals, and curved shapes with real-time preview.',
      'url': 'https://svg-playground.youmrabti.com/',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'creator': {
        '@type': 'Organization',
        'name': 'SVG Playground'
      },
      'featureList': [
        'Real-time SVG generation',
        'Multiple shape types (polygons, stars, spirals, curved stars)',
        'Customizable parameters',
        'Export to SVG and PNG',
        'Responsive design',
        'Free to use'
      ]
    });
  }
}
