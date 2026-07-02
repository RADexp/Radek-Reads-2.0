import { describe, it, expect } from 'vitest';
import { sanitizeUrl } from './sanitize-url';

describe('sanitizeUrl', () => {
  it('przepuszcza http i https, zwracając znormalizowany href', () => {
    expect(sanitizeUrl('https://radekreads.pl')).toBe('https://radekreads.pl/');
    expect(sanitizeUrl('http://example.com/a')).toBe('http://example.com/a');
  });

  it('odrzuca niebezpieczne protokoły', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('data:text/html,<script>')).toBeNull();
    expect(sanitizeUrl('file:///etc/passwd')).toBeNull();
  });

  it('zwraca null dla pustego lub błędnego wejścia', () => {
    expect(sanitizeUrl(null)).toBeNull();
    expect(sanitizeUrl(undefined)).toBeNull();
    expect(sanitizeUrl('')).toBeNull();
    expect(sanitizeUrl('nie-jest-urlem')).toBeNull();
  });
});
