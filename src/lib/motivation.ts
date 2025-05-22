export const motivationQuotes = [
  'Keep going, you are doing great!',
  'Every step forward matters!',
  'Believe in yourself and keep moo-ving!',
];

export function getMotivationQuote(): string {
  return motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
}
