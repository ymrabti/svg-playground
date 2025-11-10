import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SvgGeneratorService, SvgParameters } from '../../services/svg-generator.service';

@Component({
    selector: 'app-svg-parameters',
    templateUrl: './svg-parameters.component.html',
    styleUrls: ['./svg-parameters.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
})
export class SvgParametersComponent implements OnInit, OnDestroy {
    parametersForm: FormGroup;
    private subscription = new Subscription();

    shapeOptions = [
        { value: 'curved-star', label: 'Curved Star' },
        { value: 'custom-star', label: 'Custom Star' },
        { value: 'yinyang', label: 'Yin Yang' },
        { value: 'polygon', label: 'Polygon' },
        { value: 'star', label: 'Star' },
        { value: 'circle', label: 'Circle' },
        { value: 'spiral', label: 'Spiral' },
    ];

    constructor(private fb: FormBuilder, private svgGeneratorService: SvgGeneratorService) {
        this.parametersForm = this.createForm();
    }

    ngOnInit(): void {
        // Subscribe to form changes and update service
        this.subscription.add(
            this.parametersForm.valueChanges.pipe(debounceTime(100)).subscribe((formValue) => {
                // Process spin duration - convert empty string to false
                const processedValue = {
                    ...formValue,
                    spinDuration: formValue.spinDuration === '' ? false : formValue.spinDuration
                };
                this.svgGeneratorService.updateParameters(processedValue);
            })
        );

        // Subscribe to service parameters to sync form
        this.subscription.add(
            this.svgGeneratorService.parameters$.subscribe((params: SvgParameters) => {
                this.parametersForm.patchValue(params, { emitEvent: false });
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private createForm(): FormGroup {
        const defaultParams = this.svgGeneratorService.getCurrentParameters();

        return this.fb.group({
            shape: new FormControl(defaultParams.shape),
            edgeCount: new FormControl(defaultParams.edgeCount),
            angle: new FormControl(defaultParams.angle),
            size: new FormControl(defaultParams.size),
            strokeWidth: new FormControl(defaultParams.strokeWidth),
            strokeColor: new FormControl(defaultParams.strokeColor),
            fillColor: new FormControl(defaultParams.fillColor),
            radius: new FormControl(defaultParams.radius),
            centerX: new FormControl(defaultParams.centerX),
            centerY: new FormControl(defaultParams.centerY),
            innerRadius: new FormControl(defaultParams.innerRadius),
            spiralTurns: new FormControl(defaultParams.spiralTurns),
            rayRatio: new FormControl(defaultParams.rayRatio),
            curvedNoids: new FormControl(defaultParams.curvedNoids),
            // custom star parameters
            minRadius: new FormControl(defaultParams.minRadius),
            startVertex: new FormControl(defaultParams.startVertex),
            nested: new FormControl(defaultParams.nested),
            spinDuration: new FormControl(defaultParams.spinDuration === false ? '' : defaultParams.spinDuration),
            // yinyang parameters
            useGradient: new FormControl(defaultParams.useGradient),
        });
    }

    resetToDefaults(): void {
        this.svgGeneratorService.updateParameters({
            edgeCount: 6,
            angle: 0,
            size: 100,
            strokeWidth: 2,
            radius: 280,
            strokeColor: '#333333',
            fillColor: '#4CAF50',
            centerX: 0,
            centerY: 0,
            shape: 'custom-star',
            innerRadius: 50,
            spiralTurns: 3,
            rayRatio: 1.5,
            curvedNoids: 8,
            minRadius: 50,
            startVertex: 0,
            nested: false,
            spinDuration: false,
            useGradient: true,
        });
    }

    randomizeParameters(): void {
        const randomParams: Partial<SvgParameters> = {
            edgeCount: Math.floor(Math.random() * 10) + 3,
            angle: Math.floor(Math.random() * 360),
            size: Math.floor(Math.random() * 150) + 50,
            strokeWidth: Math.floor(Math.random() * 5) + 1,
            strokeColor: this.getRandomColor(),
            fillColor: this.getRandomColor(),
            innerRadius: Math.floor(Math.random() * 80) + 20,
            radius: Math.floor(Math.random() * 300) + 50,
            centerX: Math.floor(Math.random() * 201) - 100,
            centerY: Math.floor(Math.random() * 201) - 100,
            spiralTurns: Math.floor(Math.random() * 5) + 1,
            rayRatio: Math.floor(Math.random() * 4.5) + 1.5,
            curvedNoids: Math.floor(Math.random() * 12) + 4,
            minRadius: Math.floor(Math.random() * 50) + 10,
            startVertex: Math.floor(Math.random() * 8),
            nested: Math.random() > 0.5,
            useGradient: Math.random() > 0.5,
        };

        this.svgGeneratorService.updateParameters(randomParams);
    }

    private getRandomColor(): string {
        const colors = [
            '#FF5722',
            '#E91E63',
            '#9C27B0',
            '#673AB7',
            '#3F51B5',
            '#2196F3',
            '#03A9F4',
            '#00BCD4',
            '#009688',
            '#4CAF50',
            '#8BC34A',
            '#CDDC39',
            '#FFEB3B',
            '#FFC107',
            '#FF9800',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    get isShapeWithEdges(): boolean {
        const shape = this.parametersForm.get('shape')?.value;
        return shape === 'polygon' || shape === 'star' || shape === 'custom-star' || shape === 'yinyang';
    }

    get isStarShape(): boolean {
        return this.parametersForm.get('shape')?.value === 'star';
    }

    get isSpiralShape(): boolean {
        return this.parametersForm.get('shape')?.value === 'spiral';
    }

    get isCurvedStarShape(): boolean {
        return this.parametersForm.get('shape')?.value === 'curved-star';
    }

    get isCustomStarShape(): boolean {
        return this.parametersForm.get('shape')?.value === 'custom-star';
    }

    get isYinYangShape(): boolean {
        return this.parametersForm.get('shape')?.value === 'yinyang';
    }
}
