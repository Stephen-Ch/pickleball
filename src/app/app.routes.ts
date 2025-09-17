import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Rules } from './rules/rules';
import { Practice } from './practice/practice';
import { Quiz } from './quiz/quiz';
import { BadgesComponent } from './components/badges/badges.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'rules', component: Rules },
  { path: 'practice', component: Practice },
  { path: 'quiz', component: Quiz },
  { path: 'badges', component: BadgesComponent },
  { path: '**', redirectTo: '' } // Wildcard route - must be last
];
