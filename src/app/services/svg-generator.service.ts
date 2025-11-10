import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurvedStarService } from './curved-star.service';

export interface SvgParameters {
    edgeCount: number;
    angle: number;
    size: number;
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
    centerX: number;
    centerY: number;
    shape: 'polygon' | 'star' | 'circle' | 'spiral' | 'curved-star';
    innerRadius?: number; // for star shape
    spiralTurns?: number; // for spiral shape
    curvedRay?: number; // for curved star
    curvedNoids?: number; // for curved star points
}

export const defaultSvgParameters: SvgParameters = {
    edgeCount: 6,
    angle: 0,
    size: 100,
    strokeWidth: 2,
    strokeColor: '#333333',
    fillColor: '#4CAF50',
    centerX: 0,
    centerY: 0,
    shape: 'curved-star',
    innerRadius: 50,
    spiralTurns: 3,
    curvedRay: 200,
    curvedNoids: 8,
};

@Injectable({
    providedIn: 'root',
})
export class SvgGeneratorService {
    private parametersSubject = new BehaviorSubject<SvgParameters>(defaultSvgParameters);
    public parameters$ = this.parametersSubject.asObservable();

    constructor(private curvedStarService: CurvedStarService) {}

    updateParameters(parameters: Partial<SvgParameters>): void {
        const currentParams = this.parametersSubject.value;
        const newParams = { ...currentParams, ...parameters };
        this.parametersSubject.next(newParams);
    }

    getCurrentParameters(): SvgParameters {
        return this.parametersSubject.value;
    }

    generateSvgPath(): string {
        const params = this.getCurrentParameters();

        switch (params.shape) {
            case 'polygon':
                return this.generatePolygon(params);
            case 'star':
                return this.generateStar(params);
            case 'circle':
                return this.generateCircle(params);
            case 'spiral':
                return this.generateSpiral(params);
            case 'curved-star':
                return this.generateCurvedStar(params);
            default:
                return this.generatePolygon(params);
        }
    }

    private generatePolygon(params: SvgParameters): string {
        const points: string[] = [];
        const angleStep = (2 * Math.PI) / params.edgeCount;
        const startAngle = (params.angle * Math.PI) / 180;

        for (let i = 0; i < params.edgeCount; i++) {
            const angle = startAngle + i * angleStep;
            const x = params.centerX + params.size * Math.cos(angle);
            const y = params.centerY + params.size * Math.sin(angle);
            points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
        }

        return `M ${points[0]} L ${points.slice(1).join(' L ')} Z`;
    }

    private generateStar(params: SvgParameters): string {
        const points: string[] = [];
        const outerRadius = params.size;
        const innerRadius = params.innerRadius || params.size * 0.5;
        const angleStep = Math.PI / params.edgeCount;
        const startAngle = (params.angle * Math.PI) / 180;

        for (let i = 0; i < params.edgeCount * 2; i++) {
            const angle = startAngle + i * angleStep;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = params.centerX + radius * Math.cos(angle);
            const y = params.centerY + radius * Math.sin(angle);
            points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
        }

        return `M ${points[0]} L ${points.slice(1).join(' L ')} Z`;
    }

    private generateCircle(params: SvgParameters): string {
        return `M ${params.centerX - params.size},${params.centerY} 
            A ${params.size},${params.size} 0 1,1 ${params.centerX + params.size},${params.centerY} 
            A ${params.size},${params.size} 0 1,1 ${params.centerX - params.size},${
            params.centerY
        } Z`;
    }

    private generateSpiral(params: SvgParameters): string {
        const points: string[] = [];
        const turns = params.spiralTurns || 3;
        const steps = turns * 20; // 20 points per turn
        const maxRadius = params.size;
        const startAngle = (params.angle * Math.PI) / 180;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const angle = startAngle + progress * turns * 2 * Math.PI;
            const radius = maxRadius * progress;
            const x = params.centerX + radius * Math.cos(angle);
            const y = params.centerY + radius * Math.sin(angle);

            if (i === 0) {
                points.push(`M ${x.toFixed(2)},${y.toFixed(2)}`);
            } else {
                points.push(`L ${x.toFixed(2)},${y.toFixed(2)}`);
            }
        }

        return points.join(' ');
    }

    private generateCurvedStar(params: SvgParameters): string {
        const curvedParams = {
            noids: params.curvedNoids || params.edgeCount || 8,
            radius: params.size,
            dx: params.centerX,
            dy: params.centerY,
            initialAngle: params.angle,
            ray: params.curvedRay || 200,
            fillColor: params.fillColor,
            strokeColor: params.strokeColor,
            strokeWidth: params.strokeWidth,
            fillRule: 'evenodd' as const,
            viewBoxSize: 500,
        };

        const points = this.curvedStarService.starPoints(
            curvedParams.noids,
            curvedParams.radius,
            curvedParams.dx,
            curvedParams.dy,
            curvedParams.initialAngle
        );

        return this.curvedStarService.drawCurvedStar(
            points,
            () => 1,
            curvedParams.ray,
            curvedParams.fillRule,
            curvedParams.fillColor
        );
    }

    generateSvgElement(): string {
        const params = this.getCurrentParameters();

        // Special handling for curved stars
        if (params.shape === 'curved-star') {
            const curvedParams = {
                noids: params.curvedNoids || params.edgeCount || 8,
                radius: params.size,
                dx: params.centerX,
                dy: params.centerY,
                initialAngle: params.angle,
                ray: params.curvedRay || 200,
                fillColor: params.fillColor,
                strokeColor: params.strokeColor,
                strokeWidth: params.strokeWidth,
                fillRule: 'evenodd' as const,
                viewBoxSize:
                    Math.max(params.centerX + params.size + 15, params.centerY + params.size + 15) *
                    2,
            };

            return this.curvedStarService.generateCurvedStar(curvedParams);
        }

        // Regular shapes
        const path = this.generateSvgPath();
        const viewBoxSize =
            Math.max(params.centerX + params.size + 50, params.centerY + params.size + 50) * 2;

        return `
      <svg width="100%" height="100%" viewBox="${-viewBoxSize / 2} ${
            -viewBoxSize / 2
        } ${viewBoxSize} ${viewBoxSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${params.fillColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.lightenColor(
                params.fillColor,
                40
            )};stop-opacity:1" />
          </linearGradient>
        </defs>
        <path 
          d="${path}" 
          fill="url(#gradient)" 
          stroke="${params.strokeColor}" 
          stroke-width="${params.strokeWidth}"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>
    `;
    }

    private lightenColor(color: string, percent: number): string {
        // Simple color lightening function
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
}
