import { describe, it, expect } from 'vitest';
import { getMotivationQuote, motivationQuotes } from '../src/lib/motivation';

describe('getMotivationQuote', () => {
  it('returns one of the predefined quotes', () => {
    const quote = getMotivationQuote();
    expect(motivationQuotes).toContain(quote);
  });
});
