import { Injectable } from '@angular/core';

export interface GisRendererParameters {
  sourceUrl: string;
  scalingFunction: 'min' | 'max' | 'width' | 'height';
  translateX: number;
  translateY: number;
  scale: number;
  strokeColor: string;
  strokeWidth: number;
  fillColors: string[];
  showBoundingBox: boolean;
  boundingBoxColor: string;
  viewBoxSize: number;
  useRandomColors: boolean;
}

export interface GeoJsonFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][][]; // Polygon coordinates: [[[lon, lat], ...]]
  };
  properties: any;
}

export interface GeoJsonData {
  type: string;
  bbox?: number[];
  features: GeoJsonFeature[];
}

export interface BoundingBox {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  centerX: number;
  centerY: number;
}

export const defaultGisParameters: GisRendererParameters = {
  sourceUrl: '',
  scalingFunction: 'min',
  translateX: 0,
  translateY: 0,
  scale: 1,
  strokeColor: '#333333',
  strokeWidth: 1,
  fillColors: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'],
  showBoundingBox: true,
  boundingBoxColor: '#FF0000',
  viewBoxSize: 600,
  useRandomColors: true,
};

@Injectable({
  providedIn: 'root'
})
export class GisRendererService {
  constructor() {}

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
   * Calculate bounding box from GeoJSON features
   * @param features Array of GeoJSON features
   * @returns Calculated bounding box
   */
  private calculateBoundingBox(features: GeoJsonFeature[]): BoundingBox {
    const bounds = features.reduce(
      (prev, curr) => {
        const coordinates = curr.geometry.coordinates[0][0];
        coordinates.forEach((point: number[]) => {
          if (point[0] < prev[0]) prev[0] = point[0]; // xMin
          if (point[0] > prev[2]) prev[2] = point[0]; // xMax
          if (point[1] < prev[1]) prev[1] = point[1]; // yMin
          if (point[1] > prev[3]) prev[3] = point[1]; // yMax
        });
        return prev;
      },
      [Infinity, Infinity, -Infinity, -Infinity]
    );

    return {
      xMin: bounds[0],
      yMin: bounds[1],
      xMax: bounds[2],
      yMax: bounds[3],
      centerX: (bounds[0] + bounds[2]) / 2,
      centerY: (bounds[1] + bounds[3]) / 2,
    };
  }

  /**
   * Generate rectangle points for bounding box
   * @param bbox Bounding box coordinates
   * @returns Rectangle points string
   */
  private generateRectanglePoints(bbox: number[]): string {
    const [xMin, yMin, xMax, yMax] = bbox;
    const halfX = (xMin + xMax) / 2;
    const halfY = (yMin + yMax) / 2;
    
    return [
      `${(xMin - halfX).toFixed(3)} ${(yMin - halfY).toFixed(3)}`,
      `${(xMin - halfX).toFixed(3)} ${(yMax - halfY).toFixed(3)}`,
      `${(xMax - halfX).toFixed(3)} ${(yMax - halfY).toFixed(3)}`,
      `${(xMax - halfX).toFixed(3)} ${(yMin - halfY).toFixed(3)}`,
    ].join(' ');
  }

  /**
   * Apply scaling function to determine scale factor
   * @param width Width scale
   * @param height Height scale
   * @param scalingFunction Scaling function type
   * @returns Scale factor
   */
  private applyScalingFunction(width: number, height: number, scalingFunction: string): number {
    switch (scalingFunction) {
      case 'min':
        return Math.min(width, height);
      case 'max':
        return Math.max(width, height);
      case 'width':
        return width;
      case 'height':
        return height;
      default:
        return Math.min(width, height);
    }
  }

  /**
   * Transform coordinates based on bounding box and scale
   * @param coordinates Original coordinates
   * @param boundingBox Bounding box information
   * @param scale Scale factor
   * @param translateX X translation
   * @param translateY Y translation
   * @returns Transformed coordinates
   */
  private transformCoordinates(
    coordinates: number[][],
    boundingBox: BoundingBox,
    scale: number,
    translateX: number,
    translateY: number
  ): number[][] {
    return coordinates.map(([x, y]) => [
      (x - boundingBox.centerX) * scale + translateX,
      -(y - boundingBox.centerY) * scale + translateY
    ]);
  }

  /**
   * Generate SVG paths from GeoJSON data
   * @param geoJsonData GeoJSON data
   * @param params Rendering parameters
   * @returns Array of SVG path elements
   */
  private generateGeoJsonPaths(geoJsonData: GeoJsonData, params: GisRendererParameters): string[] {
    const paths: string[] = [];
    
    // Calculate or use existing bounding box
    const bboxData = geoJsonData.bbox || this.calculateBoundingBox(geoJsonData.features);
    const boundingBox = Array.isArray(bboxData) 
      ? {
          xMin: bboxData[0],
          yMin: bboxData[1], 
          xMax: bboxData[2],
          yMax: bboxData[3],
          centerX: (bboxData[0] + bboxData[2]) / 2,
          centerY: (bboxData[1] + bboxData[3]) / 2
        }
      : bboxData as BoundingBox;

    // Calculate scale factors
    const dx = 280;
    const dy = 280;
    const widthScale = dx / (boundingBox.xMax - boundingBox.centerX);
    const heightScale = dy / (boundingBox.yMax - boundingBox.centerY);
    const scale = this.applyScalingFunction(widthScale, heightScale, params.scalingFunction) * params.scale;

    // Add bounding box if enabled
    if (params.showBoundingBox) {
      const bboxPoints = this.generateRectanglePoints([
        boundingBox.xMin,
        boundingBox.yMin,
        boundingBox.xMax,
        boundingBox.yMax
      ].map((coord, index) => index * scale + dx));
      
      paths.push(`
        <polygon 
          points="${bboxPoints}" 
          fill="none" 
          stroke="${params.boundingBoxColor}" 
          stroke-width="${params.strokeWidth}"
        />`);
    }

    // Process each feature
    geoJsonData.features.forEach((feature, index) => {
      const coordinates = feature.geometry.coordinates[0][0] as number[][];
      const transformedCoords = this.transformCoordinates(
        coordinates,
        boundingBox,
        scale,
        params.translateX,
        params.translateY
      );
      
      const pointsString = transformedCoords.map(coord => coord.join(',')).join(' ');
      
      // Determine fill color
      let fillColor: string;
      if (params.useRandomColors) {
        fillColor = this.getRandomColor();
      } else {
        fillColor = params.fillColors[index % params.fillColors.length];
      }
      
      paths.push(`
        <polygon 
          points="${pointsString}" 
          fill="${fillColor}" 
          stroke="${params.strokeColor}" 
          stroke-width="${params.strokeWidth}"
          opacity="0.8"
        />`);
    });

    return paths;
  }

  /**
   * Fetch GeoJSON data from URL
   * @param url URL to fetch from
   * @returns Promise resolving to GeoJSON data
   */
  async fetchGeoJsonData(url: string): Promise<GeoJsonData> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch GeoJSON data: ${error}`);
    }
  }

  /**
   * Generate complete GIS map SVG
   * @param params GIS rendering parameters
   * @returns Promise resolving to SVG string
   */
  async generateGisMap(params: GisRendererParameters): Promise<string> {
    try {
      const geoJsonData = await this.fetchGeoJsonData(params.sourceUrl);
      const paths = this.generateGeoJsonPaths(geoJsonData, params);
      return this.createSvgElement(paths, params);
    } catch (error) {
      return this.createErrorSvg(`Error loading GIS data: ${error}`);
    }
  }

  /**
   * Generate GIS map from provided GeoJSON data
   * @param geoJsonData GeoJSON data object
   * @param params GIS rendering parameters
   * @returns SVG string
   */
  generateGisMapFromData(geoJsonData: GeoJsonData, params: GisRendererParameters): string {
    const paths = this.generateGeoJsonPaths(geoJsonData, params);
    return this.createSvgElement(paths, params);
  }

  /**
   * Create complete SVG element
   * @param paths Array of path elements
   * @param params GIS parameters
   * @returns Complete SVG string
   */
  private createSvgElement(paths: string[], params: GisRendererParameters): string {
    const pathElements = paths.join('\n        ');

    return `
      <svg width="100%" height="100%" viewBox="${-params.viewBoxSize / 2} ${
        -params.viewBoxSize / 2
      } ${params.viewBoxSize} ${params.viewBoxSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#2196F3;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#FF9800;stop-opacity:0.6" />
          </linearGradient>
          <filter id="gisGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="gisShadow">
            <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.2)"/>
          </filter>
        </defs>
        <rect width="${params.viewBoxSize}" height="${params.viewBoxSize}" 
              x="${-params.viewBoxSize / 2}" y="${-params.viewBoxSize / 2}" 
              stroke="rgba(0,0,0,0.1)" fill="none" stroke-width="1" stroke-dasharray="5,5"/>
        <g filter="url(#gisShadow)">
          ${pathElements}
        </g>
      </svg>
    `;
  }

  /**
   * Create error SVG when data loading fails
   * @param errorMessage Error message to display
   * @returns Error SVG string
   */
  private createErrorSvg(errorMessage: string): string {
    return `
      <svg width="100%" height="100%" viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg">
        <rect x="-280" y="-280" width="560" height="560" fill="#ffebee" stroke="#f44336" stroke-width="2"/>
        <text x="0" y="-50" text-anchor="middle" fill="#f44336" font-size="18" font-weight="bold">
          GIS Loading Error
        </text>
        <text x="0" y="0" text-anchor="middle" fill="#666" font-size="12">
          ${errorMessage}
        </text>
        <text x="0" y="50" text-anchor="middle" fill="#999" font-size="10">
          Check the URL and try again
        </text>
      </svg>
    `;
  }

  /**
   * Validate GeoJSON data structure
   * @param data Data to validate
   * @returns True if valid GeoJSON
   */
  validateGeoJsonData(data: any): data is GeoJsonData {
    return data && 
           data.type === 'FeatureCollection' && 
           Array.isArray(data.features) &&
           data.features.every((feature: any) => 
             feature.geometry && 
             feature.geometry.coordinates &&
             Array.isArray(feature.geometry.coordinates)
           );
  }

  /**
   * Generate sample GeoJSON data for testing
   * @returns Sample GeoJSON data
   */
  generateSampleGeoJson(): GeoJsonData {
    return {
      type: 'FeatureCollection',
      bbox: [-2, -2, 2, 2],
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[
              [-1, -1], [-1, 1], [0, 1], [0, -1], [-1, -1]
            ]]]
          },
          properties: { name: 'Rectangle 1' }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[
              [0, -1], [0, 1], [1, 1], [1, -1], [0, -1]
            ]]]
          },
          properties: { name: 'Rectangle 2' }
        }
      ]
    };
  }
}