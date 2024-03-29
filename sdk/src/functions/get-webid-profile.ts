import { Parser, Quad } from 'n3';
import { log } from '../utils/log';

/**
 * Retrieved and parses the profile document of a given webid.
 *
 * @param webid - The webid for which the profile document should be retrieved.
 * @returns The parsed profile document of the given webid.
 */
export const getWebIdProfile = async (webid: string): Promise<{ storageLocations: string[] }> => {

  log('Starting to retrieve webid profile', webid);

  // Check if webid is a valid url
  try {

    new URL(webid);

  } catch(error: unknown) {

    throw new Error('Please provide a valid URL');

  }

  // Fetch the WebID profile document
  const response = await fetch(webid);

  // Check if response was successful
  if(!response.ok) {

    throw new Error();

  }

  // Load body as text instead of json
  const body = await response.text();

  // Try to parse text as RDF
  const parser = new Parser();
  const quads: Quad[] = parser.parse(body);

  // Retrieve storage locations from parsed RDF
  const storageLocations = quads
    .filter((quad) => quad.predicate.value === 'http://www.w3.org/ns/solid/terms#primary-resource-storage')
    .map((quad) => quad.object.value);

  return {
    storageLocations,
  };

};
