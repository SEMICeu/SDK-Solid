import { describe, expect, test, vi } from 'vitest';
import { getWebIdProfile } from './get-webid-profile';

describe('getWebIdProfile', () => {

  test('should return a list of storage locations for a valid webid', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: true,
        // eslint-disable-next-line @typescript-eslint/require-await
        text: async () => `
        @prefix solid: <http://www.w3.org/ns/solid/terms#>.
        @prefix pim: <http://www.w3.org/ns/pim/space#>.
        
        <https://sandbox-use.id/test-0603-2> <http://www.w3.org/ns/solid/terms#primary-resource-storage> <https://storage1.sandbox-use.id/> .
        <https://sandbox-use.id/test-0603-2> <http://www.w3.org/ns/solid/terms#primary-resource-storage> <https://storage2.sandbox-use.id/> .
        <https://sandbox-use.id/test-0603-2> <http://www.w3.org/ns/solid/terms#primary-auth-provider> <https://idp.sandbox-use.id/> .
        <https://sandbox-use.id/test-0603-2> solid:oidcIssuer <https://idp.sandbox-use.id/> .
        <https://sandbox-use.id/test-0603-2> pim:storage <https://pods.sandbox-use.id/aeb6cc5f-5341-5496-9fe2-d7e7ace2b6d9/> .
        <https://sandbox-use.id/test-0603-2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/solid/interop#Agent> .
        <https://sandbox-use.id/test-0603-2> <http://www.w3.org/ns/solid/interop#hasRegistrySet> <https://pods.sandbox-use.id/aeb6cc5f-5341-5496-9fe2-d7e7ace2b6d9/registries/registryset> .
        <https://sandbox-use.id/test-0603-2/profile> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/PersonalProfileDocument> .
        <https://sandbox-use.id/test-0603-2/profile> <http://xmlns.com/foaf/0.1/maker> <https://sandbox-use.id/test-0603-2> .
        <https://sandbox-use.id/test-0603-2/profile> <http://xmlns.com/foaf/0.1/primaryTopic> <https://sandbox-use.id/test-0603-2> .
        `,
      })),
    });

    await expect(getWebIdProfile('https://use.id/foo')).resolves.toStrictEqual({ storageLocations: [ 'https://storage1.sandbox-use.id/', 'https://storage2.sandbox-use.id/' ] });

  });

  test('should throw error when response is not ok', async () => {

    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        ok: false,
        // eslint-disable-next-line @typescript-eslint/require-await
        text: async () => ``,
      })),
    });

    await expect(getWebIdProfile('https://use.id/foo')).rejects.toThrow();

  });

  test('should throw error for an invalid webid', async () => {

    await expect(getWebIdProfile('bla')).rejects.toThrow();

  });

});

