import './polyfills';

import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './app/material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { ExampleComponent } from './app/example-component';
import { RouterModule } from '@angular/router';

const bootstrap = () =>
  bootstrapApplication(ExampleComponent, {
    providers: [
      importProvidersFrom([
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        DemoMaterialModule,
        MatNativeDateModule,
        ReactiveFormsModule,
      ]),
      // {
      //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      //   useValue: { appearance: 'fill' },
      // },
    ],
  });

enableProdMode();
bootstrap();
