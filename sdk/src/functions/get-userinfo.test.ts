import { describe, expect, test, vi } from 'vitest';
import { JWK } from 'jose';
import { getUserinfo } from './get-userinfo';

describe('getUserinfo', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  test('should return the email on a successful request', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/require-await
        json: async () => ({ email: 'foo@bar.com' }),
      })),
    });

    const d = await import('../utils/decode-id-token');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo', iss: 'https://idp.foo.bar/' } })),
    });

    await expect(getUserinfo('1234', publicKey, privateKey)).resolves.toStrictEqual({ email: 'foo@bar.com' });

  });

  test('should throw an error on a failed request', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: false,
      })),
    });

    const d = await import('../utils/decode-id-token');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo', iss: 'https://idp.foo.bar/' } })),
    });

    await expect(getUserinfo('1234', publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw an error when email is not available in the response', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/require-await
        json: async () => ({  }),
      })),
    });

    const d = await import('../utils/decode-id-token');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo', iss: 'https://idp.foo.bar/' } })),
    });

    await expect(getUserinfo('1234', publicKey, privateKey)).rejects.toThrow();

  });

});

