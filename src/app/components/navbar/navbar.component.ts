import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: false
})
export class NavbarComponent {
  readonly appTitle = 'SVG Generator';
  readonly githubUrl = 'https://github.com/ymrabti/svg-playground';

  openGitHub(): void {
    window.open(this.githubUrl, '_blank', 'noopener,noreferrer');
  }
}