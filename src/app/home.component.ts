import { Component } from '@angular/core';
import { BadgesComponent } from './badges.component';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [BadgesComponent],
  template: `
    <h1>LearnPickle — Home</h1>
    <app-badges></app-badges>
  `
})
export class HomeComponent {}