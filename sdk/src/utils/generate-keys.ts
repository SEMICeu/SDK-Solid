import { exportJWK, generateKeyPair, JWK } from 'jose';
/**
 * Consists of all possible algorithms supported for key generation
 */
export type KeyGenerationAlgorithm =
  'ECDH-ES' |
  'ECDH-ES+A128KW' |
  'ECDH-ES+A192KW' |
  'ECDH-ES+A256KW' |
  'EdDSA' |
  'ES256' |
  'ES256K' |
  'ES384' |
  'ES512' |
  'PS256' |
  'PS384' |
  'PS512' |
  'RS256' |
  'RS384' |
  'RS512' |
  'RSA-OAEP-256' |
  'RSA-OAEP-384' |
  'RSA-OAEP-512' |
  'RSA-OAEP' |
  'RSA1_5';

export interface generateKeysReturnObject {
  privateKey: JWK;
  publicKey: JWK;
}

/**
 * Generate a private- and public key
 *
 * @param algorithm - The desired algorithm to be used to generate the key pair.
 * @returns An object containing the public and private key.
 */
export const generateKeys = async (
  algorithm: KeyGenerationAlgorithm = 'ES256',
): Promise<generateKeysReturnObject> => {

  try {

    const keyPair = await generateKeyPair(algorithm, { extractable: true });

    const privateKey = await exportJWK(keyPair.privateKey);
    const publicKey = await exportJWK(keyPair.publicKey);

    return {
      privateKey,
      publicKey: { ...publicKey, alg: algorithm },
    };

  } catch (error: unknown) {

    throw new Error(`An error occurred while generating keys with algorithm ${algorithm}`);

  }

};
