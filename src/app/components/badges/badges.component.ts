import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeService, Badge, BadgeStatus } from '../../services/badge.service';

@Component({
  selector: 'app-badges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="badges-container">
      <h2 class="badges-title">Your Achievements</h2>
      
      <div class="progress-summary">
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [style.width.%]="badgeStatus.earnedBadges / badgeStatus.totalBadges * 100"
            ></div>
          </div>
          <span class="progress-text">
            {{ badgeStatus.earnedBadges }} / {{ badgeStatus.totalBadges }} Badges Earned
          </span>
        </div>
      </div>

      @if (badgeStatus.isNearComplete && badgeStatus.encouragementMessage) {
        <div class="encouragement-message">
          <div class="encouragement-icon">🌟</div>
          <p>{{ badgeStatus.encouragementMessage }}</p>
        </div>
      }

      <div class="badges-grid">
        @for (badge of badgeStatus.badges; track badge.id) {
          <div 
            class="badge-card" 
            [class.earned]="badge.isEarned"
            [class.unearned]="!badge.isEarned"
          >
            <div class="badge-icon">{{ badge.icon }}</div>
            <h3 class="badge-name">{{ badge.name }}</h3>
            <p class="badge-description">{{ badge.description }}</p>
            
            @if (badge.isEarned && badge.earnedDate) {
              <div class="badge-earned-date">
                Earned {{ formatEarnedDate(badge.earnedDate) }}
              </div>
            } @else if (badge.progressNeeded) {
              <div class="badge-progress-needed">
                {{ badge.progressNeeded }}
              </div>
            }
          </div>
        }
      </div>

      @if (badgeStatus.earnedBadges === badgeStatus.totalBadges && badgeStatus.totalBadges > 0) {
        <div class="all-badges-complete">
          <div class="celebration-icon">🎉</div>
          <h3>Congratulations!</h3>
          <p>You've earned all available badges! You're a true pickleball expert!</p>
        </div>
      }

      @if (badgeStatus.earnedBadges === 0) {
        <div class="no-badges-yet">
          <div class="motivation-icon">💪</div>
          <h3>Ready to Start Your Journey?</h3>
          <p>Complete activities to earn your first badge and track your pickleball learning progress!</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .badges-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }

    .badges-title {
      font-family: 'Consolas', monospace;
      font-size: 2rem;
      color: var(--primary-color);
      text-align: center;
      margin-bottom: 2rem;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .progress-summary {
      background: var(--background-secondary);
      border: 2px solid var(--accent-color);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .progress-bar-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .progress-bar {
      width: 100%;
      max-width: 300px;
      height: 20px;
      background: var(--background-color);
      border: 2px solid var(--primary-color);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
      transition: width 0.8s ease-in-out;
      border-radius: 6px;
    }

    .progress-text {
      font-family: 'Consolas', monospace;
      color: var(--text-color);
      font-weight: bold;
      font-size: 1.1rem;
    }

    .encouragement-message {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
      border: 2px solid #FFD700;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
      animation: gentle-pulse 2s ease-in-out infinite;
    }

    .encouragement-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      animation: twinkle 1.5s ease-in-out infinite;
    }

    .encouragement-message p {
      color: #FFD700;
      font-weight: bold;
      margin: 0;
      font-size: 1.1rem;
    }

    @keyframes gentle-pulse {
      0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
      50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
    }

    @keyframes twinkle {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .badges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .badge-card {
      background: var(--background-secondary);
      border: 2px solid var(--primary-color);
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .badge-card.earned {
      border-color: var(--accent-color);
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      animation: earned-glow 3s ease-in-out infinite;
    }

    .badge-card.earned::before {
      content: '✓';
      position: absolute;
      top: 10px;
      right: 15px;
      color: var(--accent-color);
      font-size: 1.2rem;
      font-weight: bold;
    }

    .badge-card.unearned {
      opacity: 0.7;
      border-color: #555;
    }

    .badge-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 255, 255, 0.2);
    }

    @keyframes earned-glow {
      0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.3); }
      50% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.6); }
    }

    .badge-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      filter: grayscale(0);
      transition: filter 0.3s ease;
    }

    .badge-card.unearned .badge-icon {
      filter: grayscale(1);
      opacity: 0.5;
    }

    .badge-name {
      font-family: 'Consolas', monospace;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    .badge-card.earned .badge-name {
      color: var(--accent-color);
    }

    .badge-description {
      color: var(--text-color);
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .badge-earned-date {
      color: var(--accent-color);
      font-size: 0.9rem;
      font-style: italic;
      padding: 0.5rem;
      background: rgba(0, 255, 255, 0.1);
      border-radius: 4px;
    }

    .badge-progress-needed {
      color: #FFD700;
      font-size: 0.9rem;
      padding: 0.5rem;
      background: rgba(255, 215, 0, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(255, 215, 0, 0.3);
    }

    .all-badges-complete {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
      border: 2px solid #FFD700;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      animation: celebration 1s ease-in-out;
    }

    .celebration-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: bounce 1s ease-in-out infinite;
    }

    .all-badges-complete h3 {
      color: #FFD700;
      font-family: 'Consolas', monospace;
      margin-bottom: 1rem;
    }

    .all-badges-complete p {
      color: var(--text-color);
      font-size: 1.1rem;
    }

    @keyframes celebration {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .no-badges-yet {
      background: var(--background-secondary);
      border: 2px solid var(--primary-color);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      opacity: 0.8;
    }

    .motivation-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .no-badges-yet h3 {
      color: var(--primary-color);
      font-family: 'Consolas', monospace;
      margin-bottom: 1rem;
    }

    .no-badges-yet p {
      color: var(--text-color);
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .badges-container {
        padding: 0.5rem;
      }

      .badges-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .badges-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .progress-summary {
        padding: 1rem;
      }
    }
  `]
})
export class BadgesComponent {
  badgeStatus: BadgeStatus = {
    totalBadges: 0,
    earnedBadges: 0,
    badges: [],
    isNearComplete: false
  };

  constructor(private badgeService: BadgeService) {
    this.badgeStatus = this.badgeService.getBadgeStatus();
  }

  formatEarnedDate(date: Date): string {
    if (!date) return '';
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}