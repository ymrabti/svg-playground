import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SvgGeneratorService, SvgParameters } from '../../services/svg-generator.service';

@Component({
    selector: 'app-svg-preview',
    templateUrl: './svg-preview.component.html',
    styleUrls: ['./svg-preview.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class SvgPreviewComponent implements OnInit, OnDestroy {
    @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

    svgContent = '';
    safeSvgContent: SafeHtml = '';
    currentParameters: SvgParameters | null = null;
    private subscription = new Subscription();

    constructor(
        private svgGeneratorService: SvgGeneratorService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            this.svgGeneratorService.parameters$.subscribe((params: SvgParameters) => {
                this.currentParameters = params;
                this.generateSvg().then(() => {});
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private async generateSvg(): Promise<void> {
        this.svgContent = await this.svgGeneratorService.generateSvgElement();
        this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(this.svgContent);

        // Update the container directly
        if (this.svgContainer) {
            this.svgContainer.nativeElement.innerHTML = this.svgContent;
        }
    }

    downloadSvg(): void {
        if (!this.svgContent) return;

        const blob = new Blob([this.svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `generative-svg-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    copySvgToClipboard(): void {
        if (!this.svgContent) return;

        navigator.clipboard
            .writeText(this.svgContent)
            .then(() => {
                // You might want to add a toast notification here
                console.log('SVG copied to clipboard');
            })
            .catch((err) => {
                console.error('Failed to copy SVG: ', err);
            });
    }

    exportAsPng(): void {
        if (!this.svgContent) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const svgBlob = new Blob([this.svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.naturalWidth * 10 || 500;
            canvas.height = img.naturalHeight * 10 || 500;

            if (ctx) {
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const pngUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = pngUrl;
                        link.download = `generative-svg-${Date.now()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pngUrl);
                    }
                }, 'image/png');
            }

            URL.revokeObjectURL(url);
        };

        img.src = url;
    }

    getParametersInfo(): string {
        if (!this.currentParameters) return '';

        const info = [];
        info.push(`Shape: ${this.currentParameters.shape}`);

        if (this.currentParameters.shape === 'polygon' || this.currentParameters.shape === 'star') {
            info.push(`Edges: ${this.currentParameters.edgeCount}`);
        }

        if (this.currentParameters.shape === 'star') {
            info.push(`Inner Radius: ${this.currentParameters.innerRadius}`);
        }

        if (this.currentParameters.shape === 'spiral') {
            info.push(`Turns: ${this.currentParameters.spiralTurns}`);
        }

        info.push(`Size: ${this.currentParameters.size}`);
        info.push(`Angle: ${this.currentParameters.angle}°`);
        info.push(`Stroke: ${this.currentParameters.strokeWidth}px`);

        return info.join(' • ');
    }
}
