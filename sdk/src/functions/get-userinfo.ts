import { v4 } from 'uuid';
import { JWK } from 'jose';
import { log } from '../utils/log';
import { createDpopProof } from '../utils/create-dpop-proof';
import { decodeIDToken } from '../main';

/**
 * Retrieves data about the user.
 *
 * @param token - Token of the user for which to retrieve data.
 * @param publicKey - Public key to be used for creating the DPoP proof.
 * @param privateKey - Private key to be used for creating the DPoP proof.
 * @returns The data about the user.
 */
export const getUserinfo = async (
  token: string,
  publicKey: JWK,
  privateKey: JWK
): Promise<{ email: string }> => {

  log('Starting to get data');

  // Generate a correlation and request id
  const correlationId = v4();
  const requestId = v4();

  const userinfoUri = new URL('oauth/userinfo', decodeIDToken(token).payload.iss);

  const dpop = await createDpopProof('GET', userinfoUri.toString(), publicKey, privateKey, token);

  // Send a request to the userinfo endpoint
  const response = await fetch(
    userinfoUri,
    {
      headers: {
        'X-Request-ID': requestId,
        'X-Correlation-ID': correlationId,
        'DPoP': dpop,
        'Authorization': `DPoP ${token}`,
      },
    }
  );

  // Throw an error when the request failed
  if(!response.ok) {

    throw new Error('Discovery response failed');

  }

  // Converting response body to json and check if it contains email.
  const body = await response.json() as Record<string, unknown>;

  if(!body.email || typeof body.email !== 'string') {

    throw new Error('Response did not contain email');

  }

  // Parse response as JSON
  return {
    email: body.email,
  };

};
