import { Injectable } from '@angular/core';

export interface StarGeneratorParameters {
    noids: number;
    radius: number;
    minRadius: number;
    dx: number;
    dy: number;
    initialAngle: number;
    startVertex: number;
    nested: boolean;
    spinDuration: string | false;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    fillRule: 'evenodd' | 'nonzero';
    viewBoxSize: number;
}

export const defaultStarParameters: StarGeneratorParameters = {
    noids: 6,
    radius: 200,
    minRadius: 50,
    dx: 0,
    dy: 0,
    initialAngle: 90,
    startVertex: 0,
    nested: false,
    spinDuration: false,
    fillColor: '#4CAF50',
    strokeColor: '#333333',
    strokeWidth: 2,
    fillRule: 'evenodd',
    viewBoxSize: 600,
};

@Injectable({
    providedIn: 'root',
})
export class StarGeneratorService {
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
    starPoints(noids: number, r: number, dx: number, dy: number, initialAngle: number): number[][] {
        return [...Array(noids)].map((_, i) => {
            const angle = (360 / noids) * i - initialAngle;
            const angleRad = (angle * this.PI) / 180;
            const x = Math.cos(angleRad) * r + dx;
            const y = Math.sin(angleRad) * r + dy;
            return [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))];
        });
    }

    /**
     * Calculate step for star point connection
     * @param noids Number of points
     * @returns Step value
     */
    private calculateStep(noids: number): number {
        if (noids % 2 === 1) {
            return (noids - (noids % 2)) / 2;
        } else {
            return (noids - 1 - ((noids - 1) % 2)) / 2;
        }
    }

    /**
     * Create path from points with step calculation
     * @param points Array of coordinate pairs
     * @returns Array of processed points
     */
    private createPath(points: number[][]): number[][] {
        const step = this.calculateStep(points.length);
        const processedPoints: number[][] = [];
        let i = 0;
        let j = 0;

        while (j < points.length) {
            const point = [
                parseFloat(points[i % points.length][0].toString()),
                parseFloat(points[i % points.length][1].toString()),
            ];
            processedPoints.push(point);
            i += step;
            j++;
        }

        // Close the path
        const firstPoint = [
            parseFloat(points[0][0].toString()),
            parseFloat(points[0][1].toString()),
        ];
        processedPoints.push(firstPoint);

        return processedPoints;
    }

    /**
     * Generate star path data
     * @param noids Number of points
     * @param r Radius
     * @param dx X offset
     * @param dy Y offset
     * @param initial Initial angle
     * @returns Array of path arrays or single path array
     */
    generateStarPaths(
        noids: number,
        r: number,
        dx: number,
        dy: number,
        initial: number = 90
    ): number[][][] {
        const points = this.starPoints(noids, r, dx, dy, initial);

        if (noids % 4 === 2) {
            const even = points.filter((_, i) => i % 2 === 0);
            const odd = points.filter((_, i) => i % 2 === 1);
            return [this.createPath(even), this.createPath(odd)];
        }

        return [this.createPath(points)];
    }

    /**
     * Convert path points to SVG path string
     * @param pathPoints Array of path points
     * @returns SVG path string
     */
    pointsToPathString(pathPoints: number[][]): string {
        if (pathPoints.length === 0) return '';

        const firstPoint = pathPoints[0];
        let pathData = `M ${firstPoint[0]},${firstPoint[1]}`;

        for (let i = 1; i < pathPoints.length; i++) {
            pathData += ` L ${pathPoints[i][0]},${pathPoints[i][1]}`;
        }

        return pathData + ' Z';
    }

    /**
     * Calculate intersection of two lines for nested stars
     * @param noids Number of points
     * @param r Radius
     * @param dx X offset
     * @param dy Y offset
     * @param initial Initial angle
     * @param start Start point
     * @returns Intersection point
     */
    private calculateIntersection(
        noids: number,
        r: number,
        dx: number,
        dy: number,
        initial: number,
        start: number = 0
    ): { x: number; y: number } {
        const points = this.starPoints(noids, r, dx, dy, initial);
        const step = this.calculateStep(noids);

        const line1StartPoint = start % noids;
        const line1EndPoint = (start + step) % noids;
        const x1 = points[line1StartPoint][0];
        const y1 = points[line1StartPoint][1];
        const x2 = points[line1EndPoint][0];
        const y2 = points[line1EndPoint][1];

        const L1 = this.lineEquation(
            { x: parseFloat(x1.toString()), y: parseFloat(y1.toString()) },
            { x: parseFloat(x2.toString()), y: parseFloat(y2.toString()) }
        );

        const line2StartPoint = (start + 1) % noids;
        const line2EndPoint = (start + 1 + noids - step) % noids;
        const x3 = points[line2StartPoint][0];
        const y3 = points[line2StartPoint][1];
        const x4 = points[line2EndPoint][0];
        const y4 = points[line2EndPoint][1];

        const L2 = this.lineEquation(
            { x: parseFloat(x3.toString()), y: parseFloat(y3.toString()) },
            { x: parseFloat(x4.toString()), y: parseFloat(y4.toString()) }
        );

        return this.lineIntersection(L1, L2);
    }

    /**
     * Calculate line equation from two points
     * @param P1 First point
     * @param P2 Second point
     * @returns Line equation parameters
     */
    private lineEquation(
        P1: { x: number; y: number },
        P2: { x: number; y: number }
    ): { a: number; b: number } {
        return {
            a: (P1.y - P2.y) / (P1.x - P2.x),
            b: (P1.x * P2.y - P2.x * P1.y) / (P1.x - P2.x),
        };
    }

    /**
     * Calculate intersection of two lines
     * @param L1 First line equation
     * @param L2 Second line equation
     * @returns Intersection point
     */
    private lineIntersection(
        L1: { a: number; b: number },
        L2: { a: number; b: number }
    ): { x: number; y: number } {
        const q = (L2.b - L1.b) / (L1.a - L2.a);
        return {
            x: parseFloat(q.toFixed(2)),
            y: parseFloat((L1.a * q + L1.b).toFixed(2)),
        };
    }

    /**
     * Calculate radius from center point
     * @param pt Point coordinates
     * @param dx X center
     * @param dy Y center
     * @returns Radius
     */
    private calculateRadius(pt: { x: number; y: number }, dx: number, dy: number): number {
        return Math.sqrt((pt.x - dx) ** 2 + (pt.y - dy) ** 2);
    }

    /**
     * Generate random color
     * @returns Random hex color
     */
    private getRandomColor(): string {
        const colors = [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#DDA0DD',
            '#98D8C8',
            '#F7DC6F',
            '#BB8FCE',
            '#85C1E9',
            '#F8C471',
            '#82E0AA',
            '#F1948A',
            '#85C1E9',
            '#D2B4DE',
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
     * Generate complete star SVG
     * @param params Star generation parameters
     * @returns SVG string
     */
    generateStar(params: StarGeneratorParameters): string {
        const paths: string[] = [];
        let i = 0;
        let currentRadius = params.radius;

        while ((currentRadius > params.minRadius && params.noids > 4 && params.nested) || i < 1) {
            const alpha = (180 * i) / params.noids - params.initialAngle;
            const starPaths = this.generateStarPaths(
                params.noids,
                currentRadius,
                params.dx,
                params.dy,
                alpha
            );

            starPaths.forEach((pathPoints) => {
                const pathData = this.pointsToPathString(pathPoints);
                const randomColor = params.nested ? this.getRandomColor() : params.fillColor;
                paths.push(`
          <path 
            d="${pathData}" 
            fill="${randomColor}" 
            fill-rule="${params.fillRule}" 
            stroke="${params.strokeColor}" 
            stroke-width="${params.strokeWidth}"
            opacity="${0.8 + i * 0.1}"
          />`);
            });

            if (params.nested) {
                const intersectionPoint = this.calculateIntersection(
                    params.noids,
                    currentRadius,
                    params.dx,
                    params.dy,
                    params.initialAngle,
                    params.startVertex
                );
                currentRadius = this.calculateRadius(intersectionPoint, params.dx, params.dy);
            }
            i++;
        }

        return this.createSvgElement(paths, params);
    }

    /**
     * Create complete SVG element
     * @param paths Array of path elements
     * @param params Star parameters
     * @returns Complete SVG string
     */
    private createSvgElement(paths: string[], params: StarGeneratorParameters): string {
        const pathElements = paths.join('\n        ');
        const spinAnimation = params.spinDuration
            ? this.createSpinAnimation(params.spinDuration)
            : '';

        return `
      <svg width="100%" height="100%" viewBox="${-params.viewBoxSize / 2} ${
            -params.viewBoxSize / 2
        } ${params.viewBoxSize} ${params.viewBoxSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${params.fillColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.lightenColor(
                params.fillColor,
                40
            )};stop-opacity:0.8" />
          </linearGradient>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="${params.viewBoxSize}" height="${params.viewBoxSize}" 
              x="${-params.viewBoxSize / 2}" y="${-params.viewBoxSize / 2}" 
              stroke="rgba(0,0,0,0.1)" fill="none" stroke-width="1" stroke-dasharray="5,5"/>
        <g>
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
     * Generate artistic star variations
     * @param baseParams Base star parameters
     * @returns Array of SVG strings
     */
    generateStarVariations(baseParams: StarGeneratorParameters): string[] {
        const variations: string[] = [];

        // Variation 1: Multiple overlapping stars with different sizes
        const multiStarParams = {
            ...baseParams,
            fillColor: this.getRandomColor(),
            radius: baseParams.radius * 0.7,
            nested: true,
        };
        variations.push(this.generateStar(multiStarParams));

        // Variation 2: Different starting points for asymmetric patterns
        const asymmetricParams = {
            ...baseParams,
            startVertex: Math.floor(baseParams.noids / 3),
            fillColor: this.getRandomColor(),
        };
        variations.push(this.generateStar(asymmetricParams));

        // Variation 3: More points for complex patterns
        const complexParams = {
            ...baseParams,
            noids: baseParams.noids * 2,
            radius: baseParams.radius * 0.8,
            fillColor: this.getRandomColor(),
        };
        variations.push(this.generateStar(complexParams));

        return variations;
    }
}
