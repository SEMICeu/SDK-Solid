import { v4 } from 'uuid';
import { JWK } from 'jose';
import { decodeIDToken } from '../utils/decode-id-token';
import { log } from '../utils/log';
import { createDpopProof } from '../utils/create-dpop-proof';
import { getWebIdProfile } from './get-webid-profile';

/**
 * Discovers data the given user has access to and returns a list of metadata.
 *
 * @param token - Token of the user for which to discover data.
 * @param publicKey - Public key to be used for creating the DPoP proof.
 * @param privateKey - Private key to be used for creating the DPoP proof.
 * @returns A list of resources to which the user has access.
 */
export const discoverData = async (
  token: string,
  publicKey: JWK,
  privateKey: JWK
): Promise<{ subject: string; type: string; uri: string }[]> => {

  log('Starting to discover data');

  // Start by decoding the given ID Token.
  const { payload } = decodeIDToken(token);

  // Retrieve the profile of the WebID found in the ID Token.
  const profile = await getWebIdProfile(payload.webid);

  // Discover data in each storage location listed in the profile document.
  return (await Promise.all(profile.storageLocations.map(async (storageLocation) => {

    log('Discovering storage location', storageLocation);

    // Check if the storage location is a valid URI
    try {

      new URL('resources', storageLocation);

    } catch(e) {

      throw new Error();

    }

    // Generate a correlation and request id
    const correlationId = v4();
    const requestId = v4();

    const dpop = await createDpopProof('GET', (new URL('resources', storageLocation)).toString(), publicKey, privateKey, token);

    // Send a request to the resources endpoint to discovery resources
    const discoveryResponse = await fetch(
      new URL('resources', storageLocation),
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
    if(!discoveryResponse.ok) {

      throw new Error('Discovery response failed');

    }

    // Parse discovery response as JSON
    const discoveryBody: unknown = await discoveryResponse.json();

    if(!discoveryBody || typeof discoveryBody !== 'object') {

      throw new Error('Could not parse discovery response');

    }

    // Set empty array when no combinations are found in body
    const combinations = !('subject_type_combinations' in discoveryBody) || !Array.isArray(discoveryBody.subject_type_combinations) ? [] : discoveryBody.subject_type_combinations;

    // Parse and return individual combinations.
    return combinations
      .map((combination: unknown) => {

        if(
          !combination
          || typeof combination !=='object'
          || !('resources' in combination)
          || !Array.isArray(combination.resources)
        ) {

          throw new Error('Combination could not be parsed');

        }

        return combination.resources.map((r: unknown) => {

          if(
            !r
            || typeof r !=='object'
            || !('subject' in combination)
            || typeof combination.subject !== 'string'
            || !('type' in combination)
            || typeof combination.type !== 'string'
            || !('uri' in r)
            || typeof r.uri !== 'string'
          ) {

            throw new Error('No URI in resource');

          }

          return {
            subject: combination.subject,
            type: combination.type,
            uri: r.uri,
          };

        });

      });

  })))
    // Flatten results accross storage locations.
    .reduce((previous, current) => [ ...previous, ...current ], [])
    .reduce((previous, current) => [ ...previous, ...current ], [])
    .sort();

};
