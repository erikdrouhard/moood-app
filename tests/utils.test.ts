import { describe, it, expect } from 'vitest';
import { cn, getWelcomeMessage } from '../src/lib/utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates class names', () => {
    expect(cn('foo', 'foo')).toBe('foo');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
  });

  it('handles newlines and extra whitespace', () => {
    expect(cn('foo\nbar', 'bar')).toBe('foo bar');
  });
});

describe('getWelcomeMessage', () => {
  it('returns default welcome when name is empty', () => {
    expect(getWelcomeMessage('')).toBe('Welcome!');
  });

  it('returns personalized welcome when name provided', () => {
    expect(getWelcomeMessage('Alice')).toBe('Welcome Alice!');
  });
});
