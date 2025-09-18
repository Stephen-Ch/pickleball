import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let mockStorageData: { [key: string]: string } = {};

  beforeEach(async () => {
    // Create localStorage spy
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);
    mockStorageData = {};

    // Mock localStorage behavior
    localStorageSpy.getItem.and.callFake((key: string) => mockStorageData[key] || null);
    localStorageSpy.setItem.and.callFake((key: string, value: string) => {
      mockStorageData[key] = value;
    });
    localStorageSpy.removeItem.and.callFake((key: string) => {
      delete mockStorageData[key];
    });
    localStorageSpy.clear.and.callFake(() => {
      mockStorageData = {};
    });

    // Replace global localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [SettingsComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    
    // Mock Object.keys to return our mock data keys when called on localStorage
    spyOn(Object, 'keys').and.callFake((obj: any) => {
      if (obj === window.localStorage) {
        return Object.keys(mockStorageData);
      }
      // Use the original Object.keys for everything else
      return Object.getOwnPropertyNames(obj);
    });
  });

  afterEach(() => {
    // Clean up
    mockStorageData = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display settings section heading', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('#settings-heading');
    expect(heading?.textContent?.trim()).toBe('Settings');
  });

  describe('High Contrast Toggle', () => {
    it('should initialize high contrast as false by default', () => {
      component.ngOnInit();
      expect(component.highContrastEnabled).toBe(false);
    });

    it('should load high contrast preference from localStorage', () => {
      mockStorageData['highContrastEnabled'] = 'true';
      component.ngOnInit();
      expect(component.highContrastEnabled).toBe(true);
    });

    it('should toggle high contrast mode', () => {
      component.highContrastEnabled = false;
      component.toggleHighContrast();
      expect(component.highContrastEnabled).toBe(true);
      expect(localStorageSpy.getItem('highContrastEnabled')).toBe('true');
      
      component.toggleHighContrast();
      expect(component.highContrastEnabled).toBe(false);
      expect(localStorageSpy.getItem('highContrastEnabled')).toBe('false');
    });

    it('should display high contrast checkbox', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const checkbox = compiled.querySelector('#high-contrast-toggle') as HTMLInputElement;
      
      expect(checkbox).toBeTruthy();
      expect(checkbox.type).toBe('checkbox');
      expect(checkbox.getAttribute('aria-describedby')).toBe('high-contrast-description');
    });
  });

  describe('Reset Progress Functionality', () => {
    beforeEach(() => {
      // Set up some mock localStorage data
      mockStorageData['quizScores'] = 'test-data';
      mockStorageData['earnedBadges'] = 'test-badges';
      mockStorageData['practiceHistory'] = 'test-history';
      mockStorageData['learnPickleSettings'] = 'test-settings';
      mockStorageData['unrelatedKey'] = 'should-remain';
    });

    it('should show confirmation dialog when reset is requested', () => {
      component.confirmResetProgress();
      expect(component.showConfirmDialog).toBe(true);
    });

    it('should hide confirmation dialog when cancelled', () => {
      component.showConfirmDialog = true;
      component.cancelReset();
      expect(component.showConfirmDialog).toBe(false);
    });

    it('should clear specific localStorage keys when progress is reset', () => {
      spyOn(window, 'alert'); // Suppress alert dialog in tests
      
      // Verify data is there before reset
      expect(localStorageSpy.getItem('quizScores')).toBe('test-data');
      expect(localStorageSpy.getItem('learnPickleSettings')).toBe('test-settings');
      
      component.resetProgress();
      
      // Check that specific keys are removed
      expect(localStorageSpy.getItem('quizScores')).toBeNull();
      expect(localStorageSpy.getItem('earnedBadges')).toBeNull();
      expect(localStorageSpy.getItem('practiceHistory')).toBeNull();
      expect(localStorageSpy.getItem('learnPickleSettings')).toBeNull();
      
      // Check that unrelated keys remain
      expect(localStorageSpy.getItem('unrelatedKey')).toBe('should-remain');
    });

    it('should hide confirmation dialog after reset', () => {
      spyOn(window, 'alert');
      component.showConfirmDialog = true;
      
      component.resetProgress();
      
      expect(component.showConfirmDialog).toBe(false);
    });

    it('should show success message after reset', () => {
      const alertSpy = spyOn(window, 'alert');
      
      component.resetProgress();
      
      expect(alertSpy).toHaveBeenCalledWith('Progress has been reset successfully!');
    });

    it('should display reset button', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const resetButton = compiled.querySelector('.reset-button');
      
      expect(resetButton?.textContent?.trim()).toBe('Reset Progress');
      expect(resetButton?.getAttribute('aria-describedby')).toBe('reset-description');
    });
  });

  describe('Confirmation Dialog', () => {
    it('should not display dialog initially', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const dialog = compiled.querySelector('.dialog-overlay');
      
      expect(dialog).toBeFalsy();
    });

    it('should display dialog when showConfirmDialog is true', () => {
      component.showConfirmDialog = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const dialog = compiled.querySelector('.dialog-overlay');
      
      expect(dialog).toBeTruthy();
      expect(dialog?.getAttribute('role')).toBe('dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('should display correct dialog content', () => {
      component.showConfirmDialog = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const title = compiled.querySelector('#dialog-title');
      expect(title?.textContent?.trim()).toBe('Confirm Reset Progress');
      
      const cancelButton = compiled.querySelector('.dialog-button.cancel');
      const confirmButton = compiled.querySelector('.dialog-button.confirm');
      
      expect(cancelButton?.textContent?.trim()).toBe('Cancel');
      expect(confirmButton?.textContent?.trim()).toBe('Reset All Progress');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on settings section', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const section = compiled.querySelector('.settings-section');
      
      expect(section?.getAttribute('role')).toBe('region');
      expect(section?.getAttribute('aria-labelledby')).toBe('settings-heading');
    });

    it('should have proper form associations', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const checkbox = compiled.querySelector('#high-contrast-toggle');
      const label = compiled.querySelector('label[for="high-contrast-toggle"]');
      const description = compiled.querySelector('#high-contrast-description');
      
      expect(label).toBeTruthy();
      expect(description).toBeTruthy();
      expect(checkbox?.getAttribute('aria-describedby')).toBe('high-contrast-description');
    });
  });
});