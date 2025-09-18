import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sponsors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="sponsors-section" role="region" aria-labelledby="sponsors-heading">
      <h2 id="sponsors-heading" class="sponsors-title">Our Sponsors</h2>
      <p class="sponsors-subtitle">Supporting the pickleball community</p>
      
      <div class="sponsors-grid">
        <!-- DailyInventory Sponsor Card -->
        <div class="sponsor-card">
          <div class="sponsor-logo">
            <div class="placeholder-logo dailyinventory">DI</div>
          </div>
          <div class="sponsor-content">
            <h3 class="sponsor-name">DailyInventory</h3>
            <p class="sponsor-description">
              Professional inventory management solutions for sports facilities and equipment tracking.
            </p>
            <button 
              type="button"
              class="sponsor-link"
              aria-label="Visit DailyInventory website (link coming soon)"
              rel="nofollow noopener"
              disabled>
              Learn More
            </button>
          </div>
        </div>

        <!-- JustSprites Sponsor Card -->
        <div class="sponsor-card">
          <div class="sponsor-logo">
            <div class="placeholder-logo justsprites">JS</div>
          </div>
          <div class="sponsor-content">
            <h3 class="sponsor-name">JustSprites</h3>
            <p class="sponsor-description">
              Creative digital assets and graphics for sports applications and gaming experiences.
            </p>
            <button 
              type="button"
              class="sponsor-link"
              aria-label="Visit JustSprites website (link coming soon)"
              rel="nofollow noopener"
              disabled>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .sponsors-section {
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .sponsors-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #00ffff);
      margin-bottom: 0.5rem;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }

    .sponsors-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary, #b0b0b0);
      margin-bottom: 2rem;
    }

    .sponsors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      justify-items: center;
    }

    .sponsor-card {
      background: var(--surface-elevated, #2a2a2a);
      border: 2px solid var(--border-primary, #333);
      border-radius: 12px;
      padding: 1.5rem;
      max-width: 350px;
      width: 100%;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .sponsor-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-primary, #00ffff), var(--accent-secondary, #ff00ff));
    }

    .sponsor-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 255, 255, 0.15);
      border-color: var(--accent-primary, #00ffff);
    }

    .sponsor-logo {
      margin-bottom: 1rem;
    }

    .placeholder-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto;
      color: white;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .placeholder-logo.dailyinventory {
      background: linear-gradient(135deg, #4CAF50, #2E7D32);
      border: 2px solid #66BB6A;
    }

    .placeholder-logo.justsprites {
      background: linear-gradient(135deg, #FF6B35, #D84315);
      border: 2px solid #FF8A65;
    }

    .sponsor-content {
      text-align: left;
    }

    .sponsor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #00ffff);
      margin-bottom: 0.75rem;
    }

    .sponsor-description {
      font-size: 0.9rem;
      color: var(--text-secondary, #b0b0b0);
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }

    .sponsor-link {
      background: var(--button-secondary, #333);
      color: var(--text-primary, #00ffff);
      border: 1px solid var(--border-secondary, #555);
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: not-allowed;
      opacity: 0.6;
      transition: all 0.3s ease;
      width: 100%;
    }

    .sponsor-link:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .sponsor-link:not(:disabled):hover {
      background: var(--accent-primary, #00ffff);
      color: var(--background-primary, #1a1a1a);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .sponsors-section {
        padding: 1.5rem 1rem;
      }

      .sponsors-title {
        font-size: 1.75rem;
      }

      .sponsors-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .sponsor-card {
        max-width: 100%;
      }
    }
  `]
})
export class SponsorsComponent {
  constructor() {}
}