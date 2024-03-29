import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { exchangeCode, requestPatch, generateKeys } from '@useid/movejs';
import * as jose from 'jose';
import App from './App';

vi.mock('@useid/movejs', () => ({
  generateCodeVerifier: vi.fn(() => 'mockCodeVerifier'),
  log: vi.fn(),
  requestPatch: vi.fn(() => Promise.resolve('https://mocked-uri.com')),
  exchangeCode: vi.fn(() => Promise.resolve('456')),
  generateKeys: vi.fn(() => Promise.resolve({
    publicKey: { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' },
    privateKey: { 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' },
  })),
  discoverData: vi.fn(() => Promise.resolve([ { subject: 's1', type: 't1', uri: 'u1' } ])),
}));

describe('App', () => {

  afterEach(() => {

    localStorage.clear();
    cleanup();
    vi.clearAllMocks();

  });

  test('renders title', async () => {

    render(<App />);

    await waitFor(() => {

      expect(screen.getByText('Movejs Demo')).toBeDefined();

    });

  });

  test('should generate a new code verifier when none is found in local storage', () => {

    render(<App />);

    expect(localStorage.getItem('codeVerifier')).toBe('mockCodeVerifier');

  });

  test('should not generate a new code verifier when one is found in local storage', () => {

    localStorage.setItem('codeVerifier', 'oldMockCodeVerifier');

    render(<App />);

    expect(localStorage.getItem('codeVerifier')).toBe('oldMockCodeVerifier');

  });

  test('should generate a new keypair when one is not found in local storage', async () => {

    render(<App />);

    await waitFor(() => {

      expect(screen.getByText('Movejs Demo')).toBeDefined();

    });

    expect(localStorage.getItem('publicKey')).toBe(JSON.stringify({ 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' }));
    expect(localStorage.getItem('privateKey')).toBe(JSON.stringify({ 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' }));

  });

  test('should generate a new keypair when an invalid one is found in local storage', async () => {

    localStorage.setItem('publicKey', 'abc');
    localStorage.setItem('privateKey', JSON.stringify({ 'alg' : 'ES256dsdfds', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' }));

    render(<App />);

    await waitFor(() => {

      expect(screen.getByText('Movejs Demo')).toBeDefined();

    });

    expect(localStorage.getItem('publicKey')).toBeDefined();
    expect(localStorage.getItem('privateKey')).toBeDefined();

    expect(generateKeys).toHaveBeenCalledOnce();

  });

  test('should not generate a new keypair when a valid one is found in local storage', async () => {

    Object.defineProperty(jose, 'exportJWK', {
      writable: true,
      value: vi.fn(() => Promise.resolve({ 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' })),
    });

    localStorage.setItem('publicKey', JSON.stringify({ 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo' }));
    localStorage.setItem('privateKey', JSON.stringify({ 'alg' : 'ES256', 'kty': 'EC', 'crv': 'P-256', 'x': 'NmV46PCsJwA9qpun1yKorLtz1hvN2SfJ7xtSbRNRP0w', 'y': '3L27N4N4Ww-PAiWzUvjZ6QqozodRDlRbDDDASm5pgWo', 'd': 'rW1QJiBwvPD7AEM3HNWNJ2X-2jNXYGdz2Jo-uCvjdB8' }));

    render(<App />);

    await waitFor(() => {

      expect(screen.getByText('Movejs Demo')).toBeDefined();

    });

    expect(localStorage.getItem('publicKey')).toBeDefined();
    expect(localStorage.getItem('privateKey')).toBeDefined();

    expect(generateKeys).not.toHaveBeenCalled();

  });

  test('request patch when signing in with a valid email address', async() => {

    const { getByPlaceholderText, getByText } = render(<App />);

    await waitFor(() => {

      expect(getByPlaceholderText(/email address/i)).toBeDefined();

    });

    // Simulate typing an email
    fireEvent.change(getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });

    // Simulate clicking the "Sign-in" button
    fireEvent.click(getByText('Sign-in', { selector: 'button' }));

    expect(requestPatch).toHaveBeenCalledOnce();

  });

  test('exchange code when valid code is in query parameters and render commuter view', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search:'?code=123', href: 'https://foo.bar?code=123' },
    });

    Object.defineProperty(movejs, 'exchangeCode', {
      writable: true,
      value: vi.fn().mockResolvedValue('456'),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn().mockReturnValue({ payload: { webid: 'https://foo.bar' } }),
    });

    render(<App />);

    await waitFor(() => {

      expect(exchangeCode).toHaveBeenCalledOnce();

    });

    await waitFor(() => {

      expect(screen.getByText('+')).toBeDefined();

    });

    expect(localStorage.getItem('token')).toBe('456');
    expect(localStorage.getItem('actor')).toBe('commuter');
    expect(window.location.href).toBe('https://foo.bar');

  });

  test('call create data when commuter creates a travel preference', async () => {

    const movejs = await import('@useid/movejs');
    const onCreateData = vi.fn();

    Object.defineProperty(movejs, 'createData', {
      writable: true,
      value: onCreateData,
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn(() => ({ payload: { webid: 'https://use.id/foo' } })),
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search:'?code=123&state=commuter', href: 'https://foo.bar?code=123&state=commuter' },
    });

    const { getByPlaceholderText } = render(<App />);

    await waitFor(() => {

      expect(exchangeCode).toHaveBeenCalledOnce();

    });

    await waitFor(() => {

      expect(screen.getByText('+')).toBeDefined();

    });

    fireEvent.click(screen.getByText('+', { selector: 'button' }));

    await waitFor(() => {

      expect(screen.getByText('Travel preference')).toBeDefined();

    });

    fireEvent.change(getByPlaceholderText('Mode of transportation'), { target: { value: 'Foo bar' } });
    fireEvent.click(screen.getByText('Save', { selector: 'button' }));

    expect(onCreateData).toHaveBeenCalledOnce();

  });

  test('exchange code when valid code is in query parameters and render pto view', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search:'?code=123', href: 'https://foo.bar?code=123' },
    });

    Object.defineProperty(movejs, 'exchangeCode', {
      writable: true,
      value: vi.fn().mockResolvedValue('456'),
    });

    Object.defineProperty(movejs, 'decodeIDToken', {
      writable: true,
      value: vi.fn().mockReturnValue({ payload: { webid: import.meta.env.VITE_SUBJECT_WEBID } }),
    });

    render(<App />);

    await waitFor(() => {

      expect(exchangeCode).toHaveBeenCalledOnce();

    });

    expect(localStorage.getItem('token')).toBe('456');
    expect(localStorage.getItem('actor')).toBe('pto');
    expect(window.location.href).toBe('https://foo.bar');

  });

  test('render sign-in page when code exchange fails', async () => {

    const movejs = await import('@useid/movejs');

    Object.defineProperty(movejs, 'exchangeCode', {
      writable: true,
      value: vi.fn().mockRejectedValue(new Error()),
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search:'?code=123', href: 'https://foo.bar?code=123' },
    });

    render(<App />);

    await waitFor(() => {

      expect(exchangeCode).toHaveBeenCalledOnce();
      expect(screen.getByText('Movejs Demo')).toBeDefined();

    });

    expect(screen.getByText('Code could not be exchanged')).toBeDefined();

    expect(localStorage.getItem('token')).toBeNull();

  });

  test('do not exchange code when no valid code is in query parameters', async () => {

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search:'?bla=123' },
    });

    render(<App />);

    await waitFor(() => {

      expect(screen.getByText('Movejs Demo')).toBeDefined();

    });

    expect(exchangeCode).not.toHaveBeenCalledOnce();

  });

});
