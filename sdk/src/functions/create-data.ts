import { v4 } from 'uuid';
import { JWK } from 'jose';
import { log } from '../utils/log';
import { createDpopProof } from '../utils/create-dpop-proof';

/**
 * Creates a new resource
 *
 * @param storageLocation - The uri of the storage location in which to store the resource.
 * @param content - The content of the resource.
 * @param token - Token of the user for which to retrieve data.
 * @param publicKey - Public key to be used for creating the DPoP proof.
 * @param privateKey - Private key to be used for creating the DPoP proof.
 * @returns The location of the newly created resource.
 */
export const createData = async (
  storageLocation: string,
  type: string,
  subject: string,
  content: string,
  contentType: string,
  token: string,
  publicKey: JWK,
  privateKey: JWK
): Promise<string> => {

  log('Starting to get data');

  // Check if the storage location is a valid URI
  let uri;

  try {

    uri = new URL('resource', storageLocation);
    uri.searchParams.set('type', type);
    uri.searchParams.set('subject', subject);

  } catch(e) {

    throw new Error('storage location should be a valid uri');

  }

  // Generate a correlation and request id
  const correlationId = v4();
  const requestId = v4();

  const dpop = await createDpopProof('POST', uri.toString(), publicKey, privateKey, token);

  // Send a request to create the resource.
  const response = await fetch(
    uri.toString(),
    {
      method: 'POST',
      headers: {
        'X-Request-ID': requestId,
        'X-Correlation-ID': correlationId,
        'content-type': contentType,
        'DPoP': dpop,
        'Authorization': `DPoP ${token}`,
      },
      body: content,
    }
  );

  // Throw an error when the request failed
  if(!response.ok) {

    throw new Error('Discovery response failed');

  }

  // Throw error if there's no location header in the response.
  const location = response.headers.get('Location');

  if(!location) {

    throw new Error('Location should be set');

  }

  // Return location header.
  return location;

};
