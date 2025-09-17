import { Injectable } from '@angular/core';
import { ProgressService, UserProgress } from './progress.service';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'rules' | 'practice' | 'quiz';
  isEarned: boolean;
  earnedDate?: Date;
  progressNeeded?: string;
}

export interface BadgeStatus {
  totalBadges: number;
  earnedBadges: number;
  badges: Badge[];
  isNearComplete: boolean;
  encouragementMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  
  constructor(private progressService: ProgressService) {}

  getBadgeStatus(): BadgeStatus {
    const progress = this.progressService.getUserProgress();
    const badges = this.calculateBadges(progress);
    const earnedCount = badges.filter(b => b.isEarned).length;
    const totalCount = badges.length;
    const isNearComplete = earnedCount === totalCount - 1 && totalCount > 1;

    return {
      totalBadges: totalCount,
      earnedBadges: earnedCount,
      badges,
      isNearComplete,
      encouragementMessage: isNearComplete ? this.getEncouragementMessage(badges) : undefined
    };
  }

  private calculateBadges(progress: UserProgress): Badge[] {
    const badges: Badge[] = [];

    // Rules Complete Badge
    const rulesComplete = this.isRulesComplete(progress);
    badges.push({
      id: 'rules-complete',
      name: 'Rules Master',
      description: 'Viewed all pickleball rule cards',
      icon: '📚',
      category: 'rules',
      isEarned: rulesComplete.isEarned,
      earnedDate: rulesComplete.earnedDate,
      progressNeeded: rulesComplete.progressNeeded
    });

    // Practice Complete Badge
    const practiceComplete = this.isPracticeComplete(progress);
    badges.push({
      id: 'practice-complete',
      name: 'Practice Pro',
      description: 'Completed practice scenarios with 80%+ accuracy',
      icon: '🎯',
      category: 'practice',
      isEarned: practiceComplete.isEarned,
      earnedDate: practiceComplete.earnedDate,
      progressNeeded: practiceComplete.progressNeeded
    });

    // Quiz Perfect Badge
    const quizPerfect = this.isQuizPerfect(progress);
    badges.push({
      id: 'quiz-perfect',
      name: 'Quiz Champion',
      description: 'Achieved 100% on a pickleball quiz',
      icon: '🏆',
      category: 'quiz',
      isEarned: quizPerfect.isEarned,
      earnedDate: quizPerfect.earnedDate,
      progressNeeded: quizPerfect.progressNeeded
    });

    return badges;
  }

  private isRulesComplete(progress: UserProgress): { isEarned: boolean; earnedDate?: Date; progressNeeded?: string } {
    // Rules complete when all rules are viewed
    const totalRules = 8; // Based on rules-data.ts
    const viewedRules = progress.rules.totalCardsViewed;
    
    if (viewedRules >= totalRules) {
      return {
        isEarned: true,
        earnedDate: progress.rules.lastViewDate || undefined
      };
    }

    return {
      isEarned: false,
      progressNeeded: `View ${totalRules - viewedRules} more rule${totalRules - viewedRules === 1 ? '' : 's'}`
    };
  }

  private isPracticeComplete(progress: UserProgress): { isEarned: boolean; earnedDate?: Date; progressNeeded?: string } {
    // Practice complete when best accuracy >= 80% and at least 5 scenarios completed
    const minAccuracy = 80;
    const minScenarios = 5;
    
    const hasGoodAccuracy = progress.practice.bestAccuracy >= minAccuracy;
    const hasEnoughScenarios = progress.practice.scenariosCompleted >= minScenarios;
    
    if (hasGoodAccuracy && hasEnoughScenarios) {
      return {
        isEarned: true,
        earnedDate: progress.practice.lastSessionDate || undefined
      };
    }

    const accuracyNeeded = Math.max(0, minAccuracy - progress.practice.bestAccuracy);
    const scenariosNeeded = Math.max(0, minScenarios - progress.practice.scenariosCompleted);
    
    let progressNeeded = '';
    if (accuracyNeeded > 0 && scenariosNeeded > 0) {
      progressNeeded = `Achieve ${minAccuracy}% accuracy and complete ${scenariosNeeded} more scenario${scenariosNeeded === 1 ? '' : 's'}`;
    } else if (accuracyNeeded > 0) {
      progressNeeded = `Achieve ${minAccuracy}% accuracy (currently ${progress.practice.bestAccuracy}%)`;
    } else if (scenariosNeeded > 0) {
      progressNeeded = `Complete ${scenariosNeeded} more scenario${scenariosNeeded === 1 ? '' : 's'}`;
    }

    return {
      isEarned: false,
      progressNeeded
    };
  }

  private isQuizPerfect(progress: UserProgress): { isEarned: boolean; earnedDate?: Date; progressNeeded?: string } {
    // Quiz perfect when best percentage is 100%
    if (progress.quiz.bestPercentage >= 100) {
      return {
        isEarned: true,
        earnedDate: progress.quiz.lastQuizDate || undefined
      };
    }

    let progressNeeded = 'Take a quiz and score 100%';
    if (progress.quiz.totalQuizzesTaken > 0) {
      progressNeeded = `Score 100% on a quiz (best score: ${progress.quiz.bestPercentage}%)`;
    }

    return {
      isEarned: false,
      progressNeeded
    };
  }

  private getEncouragementMessage(badges: Badge[]): string {
    const unearned = badges.find(b => !b.isEarned);
    if (!unearned) return '';

    const messages = {
      'rules-complete': "You're almost there! Just review a few more rule cards to become a Rules Master! 📚",
      'practice-complete': "You're almost there! Complete a few more practice scenarios with good accuracy to become a Practice Pro! 🎯",
      'quiz-perfect': "You're almost there! Take the quiz and aim for 100% to become a Quiz Champion! 🏆"
    };

    return messages[unearned.id as keyof typeof messages] || "You're almost there! One more badge to complete your collection!";
  }

  // Utility methods for components
  getEarnedBadges(): Badge[] {
    return this.getBadgeStatus().badges.filter(b => b.isEarned);
  }

  getUnearnedBadges(): Badge[] {
    return this.getBadgeStatus().badges.filter(b => !b.isEarned);
  }

  getBadgeById(id: string): Badge | undefined {
    return this.getBadgeStatus().badges.find(b => b.id === id);
  }

  getCompletionPercentage(): number {
    const status = this.getBadgeStatus();
    return Math.round((status.earnedBadges / status.totalBadges) * 100);
  }
}