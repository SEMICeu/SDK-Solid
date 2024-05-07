import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { JWK } from 'jose';
import Subjects from './Subjects';

describe('Subjects', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  afterEach(cleanup);

  test('should render a single subject', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's2', type: 't1', uri: 'u1' } ])),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: import.meta.env.VITE_SUBJECT_WEBID, iss: 'https://idp.foo.bar/' } })),
    });

    render(<Subjects token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('s2')).toBeDefined();

    });

  });

  test('should render multiple subjects', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: import.meta.env.VITE_SUBJECT_WEBID, type: 't1', uri: 'u1' }, { subject: 's2', type: 't2', uri: 'u2' } ])),
    });

    render(<Subjects token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText(import.meta.env.VITE_SUBJECT_WEBID.split('/')[import.meta.env.VITE_SUBJECT_WEBID.split('/').length - 1])).toBeDefined();
      expect(screen.getByText('s2')).toBeDefined();

    });

  });

  test('should not render pto subject', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's1', type: 't1', uri: 'u1' }, { subject: import.meta.env.VITE_SUBJECT_WEBID, type: 't2', uri: 'u2' } ])),
    });

    Object.defineProperty(movejs, 'getUserinfo', {
      writable: true,
      value: vi.fn(() => Promise.resolve({ email: import.meta.env.VITE_SUBJECT_EMAIL })),
    });

    render(<Subjects token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('s1')).toBeDefined();
      expect(screen.queryByText(import.meta.env.VITE_SUBJECT_WEBID.split('/')[import.meta.env.VITE_SUBJECT_WEBID.split('/').length-1])).toBeNull();

    });

  });

  test('should set background of selected subject', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's1', type: 't1', uri: 'u1' }, { subject: 's2', type: 't2', uri: 'u2' } ])),
    });

    render(<Subjects token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('s1')).toBeDefined();
      expect(screen.getByText('s2')).toBeDefined();

    });

    fireEvent.click(screen.getByText('s1'));

    await waitFor(() => {

      expect(screen.getByText('s1').classList.contains('bg-slate-50')).toBeTruthy();

    });

  });

  test('should render unique subjects', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's1', type: 't1', uri: 'u1' }, { subject: 's1', type: 't2', uri: 'u2' } ])),
    });

    render(<Subjects token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('s1')).toBeDefined();

    });

  });

  test('should render empty list of subjects', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ ])),
    });

    render(<Subjects token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('No subjects found')).toBeDefined();

    });

  });

  test('should not render list of subjects when discover data throws', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.reject(new Error())),
    });

    render(<Subjects token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getAllByText('Something went wrong')).toBeDefined();

    });

  });

});
