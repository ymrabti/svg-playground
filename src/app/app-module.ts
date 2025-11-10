import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SvgGeneratorService } from './services/svg-generator.service';
import { SeoService } from './services/seo.service';

@NgModule({
  declarations: [
    App,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    SvgGeneratorService,
    SeoService,
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
