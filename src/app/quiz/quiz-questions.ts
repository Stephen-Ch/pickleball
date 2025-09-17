export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "How many points do you need to win a pickleball game?",
    options: [
      "15 points",
      "11 points", 
      "21 points",
      "First to 7 points"
    ],
    correctAnswer: 1,
    explanation: "Most pickleball games are played to 11 points, and you must win by 2 points.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "When can you hit the ball in the air (volley) in pickleball?",
    options: [
      "Anywhere on the court",
      "Only behind the baseline", 
      "Anywhere except in the non-volley zone",
      "Only when serving"
    ],
    correctAnswer: 2,
    explanation: "You cannot volley (hit the ball in the air) while standing in the non-volley zone (the kitchen).",
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "What happens after the serve in pickleball?",
    options: [
      "The receiving team can volley immediately",
      "Both teams must let the ball bounce once",
      "Only the serving team must let it bounce", 
      "The point is automatically won"
    ],
    correctAnswer: 1,
    explanation: "After the serve, both teams must let the ball bounce once before they can volley. This is called the two-bounce rule.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "In doubles, who serves first when your team gets the serve?",
    options: [
      "The player on the right side",
      "The player on the left side",
      "Either player can choose",
      "The stronger player"
    ],
    correctAnswer: 0,
    explanation: "In doubles, the player on the right side of the court always serves first when their team gets the serve.",
    difficulty: 'easy'
  },
  {
    id: 5,
    question: "What is the correct score call when you're serving with a score of 8-6 and you're the first server?",
    options: [
      "8-6-1",
      "6-8-1", 
      "8-6-2",
      "6-8-2"
    ],
    correctAnswer: 0,
    explanation: "The score is called as: your score - opponent's score - server number. So 8-6-1 means you have 8, opponents have 6, and you're the first server.",
    difficulty: 'hard'
  },
  {
    id: 6,
    question: "Can the ball hit the net and still be in play?",
    options: [
      "No, it's always a fault",
      "Yes, if it goes over and lands in bounds",
      "Only on the serve",
      "Only in the non-volley zone"
    ],
    correctAnswer: 1,
    explanation: "The ball can hit the net and still be in play as long as it goes over the net and lands in the correct court area.",
    difficulty: 'medium'
  },
  {
    id: 7,
    question: "What happens if you step into the non-volley zone to hit a ball that has bounced?",
    options: [
      "It's a fault",
      "It's legal and the point continues",
      "You must return to the baseline",
      "The point is replayed"
    ],
    correctAnswer: 1,
    explanation: "You can step into the non-volley zone (kitchen) to hit a ball that has bounced. The no-volley rule only applies to hitting the ball in the air.",
    difficulty: 'hard'
  }
];

export function getRandomQuestions(count: number = 5): QuizQuestion[] {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, QUIZ_QUESTIONS.length));
}

export function calculateGrade(score: number, total: number): string {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function getGradeMessage(score: number, total: number): string {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) {
    return "Excellent! You're a pickleball rules expert! 🏆";
  }
  if (percentage >= 80) {
    return "Great job! You have a solid understanding of pickleball rules. 🎯";
  }
  if (percentage >= 70) {
    return "Good work! You know the basics but could brush up on some details. 👍";
  }
  if (percentage >= 60) {
    return "Not bad! Keep practicing and reviewing the rules. 📚";
  }
  return "Keep studying! Consider reviewing the rules section for more practice. 💪";
}