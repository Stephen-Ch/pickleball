// Practice Scenarios for Pickleball Scoring
// Minimal set of scenarios covering serve side, score calling, and server rotation

export interface PracticeScenario {
  id: string;
  type: 'serve-side' | 'score-call' | 'next-server';
  title: string;
  description: string;
  situation: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'serve-side-1',
    type: 'serve-side',
    title: 'Basic Serve Side',
    description: 'Determine which side should serve first',
    situation: 'At the start of a new game, the score is 0-0-2.',
    question: 'Which team serves first?',
    options: [
      'Team A (left side of court)',
      'Team B (right side of court)',
      'Either team can choose',
      'The team that won the previous game'
    ],
    correctAnswer: 1,
    explanation: 'In pickleball, the serving team starts on the right side of their court. The score 0-0-2 indicates it\'s the start of the game (second server).',
    difficulty: 'beginner'
  },
  {
    id: 'score-call-1',
    type: 'score-call',
    title: 'Score Calling Basics',
    description: 'Practice calling the score correctly',
    situation: 'Your team has 7 points, the opposing team has 5 points, and you are the first server.',
    question: 'How should you call the score?',
    options: [
      '7-5-1',
      '5-7-1',
      '7-5-2',
      '1-7-5'
    ],
    correctAnswer: 0,
    explanation: 'The score is called as: your team\'s score, opposing team\'s score, server number. So it\'s 7-5-1.',
    difficulty: 'beginner'
  },
  {
    id: 'next-server-1',
    type: 'next-server',
    title: 'Server Rotation',
    description: 'Determine who serves next after a fault',
    situation: 'The score is 6-4-1. The first server commits a fault.',
    question: 'What happens next?',
    options: [
      'The second server on the same team serves',
      'Service goes to the opposing team',
      'The same player serves again',
      'The game is over'
    ],
    correctAnswer: 0,
    explanation: 'When the first server faults, the second server on the same team gets to serve. Only after both servers fault does service go to the opposing team.',
    difficulty: 'beginner'
  },
  {
    id: 'serve-side-2',
    type: 'serve-side',
    title: 'Service Side After Point',
    description: 'Determine serving position after scoring',
    situation: 'Your team just scored a point. The score is now 8-6-1, and you served from the right side.',
    question: 'Where do you serve from next?',
    options: [
      'Right side of the court',
      'Left side of the court',
      'Either side is fine',
      'The opposing team serves next'
    ],
    correctAnswer: 1,
    explanation: 'After scoring a point, the serving player switches sides and serves from the opposite side of the court.',
    difficulty: 'intermediate'
  },
  {
    id: 'score-call-2',
    type: 'score-call',
    title: 'Second Server Score Call',
    description: 'Practice calling score as second server',
    situation: 'The opposing team has 9 points, your team has 3 points, and you are the second server.',
    question: 'How should you call the score?',
    options: [
      '3-9-2',
      '9-3-2',
      '3-9-1',
      '2-3-9'
    ],
    correctAnswer: 0,
    explanation: 'Always call your team\'s score first, then the opposing team\'s score, then your server number (2 for second server).',
    difficulty: 'intermediate'
  },
  {
    id: 'next-server-2',
    type: 'next-server',
    title: 'Service Handover',
    description: 'Complex server rotation scenario',
    situation: 'The score is 10-8-2. The second server commits a fault.',
    question: 'What happens next?',
    options: [
      'The first server on the same team serves',
      'Service goes to the opposing team',
      'The same player serves again',
      'The receiving team gets 1 point'
    ],
    correctAnswer: 1,
    explanation: 'When the second server faults, service goes to the opposing team. They will start as server #1.',
    difficulty: 'intermediate'
  }
];

export function getScenarioById(id: string): PracticeScenario | undefined {
  return PRACTICE_SCENARIOS.find(scenario => scenario.id === id);
}

export function getScenariosByType(type: PracticeScenario['type']): PracticeScenario[] {
  return PRACTICE_SCENARIOS.filter(scenario => scenario.type === type);
}

export function getScenariosByDifficulty(difficulty: PracticeScenario['difficulty']): PracticeScenario[] {
  return PRACTICE_SCENARIOS.filter(scenario => scenario.difficulty === difficulty);
}

export function getRandomScenario(): PracticeScenario {
  const randomIndex = Math.floor(Math.random() * PRACTICE_SCENARIOS.length);
  return PRACTICE_SCENARIOS[randomIndex];
}

export function getNextScenario(currentId: string): PracticeScenario | null {
  const currentIndex = PRACTICE_SCENARIOS.findIndex(scenario => scenario.id === currentId);
  if (currentIndex === -1 || currentIndex === PRACTICE_SCENARIOS.length - 1) {
    return null;
  }
  return PRACTICE_SCENARIOS[currentIndex + 1];
}

export function getTotalScenarios(): number {
  return PRACTICE_SCENARIOS.length;
}

export function getCurrentScenarioNumber(id: string): number {
  const index = PRACTICE_SCENARIOS.findIndex(scenario => scenario.id === id);
  return index === -1 ? 0 : index + 1;
}