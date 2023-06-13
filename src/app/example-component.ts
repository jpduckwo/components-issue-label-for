import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CustomControlComponent } from './custom-control-component';

@Component({
  selector: 'example-component',
  templateUrl: 'example-component.html',
  styleUrls: ['example-component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, CustomControlComponent],
})
export class ExampleComponent {}

/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
