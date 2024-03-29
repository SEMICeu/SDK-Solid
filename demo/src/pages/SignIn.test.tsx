import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import SignIn from './SignIn';

describe('SignIn', () => {

  afterEach(cleanup);

  test('onSignIn should not be called when not clicked.', async () => {

    const movejs = await import('@useid/movejs');
    const fn = vi.fn().mockResolvedValue('https://foo.bar');

    Object.defineProperty(movejs, 'requestPatch', {
      writable: true,
      value: fn,
    });

    render(<SignIn codeVerifier="codeVerifier" />);

    expect(fn).not.toHaveBeenCalled();

  });

  test('onSignIn should not be called when clicked without entering email.', async () => {

    const movejs = await import('@useid/movejs');
    const fn = vi.fn().mockResolvedValue('https://foo.bar');

    Object.defineProperty(movejs, 'requestPatch', {
      writable: true,
      value: fn,
    });

    const { getByText } = render(<SignIn codeVerifier="codeVerifier" />);
    fireEvent.click(getByText('Sign-in', { selector: 'button' }));

    expect(fn).not.toHaveBeenCalled();

  });

  test('onSignIn should be called when clicked after entering a valid email.', async () => {

    const movejs = await import('@useid/movejs');
    const fn = vi.fn().mockResolvedValue('https://foo.bar');

    Object.defineProperty(movejs, 'requestPatch', {
      writable: true,
      value: fn,
    });

    const { getByText, getByPlaceholderText } = render(<SignIn codeVerifier="codeVerifier" />);
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'wouter@digita.ai' } });
    fireEvent.click(getByText('Sign-in', { selector: 'button' }));

    expect(fn).toHaveBeenCalled();

  });

  test('onSignIn should not be called when clicked after entering an invalid email.', async () => {

    const movejs = await import('@useid/movejs');
    const fn = vi.fn().mockResolvedValue('https://foo.bar');

    Object.defineProperty(movejs, 'requestPatch', {
      writable: true,
      value: fn,
    });

    const { getByText, getByPlaceholderText } = render(<SignIn codeVerifier="codeVerifier" />);
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'abc' } });
    fireEvent.click(getByText('Sign-in', { selector: 'button' }));

    expect(fn).not.toHaveBeenCalled();

  });

});
