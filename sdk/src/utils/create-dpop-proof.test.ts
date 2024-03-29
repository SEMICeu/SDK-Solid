/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { JWK } from 'jose';
import { describe, expect, test } from 'vitest';
import { createDpopProof } from './create-dpop-proof';

// beforeEach(() => jest.clearAllMocks());
const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

describe('createDPoPProof()', () => {

  test('should return a DPoP proof', async () => {

    const result = await createDpopProof('GET', 'https://example.com/', publicKey, privateKey);
    expect(result).toBeDefined();

    const header = JSON.parse(atob(result.split('.')[0]));
    const payload = JSON.parse(atob(result.split('.')[1]));

    expect(header.alg).toBeDefined();
    expect(header.jwk).toBeDefined();
    expect(payload.htm).toBe('GET');
    expect(payload.ath).toBeUndefined();
    expect(payload.htu).toBe('https://example.com/');

  });

  test('should return a DPoP proof with ath', async () => {

    const result = createDpopProof('GET', 'https://example.com/', publicKey, privateKey, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    await expect(result).resolves.toBeDefined();

    const header = JSON.parse(atob((await result).split('.')[0]));
    const payload = JSON.parse(atob((await result).split('.')[1]));

    expect(header.alg).toBeDefined();
    expect(header.jwk).toBeDefined();
    expect(payload.htm).toBe('GET');
    expect(payload.ath).toBe('f3U2fniBJVE04Tdecj0d6orV9qT9t52TjfHxdUqDBgY');
    expect(payload.htu).toBe('https://example.com/');

  });

  test('should remove the hash of the htu when present', async () => {

    const result = createDpopProof('htm', 'https://example.com/test/profile/card#me', publicKey, privateKey);
    await expect(result).resolves.toBeDefined();

    const payload = JSON.parse(atob((await result).split('.')[1]));

    expect(payload.htu).toBe('https://example.com/test/profile/card');

  });

  test('should throw when publicKey does not have an alg', async () => {

    await expect(createDpopProof('htm', 'htu', { alg: undefined }, privateKey)).rejects.toThrow();

  });

});
