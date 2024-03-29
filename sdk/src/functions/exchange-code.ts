import { JWK } from 'jose';
import { createDpopProof } from '../utils/create-dpop-proof';
import { log } from '../utils/log';

/**
 * Exchanges a code for an identity provider.
 *
 * @param idpBaseUri - The base uri of the identity provider that will issue the token.
 * @param code - The code to be exchanged for a token.
 * @param clientId - The client ID of the azp.
 * @param redirectURI - The redirect URI.
 * @param codeVerifier - The code verifier used in the communication with the identity provider.
 * @param publicKey - The public key for signing the DPoP token.
 * @param privateKey - The private key for signing the DPoP token.
 * @returns The token issued by the identity provider.
 */
export const exchangeCode = async (
  idpBaseUri: string,
  code: string,
  clientId: string,
  redirectURI: string,
  codeVerifier: string,
  publicKey: JWK,
  privateKey: JWK,
): Promise<string> => {

  log('Exchanging code', { code, idpBaseUri });

  let url: URL;

  try {

    url = new URL('oauth/token', idpBaseUri);

  } catch(e) {

    throw new Error('Incorrect identity provider base URI');

  }

  try {

    new URL(redirectURI);

  } catch(e) {

    throw new Error('Incorrect redirect URI');

  }

  // Generating a dpop token for the call.
  const dpop = await createDpopProof(
    'POST',
    url.toString(),
    publicKey,
    privateKey
  );

  // Exchanging code for token
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      DPoP: dpop,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectURI)}&code_verifier=${codeVerifier}`,
  });

  // Checking if response was succesful.
  if(!res.ok) {

    throw new Error('Failed to exchange code');

  }

  // Converting response body to json and check if it contains token.
  const body = await res.json() as Record<string, unknown>;

  if(!body.id_token || typeof body.id_token !== 'string') {

    throw new Error('Response did not contain token');

  }

  return body.id_token;

};
