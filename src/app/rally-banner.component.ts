import { Component, Input, NgZone, inject } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-rally-banner',
  imports: [NgIf],
  template: `
    <div *ngIf="visible" class="rally-banner" [class.fade-out]="fadeOut">
      <div class="call">{{ call }}</div>
      <div class="explainer">{{ explainer }}</div>
      <div class="score">{{ score }}</div>
    </div>
  `,
  styles: [`
    .rally-banner {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #e60012 0%, #ff4444 100%);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 1rem;
      box-shadow: 0 8px 32px #0004;
      text-align: center;
      z-index: 1000;
      max-width: 20rem;
      border: 3px solid #fff;
      animation: slideIn 0.3s ease-out;
    }
    .rally-banner.fade-out {
      animation: fadeOut 0.5s ease-out forwards;
    }
    .call {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-shadow: 0 1px 2px #0004;
    }
    .explainer {
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    .score {
      font-size: 1.1rem;
      font-weight: bold;
      background: #fff2;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      display: inline-block;
    }
    @keyframes slideIn {
      from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes fadeOut {
      to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
  `]
})
export class RallyBannerComponent {
  @Input() call = '';
  @Input() explainer = '';
  @Input() score = '';
  
  visible = false;
  fadeOut = false;
  private zone = inject(NgZone);

  show(duration = 3000) {
    this.visible = true;
    this.fadeOut = false;
    
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.fadeOut = true;
          setTimeout(() => {
            this.visible = false;
            this.fadeOut = false;
          }, 500);
        });
      }, duration);
    });
  }

  hide() {
    this.visible = false;
    this.fadeOut = false;
  }
}