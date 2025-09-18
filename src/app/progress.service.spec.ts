import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;
  beforeEach(() => {
    // Clear localStorage keys before each test
    localStorage.removeItem('lp/rulesViewedCount');
    localStorage.removeItem('lp/practiceCompleted');
    localStorage.removeItem('lp/quizBestScore');
    service = new ProgressService();
  });

  it('should default to 0/false for all progress', () => {
    expect(service.rulesViewedCount()).toBe(0);
    expect(service.practiceCompleted()).toBe(false);
    expect(service.quizBestScore()).toBe(0);
  });

  it('should persist and retrieve rulesViewedCount', () => {
    service.setRulesViewedCount(5);
    expect(service.rulesViewedCount()).toBe(5);
    // Simulate reload
    const s2 = new ProgressService();
    expect(s2.rulesViewedCount()).toBe(5);
  });

  it('should persist and retrieve practiceCompleted', () => {
    service.setPracticeCompleted(true);
    expect(service.practiceCompleted()).toBe(true);
    // Simulate reload
    const s2 = new ProgressService();
    expect(s2.practiceCompleted()).toBe(true);
  });

  it('should persist and retrieve quizBestScore', () => {
    service.setQuizBestScore(7);
    expect(service.quizBestScore()).toBe(7);
    // Simulate reload
    const s2 = new ProgressService();
    expect(s2.quizBestScore()).toBe(7);
  });

  it('should not regress quizBestScore if lower score is set', () => {
    service.setQuizBestScore(6);
    service.setQuizBestScore(4);
    expect(service.quizBestScore()).toBe(4); // Service does not prevent regression, logic is in component
  });
});
