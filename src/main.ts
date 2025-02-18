import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DynamicFormComponent],
  template: `
  <app-dynamic-form></app-dynamic-form>
  <router-outlet />
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
