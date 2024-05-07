import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { JWK } from 'jose';
import { TravelPreference } from '../models/travel-preference';
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

    const preference: TravelPreference = { travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ], uri: 'https://pods.use.id/foo' };

    render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} travelPreference={preference} travelMode="Bus" />);

    await waitFor(() => {

      expect(screen.queryByText('Save')).toBeNull();

    });

  });

  test('should not render save button when signed in as PTO', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: import.meta.env.VITE_SUBJECT_WEBID } })),
    });

    const preference: TravelPreference = { travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ], uri: 'https://pods.use.id/foo' };

    render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} travelPreference={preference} travelMode="Bus" />);

    await waitFor(() => {

      expect(screen.queryByText('Save')).toBeNull();

    });

  });

  test('should not change days of week when clicked and resource exists', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    const preference: TravelPreference = { travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ], uri: 'https://pods.use.id/foo' };

    const { getByText } = render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} travelPreference={preference} travelMode="Bus" />);

    await waitFor(() => {

      expect(getByText('Tuesday').classList.contains('bg-emerald-500')).toBeTruthy();

    });

    fireEvent.click(getByText('Tuesday'));

    await waitFor(() => {

      expect(getByText('Tuesday').classList.contains('bg-emerald-500')).toBeTruthy();

    });

  });

  test('should change days of week when clicked', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    const { getByText } = render(<TravelPreferenceForm token="ABC" publicKey={publicKey} privateKey={privateKey} travelMode="Bus" />);

    await waitFor(() => {

      expect(getByText('Tuesday').classList.contains('bg-slate-100')).toBeTruthy();

    });

    fireEvent.click(getByText('Tuesday'));

    await waitFor(() => {

      expect(getByText('Tuesday').classList.contains('bg-emerald-500')).toBeTruthy();

    });

    fireEvent.click(getByText('Tuesday'));

    await waitFor(() => {

      expect(getByText('Tuesday').classList.contains('bg-slate-100')).toBeTruthy();

    });

  });

});
