import { afterEach, describe, expect, test } from 'vitest';
import { render, cleanup, waitFor, fireEvent } from '@testing-library/react';
import Itinerary from './Itinerary';

describe('Itinerary', () => {

  afterEach(cleanup);

  test('should render disabled form', async () => {

    const { getByText } = render(<Itinerary />);

    await waitFor(() => {

      expect(getByText('Where would you like to go?')).toBeDefined();
      expect(getByText('Generate itinerary', { selector: 'button' })).toBeDefined();
      expect(getByText('Generate itinerary', { selector: 'button' }).hasAttribute('disabled')).toBeTruthy();

    });

  });

  test('should render enabled form when start and destination was filled in', async () => {

    const { getByText, getByPlaceholderText } = render(<Itinerary />);

    await waitFor(() => {

      expect(getByText('Where would you like to go?')).toBeDefined();
      expect(getByText('Generate itinerary', { selector: 'button' })).toBeDefined();
      expect(getByText('Generate itinerary', { selector: 'button' }).hasAttribute('disabled')).toBeTruthy();

    });

    fireEvent.change(getByPlaceholderText('Start'), { target: { value: 'start street' } });
    fireEvent.change(getByPlaceholderText('Destination'), { target: { value: 'start street' } });

    await waitFor(() => {

      expect(getByText('Generate itinerary', { selector: 'button' }).hasAttribute('disabled')).toBeFalsy();

    });

    fireEvent.click(getByText('Generate itinerary', { selector: 'button' }));

  });

});
