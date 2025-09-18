import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgesComponent } from './badges.component';
import { ProgressService } from './progress.service';

class MockProgressService {
  rulesViewedCount = () => 7;
  practiceCompleted = () => true;
  quizBestScore = () => 6;
}

describe('BadgesComponent', () => {
  let fixture: ComponentFixture<BadgesComponent>;
  let component: BadgesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgesComponent],
      providers: [
        { provide: ProgressService, useClass: MockProgressService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(BadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show all badges as earned when all criteria met', () => {
    expect(component.rulesEarned()).toBeTrue();
    expect(component.practiceEarned()).toBeTrue();
    expect(component.quizEarned()).toBeTrue();
    expect(component.allEarned()).toBeTrue();
  });

  it('should show nudge if not all badges earned', async () => {
    class PartialMockProgressService {
      rulesViewedCount = () => 3;
      practiceCompleted = () => true;
      quizBestScore = () => 6;
    }
    await TestBed.resetTestingModule().configureTestingModule({
      imports: [BadgesComponent],
      providers: [
        { provide: ProgressService, useClass: PartialMockProgressService }
      ]
    }).compileComponents();
    const partialFixture = TestBed.createComponent(BadgesComponent);
    const partialComponent = partialFixture.componentInstance;
    partialFixture.detectChanges();
    expect(partialComponent.allEarned()).toBeFalse();
  });
});
