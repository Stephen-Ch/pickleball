export interface RuleCard {
  id: number;
  title: string;
  shortText: string;
  moreInfo: string;
}

export const RULES_CARDS: RuleCard[] = [
  {
    id: 1,
    title: 'Serve Diagonally',
    shortText: 'The serve must be hit diagonally cross-court and land within the opposite service box.',
    moreInfo: 'The server stands behind the baseline and serves underhand, aiming diagonally. The ball must clear the non-volley zone and land in the correct service court.'
  },
  {
    id: 2,
    title: 'Double Bounce Rule',
    shortText: 'Each side must play their first shot off the bounce before volleys are allowed.',
    moreInfo: 'After the serve, the receiving team must let the ball bounce before returning. The serving team must also let the return bounce before playing it. Only then can volleys be played.'
  },
  {
    id: 3,
    title: 'Non-Volley Zone (Kitchen)',
    shortText: 'Players cannot volley the ball while standing in the non-volley zone (the kitchen).',
    moreInfo: 'The non-volley zone is a 7-foot area on both sides of the net. You can enter the kitchen to play a ball that bounces, but you must exit before volleying.'
  },
  {
    id: 4,
    title: 'Scoring',
    shortText: 'Points are scored only by the serving team. Games are typically played to 11, win by 2.',
    moreInfo: 'If the serving team wins a rally, they score a point and continue serving. If the receiving team wins, no point is scored and serve passes.'
  },
  {
    id: 5,
    title: 'Faults',
    shortText: 'A fault is any action that stops play because of a rule violation.',
    moreInfo: 'Common faults: hitting the ball out, not clearing the net, volleying in the kitchen, or serving incorrectly.'
  },
  {
    id: 6,
    title: 'Let Serves',
    shortText: 'If the serve hits the net but lands in the correct service box, it is replayed (a let).',
    moreInfo: 'Let serves do not count as faults. The server simply serves again with no penalty.'
  }
];
