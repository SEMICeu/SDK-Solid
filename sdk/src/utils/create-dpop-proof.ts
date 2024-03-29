import { SignJWT, importJWK, JWK, base64url } from 'jose';
import { v4 } from 'uuid';

/**
 * Creates a DPoP proof signed by the private key.
 *
 * @param htm -  The HTTP method for the request to which the JWT is attached.
 * @param htu - The HTTP URI used for the request, without query and fragment parts.
 * @param publicKey - The public key.
 * @param privateKey - The private key.
 * @param token - The token sent with the request.
 * @returns DPoP proof string
 */
export const createDpopProof = async (
  htm: string,
  htu: string,
  publicKey: JWK,
  privateKey: JWK,
  token?: string,
): Promise<string> => {

  // Throw error if not algorithm is set
  if(!publicKey.alg) {

    throw new Error('No alg set on public key');

  }

  // The uri should not contain query parameters on an hash
  const noQueryAndHashHtu = htu.split('#')[0].split('?')[0];

  let ath: string|undefined;

  if(token){

    const t = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));

    ath= base64url.encode(Uint8Array.from(new Uint8Array(t)));

  }

  // Sign the JWT with the given keys and payloadd
  return await new SignJWT({ htm, htu: noQueryAndHashHtu, ... ath ? { ath } : {} })
    .setProtectedHeader({
      alg: publicKey.alg,
      typ: 'dpop+jwt',
      jwk: publicKey,
    })
    .setJti(v4())
    .setIssuedAt()
    .sign(await importJWK(privateKey, publicKey.alg));

};
