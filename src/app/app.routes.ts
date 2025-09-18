import { Routes } from '@angular/router';
import { ShellComponent } from './shell.component';
import { HomeComponent } from './home.component';
import { RulesComponent } from './rules.component';
import { PracticeComponent } from './practice.component';
import { QuizComponent } from './quiz.component';
import { ArcadeComponent } from './arcade.component';
import { OfflineComponent } from './offline.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: ArcadeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'rules', component: RulesComponent },
      { path: 'practice', component: PracticeComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'arcade', component: ArcadeComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: 'offline', component: OfflineComponent }
];
