import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { JWK } from 'jose';
import { VOC_TRAVEL_PREFERENCE } from '../vocabulary';
import Subject from './Subject';

describe('Subject', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  afterEach(cleanup);

  test('should render selected subject', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u1' }, { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u2' } ])),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    const retrieveDataMock = vi.fn();
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ modeOfTransportation: 'Foo bar 1' }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ modeOfTransportation: 'Foo bar 2' }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ modeOfTransportation: 'Foo bar 2' }));

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: retrieveDataMock,
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('Foo bar 2')).toBeDefined();

    });

    fireEvent.click(screen.getByText('Foo bar 2'));

    await waitFor(() => {

      expect(screen.getByDisplayValue('Foo bar 2')).toBeDefined();

    });

  });

  test('should render an empty list', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ ])),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('No travel preferences found')).toBeDefined();

    });

  });

  test('should not throw when a preference can not be parsed', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u1' }, { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u2' } ])),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: vi.fn(() => Promise.resolve(JSON.stringify({ modeOfTransportation123: 'Foo bar' }))),
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

  });

});
