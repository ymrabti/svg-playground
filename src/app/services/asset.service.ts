import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface SvgPreset {
  name: string;
  description: string;
  shape: string;
  parameters: any;
}

export interface AssetPaths {
  icons: {
    star: string;
    circle: string;
    polygon: string;
    spiral: string;
    curvedStar: string;
    copy: string;
    download: string;
    refresh: string;
    palette: string;
  };
  data: {
    presets: string;
    colorPalette: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  
  private readonly assetPaths: AssetPaths = {
    icons: {
      star: 'assets/icons/star.svg',
      circle: 'assets/icons/circle.svg',
      polygon: 'assets/icons/polygon.svg',
      spiral: 'assets/icons/spiral.svg',
      curvedStar: 'assets/icons/curved-star.svg',
      copy: 'assets/icons/copy.svg',
      download: 'assets/icons/download.svg',
      refresh: 'assets/icons/refresh.svg',
      palette: 'assets/icons/palette.svg'
    },
    data: {
      presets: 'assets/data/svg-presets.json',
      colorPalette: 'assets/data/color-palette.json'
    }
  };

  constructor(private http: HttpClient) {}

  /**
   * Get SVG icon path by name
   */
  getIconPath(iconName: keyof AssetPaths['icons']): string {
    return this.assetPaths.icons[iconName];
  }

  /**
   * Load SVG presets from assets
   */
  loadSvgPresets(): Observable<SvgPreset[]> {
    return this.http.get<SvgPreset[]>(this.assetPaths.data.presets).pipe(
      catchError(error => {
        console.error('Failed to load SVG presets:', error);
        return of([]);
      })
    );
  }

  /**
   * Load color palette from assets
   */
  loadColorPalette(): Observable<string[]> {
    return this.http.get<string[]>(this.assetPaths.data.colorPalette).pipe(
      catchError(error => {
        console.error('Failed to load color palette:', error);
        return of([
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
          '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ]);
      })
    );
  }

  /**
   * Load SVG icon content
   */
  loadSvgIcon(iconName: keyof AssetPaths['icons']): Observable<string> {
    const iconPath = this.getIconPath(iconName);
    return this.http.get(iconPath, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error(`Failed to load icon ${iconName}:`, error);
        return of('<svg></svg>');
      })
    );
  }

  /**
   * Get all available asset paths
   */
  getAssetPaths(): AssetPaths {
    return { ...this.assetPaths };
  }

  /**
   * Validate if asset exists (basic check)
   */
  validateAssetPath(path: string): Observable<boolean> {
    return this.http.head(path).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Get asset URL for dynamic loading
   */
  getAssetUrl(relativePath: string): string {
    return `assets/${relativePath}`;
  }

  /**
   * Helper method to get random preset
   */
  getRandomPreset(): Observable<SvgPreset | null> {
    return this.loadSvgPresets().pipe(
      map(presets => {
        if (presets.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * presets.length);
        return presets[randomIndex];
      })
    );
  }

  /**
   * Helper method to get preset by shape type
   */
  getPresetsByShape(shape: string): Observable<SvgPreset[]> {
    return this.loadSvgPresets().pipe(
      map(presets => presets.filter(preset => preset.shape === shape))
    );
  }

  /**
   * Save user-created preset (would typically save to backend/localStorage)
   */
  saveCustomPreset(preset: SvgPreset): void {
    const customPresets = this.getCustomPresets();
    customPresets.push(preset);
    localStorage.setItem('svg-custom-presets', JSON.stringify(customPresets));
  }

  /**
   * Load custom presets from localStorage
   */
  loadCustomPresets(): Observable<SvgPreset[]> {
    const customPresets = this.getCustomPresets();
    return of(customPresets);
  }

  /**
   * Get custom presets from localStorage
   */
  private getCustomPresets(): SvgPreset[] {
    try {
      const stored = localStorage.getItem('svg-custom-presets');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load custom presets:', error);
      return [];
    }
  }

  /**
   * Delete custom preset
   */
  deleteCustomPreset(presetName: string): void {
    const customPresets = this.getCustomPresets();
    const filtered = customPresets.filter(preset => preset.name !== presetName);
    localStorage.setItem('svg-custom-presets', JSON.stringify(filtered));
  }
}