import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { JWK } from 'jose';
import { VOC_TRAVEL_DISRUPTION, VOC_TRAVEL_PREFERENCE } from '../vocabulary';
import Subject from './Subject';

describe('Subject', () => {

  const publicKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' };
  const privateKey: JWK = { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' };

  afterEach(cleanup);

  test('should render selected subject', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u1' }, { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u2' }, { subject: 's1', type: VOC_TRAVEL_DISRUPTION, uri: 'u2' } ])),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 's1' } })),
    });

    const retrieveDataMock = vi.fn();
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ], label: 'Foo bar' }));

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: retrieveDataMock,
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('Train')).toBeDefined();
      expect(screen.getByText('Where would you like to go?')).toBeDefined();
      expect(screen.queryByText('Travel preference')).toBeNull();

    });

    fireEvent.click(screen.queryAllByText('Train')[0]);

    await waitFor(() => {

      expect(screen.queryByText('Where would you like to go?')).toBeNull();
      expect(screen.getByText('Travel preference')).toBeDefined();

    });

  });

  test('should render first preference when subject is set', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn(() => Promise.resolve([ { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u1' }, { subject: 's1', type: VOC_TRAVEL_PREFERENCE, uri: 'u2' } ])),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: import.meta.env.VITE_SUBJECT_WEBID } })),
    });

    const retrieveDataMock = vi.fn((u: string) => Promise.resolve(u === 'u1' ? JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }) : JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] })));

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: retrieveDataMock,
    });

    const { getByText } = render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} subject="s1" />);

    await waitFor(() => {

      expect(getByText('Train')).toBeDefined();
      expect(getByText('Bus')).toBeDefined();

    });

    await waitFor(() => {

      expect(getByText('Travel preference')).toBeDefined();

    });

  });

  test('should render create form', async () => {

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
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: retrieveDataMock,
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('Bus')).toBeDefined();
      expect(screen.getByText('Where would you like to go?')).toBeDefined();
      expect(screen.queryByText('Travel preference')).toBeNull();

    });

    fireEvent.click(screen.queryAllByText('Bus')[0]);

    await waitFor(() => {

      expect(screen.queryByText('Where would you like to go?')).toBeNull();
      expect(screen.getByText('Travel preference')).toBeDefined();

    });

  });

  test('should render itinerary by default', async () => {

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
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: retrieveDataMock,
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('Where would you like to go?')).toBeDefined();

    });

  });

  test('should render itinerary after clicking button', async () => {

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
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: retrieveDataMock,
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    fireEvent.click(screen.getByText('Bus'));

    await waitFor(() => {

      expect(screen.getByText('Travel preference')).toBeDefined();

    });

    fireEvent.click(screen.getByText('Generate itinerary'));

    await waitFor(() => {

      expect(screen.getByText('Where would you like to go?')).toBeDefined();

    });

  });

  test('should not render itinerary button when subject is set', async () => {

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
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));
    retrieveDataMock.mockResolvedValueOnce(JSON.stringify({ travelMode: 'Train', daysOfWeek: [ 'Tuesday', 'Wednesday' ] }));

    Object.defineProperty(movejs, 'retrieveData', {
      writable: true,
      value: retrieveDataMock,
    });

    const { queryByText }=render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} subject="123" />);

    await waitFor(() => {

      expect(queryByText('Generate itinerary')).toBeNull();

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
      value: vi.fn(() => Promise.resolve(JSON.stringify({ travelMode123: 'Foo bar' }))),
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

  });

  test('should show error message when discover data throws', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'discoverData', {
      writable: true,
      value: vi.fn().mockRejectedValue(new Error()),
    });

    render(<Subject token="ABC" publicKey={publicKey} privateKey={privateKey} />);

    await waitFor(() => {

      expect(screen.getByText('Something went wrong (Subject)')).toBeDefined();

    });

  });

});
