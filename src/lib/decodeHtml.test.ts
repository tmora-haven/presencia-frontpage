import { describe, expect, it } from 'vitest';
import { decodeHtml } from './decodeHtml';

describe('decodeHtml', () => {
  it('decodes entities and strips tags', () => {
    expect(decodeHtml('<p>R&Iacute;O GRANDE &#8211; agua &amp; luz</p>')).toBe('RÍO GRANDE – agua & luz');
  });

  it('collapses whitespace and normalises the WP excerpt marker', () => {
    expect(decodeHtml('<p>Hola\n\n  mundo [&hellip;]</p>\n')).toBe('Hola mundo…');
  });

  it('neutralises script injection into plain text', () => {
    const out = decodeHtml('Titular <script>alert(1)</script><img src=x onerror=alert(1)>');
    expect(out).not.toMatch(/<|>/);
    expect(out).toContain('Titular');
  });

  it('handles empty input', () => {
    expect(decodeHtml(undefined)).toBe('');
    expect(decodeHtml('')).toBe('');
  });
});
