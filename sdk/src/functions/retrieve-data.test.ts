import { describe, expect, test, vi } from 'vitest';
import { JWK } from 'jose';
import { retrieveData } from './retrieve-data';

describe('retrieveData', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  test('should return content of the requested resource', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/require-await
        text: async () => 'foo bar',
      })),
    });

    await expect(retrieveData('https://idp.foo.bar', '1234token', publicKey, privateKey)).resolves.toBe('foo bar');

  });

  test('should throw when provided with an invalid url', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/require-await
        text: async () => 'foo bar',
      })),
    });

    await expect(retrieveData('foobar', '1234token', publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw when request to retrieve resource fails', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: false,
      })),
    });

    await expect(retrieveData('https://idp.foo.bar', '1234token', publicKey, privateKey)).rejects.toThrow();

  });

});

