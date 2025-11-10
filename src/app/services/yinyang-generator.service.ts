import { Injectable } from '@angular/core';

export interface YinYangParameters {
  noids: number;
  radius: number;
  dx: number;
  dy: number;
  initialAngle: number;
  spinDuration: string | false;
  baseColor: string;
  strokeColor: string;
  strokeWidth: number;
  useGradient: boolean;
  viewBoxSize: number;
}

export const defaultYinYangParameters: YinYangParameters = {
  noids: 8,
  radius: 200,
  dx: 0,
  dy: 0,
  initialAngle: 0,
  spinDuration: false,
  baseColor: '#FF6B6B',
  strokeColor: '#333333',
  strokeWidth: 2,
  useGradient: true,
  viewBoxSize: 600,
};

@Injectable({
  providedIn: 'root'
})
export class YinYangGeneratorService {
  private readonly PI = Math.PI;

  constructor() {}

  /**
   * Generate star points coordinates
   * @param noids Number of points
   * @param r Radius
   * @param dx X offset
   * @param dy Y offset
   * @param initialAngle Initial angle in degrees
   * @returns Array of star points
   */
  private starPoints(noids: number, r: number, dx: number, dy: number, initialAngle: number): number[][] {
    return [...Array(noids)].map((_, i) => {
      const angle = (360 / noids) * i - initialAngle;
      const angleRad = (angle * this.PI) / 180;
      const x = Math.cos(angleRad) * r + dx;
      const y = Math.sin(angleRad) * r + dy;
      return [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))];
    });
  }

  /**
   * Generate gradient colors between two colors
   * @param n Number of colors to generate
   * @param color1 Start color (hex)
   * @param color2 End color (hex)
   * @returns Array of hex colors
   */
  private gradientColors(n: number, color1: string, color2: string): string[] {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    const colors: string[] = [];

    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
      const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
      const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
      colors.push(this.rgbToHex([r, g, b]));
    }

    return colors;
  }

  /**
   * Convert hex color to RGB array
   * @param hex Hex color string
   * @returns RGB array [r, g, b]
   */
  private hexToRgb(hex: string): number[] {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const int = parseInt(hex, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  }

  /**
   * Convert RGB array to hex color
   * @param rgb RGB array [r, g, b]
   * @returns Hex color string
   */
  private rgbToHex([r, g, b]: number[]): string {
    return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Reverse/invert a hex color
   * @param hex Hex color string
   * @returns Inverted hex color
   */
  private reverseColor(hex: string): string {
    hex = hex.replace('#', '');
    const r = (255 - parseInt(hex.substring(0, 2), 16)).toString(16).padStart(2, '0');
    const g = (255 - parseInt(hex.substring(2, 4), 16)).toString(16).padStart(2, '0');
    const b = (255 - parseInt(hex.substring(4, 6), 16)).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  /**
   * Generate random color
   * @returns Random hex color
   */
  private getRandomColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Create spin animation element
   * @param duration Animation duration
   * @returns Animation element string
   */
  private createSpinAnimation(duration: string): string {
    return `<animateTransform
      attributeName="transform"
      type="rotate"
      values="0 0 0;360 0 0"
      dur="${duration}"
      repeatCount="indefinite"
    />`;
  }

  /**
   * Generate YinYang pattern paths
   * @param params YinYang parameters
   * @returns Array of path elements
   */
  private generateYinYangPaths(params: YinYangParameters): string[] {
    const paths: string[] = [];
    const points = this.starPoints(params.noids, params.radius, params.dx, params.dy, params.initialAngle);
    const rotatedPoints = this.starPoints(params.noids, 0, params.dx, params.dy, 45);
    
    // Use fillColor as the base yin color instead of random color
    const yinColor = params.baseColor;
    const yangColor = this.reverseColor(yinColor);
    const gradientColors = this.gradientColors(params.noids, yinColor, yangColor);

    // Main circle
    paths.push(`
      <circle 
        cx="${params.dx}" 
        cy="${params.dy}" 
        r="${params.radius}" 
        fill="orange" 
        stroke="${params.strokeColor}" 
        stroke-width="${params.strokeWidth}"
      />`);

    // YinYang pattern paths
    points.forEach((point, index) => {
      const color = gradientColors[index];
      const rj = params.radius / 2;
      const nextIndex = (index + 1) % params.noids;
      
      const fMove = `M${point.join(' ')}A${rj} ${rj} 0 0 1 `;
      let d = `${fMove}${rotatedPoints[index].join(' ')} M${rotatedPoints[nextIndex].join(' ')}`;
      d += `A${rj} ${rj} 0 0 0 ${points[nextIndex].join(' ')}`;
      d += `A${-1 * params.radius} ${-1 * params.radius} 0 0 0 ${point.join(' ')}`;
      
      paths.push(`
        <path 
          d="${d}" 
          fill="${color}" 
          stroke="${color}" 
          stroke-width="${params.strokeWidth}"
        />`);
    });

    // Small circles at star points
    points.forEach((point, index) => {
      const color = gradientColors[index];
      paths.push(`
        <circle 
          cx="${point[0] / 2}" 
          cy="${point[1] / 2}" 
          r="${params.radius * 0.25}" 
          fill="${color}" 
          stroke="${params.strokeColor}" 
          stroke-width="${params.strokeWidth}"
        />`);
    });

    return paths;
  }

  /**
   * Generate complete YinYang SVG
   * @param params YinYang generation parameters
   * @returns SVG string
   */
  generateYinYang(params: YinYangParameters): string {
    const paths = this.generateYinYangPaths(params);
    return this.createSvgElement(paths, params);
  }

  /**
   * Create complete SVG element
   * @param paths Array of path elements
   * @param params YinYang parameters
   * @returns Complete SVG string
   */
  private createSvgElement(paths: string[], params: YinYangParameters): string {
    const pathElements = paths.join('\n        ');
    const spinAnimation = params.spinDuration ? this.createSpinAnimation(params.spinDuration) : '';

    return `
      <svg width="100%" height="100%" viewBox="${-params.viewBoxSize / 2} ${
        -params.viewBoxSize / 2
      } ${params.viewBoxSize} ${params.viewBoxSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="yinyangGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${params.baseColor};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${this.reverseColor(params.baseColor)};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${this.lightenColor(
              params.baseColor,
              40
            )};stop-opacity:0.6" />
          </linearGradient>
          <filter id="yinyangGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="yinyangShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <rect width="${params.viewBoxSize}" height="${params.viewBoxSize}" 
              x="${-params.viewBoxSize / 2}" y="${-params.viewBoxSize / 2}" 
              stroke="rgba(0,0,0,0.1)" fill="none" stroke-width="1" stroke-dasharray="5,5"/>
        <g filter="url(#yinyangShadow)">
          ${pathElements}
          ${spinAnimation}
        </g>
      </svg>
    `;
  }

  /**
   * Lighten a color by a percentage
   * @param color Hex color string
   * @param percent Percentage to lighten
   * @returns Lightened color
   */
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  /**
   * Generate artistic YinYang variations
   * @param baseParams Base YinYang parameters
   * @returns Array of SVG strings
   */
  generateYinYangVariations(baseParams: YinYangParameters): string[] {
    const variations: string[] = [];

    // Variation 1: More segments for complex patterns
    const complexParams = {
      ...baseParams,
      noids: baseParams.noids * 2,
      baseColor: this.getRandomColor(),
      radius: baseParams.radius * 0.8,
    };
    variations.push(this.generateYinYang(complexParams));

    // Variation 2: Different base color
    const colorVariationParams = {
      ...baseParams,
      baseColor: this.getRandomColor(),
      useGradient: true,
    };
    variations.push(this.generateYinYang(colorVariationParams));

    // Variation 3: Smaller with spin
    const spinVariationParams = {
      ...baseParams,
      radius: baseParams.radius * 0.6,
      spinDuration: '3s',
      baseColor: this.getRandomColor(),
    };
    variations.push(this.generateYinYang(spinVariationParams));

    return variations;
  }
}