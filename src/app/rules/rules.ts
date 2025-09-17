import { Component, OnInit } from '@angular/core';
import { Shell } from '../shell/shell';
import { RuleCard, PICKLEBALL_RULES, getNextRule, getPreviousRule, getCurrentRuleNumber, getTotalRules } from './rules-data';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-rules',
  imports: [Shell],
  templateUrl: './rules.html',
  styleUrl: './rules.scss'
})
export class Rules implements OnInit {
  currentRule: RuleCard = PICKLEBALL_RULES[0];
  currentRuleNumber: number = 1;
  totalRules: number = getTotalRules();
  
  constructor(private progressService: ProgressService) {}
  
  get canGoNext(): boolean {
    return getNextRule(this.currentRule.id) !== null;
  }
  
  get canGoPrevious(): boolean {
    return getPreviousRule(this.currentRule.id) !== null;
  }
  
  get isFirstRule(): boolean {
    return this.currentRuleNumber === 1;
  }
  
  get isLastRule(): boolean {
    return this.currentRuleNumber === this.totalRules;
  }

  get rulesProgress() {
    return this.progressService.getRulesProgress();
  }

  get completionPercentage(): number {
    const progress = this.rulesProgress;
    return Math.round((progress.totalCardsViewed / this.totalRules) * 100);
  }

  get hasViewedCurrentCard(): boolean {
    return this.rulesProgress.cardsViewed.has(this.currentRule.id);
  }

  ngOnInit(): void {
    // Start with the first rule
    this.setCurrentRule(PICKLEBALL_RULES[0]);
  }

  nextRule(): void {
    const nextRule = getNextRule(this.currentRule.id);
    if (nextRule) {
      this.setCurrentRule(nextRule);
    }
  }

  previousRule(): void {
    const previousRule = getPreviousRule(this.currentRule.id);
    if (previousRule) {
      this.setCurrentRule(previousRule);
    }
  }

  goToRule(rule: RuleCard): void {
    this.setCurrentRule(rule);
  }

  markSectionCompleted(section: string): void {
    this.progressService.markRuleSectionCompleted(section);
  }

  private setCurrentRule(rule: RuleCard): void {
    this.currentRule = rule;
    this.currentRuleNumber = getCurrentRuleNumber(rule.id);
    
    // Track that this card has been viewed
    // Use a simple section classification based on rule content/title
    const section = this.getSectionFromRule(rule);
    this.progressService.markRuleCardViewed(rule.id, section);
    
    // Check if we've completed all rules (simplified completion logic)
    const progress = this.progressService.getRulesProgress();
    if (progress.totalCardsViewed === this.totalRules) {
      this.progressService.markRuleSectionCompleted('all-rules');
    }
  }

  private getSectionFromRule(rule: RuleCard): string {
    // Simple categorization based on rule ID or title
    if (rule.id.includes('serve') || rule.title.toLowerCase().includes('serv')) {
      return 'serving';
    }
    if (rule.id.includes('score') || rule.title.toLowerCase().includes('scor')) {
      return 'scoring';
    }
    if (rule.id.includes('volley') || rule.id.includes('kitchen') || rule.title.toLowerCase().includes('volley')) {
      return 'court-zones';
    }
    if (rule.id.includes('fault') || rule.title.toLowerCase().includes('fault')) {
      return 'faults';
    }
    return 'general-rules';
  }

  getAllRules(): RuleCard[] {
    return PICKLEBALL_RULES;
  }

  // For testing purposes
  getCurrentRuleForTesting(): RuleCard {
    return this.currentRule;
  }
}
