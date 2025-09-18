import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineComponent } from './offline.component';

describe('OfflineComponent', () => {
  let component: OfflineComponent;
  let fixture: ComponentFixture<OfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display offline message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('You\'re Offline');
  });

  it('should show available offline features', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const features = compiled.querySelectorAll('.offline-features li');
    expect(features.length).toBe(4);
    expect(features[0].textContent).toContain('Rules Reference');
    expect(features[1].textContent).toContain('Practice Scenarios');
    expect(features[2].textContent).toContain('Arcade Mode');
    expect(features[3].textContent).toContain('Quiz Challenges');
  });

  it('should have a retry button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const retryButton = compiled.querySelector('.retry-button');
    expect(retryButton).toBeTruthy();
    expect(retryButton?.textContent).toContain('Try Again');
  });
});