import { describe, expect, test, vi } from 'vitest';
import * as jose from 'jose';
import { generateKeys } from './generate-keys';

describe('generateKeys()', () => {

  test('should return both the private and the public key', async () => {

    const result = generateKeys();
    await expect(result).resolves.toBeDefined();
    const awaitedRsult = await result;
    expect(awaitedRsult.privateKey).toBeDefined();
    expect(awaitedRsult.publicKey).toBeDefined();

  });

  test('should use ES256 algorithm by default', async () => {

    const spy = vi.spyOn(jose, 'generateKeyPair');

    const result = generateKeys();
    await expect(result).resolves.toBeDefined();

    const awaitedResult = await result;
    expect(awaitedResult.publicKey.alg).toBe('ES256');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('ES256', { extractable: true });

  });

  test('should use the algorithm provided by the user', async () => {

    const spy = vi.spyOn(jose, 'generateKeyPair');

    const result = generateKeys('ES512');
    await expect(result).resolves.toBeDefined();

    const awaitedResult = await result;
    expect(awaitedResult.publicKey.alg).toBe('ES512');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('ES512', { extractable: true });

  });

  test('should throw when something goes wrong', async () => {

    vi.spyOn(jose, 'generateKeyPair').mockRejectedValueOnce(undefined);

    const result = generateKeys();
    await expect(result).rejects.toThrow('An error occurred while generating keys with algorithm ES256');

  });

});
