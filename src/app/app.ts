import { Component, signal } from '@angular/core';

@Component({
  selector: 'fat-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-svg-api');
}
