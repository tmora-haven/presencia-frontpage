import { describe, expect, it } from 'vitest';
import { ConfigError, resolveApiBase } from './config';

describe('resolveApiBase', () => {
  it('accepts an https origin and normalises to origin/', () => {
    expect(resolveApiBase('https://presenciapr.com/wp-json/?x=1').toString()).toBe('https://presenciapr.com/');
  });

  it('rejects missing values', () => {
    expect(() => resolveApiBase(undefined)).toThrow(ConfigError);
    expect(() => resolveApiBase('  ')).toThrow(ConfigError);
  });

  it('rejects non-https and malformed URLs', () => {
    expect(() => resolveApiBase('http://presenciapr.com')).toThrow(/https/);
    expect(() => resolveApiBase('not a url')).toThrow(ConfigError);
  });
});
