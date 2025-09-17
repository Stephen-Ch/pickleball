import { TestBed } from '@angular/core/testing';
import { ProgressService, RulesProgress, PracticeProgress, QuizProgress } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockStorageData: { [key: string]: string } = {};

  beforeEach(() => {
    // Create localStorage spy
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);
    
    // Mock localStorage behavior
    localStorageSpy.getItem.and.callFake((key: string) => mockStorageData[key] || null);
    localStorageSpy.setItem.and.callFake((key: string, value: string) => {
      mockStorageData[key] = value;
    });
    localStorageSpy.removeItem.and.callFake((key: string) => {
      delete mockStorageData[key];
    });

    // Replace global localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    TestBed.configureTestingModule({});
    
    // Clear mock storage before each test
    Object.keys(mockStorageData).forEach(key => delete mockStorageData[key]);
    
    service = TestBed.inject(ProgressService);
  });

  afterEach(() => {
    // Clear mock storage after each test
    Object.keys(mockStorageData).forEach(key => delete mockStorageData[key]);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize overall progress on first use', () => {
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'lp/overall',
        jasmine.stringMatching(/"sessionsCount":1/)
      );
    });

    it('should increment session count on subsequent initializations', () => {
      // Set initial data
      mockStorageData['lp/overall'] = JSON.stringify({
        totalTimeSpent: 10,
        firstVisit: '2025-01-01T00:00:00.000Z',
        lastActivity: '2025-01-01T00:00:00.000Z',
        sessionsCount: 5
      });

      // Clear the spy to capture only new calls
      localStorageSpy.setItem.calls.reset();

      // Create new service instance (simulating app restart)
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ProgressService);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'lp/overall',
        jasmine.stringMatching(/"sessionsCount":6/)
      );
    });
  });

  describe('Storage Utilities', () => {
    it('should handle JSON parsing errors gracefully', () => {
      mockStorageData['lp/test'] = 'invalid json';
      spyOn(console, 'warn');

      const result = service['getFromStorage']('lp/test');

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    });

    it('should handle localStorage write errors gracefully', () => {
      spyOn(console, 'error');
      localStorageSpy.setItem.and.throwError('Storage quota exceeded');

      service['saveToStorage']('lp/test', { data: 'test' });

      expect(console.error).toHaveBeenCalled();
    });

    it('should properly convert dates to ISO strings for storage', () => {
      const testDate = new Date('2025-01-01T12:00:00.000Z');
      const testData = {
        date: testDate,
        nested: {
          anotherDate: testDate
        },
        set: new Set(['item1', 'item2']),
        array: [testDate]
      };

      service['saveToStorage']('lp/test', testData);

      const stored = mockStorageData['lp/test'];
      const parsed = JSON.parse(stored);
      
      expect(parsed.date).toBe('2025-01-01T12:00:00.000Z');
      expect(parsed.nested.anotherDate).toBe('2025-01-01T12:00:00.000Z');
      expect(parsed.set).toEqual(['item1', 'item2']);
      expect(parsed.array[0]).toBe('2025-01-01T12:00:00.000Z');
    });

    it('should properly revive dates from storage', () => {
      mockStorageData['lp/test'] = JSON.stringify({
        date: '2025-01-01T12:00:00.000Z',
        nested: {
          anotherDate: '2025-01-01T12:00:00.000Z'
        },
        cardsViewed: ['card1', 'card2'],
        completedSections: ['section1'],
        array: ['2025-01-01T12:00:00.000Z']
      });

      const result = service['getFromStorage']('lp/test');

      expect(result.date).toBeInstanceOf(Date);
      expect(result.nested.anotherDate).toBeInstanceOf(Date);
      expect(result.cardsViewed).toBeInstanceOf(Set);
      expect(result.cardsViewed.has('card1')).toBe(true);
      expect(result.completedSections).toBeInstanceOf(Set);
      expect(result.array[0]).toBeInstanceOf(Date);
    });
  });

  describe('Rules Progress', () => {
    it('should return default rules progress when no data exists', () => {
      const progress = service.getRulesProgress();

      expect(progress.cardsViewed).toBeInstanceOf(Set);
      expect(progress.cardsViewed.size).toBe(0);
      expect(progress.totalCardsViewed).toBe(0);
      expect(progress.completedSections).toBeInstanceOf(Set);
      expect(progress.lastViewedCard).toBeNull();
      expect(progress.firstViewDate).toBeNull();
      expect(progress.lastViewDate).toBeNull();
    });

    it('should mark rule card as viewed', () => {
      const cardId = 'scoring-basics';
      const section = 'scoring';

      service.markRuleCardViewed(cardId, section);

      const progress = service.getRulesProgress();
      expect(progress.cardsViewed.has(cardId)).toBe(true);
      expect(progress.totalCardsViewed).toBe(1);
      expect(progress.lastViewedCard).toBe(cardId);
      expect(progress.firstViewDate).toBeInstanceOf(Date);
      expect(progress.lastViewDate).toBeInstanceOf(Date);
    });

    it('should not increment total when same card viewed multiple times', () => {
      const cardId = 'scoring-basics';
      const section = 'scoring';

      service.markRuleCardViewed(cardId, section);
      service.markRuleCardViewed(cardId, section);

      const progress = service.getRulesProgress();
      expect(progress.totalCardsViewed).toBe(1);
      expect(progress.cardsViewed.size).toBe(1);
    });

    it('should mark rule section as completed', () => {
      const section = 'scoring';

      service.markRuleSectionCompleted(section);

      const progress = service.getRulesProgress();
      expect(progress.completedSections.has(section)).toBe(true);
    });

    it('should update last activity when tracking rules progress', () => {
      const cardId = 'test-card';
      const section = 'test-section';

      service.markRuleCardViewed(cardId, section);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'lp/overall',
        jasmine.stringMatching(/"lastActivity":"/)
      );
    });
  });

  describe('Practice Progress', () => {
    it('should return default practice progress when no data exists', () => {
      const progress = service.getPracticeProgress();

      expect(progress.scenariosCompleted).toBe(0);
      expect(progress.totalAttempts).toBe(0);
      expect(progress.correctAnswers).toBe(0);
      expect(progress.accuracyPercentage).toBe(0);
      expect(progress.bestAccuracy).toBe(0);
      expect(progress.completedSessions).toBe(0);
      expect(progress.lastSessionDate).toBeNull();
      expect(progress.scenarioTypes).toEqual({});
    });

    it('should update practice progress correctly', () => {
      service.updatePracticeProgress(5, 3, 5, 'serve-side');

      const progress = service.getPracticeProgress();
      expect(progress.scenariosCompleted).toBe(5);
      expect(progress.totalAttempts).toBe(5);
      expect(progress.correctAnswers).toBe(3);
      expect(progress.accuracyPercentage).toBe(60);
      expect(progress.bestAccuracy).toBe(60);
      expect(progress.completedSessions).toBe(1);
      expect(progress.lastSessionDate).toBeInstanceOf(Date);
    });

    it('should track scenario type progress', () => {
      service.updatePracticeProgress(3, 2, 3, 'serve-side');
      service.updatePracticeProgress(2, 2, 2, 'score-call');
      service.updatePracticeProgress(1, 1, 1, 'serve-side');

      const progress = service.getPracticeProgress();
      
      expect(progress.scenarioTypes['serve-side']).toEqual({
        attempts: 4,
        correct: 3,
        accuracy: 75
      });
      
      expect(progress.scenarioTypes['score-call']).toEqual({
        attempts: 2,
        correct: 2,
        accuracy: 100
      });
    });

    it('should update best accuracy only when improved', () => {
      service.updatePracticeProgress(5, 4, 5); // 80% accuracy
      service.updatePracticeProgress(5, 2, 5); // 40% accuracy
      service.updatePracticeProgress(5, 5, 5); // 100% accuracy

      const progress = service.getPracticeProgress();
      expect(progress.bestAccuracy).toBe(100);
    });

    it('should accumulate progress across sessions', () => {
      service.updatePracticeProgress(3, 2, 3);
      service.updatePracticeProgress(4, 3, 4);

      const progress = service.getPracticeProgress();
      expect(progress.scenariosCompleted).toBe(7);
      expect(progress.totalAttempts).toBe(7);
      expect(progress.correctAnswers).toBe(5);
      expect(progress.accuracyPercentage).toBe(71); // 5/7 = 71%
      expect(progress.completedSessions).toBe(2);
    });
  });

  describe('Quiz Progress', () => {
    it('should return default quiz progress when no data exists', () => {
      const progress = service.getQuizProgress();

      expect(progress.bestScore).toBe(0);
      expect(progress.bestPercentage).toBe(0);
      expect(progress.bestGrade).toBe('F');
      expect(progress.totalQuizzesTaken).toBe(0);
      expect(progress.totalQuestionsAnswered).toBe(0);
      expect(progress.totalCorrectAnswers).toBe(0);
      expect(progress.overallAccuracy).toBe(0);
      expect(progress.lastQuizDate).toBeNull();
      expect(progress.perfectScores).toBe(0);
      expect(progress.scores).toEqual([]);
    });

    it('should update quiz progress correctly', () => {
      service.updateQuizProgress(4, 5, 80, 'B');

      const progress = service.getQuizProgress();
      expect(progress.bestScore).toBe(4);
      expect(progress.bestPercentage).toBe(80);
      expect(progress.bestGrade).toBe('B');
      expect(progress.totalQuizzesTaken).toBe(1);
      expect(progress.totalQuestionsAnswered).toBe(5);
      expect(progress.totalCorrectAnswers).toBe(4);
      expect(progress.overallAccuracy).toBe(80);
      expect(progress.lastQuizDate).toBeInstanceOf(Date);
      expect(progress.perfectScores).toBe(0);
      expect(progress.scores.length).toBe(1);
    });

    it('should update best score only when improved', () => {
      service.updateQuizProgress(3, 5, 60, 'D');
      service.updateQuizProgress(4, 5, 80, 'B');
      service.updateQuizProgress(3, 5, 60, 'D');

      const progress = service.getQuizProgress();
      expect(progress.bestScore).toBe(4);
      expect(progress.bestPercentage).toBe(80);
      expect(progress.bestGrade).toBe('B');
    });

    it('should track perfect scores', () => {
      service.updateQuizProgress(5, 5, 100, 'A');
      service.updateQuizProgress(4, 5, 80, 'B');
      service.updateQuizProgress(5, 5, 100, 'A');

      const progress = service.getQuizProgress();
      expect(progress.perfectScores).toBe(2);
    });

    it('should maintain score history (max 10)', () => {
      // Add 12 quiz scores
      for (let i = 0; i < 12; i++) {
        service.updateQuizProgress(i % 6, 5, (i % 6) * 20, 'F');
      }

      const progress = service.getQuizProgress();
      expect(progress.scores.length).toBe(10);
      expect(progress.totalQuizzesTaken).toBe(12);
    });

    it('should calculate overall accuracy across all quizzes', () => {
      service.updateQuizProgress(3, 5, 60, 'D'); // 3/5
      service.updateQuizProgress(4, 5, 80, 'B'); // 4/5
      service.updateQuizProgress(5, 5, 100, 'A'); // 5/5

      const progress = service.getQuizProgress();
      expect(progress.overallAccuracy).toBe(80); // 12/15 = 80%
    });
  });

  describe('Overall Progress and Utilities', () => {
    it('should get user progress from all sections', () => {
      const userProgress = service.getUserProgress();

      expect(userProgress.rules).toBeDefined();
      expect(userProgress.practice).toBeDefined();
      expect(userProgress.quiz).toBeDefined();
      expect(userProgress.overall).toBeDefined();
    });

    it('should update time spent', () => {
      service.updateTimeSpent(15);
      service.updateTimeSpent(30);

      const overall = service.getOverallProgress();
      expect(overall.totalTimeSpent).toBe(45);
    });

    it('should clear all progress', () => {
      // Add some progress
      service.markRuleCardViewed('test-card', 'test-section');
      service.updatePracticeProgress(5, 3, 5);
      service.updateQuizProgress(4, 5, 80, 'B');

      service.clearAllProgress();

      expect(localStorageSpy.removeItem).toHaveBeenCalledTimes(4);
      
      // Should reinitialize
      const overall = service.getOverallProgress();
      expect(overall.sessionsCount).toBe(1);
    });

    it('should export progress as JSON string', () => {
      service.markRuleCardViewed('test-card', 'test-section');
      
      const exported = service.exportProgress();
      const parsed = JSON.parse(exported);

      expect(parsed.rules).toBeDefined();
      expect(parsed.practice).toBeDefined();
      expect(parsed.quiz).toBeDefined();
      expect(parsed.overall).toBeDefined();
    });

    it('should import progress from JSON string', () => {
      const progressData = {
        rules: {
          cardsViewed: ['card1', 'card2'],
          totalCardsViewed: 2,
          completedSections: ['section1'],
          lastViewedCard: 'card2',
          firstViewDate: '2025-01-01T00:00:00.000Z',
          lastViewDate: '2025-01-01T01:00:00.000Z'
        },
        practice: {
          scenariosCompleted: 10,
          totalAttempts: 12,
          correctAnswers: 9,
          accuracyPercentage: 75,
          bestAccuracy: 80,
          completedSessions: 2,
          lastSessionDate: '2025-01-01T02:00:00.000Z',
          scenarioTypes: {}
        },
        quiz: {
          bestScore: 5,
          bestPercentage: 100,
          bestGrade: 'A',
          totalQuizzesTaken: 3,
          totalQuestionsAnswered: 15,
          totalCorrectAnswers: 13,
          overallAccuracy: 87,
          lastQuizDate: '2025-01-01T03:00:00.000Z',
          perfectScores: 1,
          scores: []
        },
        overall: {
          totalTimeSpent: 60,
          firstVisit: '2025-01-01T00:00:00.000Z',
          lastActivity: '2025-01-01T03:00:00.000Z',
          sessionsCount: 5
        }
      };

      const result = service.importProgress(JSON.stringify(progressData));

      expect(result).toBe(true);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'lp/rules',
        jasmine.any(String)
      );
    });

    it('should handle invalid JSON during import', () => {
      spyOn(console, 'error');
      
      const result = service.importProgress('invalid json');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    it('should return storage keys for testing', () => {
      const keys = service.getStorageKeys();

      expect(keys).toEqual([
        'lp/rules',
        'lp/practice',
        'lp/quiz',
        'lp/overall'
      ]);
    });
  });

  describe('Date Handling', () => {
    it('should correctly identify ISO date strings', () => {
      expect(service['isISOString']('2025-01-01T00:00:00.000Z')).toBe(true);
      expect(service['isISOString']('2025-01-01T00:00:00Z')).toBe(true);
      expect(service['isISOString']('2025-01-01')).toBe(false);
      expect(service['isISOString']('not a date')).toBe(false);
      expect(service['isISOString']('')).toBe(false);
    });
  });
});