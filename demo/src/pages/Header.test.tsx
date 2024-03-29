import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { JWK } from 'jose';
import Header from './Header';

describe('Header', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  afterEach(cleanup);

  test('render email when userinfo succeeds', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'getUserinfo', {
      writable: true,
      value: vi.fn(() => Promise.resolve({ email: 'foo@bar.com' })),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    render(<Header token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('foo@bar.com')).toBeDefined();

    });

  });

  test('render webid when userinfo fails', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'getUserinfo', {
      writable: true,
      value: vi.fn(() => Promise.reject(new Error())),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    render(<Header token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('s1')).toBeDefined();

    });

  });

});
