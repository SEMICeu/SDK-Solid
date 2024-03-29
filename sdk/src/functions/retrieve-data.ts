import { v4 } from 'uuid';
import { JWK } from 'jose';
import { log } from '../utils/log';
import { createDpopProof } from '../utils/create-dpop-proof';

/**
 * Retrieves the content of a given resource.
 *
 * @param resourceUri - The uri of the resource to retrieve.
 * @param token - Token of the user for which to retrieve data.
 * @param publicKey - Public key to be used for creating the DPoP proof.
 * @param privateKey - Private key to be used for creating the DPoP proof.
 * @returns The text content of the resource.
 */
export const retrieveData = async (
  resourceUri: string,
  token: string,
  publicKey: JWK,
  privateKey: JWK
): Promise<string> => {

  log('Starting to get data');

  // Check if the storage location is a valid URI
  try {

    new URL(resourceUri);

  } catch(e) {

    throw new Error();

  }

  // Generate a correlation and request id
  const correlationId = v4();
  const requestId = v4();

  const dpop = await createDpopProof('GET', resourceUri, publicKey, privateKey, token);

  // Send a request to the resources endpoint to discovery resources
  const response = await fetch(
    resourceUri,
    {
      headers: {
        'X-Request-ID': requestId,
        'X-Correlation-ID': correlationId,
        'DPoP': dpop,
        'Authorization': `DPoP ${token}`,
      },
    }
  );

  // Throw an error when the discovery request failed
  if(!response.ok) {

    throw new Error('Discovery response failed');

  }

  // Parse discovery response as JSON
  return await response.text();

};
