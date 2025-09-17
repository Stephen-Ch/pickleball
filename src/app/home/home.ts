import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Shell } from '../shell/shell';
import { BadgeService, BadgeStatus } from '../services/badge.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Shell, RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  badgeStatus: BadgeStatus = {
    totalBadges: 0,
    earnedBadges: 0,
    badges: [],
    isNearComplete: false
  };

  constructor(private badgeService: BadgeService) {
    this.badgeStatus = this.badgeService.getBadgeStatus();
  }

  isBadgeEarned(badgeId: string): boolean {
    return this.badgeStatus.badges.find(b => b.id === badgeId)?.isEarned || false;
  }

  getBadgeDisplayText(badgeId: string): string {
    const badge = this.badgeStatus.badges.find(b => b.id === badgeId);
    if (!badge?.isEarned) return '';
    
    switch (badgeId) {
      case 'quiz-perfect':
        return '✓ Perfect Score';
      default:
        return '✓ Completed';
    }
  }
}
