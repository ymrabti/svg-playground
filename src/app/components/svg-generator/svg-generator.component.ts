import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgParametersComponent } from '../svg-parameters/svg-parameters.component';
import { SvgPreviewComponent } from '../svg-preview/svg-preview.component';

@Component({
  selector: 'app-svg-generator',
  templateUrl: './svg-generator.component.html',
  styleUrls: ['./svg-generator.component.scss'],
  standalone: true,
  imports: [CommonModule, SvgParametersComponent, SvgPreviewComponent]
})
export class SvgGeneratorComponent {
  constructor() {}
}