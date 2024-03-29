import { describe, expect, test, vi } from 'vitest';
import { JWK } from 'jose';
import { generateCodeVerifier } from '../utils/generate-code-verifier';
import { exchangeCode } from './exchange-code';

describe('exchangeCode', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };
  const codeVerifier = generateCodeVerifier();

  test('should return the token on a successful request', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/require-await
        json: async () => ({ id_token: '456' }),
      })),
    });

    await expect(exchangeCode('https://idp.foo.bar', '123', 'client-id', 'https://app.foo.bar/redirect', codeVerifier, publicKey, privateKey)).resolves.toBe('456');

  });

  test('should throw an error on a failed request', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: false,
      })),
    });

    await expect(exchangeCode('https://idp.foo.bar', '123', 'client-id', 'https://app.foo.bar/redirect', codeVerifier, publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw an error on a successful request that does not contain a token', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/require-await
        json: async () => ({ }),
      })),
    });

    await expect(exchangeCode('https://idp.foo.bar', '123', 'client-id', 'https://app.foo.bar/redirect', codeVerifier, publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw an error when providing an invalid idp base uri', async () => {

    await expect(exchangeCode('bla', '123', 'client-id', 'https://app.foo.bar/redirect', codeVerifier, publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw an error when providing an invalid redirect uri', async () => {

    await expect(exchangeCode('https://idp.foo.bar', '123', 'client-id', 'bla', codeVerifier, publicKey, privateKey)).rejects.toThrow();

  });

});

