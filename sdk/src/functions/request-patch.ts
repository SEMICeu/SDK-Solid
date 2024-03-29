import { generateCodeChallenge } from '../utils/generate-code-challenge';
import { log } from '../main';
import { Patch } from '../models/patch-model';
import { compressPatch } from './compress-patch';

/**
 * Generates a URI to which the user should be redirected in order to approve the patch request.
 *
 * @param email - The user who's data access is patched.
 * @param codeVerifier - A code verifier.
 * @param idpBaseURI - The base URI of the user's identity provider.
 * @param clientId - The client ID of the application sending the patch request.
 * @param redirectURI - The uri to which the user should be redirected after access is patched.
 * @param patch - The patch document describing how a user's access should be patched.
 * @param state - A state parameter, returned by the server.
 * @returns A URI to which the user should be redirected.
 */
export const requestPatch = async (
  email: string,
  codeVerifier: string,
  idpBaseURI: string,
  clientId: string,
  redirectURI: string,
  patch: Patch,
  state?: string
): Promise<string> => {

  log('Requesting patch', { email, codeVerifier, idpBaseURI, clientId, redirectURI, patch, state });

  if(email === '') {

    throw new Error('email can not be an empty string.');

  }

  if(codeVerifier === '') {

    throw new Error('codeVerifier can not be an empty string.');

  }

  if(clientId === '') {

    throw new Error('clientId can not be an empty string.');

  }

  // Check if idpBaseURI is a valid uri.
  try {

    new URL(idpBaseURI);

  } catch(e) {

    throw new Error('idpBaseURI should be a valid URI.');

  }

  // Check if redirectURI is a valid uri.
  try {

    new URL(redirectURI);

  } catch(e) {

    throw new Error('redirectURI should be a valid URI.');

  }

  // Use the oauth/authorize endpoint on the identity provider.
  const uri = new URL('oauth/authorize', idpBaseURI);

  // Add the request application's client ID.
  uri.searchParams.append('client_id', clientId);

  // Add the OIDC response type.
  uri.searchParams.append('response_type', 'code');

  // Add a state parameter if set.
  if(state){

    uri.searchParams.append('state', state);

  }

  // Add a redirect uri.
  uri.searchParams.append('redirect_uri', redirectURI);

  // Calculate and add the code challenge and code challenge method.
  uri.searchParams.append('code_challenge_method', 'S256');
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  uri.searchParams.append('code_challenge', codeChallenge);

  // Add the user's email address.
  uri.searchParams.append('email', email);

  // Compress and add the patch document.
  const solidPatchCompressed = await compressPatch(patch);
  uri.searchParams.append('solid_patch', solidPatchCompressed);

  log('Finished creating request patch uri', uri.toString());

  // Return the URI as a string.
  return uri.toString();

};
