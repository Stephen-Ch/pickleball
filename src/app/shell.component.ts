import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterModule],
  template: `
    <header id="app-header" tabindex="-1">
      <nav>
        <a routerLink="/" aria-label="Home">Home</a>
        <a routerLink="/rules" aria-label="Rules">Rules</a>
        <a routerLink="/practice" aria-label="Practice">Practice</a>
        <a routerLink="/quiz" aria-label="Quiz">Quiz</a>
      </nav>
    </header>
    <main><router-outlet></router-outlet></main>
    <footer><small>&copy; LearnPickle</small></footer>
  `
})
export class ShellComponent {}