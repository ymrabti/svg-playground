import { Injectable } from '@angular/core';

export interface CurvedStarParameters {
    noids: number;
    radius: number;
    dx: number;
    dy: number;
    initialAngle: number;
    ray: number;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    fillRule: 'evenodd' | 'nonzero';
    viewBoxSize: number;
}

export const defaultCurvedStarParameters: CurvedStarParameters = {
    noids: 8,
    radius: 100,
    dx: 0,
    dy: 0,
    initialAngle: 0,
    ray: 200,
    fillColor: '#FF6B6B',
    strokeColor: 'transparent',
    strokeWidth: 1,
    fillRule: 'evenodd',
    viewBoxSize: 500,
};

@Injectable({
    providedIn: 'root',
})
export class CurvedStarService {
    private readonly PI = Math.PI;

    constructor() {}

    /**
     * Generate curved star points
     */
    starPoints(noids: number, r: number, dx: number, dy: number, initialAngle: number): number[][] {
        return [...Array(noids)].map((_, i) => {
            let angle = (360 / noids) * i - initialAngle;
            let angra = (angle * this.PI) / 180;
            let coss = Math.cos(angra) * r + dx;
            let sinn = Math.sin(angra) * r + dy;
            return [parseFloat(coss.toFixed(2)), parseFloat(sinn.toFixed(2))];
        });
    }

    /**
     * Create path with step calculation
     */
    createPath(points: number[][], separator: string = ' '): number[][] {
        const step = this.calculateStep(points.length);
        const resultPath: number[][] = [];
        let i = 0;
        let j = 0;

        while (j < points.length) {
            const currentPoint = points[i % points.length];
            const listFloat = [
                parseFloat(currentPoint[0].toString()),
                parseFloat(currentPoint[1].toString()),
            ];
            resultPath.push(listFloat);
            i += step;
            j++;
        }

        // Close the path by adding the first point
        const firstPoint = [
            parseFloat(points[0][0].toString()),
            parseFloat(points[0][1].toString()),
        ];
        resultPath.push(firstPoint);

        return resultPath;
    }

    /**
     * Calculate step for path creation
     */
    private calculateStep(length: number): number {
        if (length % 2 == 1) {
            return (length - (length % 2)) / 2;
        } else {
            return (length - 1 - ((length - 1) % 2)) / 2;
        }
    }

    /**
     * Draw curved star path
     */
    drawCurvedStar(
        points: number[][],
        rayFunction: (i: number) => number = () => 1,
        ray: number,
        fillRule: string,
        fillColor: string
    ): string {
        const curveStar = this.createPath(points, ',');
        let curvePath = ['M', curveStar[0][0].toString(), curveStar[0][1].toString()];

        curveStar.forEach((val, ind) => {
            if (ind !== 0) {
                const ry = rayFunction(ind);
                curvePath = curvePath.concat([
                    'A',
                    ray.toString(),
                    ray.toString(),
                    '0',
                    '0',
                    ry.toString(),
                    val[0].toString(),
                    val[1].toString(),
                ]);
            }
        });

        return curvePath.join(' ');
    }

    /**
     * Generate curved star SVG
     */
    generateCurvedStar(params: CurvedStarParameters): string {
        const points = this.starPoints(
            params.noids,
            params.radius,
            params.dx,
            params.dy,
            params.initialAngle
        );

        if (params.noids % 4 === 2) {
            // Split into even and odd points for certain star configurations
            const evenPoints = points.filter((_, i) => i % 2 === 0);
            const oddPoints = points.filter((_, i) => i % 2 === 1);

            const evenPath = this.drawCurvedStar(
                evenPoints,
                () => 1,
                params.ray,
                params.fillRule,
                params.fillColor
            );
            const oddPath = this.drawCurvedStar(
                oddPoints,
                () => 1,
                params.ray,
                params.fillRule,
                params.fillColor
            );

            return this.createSvgElement([evenPath, oddPath], params);
        } else {
            const path = this.drawCurvedStar(
                points,
                (i) => 1 - (i % 2),
                params.ray,
                params.fillRule,
                params.fillColor
            );
            return this.createSvgElement([path], params);
        }
    }

    /**
     * Create complete SVG element
     */
    private createSvgElement(paths: string[], params: CurvedStarParameters): string {
        const pathElements = paths
            .map(
                (pathData, index) =>
                    `<path 
        d="${pathData}" 
        fill="${params.fillColor}" 
        fill-rule="${params.fillRule}" 
        stroke="${params.strokeColor}" 
        stroke-width="${params.strokeWidth}"
        opacity="${0.8 + index * 0.1}"
      />`
            )
            .join('\n        ');

        return `
      <svg width="100%" height="100%" viewBox="${-params.viewBoxSize / 2} ${
            -params.viewBoxSize / 2
        } ${params.viewBoxSize} ${params.viewBoxSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="curvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${params.fillColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.lightenColor(
                params.fillColor,
                40
            )};stop-opacity:0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="${params.viewBoxSize}" height="${params.viewBoxSize}" x="${
            -params.viewBoxSize / 2
        }" y="${-params.viewBoxSize / 2}" 
              stroke="rgba(0,0,0,0.1)" fill="none" stroke-width="1" stroke-dasharray="5,5"/>
        ${pathElements}
      </svg>
    `;
    }

    /**
     * Generate random color
     */
    getRandomColor(): string {
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
     * Lighten a color by a percentage
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
     * Create artistic variations of curved stars
     */
    generateArtisticVariations(baseParams: CurvedStarParameters): string[] {
        const variations: string[] = [];

        // Variation 1: Multiple overlapping stars with different sizes
        const multiStarParams = {
            ...baseParams,
            fillColor: this.getRandomColor(),
            radius: baseParams.radius * 0.7,
        };
        variations.push(this.generateCurvedStar(multiStarParams));

        // Variation 2: Different ray values for more organic curves
        const organicParams = {
            ...baseParams,
            ray: baseParams.ray * 1.5,
            fillColor: this.getRandomColor(),
        };
        variations.push(this.generateCurvedStar(organicParams));

        // Variation 3: More points for complex patterns
        const complexParams = {
            ...baseParams,
            noids: baseParams.noids * 2,
            radius: baseParams.radius * 0.8,
            fillColor: this.getRandomColor(),
        };
        variations.push(this.generateCurvedStar(complexParams));

        return variations;
    }
}
