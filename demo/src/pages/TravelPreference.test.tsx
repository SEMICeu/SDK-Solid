import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { JWK } from 'jose';
import TravelPreferenceForm from './TravelPreference';

describe('TravelPreferenceForm', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  afterEach(cleanup);

  test('should render selected preference', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: vi.fn(() => Promise.resolve(JSON.stringify({ modeOfTransportation: 'Foo bar', daysOfWeek: [ 1, 2 ] }))),
    });

    render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} resource="https://pods.use.id/foo" />);

    await waitFor(() => {

      expect(screen.getByDisplayValue('Foo bar')).toBeDefined();
      expect(screen.getByText('Save')).toBeDefined();

    });

  });

  test('should not render save button when signed in as PTO', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: import.meta.env.VITE_SUBJECT_WEBID } })),
    });

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: vi.fn(() => Promise.resolve(JSON.stringify({ modeOfTransportation: 'Foo bar', daysOfWeek: [ 1, 2 ] }))),
    });

    render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} resource="https://pods.use.id/foo" />);

    await waitFor(() => {

      expect(screen.getByDisplayValue('Foo bar')).toBeDefined();
      expect(screen.queryByText('Save')).toBeNull();

    });

  });

  test('should change days of week when clicked', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: vi.fn(() => Promise.resolve(JSON.stringify({ modeOfTransportation: 'Foo bar', daysOfWeek: [ 1, 2 ] }))),
    });

    const { getByDisplayValue, getByText } = render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} resource="https://pods.use.id/foo" />);

    await waitFor(() => {

      expect(getByDisplayValue('Foo bar')).toBeDefined();
      expect(getByText('Tuesday').classList.contains('bg-emerald-500')).toBeTruthy();

    });

    fireEvent.click(getByText('Tuesday'));

    await waitFor(() => {

      expect(getByText('Tuesday').classList.contains('bg-slate-100')).toBeTruthy();

    });

    fireEvent.click(getByText('Tuesday'));

    await waitFor(() => {

      expect(getByText('Tuesday').classList.contains('bg-emerald-500')).toBeTruthy();

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
