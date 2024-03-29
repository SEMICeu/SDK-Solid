/**
 * Generate a code challenge base on a (valid) given code verifier string
 *
 * @param codeVerifier - the code verifier you wish to generate a code challenge for
 * @returns a string containing the code challange
 */
export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {

  if(codeVerifier === '') {

    throw Error('Code verifier can not be an empty string');

  }

  // Encode the code verifier in an array of bytes.
  const encoder = new TextEncoder();
  const codeVerifierBytes = encoder.encode(codeVerifier);

  // Calculate a SHA-256 to create the code challenge.
  const codeChallengeBuffer = await window.crypto.subtle.digest('SHA-256', codeVerifierBytes);

  // Transform the buffer back to a string.
  const codeChallengeString = String.fromCharCode.apply(
    null,
    Array.prototype.slice.apply<Uint8Array, number[]>(new Uint8Array(codeChallengeBuffer))
  );

  // Transform and return a base64url encoded version of the code challenge.
  return btoa(codeChallengeString).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

};
