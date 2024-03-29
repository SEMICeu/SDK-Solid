import { describe, expect, test, vi } from 'vitest';
import { JWK } from 'jose';
import { discoverData } from './discover-data';

describe('discoverData', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  test('should return list of resources', async () => {

    const d = await import('../utils/decode-id-token');
    const w = await import('../functions/get-webid-profile');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(w, 'getWebIdProfile', {
      writable: true,
      value: vi.fn().mockResolvedValue({ storageLocations: [ 'https://pods1.use.id/foo', 'https://pods2.use.id/foo' ] }),
    });

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn()
        .mockImplementationOnce(() => ({
          ok: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          json: async () => ({ subject_type_combinations: [
            {
              subject: 's1',
              type: 't1',
              resources: [
                { uri: 'u1' },
              ],
            },
            {
              subject: 's1',
              type: 't2',
              resources: [
                { uri: 'u2' },
              ],
            },
          ] }),
        }))
        .mockImplementationOnce(() => ({
          ok: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          json: async () => ({ subject_type_combinations: [
            {
              subject: 's1',
              type: 't3',
              resources: [
                { uri: 'u3' },
              ],
            },
          ] }),
        })),
    });

    expect((await discoverData('https://idp.foo.bar', publicKey, privateKey)).sort((a, b) => a.type.localeCompare(b.type))).toStrictEqual([
      {
        subject: 's1',
        type: 't1',
        uri: 'u1',
      },
      {
        subject: 's1',
        type: 't2',
        uri: 'u2',
      },
      {
        subject: 's1',
        type: 't3',
        uri: 'u3',
      },
    ].sort((a, b) => a.type.localeCompare(b.type)));

  });

  test('should throw error when an invalid storageLocation is found in the webid profile', async () => {

    const d = await import('../utils/decode-id-token');
    const w = await import('../functions/get-webid-profile');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(w, 'getWebIdProfile', {
      writable: true,
      value: vi.fn().mockResolvedValue({ storageLocations: [ 'abc' ] }),
    });

    await expect(discoverData('https://idp.foo.bar', publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw when a discovery call fails', async () => {

    const d = await import('../utils/decode-id-token');
    const w = await import('../functions/get-webid-profile');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(w, 'getWebIdProfile', {
      writable: true,
      value: vi.fn().mockResolvedValue({ storageLocations: [ 'https://pods1.use.id/foo' ] }),
    });

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn()
        .mockImplementationOnce(() => ({
          ok: false,
        })),
    });

    await expect(discoverData('https://idp.foo.bar', publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw when the discovery body is not an object', async () => {

    const d = await import('../utils/decode-id-token');
    const w = await import('../functions/get-webid-profile');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(w, 'getWebIdProfile', {
      writable: true,
      value: vi.fn().mockResolvedValue({ storageLocations: [ 'https://pods1.use.id/foo' ] }),
    });

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn()
        .mockImplementationOnce(() => ({
          ok: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          json: async () => 'bla',
        })),
    });

    await expect(discoverData('https://idp.foo.bar', publicKey, privateKey)).rejects.toThrow();

  });

  test('should return empty array when discovery request does not return subject type combinations', async () => {

    const d = await import('../utils/decode-id-token');
    const w = await import('../functions/get-webid-profile');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(w, 'getWebIdProfile', {
      writable: true,
      value: vi.fn().mockResolvedValue({ storageLocations: [ 'https://pods1.use.id/foo' ] }),
    });

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn()
        .mockImplementationOnce(() => ({
          ok: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          json: async () => ({ bla: [
            {
              subject: 's1',
              type: 't1',
              resources: [
                { uri: 'u1' },
              ],
            },
            {
              subject: 's1',
              type: 't2',
              resources: [
                { uri: 'u2' },
              ],
            },
          ] }),
        })),
    });

    await expect(discoverData('https://idp.foo.bar', publicKey, privateKey)).resolves.toStrictEqual([]);

  });

  test('should throw when discovery call contains invalid metadata', async () => {

    const d = await import('../utils/decode-id-token');
    const w = await import('../functions/get-webid-profile');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(w, 'getWebIdProfile', {
      writable: true,
      value: vi.fn().mockResolvedValue({ storageLocations: [ 'https://pods1.use.id/foo' ] }),
    });

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn()
        .mockImplementationOnce(() => ({
          ok: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          json: async () => ({ subject_type_combinations: [
            {
              bla: 's1',
              type: 't1',
              resources: [
                { uri: 'u1' },
              ],
            },
            {
              subject: 's1',
              type: 't2',
              resources: [
                { uri: 'u2' },
              ],
            },
          ] }),
        })),
    });

    await expect(discoverData('https://idp.foo.bar', publicKey, privateKey)).rejects.toThrow();

  });

  test('should throw when discovery call contains invalid resources', async () => {

    const d = await import('../utils/decode-id-token');
    const w = await import('../functions/get-webid-profile');

    Object.defineProperty(d, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(w, 'getWebIdProfile', {
      writable: true,
      value: vi.fn().mockResolvedValue({ storageLocations: [ 'https://pods1.use.id/foo' ] }),
    });

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn()
        .mockImplementationOnce(() => ({
          ok: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          json: async () => ({ subject_type_combinations: [
            {
              subject: 's1',
              type: 't1',
              resources: [
                { uri: 'u1' },
              ],
            },
            {
              subject: 's1',
              type: 't2',
              resources: 'bla',
            },
          ] }),
        })),
    });

    await expect(discoverData('https://idp.foo.bar', publicKey, privateKey)).rejects.toThrow();

  });

});

