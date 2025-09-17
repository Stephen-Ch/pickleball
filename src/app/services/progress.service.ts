import { Injectable } from '@angular/core';

export interface RulesProgress {
  cardsViewed: Set<string>;
  totalCardsViewed: number;
  completedSections: Set<string>;
  lastViewedCard: string | null;
  firstViewDate: Date | null;
  lastViewDate: Date | null;
}

export interface PracticeProgress {
  scenariosCompleted: number;
  totalAttempts: number;
  correctAnswers: number;
  accuracyPercentage: number;
  bestAccuracy: number;
  completedSessions: number;
  lastSessionDate: Date | null;
  scenarioTypes: {
    [key: string]: {
      attempts: number;
      correct: number;
      accuracy: number;
    };
  };
}

export interface QuizProgress {
  bestScore: number;
  bestPercentage: number;
  bestGrade: string;
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  lastQuizDate: Date | null;
  perfectScores: number;
  scores: Array<{
    score: number;
    total: number;
    percentage: number;
    grade: string;
    date: Date;
  }>;
}

export interface UserProgress {
  rules: RulesProgress;
  practice: PracticeProgress;
  quiz: QuizProgress;
  overall: {
    totalTimeSpent: number;
    firstVisit: Date | null;
    lastActivity: Date | null;
    sessionsCount: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly STORAGE_PREFIX = 'lp/';
  private readonly RULES_KEY = `${this.STORAGE_PREFIX}rules`;
  private readonly PRACTICE_KEY = `${this.STORAGE_PREFIX}practice`;
  private readonly QUIZ_KEY = `${this.STORAGE_PREFIX}quiz`;
  private readonly OVERALL_KEY = `${this.STORAGE_PREFIX}overall`;

  constructor() {
    this.initializeProgress();
  }

  private initializeProgress(): void {
    // Initialize storage if not exists
    if (!this.getFromStorage(this.OVERALL_KEY)) {
      this.saveToStorage(this.OVERALL_KEY, {
        totalTimeSpent: 0,
        firstVisit: new Date(),
        lastActivity: new Date(),
        sessionsCount: 1
      });
    } else {
      this.incrementSessionCount();
    }
  }

  private getFromStorage(key: string): any {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      // Convert date strings back to Date objects
      return this.reviveDates(parsed);
    } catch (error) {
      console.warn(`Failed to parse localStorage item ${key}:`, error);
      return null;
    }
  }

  private saveToStorage(key: string, data: any): void {
    try {
      // Convert dates to ISO strings for JSON storage
      const serializable = this.prepareDatesForStorage(data);
      localStorage.setItem(key, JSON.stringify(serializable));
    } catch (error) {
      console.error(`Failed to save to localStorage ${key}:`, error);
    }
  }

  private prepareDatesForStorage(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (obj instanceof Set) return Array.from(obj);
    if (Array.isArray(obj)) return obj.map(item => this.prepareDatesForStorage(item));
    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.prepareDatesForStorage(value);
      }
      return result;
    }
    return obj;
  }

  private reviveDates(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string' && this.isISOString(obj)) {
      return new Date(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.reviveDates(item));
    }
    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'cardsViewed' || key === 'completedSections') {
          result[key] = new Set(Array.isArray(value) ? value : []);
        } else {
          result[key] = this.reviveDates(value);
        }
      }
      return result;
    }
    return obj;
  }

  private isISOString(str: string): boolean {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    return iso8601Regex.test(str);
  }

  private incrementSessionCount(): void {
    const overall = this.getFromStorage(this.OVERALL_KEY) || {};
    overall.sessionsCount = (overall.sessionsCount || 0) + 1;
    overall.lastActivity = new Date();
    this.saveToStorage(this.OVERALL_KEY, overall);
  }

  // Rules Progress Methods
  getRulesProgress(): RulesProgress {
    const stored = this.getFromStorage(this.RULES_KEY);
    return {
      cardsViewed: new Set(),
      totalCardsViewed: 0,
      completedSections: new Set(),
      lastViewedCard: null,
      firstViewDate: null,
      lastViewDate: null,
      ...stored
    };
  }

  markRuleCardViewed(cardId: string, section: string): void {
    const progress = this.getRulesProgress();
    const now = new Date();
    
    if (!progress.cardsViewed.has(cardId)) {
      progress.cardsViewed.add(cardId);
      progress.totalCardsViewed = progress.cardsViewed.size;
    }
    
    progress.lastViewedCard = cardId;
    progress.lastViewDate = now;
    
    if (!progress.firstViewDate) {
      progress.firstViewDate = now;
    }
    
    this.saveToStorage(this.RULES_KEY, progress);
    this.updateLastActivity();
  }

  markRuleSectionCompleted(section: string): void {
    const progress = this.getRulesProgress();
    progress.completedSections.add(section);
    this.saveToStorage(this.RULES_KEY, progress);
    this.updateLastActivity();
  }

  // Practice Progress Methods
  getPracticeProgress(): PracticeProgress {
    const stored = this.getFromStorage(this.PRACTICE_KEY);
    return {
      scenariosCompleted: 0,
      totalAttempts: 0,
      correctAnswers: 0,
      accuracyPercentage: 0,
      bestAccuracy: 0,
      completedSessions: 0,
      lastSessionDate: null,
      scenarioTypes: {},
      ...stored
    };
  }

  updatePracticeProgress(
    scenariosCompleted: number,
    correctAnswers: number,
    totalAttempts: number,
    scenarioType?: string
  ): void {
    const progress = this.getPracticeProgress();
    const now = new Date();
    
    progress.scenariosCompleted += scenariosCompleted;
    progress.totalAttempts += totalAttempts;
    progress.correctAnswers += correctAnswers;
    progress.accuracyPercentage = progress.totalAttempts > 0 
      ? Math.round((progress.correctAnswers / progress.totalAttempts) * 100)
      : 0;
    
    const sessionAccuracy = totalAttempts > 0 
      ? Math.round((correctAnswers / totalAttempts) * 100)
      : 0;
    
    if (sessionAccuracy > progress.bestAccuracy) {
      progress.bestAccuracy = sessionAccuracy;
    }
    
    progress.completedSessions++;
    progress.lastSessionDate = now;
    
    // Track scenario type progress
    if (scenarioType) {
      if (!progress.scenarioTypes[scenarioType]) {
        progress.scenarioTypes[scenarioType] = {
          attempts: 0,
          correct: 0,
          accuracy: 0
        };
      }
      
      const typeProgress = progress.scenarioTypes[scenarioType];
      typeProgress.attempts += totalAttempts;
      typeProgress.correct += correctAnswers;
      typeProgress.accuracy = typeProgress.attempts > 0 
        ? Math.round((typeProgress.correct / typeProgress.attempts) * 100)
        : 0;
    }
    
    this.saveToStorage(this.PRACTICE_KEY, progress);
    this.updateLastActivity();
  }

  // Quiz Progress Methods
  getQuizProgress(): QuizProgress {
    const stored = this.getFromStorage(this.QUIZ_KEY);
    return {
      bestScore: 0,
      bestPercentage: 0,
      bestGrade: 'F',
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      overallAccuracy: 0,
      lastQuizDate: null,
      perfectScores: 0,
      scores: [],
      ...stored
    };
  }

  updateQuizProgress(
    score: number,
    total: number,
    percentage: number,
    grade: string
  ): void {
    const progress = this.getQuizProgress();
    const now = new Date();
    
    // Update best score
    if (score > progress.bestScore || 
        (score === progress.bestScore && percentage > progress.bestPercentage)) {
      progress.bestScore = score;
      progress.bestPercentage = percentage;
      progress.bestGrade = grade;
    }
    
    // Update totals
    progress.totalQuizzesTaken++;
    progress.totalQuestionsAnswered += total;
    progress.totalCorrectAnswers += score;
    progress.overallAccuracy = progress.totalQuestionsAnswered > 0
      ? Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100)
      : 0;
    
    // Track perfect scores
    if (percentage === 100) {
      progress.perfectScores++;
    }
    
    progress.lastQuizDate = now;
    
    // Add to score history (keep last 10)
    progress.scores.push({
      score,
      total,
      percentage,
      grade,
      date: now
    });
    
    if (progress.scores.length > 10) {
      progress.scores = progress.scores.slice(-10);
    }
    
    this.saveToStorage(this.QUIZ_KEY, progress);
    this.updateLastActivity();
  }

  // Overall Progress Methods
  getOverallProgress() {
    return {
      totalTimeSpent: 0,
      firstVisit: null,
      lastActivity: null,
      sessionsCount: 0,
      ...this.getFromStorage(this.OVERALL_KEY)
    };
  }

  updateTimeSpent(minutes: number): void {
    const overall = this.getOverallProgress();
    overall.totalTimeSpent += minutes;
    this.saveToStorage(this.OVERALL_KEY, overall);
  }

  private updateLastActivity(): void {
    const overall = this.getOverallProgress();
    overall.lastActivity = new Date();
    this.saveToStorage(this.OVERALL_KEY, overall);
  }

  // Utility Methods
  getUserProgress(): UserProgress {
    return {
      rules: this.getRulesProgress(),
      practice: this.getPracticeProgress(),
      quiz: this.getQuizProgress(),
      overall: this.getOverallProgress()
    };
  }

  clearAllProgress(): void {
    const keys = [this.RULES_KEY, this.PRACTICE_KEY, this.QUIZ_KEY, this.OVERALL_KEY];
    keys.forEach(key => localStorage.removeItem(key));
    this.initializeProgress();
  }

  exportProgress(): string {
    return JSON.stringify(this.getUserProgress(), null, 2);
  }

  importProgress(progressData: string): boolean {
    try {
      const data = JSON.parse(progressData);
      
      if (data.rules) this.saveToStorage(this.RULES_KEY, data.rules);
      if (data.practice) this.saveToStorage(this.PRACTICE_KEY, data.practice);
      if (data.quiz) this.saveToStorage(this.QUIZ_KEY, data.quiz);
      if (data.overall) this.saveToStorage(this.OVERALL_KEY, data.overall);
      
      return true;
    } catch (error) {
      console.error('Failed to import progress data:', error);
      return false;
    }
  }

  // For testing
  getStorageKeys(): string[] {
    return [this.RULES_KEY, this.PRACTICE_KEY, this.QUIZ_KEY, this.OVERALL_KEY];
  }
}