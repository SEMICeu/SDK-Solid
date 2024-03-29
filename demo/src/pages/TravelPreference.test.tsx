import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { JWK } from 'jose';
import TravelPreferenceForm from './TravelPreference';

describe('TravelPreferenceForm', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  afterEach(cleanup);

  test('should render selected subject', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: vi.fn(() => Promise.resolve(JSON.stringify({ modeOfTransportation: 'Foo bar' }))),
    });

    render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} resource="https://pods.use.id/foo" />);

    await waitFor(() => {

      expect(screen.getByDisplayValue('Foo bar')).toBeDefined();

    });

  });

  test('should show error message when retrieve data fails', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: vi.fn(() => Promise.reject(new Error())),
    });

    render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} resource="https://pods.use.id/foo" />);

    await waitFor(() => {

      expect(screen.getByText('Something went wrong')).toBeDefined();

    });

  });

});
