export interface PracticeScenario {
  id: number;
  prompt: string;
  options: string[];
  answer: number; // index of correct option
  feedback: string[]; // feedback for each option
}

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 1,
    prompt: 'It’s the start of a new game. Where should the server stand?',
    options: ['Right side', 'Left side', 'Anywhere behind the baseline'],
    answer: 0,
    feedback: [
      'Correct! The server always starts from the right side at the beginning of a game.',
      'Not quite. The first serve always starts from the right side.',
      'Not quite. The server must start from the right side for the first serve.'
    ]
  },
  {
    id: 2,
    prompt: 'The serve lands in the kitchen. What’s the call?',
    options: ['Let, replay the serve', 'Fault, point to receiver', 'Play on'],
    answer: 1,
    feedback: [
      'Nope. A serve landing in the kitchen is a fault, not a let.',
      'Correct! Serves must clear the kitchen. Point to the receiver.',
      'No, play stops. A serve in the kitchen is a fault.'
    ]
  },
  {
    id: 3,
    prompt: 'After the serve, the return bounces, and the serving team volleys the next shot. Is this legal?',
    options: ['Yes', 'No'],
    answer: 1,
    feedback: [
      'Not quite. Both teams must let the ball bounce once before volleys are allowed.',
      'Correct! The two-bounce rule means both teams must let the ball bounce before volleying.'
    ]
  },
  {
    id: 4,
    prompt: 'Who can call a kitchen fault?',
    options: ['Only the referee', 'Any player on the court', 'Only the receiving team'],
    answer: 1,
    feedback: [
      'Not quite. Any player can call a kitchen fault.',
      'Correct! Any player may call a kitchen (non-volley zone) fault.',
      'No, any player can call a kitchen fault.'
    ]
  },
  {
    id: 5,
    prompt: 'The wrong player serves. What happens?',
    options: ['Replay the point', 'Fault, serve lost', 'Let, replay the serve'],
    answer: 1,
    feedback: [
      'No, serving out of turn is a fault and the serve is lost.',
      'Correct! Wrong server is a fault and serve is lost.',
      'No, it’s not a let. Serve is lost.'
    ]
  }
];
