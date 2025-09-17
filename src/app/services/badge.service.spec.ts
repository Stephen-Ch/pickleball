import { TestBed } from '@angular/core/testing';
import { BadgeService, Badge, BadgeStatus } from './badge.service';
import { ProgressService, UserProgress } from './progress.service';

describe('BadgeService', () => {
  let service: BadgeService;
  let progressService: jasmine.SpyObj<ProgressService>;

  const mockInitialProgress: UserProgress = {
    rules: {
      cardsViewed: new Set<string>(),
      totalCardsViewed: 0,
      completedSections: new Set<string>(),
      lastViewedCard: null,
      firstViewDate: null,
      lastViewDate: null
    },
    practice: {
      scenariosCompleted: 0,
      totalAttempts: 0,
      correctAnswers: 0,
      accuracyPercentage: 0,
      bestAccuracy: 0,
      completedSessions: 0,
      lastSessionDate: null,
      scenarioTypes: {}
    },
    quiz: {
      bestScore: 0,
      bestPercentage: 0,
      bestGrade: 'F',
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      overallAccuracy: 0,
      lastQuizDate: null,
      perfectScores: 0,
      scores: []
    },
    overall: {
      totalTimeSpent: 0,
      firstVisit: null,
      lastActivity: null,
      sessionsCount: 0
    }
  };

  beforeEach(() => {
    const progressSpy = jasmine.createSpyObj('ProgressService', ['getUserProgress']);
    
    TestBed.configureTestingModule({
      providers: [
        BadgeService,
        { provide: ProgressService, useValue: progressSpy }
      ]
    });
    
    service = TestBed.inject(BadgeService);
    progressService = TestBed.inject(ProgressService) as jasmine.SpyObj<ProgressService>;
    
    // Default to initial progress
    progressService.getUserProgress.and.returnValue(mockInitialProgress);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBadgeStatus', () => {
    it('should return initial status with no badges earned', () => {
      const status = service.getBadgeStatus();
      
      expect(status.totalBadges).toBe(3);
      expect(status.earnedBadges).toBe(0);
      expect(status.badges.length).toBe(3);
      expect(status.isNearComplete).toBe(false);
      expect(status.encouragementMessage).toBeUndefined();
      
      // Check all badges are unearned
      status.badges.forEach(badge => {
        expect(badge.isEarned).toBe(false);
        expect(badge.earnedDate).toBeUndefined();
        expect(badge.progressNeeded).toBeTruthy();
      });
    });

    it('should detect near completion when exactly one badge is missing', () => {
      const progressWithTwoBadges: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8']),
          totalCardsViewed: 8,
          completedSections: new Set(),
          lastViewedCard: 'rule8',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        },
        practice: {
          scenariosCompleted: 5,
          totalAttempts: 5,
          correctAnswers: 4,
          accuracyPercentage: 85,
          bestAccuracy: 85,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        }
        // Quiz still at 0, so one badge missing
      };
      
      progressService.getUserProgress.and.returnValue(progressWithTwoBadges);
      
      const status = service.getBadgeStatus();
      
      expect(status.earnedBadges).toBe(2);
      expect(status.totalBadges).toBe(3);
      expect(status.isNearComplete).toBe(true);
      expect(status.encouragementMessage).toContain("You're almost there!");
      expect(status.encouragementMessage).toContain("quiz");
    });

    it('should not show near completion when all badges are earned', () => {
      const progressWithAllBadges: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8']),
          totalCardsViewed: 8,
          completedSections: new Set(),
          lastViewedCard: 'rule8',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        },
        practice: {
          scenariosCompleted: 5,
          totalAttempts: 5,
          correctAnswers: 4,
          accuracyPercentage: 85,
          bestAccuracy: 85,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        },
        quiz: {
          ...mockInitialProgress.quiz,
          totalQuizzesTaken: 1,
          bestScore: 10,
          bestPercentage: 100,
          lastQuizDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithAllBadges);
      
      const status = service.getBadgeStatus();
      
      expect(status.earnedBadges).toBe(3);
      expect(status.totalBadges).toBe(3);
      expect(status.isNearComplete).toBe(false);
      expect(status.encouragementMessage).toBeUndefined();
    });

    it('should not show near completion when no badges are earned', () => {
      const status = service.getBadgeStatus();
      
      expect(status.earnedBadges).toBe(0);
      expect(status.isNearComplete).toBe(false);
      expect(status.encouragementMessage).toBeUndefined();
    });
  });

  describe('Rules Complete Badge', () => {
    it('should not be earned when no rules viewed', () => {
      const status = service.getBadgeStatus();
      const rulesBadge = status.badges.find(b => b.id === 'rules-complete');
      
      expect(rulesBadge).toBeTruthy();
      expect(rulesBadge!.isEarned).toBe(false);
      expect(rulesBadge!.progressNeeded).toBe('View 8 more rules');
    });

    it('should not be earned when some rules viewed', () => {
      const progressWithSomeRules: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5']),
          totalCardsViewed: 5,
          completedSections: new Set(),
          lastViewedCard: 'rule5',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithSomeRules);
      
      const status = service.getBadgeStatus();
      const rulesBadge = status.badges.find(b => b.id === 'rules-complete');
      
      expect(rulesBadge!.isEarned).toBe(false);
      expect(rulesBadge!.progressNeeded).toBe('View 3 more rules');
    });

    it('should be earned when all rules viewed', () => {
      const earnedDate = new Date();
      const progressWithAllRules: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8']),
          totalCardsViewed: 8,
          completedSections: new Set(),
          lastViewedCard: 'rule8',
          firstViewDate: new Date(),
          lastViewDate: earnedDate
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithAllRules);
      
      const status = service.getBadgeStatus();
      const rulesBadge = status.badges.find(b => b.id === 'rules-complete');
      
      expect(rulesBadge!.isEarned).toBe(true);
      expect(rulesBadge!.earnedDate).toEqual(earnedDate);
      expect(rulesBadge!.progressNeeded).toBeUndefined();
    });

    it('should handle single rule remaining correctly', () => {
      const progressWithMostRules: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7']),
          totalCardsViewed: 7,
          completedSections: new Set(),
          lastViewedCard: 'rule7',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithMostRules);
      
      const status = service.getBadgeStatus();
      const rulesBadge = status.badges.find(b => b.id === 'rules-complete');
      
      expect(rulesBadge!.isEarned).toBe(false);
      expect(rulesBadge!.progressNeeded).toBe('View 1 more rule');
    });
  });

  describe('Practice Complete Badge', () => {
    it('should not be earned with no practice', () => {
      const status = service.getBadgeStatus();
      const practiceBadge = status.badges.find(b => b.id === 'practice-complete');
      
      expect(practiceBadge!.isEarned).toBe(false);
      expect(practiceBadge!.progressNeeded).toBe('Achieve 80% accuracy and complete 5 more scenarios');
    });

    it('should not be earned with good accuracy but insufficient scenarios', () => {
      const progressWithGoodAccuracy: UserProgress = {
        ...mockInitialProgress,
        practice: {
          scenariosCompleted: 3,
          totalAttempts: 3,
          correctAnswers: 3,
          accuracyPercentage: 90,
          bestAccuracy: 90,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithGoodAccuracy);
      
      const status = service.getBadgeStatus();
      const practiceBadge = status.badges.find(b => b.id === 'practice-complete');
      
      expect(practiceBadge!.isEarned).toBe(false);
      expect(practiceBadge!.progressNeeded).toBe('Complete 2 more scenarios');
    });

    it('should not be earned with enough scenarios but poor accuracy', () => {
      const progressWithPoorAccuracy: UserProgress = {
        ...mockInitialProgress,
        practice: {
          scenariosCompleted: 6,
          totalAttempts: 10,
          correctAnswers: 6,
          accuracyPercentage: 60,
          bestAccuracy: 60,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithPoorAccuracy);
      
      const status = service.getBadgeStatus();
      const practiceBadge = status.badges.find(b => b.id === 'practice-complete');
      
      expect(practiceBadge!.isEarned).toBe(false);
      expect(practiceBadge!.progressNeeded).toBe('Achieve 80% accuracy (currently 60%)');
    });

    it('should be earned with good accuracy and enough scenarios', () => {
      const earnedDate = new Date();
      const progressWithGoodPractice: UserProgress = {
        ...mockInitialProgress,
        practice: {
          scenariosCompleted: 5,
          totalAttempts: 6,
          correctAnswers: 5,
          accuracyPercentage: 85,
          bestAccuracy: 85,
          completedSessions: 1,
          lastSessionDate: earnedDate,
          scenarioTypes: {}
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithGoodPractice);
      
      const status = service.getBadgeStatus();
      const practiceBadge = status.badges.find(b => b.id === 'practice-complete');
      
      expect(practiceBadge!.isEarned).toBe(true);
      expect(practiceBadge!.earnedDate).toEqual(earnedDate);
      expect(practiceBadge!.progressNeeded).toBeUndefined();
    });

    it('should handle edge case of exactly 80% accuracy', () => {
      const progressWithExactAccuracy: UserProgress = {
        ...mockInitialProgress,
        practice: {
          scenariosCompleted: 5,
          totalAttempts: 5,
          correctAnswers: 4,
          accuracyPercentage: 80,
          bestAccuracy: 80,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithExactAccuracy);
      
      const status = service.getBadgeStatus();
      const practiceBadge = status.badges.find(b => b.id === 'practice-complete');
      
      expect(practiceBadge!.isEarned).toBe(true);
    });
  });

  describe('Quiz Perfect Badge', () => {
    it('should not be earned with no quizzes taken', () => {
      const status = service.getBadgeStatus();
      const quizBadge = status.badges.find(b => b.id === 'quiz-perfect');
      
      expect(quizBadge!.isEarned).toBe(false);
      expect(quizBadge!.progressNeeded).toBe('Take a quiz and score 100%');
    });

    it('should not be earned with less than 100%', () => {
      const progressWithGoodQuiz: UserProgress = {
        ...mockInitialProgress,
        quiz: {
          ...mockInitialProgress.quiz,
          totalQuizzesTaken: 3,
          bestScore: 9,
          bestPercentage: 90,
          lastQuizDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithGoodQuiz);
      
      const status = service.getBadgeStatus();
      const quizBadge = status.badges.find(b => b.id === 'quiz-perfect');
      
      expect(quizBadge!.isEarned).toBe(false);
      expect(quizBadge!.progressNeeded).toBe('Score 100% on a quiz (best score: 90%)');
    });

    it('should be earned with 100% score', () => {
      const earnedDate = new Date();
      const progressWithPerfectQuiz: UserProgress = {
        ...mockInitialProgress,
        quiz: {
          ...mockInitialProgress.quiz,
          totalQuizzesTaken: 1,
          bestScore: 10,
          bestPercentage: 100,
          lastQuizDate: earnedDate
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressWithPerfectQuiz);
      
      const status = service.getBadgeStatus();
      const quizBadge = status.badges.find(b => b.id === 'quiz-perfect');
      
      expect(quizBadge!.isEarned).toBe(true);
      expect(quizBadge!.earnedDate).toEqual(earnedDate);
      expect(quizBadge!.progressNeeded).toBeUndefined();
    });
  });

  describe('Badge Properties', () => {
    it('should have correct badge properties', () => {
      const status = service.getBadgeStatus();
      
      const rulesBadge = status.badges.find(b => b.id === 'rules-complete');
      expect(rulesBadge!.name).toBe('Rules Master');
      expect(rulesBadge!.description).toBe('Viewed all pickleball rule cards');
      expect(rulesBadge!.icon).toBe('📚');
      expect(rulesBadge!.category).toBe('rules');
      
      const practiceBadge = status.badges.find(b => b.id === 'practice-complete');
      expect(practiceBadge!.name).toBe('Practice Pro');
      expect(practiceBadge!.description).toBe('Completed practice scenarios with 80%+ accuracy');
      expect(practiceBadge!.icon).toBe('🎯');
      expect(practiceBadge!.category).toBe('practice');
      
      const quizBadge = status.badges.find(b => b.id === 'quiz-perfect');
      expect(quizBadge!.name).toBe('Quiz Champion');
      expect(quizBadge!.description).toBe('Achieved 100% on a pickleball quiz');
      expect(quizBadge!.icon).toBe('🏆');
      expect(quizBadge!.category).toBe('quiz');
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      const mixedProgress: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8']),
          totalCardsViewed: 8,
          completedSections: new Set(),
          lastViewedCard: 'rule8',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        },
        practice: {
          scenariosCompleted: 3,
          totalAttempts: 5,
          correctAnswers: 3,
          accuracyPercentage: 70,
          bestAccuracy: 70,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        },
        quiz: {
          ...mockInitialProgress.quiz,
          totalQuizzesTaken: 1,
          bestScore: 10,
          bestPercentage: 100,
          lastQuizDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(mixedProgress);
    });

    it('should return earned badges only', () => {
      const earnedBadges = service.getEarnedBadges();
      
      expect(earnedBadges.length).toBe(2);
      expect(earnedBadges.map(b => b.id)).toContain('rules-complete');
      expect(earnedBadges.map(b => b.id)).toContain('quiz-perfect');
      expect(earnedBadges.map(b => b.id)).not.toContain('practice-complete');
    });

    it('should return unearned badges only', () => {
      const unearnedBadges = service.getUnearnedBadges();
      
      expect(unearnedBadges.length).toBe(1);
      expect(unearnedBadges[0].id).toBe('practice-complete');
    });

    it('should find badge by ID', () => {
      const rulesBadge = service.getBadgeById('rules-complete');
      expect(rulesBadge).toBeTruthy();
      expect(rulesBadge!.name).toBe('Rules Master');
      
      const nonExistentBadge = service.getBadgeById('non-existent');
      expect(nonExistentBadge).toBeUndefined();
    });

    it('should calculate completion percentage', () => {
      const percentage = service.getCompletionPercentage();
      expect(percentage).toBe(67); // 2 out of 3 badges = 66.67% rounded to 67%
    });

    it('should calculate 100% completion', () => {
      const allEarnedProgress: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8']),
          totalCardsViewed: 8,
          completedSections: new Set(),
          lastViewedCard: 'rule8',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        },
        practice: {
          scenariosCompleted: 5,
          totalAttempts: 5,
          correctAnswers: 4,
          accuracyPercentage: 85,
          bestAccuracy: 85,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        },
        quiz: {
          ...mockInitialProgress.quiz,
          totalQuizzesTaken: 1,
          bestScore: 10,
          bestPercentage: 100,
          lastQuizDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(allEarnedProgress);
      
      const percentage = service.getCompletionPercentage();
      expect(percentage).toBe(100);
    });

    it('should calculate 0% completion', () => {
      progressService.getUserProgress.and.returnValue(mockInitialProgress);
      
      const percentage = service.getCompletionPercentage();
      expect(percentage).toBe(0);
    });
  });

  describe('Encouragement Messages', () => {
    it('should provide rules encouragement when rules badge missing', () => {
      const progressMissingRules: UserProgress = {
        ...mockInitialProgress,
        practice: {
          scenariosCompleted: 5,
          totalAttempts: 5,
          correctAnswers: 4,
          accuracyPercentage: 85,
          bestAccuracy: 85,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        },
        quiz: {
          ...mockInitialProgress.quiz,
          totalQuizzesTaken: 1,
          bestScore: 10,
          bestPercentage: 100,
          lastQuizDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressMissingRules);
      
      const status = service.getBadgeStatus();
      expect(status.encouragementMessage).toContain('rule cards');
      expect(status.encouragementMessage).toContain('Rules Master');
    });

    it('should provide practice encouragement when practice badge missing', () => {
      const progressMissingPractice: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8']),
          totalCardsViewed: 8,
          completedSections: new Set(),
          lastViewedCard: 'rule8',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        },
        quiz: {
          ...mockInitialProgress.quiz,
          totalQuizzesTaken: 1,
          bestScore: 10,
          bestPercentage: 100,
          lastQuizDate: new Date()
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressMissingPractice);
      
      const status = service.getBadgeStatus();
      expect(status.encouragementMessage).toContain('practice scenarios');
      expect(status.encouragementMessage).toContain('Practice Pro');
    });

    it('should provide quiz encouragement when quiz badge missing', () => {
      const progressMissingQuiz: UserProgress = {
        ...mockInitialProgress,
        rules: {
          cardsViewed: new Set(['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6', 'rule7', 'rule8']),
          totalCardsViewed: 8,
          completedSections: new Set(),
          lastViewedCard: 'rule8',
          firstViewDate: new Date(),
          lastViewDate: new Date()
        },
        practice: {
          scenariosCompleted: 5,
          totalAttempts: 5,
          correctAnswers: 4,
          accuracyPercentage: 85,
          bestAccuracy: 85,
          completedSessions: 1,
          lastSessionDate: new Date(),
          scenarioTypes: {}
        }
      };
      
      progressService.getUserProgress.and.returnValue(progressMissingQuiz);
      
      const status = service.getBadgeStatus();
      expect(status.encouragementMessage).toContain('quiz');
      expect(status.encouragementMessage).toContain('Quiz Champion');
    });
  });
});