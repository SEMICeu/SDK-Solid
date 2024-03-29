import { describe, expect, test, vi } from 'vitest';
import { JWK } from 'jose';
import { createData } from './create-data';

describe('retrieveData', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  test('should return location header after creating a new resource', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        headers: {
          get: vi.fn().mockImplementation(() => 'https://storage.foo.bar/1'),
        },
      })),
    });

    await expect(createData('https://storage.foo.bar', 'type', 'subject', 'content', 'contentType', '1234token', publicKey, privateKey)).resolves.toBe('https://storage.foo.bar/1');

  });

  test('should throw when providing an invalid storage location', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        headers: {
          get: vi.fn().mockImplementation(() => 'https://storage.foo.bar/1'),
        },
      })),
    });

    await expect(createData('bla', 'type', 'subject', 'content', 'contentType', '1234token', publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw when request fails', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: false,
      })),
    });

    await expect(createData('https://storage.foo.bar', 'type', 'subject', 'content', 'contentType', '1234token', publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw when providing an invalid storage location', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        headers: {
          get: vi.fn().mockImplementation(() => undefined),
        },
      })),
    });

    await expect(createData('https://storage.foo.bar', 'type', 'subject', 'content', 'contentType', '1234token', publicKey, privateKey)).rejects.toThrow();

  });

});

