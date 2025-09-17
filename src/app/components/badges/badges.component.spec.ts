import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgesComponent } from './badges.component';
import { BadgeService, BadgeStatus, Badge } from '../../services/badge.service';

describe('BadgesComponent', () => {
  let component: BadgesComponent;
  let fixture: ComponentFixture<BadgesComponent>;
  let badgeService: jasmine.SpyObj<BadgeService>;

  const mockBadgeStatus: BadgeStatus = {
    totalBadges: 3,
    earnedBadges: 1,
    isNearComplete: false,
    badges: [
      {
        id: 'rules-complete',
        name: 'Rules Master',
        description: 'Viewed all pickleball rule cards',
        icon: '📚',
        category: 'rules',
        isEarned: true,
        earnedDate: new Date('2024-01-15')
      },
      {
        id: 'practice-complete',
        name: 'Practice Pro',
        description: 'Completed practice scenarios with 80%+ accuracy',
        icon: '🎯',
        category: 'practice',
        isEarned: false,
        progressNeeded: 'Complete 3 more scenarios'
      },
      {
        id: 'quiz-perfect',
        name: 'Quiz Champion',
        description: 'Achieved 100% on a pickleball quiz',
        icon: '🏆',
        category: 'quiz',
        isEarned: false,
        progressNeeded: 'Take a quiz and score 100%'
      }
    ]
  };

  beforeEach(async () => {
    const badgeServiceSpy = jasmine.createSpyObj('BadgeService', ['getBadgeStatus']);
    badgeServiceSpy.getBadgeStatus.and.returnValue(mockBadgeStatus);

    await TestBed.configureTestingModule({
      imports: [BadgesComponent],
      providers: [
        { provide: BadgeService, useValue: badgeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgesComponent);
    component = fixture.componentInstance;
    badgeService = TestBed.inject(BadgeService) as jasmine.SpyObj<BadgeService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with badge status from service', () => {
    expect(component.badgeStatus).toEqual(mockBadgeStatus);
    expect(badgeService.getBadgeStatus).toHaveBeenCalled();
  });

  describe('Component Rendering', () => {
    it('should display the badges title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('.badges-title');
      expect(title?.textContent).toContain('Your Achievements');
    });

    it('should display progress summary', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const progressText = compiled.querySelector('.progress-text');
      expect(progressText?.textContent).toContain('1 / 3 Badges Earned');
    });

    it('should display progress bar with correct width', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const progressFill = compiled.querySelector('.progress-fill') as HTMLElement;
      expect(progressFill?.style.width).toBe('33.3333%'); // 1/3 = 33.33%
    });

    it('should render all badge cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const badgeCards = compiled.querySelectorAll('.badge-card');
      expect(badgeCards.length).toBe(3);
    });

    it('should mark earned badges correctly', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const earnedBadge = compiled.querySelector('.badge-card.earned');
      const unearnedBadges = compiled.querySelectorAll('.badge-card.unearned');
      
      expect(earnedBadge).toBeTruthy();
      expect(unearnedBadges.length).toBe(2);
    });

    it('should display badge properties correctly', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const badgeCards = compiled.querySelectorAll('.badge-card');
      
      // Check first badge (Rules Master - earned)
      const firstBadge = badgeCards[0];
      expect(firstBadge.querySelector('.badge-icon')?.textContent).toBe('📚');
      expect(firstBadge.querySelector('.badge-name')?.textContent).toBe('Rules Master');
      expect(firstBadge.querySelector('.badge-description')?.textContent).toBe('Viewed all pickleball rule cards');
      expect(firstBadge.querySelector('.badge-earned-date')).toBeTruthy();
      
      // Check second badge (Practice Pro - unearned)
      const secondBadge = badgeCards[1];
      expect(secondBadge.querySelector('.badge-icon')?.textContent).toBe('🎯');
      expect(secondBadge.querySelector('.badge-name')?.textContent).toBe('Practice Pro');
      expect(secondBadge.querySelector('.badge-progress-needed')?.textContent?.trim()).toBe('Complete 3 more scenarios');
    });

    it('should not show encouragement message when not near complete', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const encouragementMessage = compiled.querySelector('.encouragement-message');
      expect(encouragementMessage).toBeFalsy();
    });

    it('should not show all badges complete message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const allComplete = compiled.querySelector('.all-badges-complete');
      expect(allComplete).toBeFalsy();
    });

    it('should not show no badges message when some earned', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const noBadges = compiled.querySelector('.no-badges-yet');
      expect(noBadges).toBeFalsy();
    });
  });

  describe('Near Completion State', () => {
    beforeEach(() => {
      const nearCompleteStatus: BadgeStatus = {
        ...mockBadgeStatus,
        earnedBadges: 2,
        isNearComplete: true,
        encouragementMessage: "You're almost there! Take the quiz and aim for 100% to become a Quiz Champion! 🏆",
        badges: [
          {
            ...mockBadgeStatus.badges[0],
            isEarned: true
          },
          {
            ...mockBadgeStatus.badges[1],
            isEarned: true,
            earnedDate: new Date('2024-01-16')
          },
          {
            ...mockBadgeStatus.badges[2],
            isEarned: false
          }
        ]
      };
      
      badgeService.getBadgeStatus.and.returnValue(nearCompleteStatus);
      component.badgeStatus = nearCompleteStatus;
      fixture.detectChanges();
    });

    it('should display encouragement message when near complete', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const encouragementMessage = compiled.querySelector('.encouragement-message');
      expect(encouragementMessage).toBeTruthy();
      expect(encouragementMessage?.textContent).toContain("You're almost there!");
      expect(encouragementMessage?.textContent).toContain("Quiz Champion");
    });

    it('should show encouragement icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const encouragementIcon = compiled.querySelector('.encouragement-icon');
      expect(encouragementIcon?.textContent).toBe('🌟');
    });
  });

  describe('All Badges Complete State', () => {
    beforeEach(() => {
      const allCompleteStatus: BadgeStatus = {
        totalBadges: 3,
        earnedBadges: 3,
        isNearComplete: false,
        badges: mockBadgeStatus.badges.map(badge => ({
          ...badge,
          isEarned: true,
          earnedDate: new Date('2024-01-15')
        }))
      };
      
      badgeService.getBadgeStatus.and.returnValue(allCompleteStatus);
      component.badgeStatus = allCompleteStatus;
      fixture.detectChanges();
    });

    it('should display all badges complete message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const allComplete = compiled.querySelector('.all-badges-complete');
      expect(allComplete).toBeTruthy();
      expect(allComplete?.textContent).toContain('Congratulations!');
      expect(allComplete?.textContent).toContain("You've earned all available badges!");
    });

    it('should show celebration icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const celebrationIcon = compiled.querySelector('.celebration-icon');
      expect(celebrationIcon?.textContent).toBe('🎉');
    });

    it('should show 100% progress', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const progressText = compiled.querySelector('.progress-text');
      expect(progressText?.textContent).toContain('3 / 3 Badges Earned');
      
      const progressFill = compiled.querySelector('.progress-fill') as HTMLElement;
      expect(progressFill?.style.width).toBe('100%');
    });
  });

  describe('No Badges Earned State', () => {
    beforeEach(() => {
      const noBadgesStatus: BadgeStatus = {
        totalBadges: 3,
        earnedBadges: 0,
        isNearComplete: false,
        badges: mockBadgeStatus.badges.map(badge => ({
          ...badge,
          isEarned: false,
          earnedDate: undefined
        }))
      };
      
      badgeService.getBadgeStatus.and.returnValue(noBadgesStatus);
      component.badgeStatus = noBadgesStatus;
      fixture.detectChanges();
    });

    it('should display no badges message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const noBadges = compiled.querySelector('.no-badges-yet');
      expect(noBadges).toBeTruthy();
      expect(noBadges?.textContent).toContain('Ready to Start Your Journey?');
      expect(noBadges?.textContent).toContain('Complete activities to earn your first badge');
    });

    it('should show motivation icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const motivationIcon = compiled.querySelector('.motivation-icon');
      expect(motivationIcon?.textContent).toBe('💪');
    });

    it('should show 0% progress', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const progressText = compiled.querySelector('.progress-text');
      expect(progressText?.textContent).toContain('0 / 3 Badges Earned');
      
      const progressFill = compiled.querySelector('.progress-fill') as HTMLElement;
      expect(progressFill?.style.width).toBe('0%');
    });

    it('should mark all badges as unearned', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const earnedBadges = compiled.querySelectorAll('.badge-card.earned');
      const unearnedBadges = compiled.querySelectorAll('.badge-card.unearned');
      
      expect(earnedBadges.length).toBe(0);
      expect(unearnedBadges.length).toBe(3);
    });
  });

  describe('formatEarnedDate', () => {
    it('should format today correctly', () => {
      const today = new Date();
      expect(component.formatEarnedDate(today)).toBe('today');
    });

    it('should format yesterday correctly', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(component.formatEarnedDate(yesterday)).toBe('yesterday');
    });

    it('should format days ago correctly', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      expect(component.formatEarnedDate(threeDaysAgo)).toBe('3 days ago');
    });

    it('should format weeks ago correctly', () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      expect(component.formatEarnedDate(twoWeeksAgo)).toBe('2 weeks ago');
    });

    it('should format weeks ago (singular) correctly', () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      expect(component.formatEarnedDate(oneWeekAgo)).toBe('1 week ago');
    });

    it('should format old dates with locale string', () => {
      const oldDate = new Date('2023-01-15');
      const result = component.formatEarnedDate(oldDate);
      expect(result).toBe(oldDate.toLocaleDateString());
    });

    it('should handle null date', () => {
      expect(component.formatEarnedDate(null as any)).toBe('');
    });

    it('should handle undefined date', () => {
      expect(component.formatEarnedDate(undefined as any)).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mainTitle = compiled.querySelector('h1');
      const badgeNames = compiled.querySelectorAll('h3');
      
      expect(mainTitle).toBeTruthy();
      expect(badgeNames.length).toBeGreaterThan(0);
    });

    it('should have descriptive text for earned badges', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const earnedBadge = compiled.querySelector('.badge-card.earned');
      const earnedDate = earnedBadge?.querySelector('.badge-earned-date');
      
      expect(earnedDate?.textContent).toContain('Earned');
    });

    it('should provide progress information for unearned badges', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const unearnedBadges = compiled.querySelectorAll('.badge-card.unearned');
      
      unearnedBadges.forEach(badge => {
        const progressNeeded = badge.querySelector('.badge-progress-needed');
        expect(progressNeeded?.textContent).toBeTruthy();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should apply mobile-friendly classes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.badges-container');
      const grid = compiled.querySelector('.badges-grid');
      
      expect(container).toBeTruthy();
      expect(grid).toBeTruthy();
    });
  });
});