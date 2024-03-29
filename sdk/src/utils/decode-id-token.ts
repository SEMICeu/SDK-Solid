/**
 * Decodes the given ID Token.
 *
 * @param idToken - The ID Token to decode.
 * @returns A decoded ID token.
 */
export const decodeIDToken = (idToken: string): { header: object; payload: { iss: string; webid: string } } => {

  // Split the ID Token and check if there are 3 parts
  const splitIDToken = idToken.split('.');

  if(splitIDToken.length !== 3) {

    throw Error('');

  }

  // Decode and parse the header and payload
  const header = JSON.parse(atob(splitIDToken[0]).toString()) as object;
  const payload = JSON.parse(atob(splitIDToken[1]).toString()) as object;

  // Throw an error when the webid isn't present in the payload
  if(!('webid' in payload) || typeof payload.webid !== 'string') {

    throw new Error();

  }

  // Throw an error when the issuer isn't present in the payload
  if(!('iss' in payload) || typeof payload.iss !== 'string') {

    throw new Error();

  }

  return { header, payload: payload as { iss: string; webid: string } };

};
