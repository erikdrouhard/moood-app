import { describe, it, expect } from 'vitest';
import { cn } from '../src/lib/utils';

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
});
