/**
 * generate a PKCE code verifier with a desired length
 *
 * @param length - the desired length of the code verifier
 * @returns the generated code verifier
 */
export const generateCodeVerifier = (length = 43): string => {

  if (length < 43) throw new Error('A PKCE code_verifier has to be at least 43 characters long');
  if (length > 128) throw new Error('A PKCE code_verifier can not contain more than 128 characters');

  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const codeVerifier = [ ...Array(length).keys() ].map(() => possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))).join('');

  return codeVerifier;

};
