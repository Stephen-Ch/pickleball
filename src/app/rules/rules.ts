import { Component, OnInit } from '@angular/core';
import { Shell } from '../shell/shell';
import { RuleCard, PICKLEBALL_RULES, getNextRule, getPreviousRule, getCurrentRuleNumber, getTotalRules } from './rules-data';

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

  getAllRules(): RuleCard[] {
    return PICKLEBALL_RULES;
  }

  private setCurrentRule(rule: RuleCard): void {
    this.currentRule = rule;
    this.currentRuleNumber = getCurrentRuleNumber(rule.id);
  }

  // For testing purposes
  getCurrentRuleForTesting(): RuleCard {
    return this.currentRule;
  }
}
