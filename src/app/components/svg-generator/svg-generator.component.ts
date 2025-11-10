import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgParametersComponent } from '../svg-parameters/svg-parameters.component';
import { SvgPreviewComponent } from '../svg-preview/svg-preview.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-svg-generator',
  templateUrl: './svg-generator.component.html',
  styleUrls: ['./svg-generator.component.scss'],
  standalone: true,
  imports: [CommonModule, SvgParametersComponent, SvgPreviewComponent]
})
export class SvgGeneratorComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Update SEO for the generator page
    this.seoService.updateSEO({
      title: 'SVG Generator - Create Custom Geometric Shapes Online',
      description: 'Professional SVG generator with real-time preview. Create polygons, stars, spirals, and curved shapes. Customize colors, sizes, and export as SVG or PNG.',
      keywords: 'SVG generator, geometric shapes, online design tool, vector graphics editor, polygon creator, star generator'
    });

    // Add breadcrumbs
    this.seoService.generateBreadcrumbs([
      { name: 'Home', url: 'https://svg-playground.com/' },
      { name: 'SVG Generator', url: 'https://svg-playground.com/generator' }
    ]);
  }
}