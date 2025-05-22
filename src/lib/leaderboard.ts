export interface LeaderboardEntry {
  name: string;
  streak: number;
}

export const getMockLeaderboard = (): LeaderboardEntry[] => [
  { name: 'Dr. Moo', streak: 42 },
  { name: 'Bessie', streak: 41 },
  { name: 'Captain Cow', streak: 39 },
  { name: 'Moolisa', streak: 36 },
  { name: 'PasturePal', streak: 34 },
  { name: 'Moo2D2', streak: 33 },
  { name: 'Sir Loin', streak: 31 },
  { name: 'Cheddar', streak: 29 },
  { name: 'Buttercup', streak: 28 },
  { name: 'Mooana', streak: 26 },
  { name: 'Milkshake', streak: 25 },
  { name: 'Whiskers', streak: 23 },
  { name: 'Grasshopper', streak: 22 },
  { name: 'Cowculus', streak: 21 },
  { name: 'Moozilla', streak: 19 },
  { name: 'Sundae', streak: 18 },
  { name: 'Mootron', streak: 17 },
  { name: 'Cownelius', streak: 15 },
  { name: 'Moochi', streak: 14 },
  { name: 'Moonshine', streak: 13 },
  { name: 'Cowabunga', streak: 12 },
  { name: 'Moolette', streak: 10 },
  { name: 'Hamburglar', streak: 9 },
  { name: 'Moozy', streak: 7 },
  { name: 'Cowffee', streak: 5 },
];
