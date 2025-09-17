// Pickleball Rules Data
// Small collection of rule cards for the card stack explorer

export interface RuleCard {
  id: string;
  title: string;
  shortText: string;
  moreInfoUrl: string; // Placeholder for future external links
}

export const PICKLEBALL_RULES: RuleCard[] = [
  {
    id: 'basic-serve',
    title: 'Basic Serving Rules',
    shortText: 'The serve must be made underhand with the paddle below the waist. The ball must bounce once on each side before volleys are allowed.',
    moreInfoUrl: 'https://usapickleball.org/what-is-pickleball/how-to-play/basics/'
  },
  {
    id: 'double-bounce',
    title: 'Double Bounce Rule',
    shortText: 'After the serve, each team must let the ball bounce once on their side before returning it. This prevents aggressive net play immediately.',
    moreInfoUrl: 'https://usapickleball.org/what-is-pickleball/how-to-play/basics/'
  },
  {
    id: 'non-volley-zone',
    title: 'Non-Volley Zone (Kitchen)',
    shortText: 'The 7-foot area on both sides of the net where you cannot hit the ball in the air (volley). You can enter this zone to play a ball that has bounced.',
    moreInfoUrl: 'https://usapickleball.org/what-is-pickleball/how-to-play/basics/'
  },
  {
    id: 'scoring-system',
    title: 'Scoring System',
    shortText: 'Games are played to 11 points, win by 2. Only the serving team can score points. Scores are called as three numbers: serving team, receiving team, server number.',
    moreInfoUrl: 'https://usapickleball.org/what-is-pickleball/how-to-play/basics/'
  },
  {
    id: 'fault-rules',
    title: 'Common Faults',
    shortText: 'A fault occurs when: the ball is hit out of bounds, into the net, or volleyed in the non-volley zone. The serve must also clear the net and land in the correct service court.',
    moreInfoUrl: 'https://usapickleball.org/what-is-pickleball/how-to-play/basics/'
  },
  {
    id: 'server-rotation',
    title: 'Server Rotation',
    shortText: 'In doubles, both players on a team get to serve (except at the start). The first server serves until a fault, then the second server serves until a fault, then service goes to the other team.',
    moreInfoUrl: 'https://usapickleball.org/what-is-pickleball/how-to-play/basics/'
  }
];

export function getRuleById(id: string): RuleCard | undefined {
  return PICKLEBALL_RULES.find(rule => rule.id === id);
}

export function getRuleIndex(id: string): number {
  return PICKLEBALL_RULES.findIndex(rule => rule.id === id);
}

export function getNextRule(currentId: string): RuleCard | null {
  const currentIndex = getRuleIndex(currentId);
  if (currentIndex === -1 || currentIndex === PICKLEBALL_RULES.length - 1) {
    return null;
  }
  return PICKLEBALL_RULES[currentIndex + 1];
}

export function getPreviousRule(currentId: string): RuleCard | null {
  const currentIndex = getRuleIndex(currentId);
  if (currentIndex <= 0) {
    return null;
  }
  return PICKLEBALL_RULES[currentIndex - 1];
}

export function getTotalRules(): number {
  return PICKLEBALL_RULES.length;
}

export function getCurrentRuleNumber(id: string): number {
  return getRuleIndex(id) + 1;
}