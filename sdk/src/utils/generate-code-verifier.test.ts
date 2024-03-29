import { describe, expect, test } from 'vitest';
import { generateCodeVerifier } from './generate-code-verifier';

describe('generateCodeVerifier()', () => {

  test('should return a code verifier of the desired length', () => {

    expect(generateCodeVerifier(100)).toHaveLength(100);
    expect(generateCodeVerifier(70)).toHaveLength(70);

  });

  test('should return a code verifier that only contains valid code verifier characters', () => {

    const result = generateCodeVerifier(100);
    expect(result).toBeDefined();

    // eslint-disable-next-line no-useless-escape
    const regex = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-\.\_\~]{43,128}$/;
    expect(regex.test(result)).toBe(true);

  });

  test('should throw when parameter length is less than 43', () => {

    expect(() => generateCodeVerifier(42)).toThrow('A PKCE code_verifier has to be at least 43 characters long');

  });

  test('should throw when parameter length is greater than 128', () => {

    expect(() => generateCodeVerifier(129)).toThrow('A PKCE code_verifier can not contain more than 128 characters');

  });

});
