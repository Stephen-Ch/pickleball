import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from './app';
import { routes } from './app.routes';
import { HomeComponent } from './home.component';
import { RulesComponent } from './rules.component';
import { PracticeComponent } from './practice.component';
import { QuizComponent } from './quiz.component';
import { ShellComponent } from './shell.component';

describe('App Routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        AppComponent,
        HomeComponent,
        RulesComponent,
        PracticeComponent,
        QuizComponent,
        ShellComponent
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to / and show Home <h1>', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('LearnPickle — Home');
  });

  it('should navigate to /rules and show Rules <h1>', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    router.navigateByUrl('/rules');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('Rules');
  });

  it('should redirect unknown routes to /', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    router.navigateByUrl('/nope');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(location.path()).toBe('/');
    expect(fixture.nativeElement.innerHTML).toContain('LearnPickle — Home');
  });
});
