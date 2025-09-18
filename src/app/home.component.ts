import { Component } from '@angular/core';
import { BadgesComponent } from './badges.component';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [BadgesComponent],
  template: `
    <h1>LearnPickle — Home</h1>
    <app-badges></app-badges>
    <p style="margin-top:2rem">
      <a routerLink="/arcade" style="font-size:1.1rem; color:#e60012; text-decoration:underline;">Try the Arcade Rally Demo</a>
    </p>
  `
})
export class HomeComponent {}