import { describe, it, expect } from 'vitest';
import { getMockLeaderboard } from '../src/lib/leaderboard';

describe('getMockLeaderboard', () => {
  const data = getMockLeaderboard();
  it('returns 25 entries', () => {
    expect(data).toHaveLength(25);
  });

  it('entries contain name and streak', () => {
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('streak');
  });
});
