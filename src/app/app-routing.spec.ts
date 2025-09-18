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
import { ArcadeComponent } from './arcade.component';
import { OfflineComponent } from './offline.component';
import { ShellComponent } from './shell.component';
import { SettingsService } from './settings.service';
import { AudioService } from './audio.service';
import { RallyCallService } from './rally-call.service';
import { ScoreboardService } from './scoreboard.service';

describe('App Routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const settingsService = jasmine.createSpyObj('SettingsService', ['difficulty', 'mute', 'hc']);
    const audioService = jasmine.createSpyObj('AudioService', ['play']);
    const rallyCallService = jasmine.createSpyObj('RallyCallService', ['makeCall']);
    const scoreboardService = jasmine.createSpyObj('ScoreboardService', ['addPoint', 'sideOut', 'getThreeNumberScore']);
    
    settingsService.difficulty.and.returnValue('Beginner');
    settingsService.mute.and.returnValue(false);
    settingsService.hc.and.returnValue(false);
    scoreboardService.getThreeNumberScore.and.returnValue('0-0-1');

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        AppComponent,
        HomeComponent,
        RulesComponent,
        PracticeComponent,
        QuizComponent,
        ArcadeComponent,
        OfflineComponent,
        ShellComponent
      ],
      providers: [
        { provide: SettingsService, useValue: settingsService },
        { provide: AudioService, useValue: audioService },
        { provide: RallyCallService, useValue: rallyCallService },
        { provide: ScoreboardService, useValue: scoreboardService }
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to / and show Arcade game', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('Arcade Rally Demo');
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
    expect(fixture.nativeElement.innerHTML).toContain('Arcade Rally Demo');
  });
});
