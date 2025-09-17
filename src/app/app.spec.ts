import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain only router-outlet as template content (sentinel test)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Template should contain only router-outlet, no other meaningful content
    const routerOutlets = compiled.querySelectorAll('router-outlet');
    expect(routerOutlets.length).toBe(1);
    
    // Should not contain any other elements (div, main, h1, etc.)
    const otherElements = compiled.querySelectorAll('*:not(router-outlet)');
    expect(otherElements.length).toBe(0);
  });
});
