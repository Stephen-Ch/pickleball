import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="settings-section" role="region" aria-labelledby="settings-heading">
      <h2 id="settings-heading" class="settings-title">Settings</h2>
      <p class="settings-subtitle">Customize your LearnPickle experience</p>
      
      <div class="settings-grid">
        <!-- Accessibility Settings -->
        <div class="settings-group">
          <h3 class="group-title">Accessibility</h3>
          
          <div class="setting-item">
            <label class="setting-label" for="high-contrast-toggle">
              <input 
                type="checkbox" 
                id="high-contrast-toggle"
                [(ngModel)]="highContrastEnabled"
                (change)="toggleHighContrast()"
                class="setting-checkbox"
                aria-describedby="high-contrast-description">
              <span class="setting-text">High Contrast Mode</span>
            </label>
            <p id="high-contrast-description" class="setting-description">
              Increases color contrast for better visibility and accessibility
            </p>
          </div>
        </div>

        <!-- Data Management Settings -->
        <div class="settings-group">
          <h3 class="group-title">Data Management</h3>
          
          <div class="setting-item">
            <button 
              type="button"
              class="reset-button"
              (click)="confirmResetProgress()"
              aria-describedby="reset-description">
              Reset Progress
            </button>
            <p id="reset-description" class="setting-description">
              Clear all saved progress, quiz scores, and badges. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      @if (showConfirmDialog) {
        <div class="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div class="dialog-content">
            <h3 id="dialog-title" class="dialog-title">Confirm Reset Progress</h3>
            <p class="dialog-message">
              Are you sure you want to reset all your progress? This will clear:
            </p>
            <ul class="dialog-list">
              <li>Quiz scores and completion status</li>
              <li>Earned badges and achievements</li>
              <li>Practice session history</li>
              <li>All saved preferences</li>
            </ul>
            <p class="dialog-warning">
              <strong>This action cannot be undone.</strong>
            </p>
            <div class="dialog-actions">
              <button 
                type="button"
                class="dialog-button cancel"
                (click)="cancelReset()"
                #cancelButton>
                Cancel
              </button>
              <button 
                type="button"
                class="dialog-button confirm"
                (click)="resetProgress()"
                aria-describedby="dialog-title">
                Reset All Progress
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .settings-section {
      padding: 2rem 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .settings-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #00ffff);
      margin-bottom: 0.5rem;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }

    .settings-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary, #b0b0b0);
      margin-bottom: 2rem;
    }

    .settings-grid {
      display: grid;
      gap: 2rem;
    }

    .settings-group {
      background: var(--surface-elevated, #2a2a2a);
      border: 2px solid var(--border-primary, #333);
      border-radius: 12px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .settings-group::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-primary, #00ffff), var(--accent-secondary, #ff00ff));
    }

    .group-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #00ffff);
      margin-bottom: 1rem;
    }

    .setting-item {
      margin-bottom: 1.5rem;
    }

    .setting-item:last-child {
      margin-bottom: 0;
    }

    .setting-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary, #ffffff);
    }

    .setting-checkbox {
      width: 18px;
      height: 18px;
      margin-right: 0.75rem;
      accent-color: var(--accent-primary, #00ffff);
      cursor: pointer;
    }

    .setting-text {
      user-select: none;
    }

    .setting-description {
      font-size: 0.9rem;
      color: var(--text-secondary, #b0b0b0);
      margin: 0.5rem 0 0 0;
      line-height: 1.4;
    }

    .reset-button {
      background: var(--error-color, #ff4444);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .reset-button:hover {
      background: var(--error-hover, #ff6666);
      transform: translateY(-1px);
    }

    .reset-button:active {
      transform: translateY(0);
    }

    /* Dialog Styles */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .dialog-content {
      background: var(--surface-elevated, #2a2a2a);
      border: 2px solid var(--border-primary, #333);
      border-radius: 12px;
      padding: 2rem;
      max-width: 500px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary, #00ffff);
      margin-bottom: 1rem;
    }

    .dialog-message {
      color: var(--text-primary, #ffffff);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .dialog-list {
      color: var(--text-secondary, #b0b0b0);
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .dialog-list li {
      margin-bottom: 0.5rem;
    }

    .dialog-warning {
      color: var(--error-color, #ff4444);
      font-weight: 600;
      margin: 1rem 0;
    }

    .dialog-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .dialog-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dialog-button.cancel {
      background: var(--button-secondary, #666);
      color: var(--text-primary, #ffffff);
    }

    .dialog-button.cancel:hover {
      background: var(--button-secondary-hover, #777);
    }

    .dialog-button.confirm {
      background: var(--error-color, #ff4444);
      color: white;
    }

    .dialog-button.confirm:hover {
      background: var(--error-hover, #ff6666);
    }

    /* High Contrast Mode Styles */
    :global(body.high-contrast) {
      --text-primary: #ffffff;
      --text-secondary: #cccccc;
      --background-primary: #000000;
      --surface-elevated: #1a1a1a;
      --border-primary: #ffffff;
      --accent-primary: #ffff00;
      --accent-secondary: #ff00ff;
      --error-color: #ff0000;
      filter: contrast(150%);
    }

    @media (max-width: 768px) {
      .settings-section {
        padding: 1.5rem 1rem;
      }

      .settings-title {
        font-size: 1.75rem;
      }

      .dialog-content {
        padding: 1.5rem;
        margin: 1rem;
      }

      .dialog-actions {
        flex-direction: column;
      }

      .dialog-button {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  highContrastEnabled = false;
  showConfirmDialog = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    // Load high contrast preference from localStorage
    const savedHighContrast = localStorage.getItem('highContrastEnabled');
    this.highContrastEnabled = savedHighContrast === 'true';
    
    if (this.highContrastEnabled) {
      this.document.body.classList.add('high-contrast');
    }
  }

  toggleHighContrast() {
    this.highContrastEnabled = !this.highContrastEnabled;
    
    if (this.highContrastEnabled) {
      this.document.body.classList.add('high-contrast');
    } else {
      this.document.body.classList.remove('high-contrast');
    }
    
    // Save preference to localStorage
    localStorage.setItem('highContrastEnabled', this.highContrastEnabled.toString());
  }

  confirmResetProgress() {
    this.showConfirmDialog = true;
    
    // Focus the cancel button for accessibility
    setTimeout(() => {
      const cancelButton = this.document.querySelector('.dialog-button.cancel') as HTMLElement;
      if (cancelButton) {
        cancelButton.focus();
      }
    }, 100);
  }

  cancelReset() {
    this.showConfirmDialog = false;
  }

  resetProgress() {
    // Clear all localStorage keys related to app progress
    const keysToRemove = [
      'quizScores',
      'earnedBadges',
      'practiceHistory',
      'userProgress',
      'completedQuizzes',
      'badgeProgress',
      'lastQuizScore',
      'totalQuizAttempts'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Also clear any keys that might exist but weren't in our list
    // by checking all localStorage keys for app-related patterns
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('learnPickle') || 
          key.includes('quiz') || 
          key.includes('badge') || 
          key.includes('progress') ||
          key.includes('practice')) {
        localStorage.removeItem(key);
      }
    });

    this.showConfirmDialog = false;
    
    // Show success feedback (could be expanded to a toast notification)
    alert('Progress has been reset successfully!');
  }
}