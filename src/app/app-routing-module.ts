import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/svg-generator/svg-generator.component').then(m => m.SvgGeneratorComponent)
  },
  { 
    path: 'generator', 
    loadComponent: () => import('./components/svg-generator/svg-generator.component').then(m => m.SvgGeneratorComponent)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
