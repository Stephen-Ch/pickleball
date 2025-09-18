export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // index of correct option
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Where must the serve land?',
    options: ['Anywhere', 'In the kitchen', 'Diagonal service box'],
    answer: 2
  },
  {
    id: 2,
    question: 'How many bounces before volleys are allowed?',
    options: ['None', 'One', 'Two'],
    answer: 2
  },
  {
    id: 3,
    question: 'What is the kitchen?',
    options: ['Non-volley zone', 'Service box', 'Sideline'],
    answer: 0
  },
  {
    id: 4,
    question: 'Who can score a point?',
    options: ['Either team', 'Only the serving team', 'Only the receiving team'],
    answer: 1
  },
  {
    id: 5,
    question: 'What happens if the serve hits the net and lands in the correct box?',
    options: ['Let, replay', 'Fault', 'Point to receiver'],
    answer: 0
  },
  {
    id: 6,
    question: 'What is a fault?',
    options: ['Any rule violation', 'A type of serve', 'A winning shot'],
    answer: 0
  },
  {
    id: 7,
    question: 'Where does the first serve of a game start?',
    options: ['Left side', 'Right side', 'Anywhere'],
    answer: 1
  }
];
