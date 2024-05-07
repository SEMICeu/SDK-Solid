import { afterEach, describe, expect, test } from 'vitest';
import { render, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { TravelPreference } from '../models/travel-preference';
import { TravelDisruption } from '../models/travel-disruption';
import Itinerary from './Itinerary';

const travelDisruptions: TravelDisruption[] = [
  {
    label: 'Onderhoudswerken op traject IC12',
    travelMode: 'Train',
    from: 'Antwerp',
    to: 'Brussels',
    daysOfWeek: [ 'Wednesday', 'Thursday' ],
  },
  {
    label: 'Onderhoudswerken op traject Line 234',
    travelMode: 'Bus',
    from: 'Antwerp',
    to: 'Brussels',
    daysOfWeek: [ 'Thursday' ],
  },
];

describe('Itinerary', () => {

  afterEach(cleanup);

  test('should render disabled form', async () => {

    const travelPreferences: TravelPreference[] = [];

    const { getByText } = render(<Itinerary
      travelPreferences={travelPreferences}
      travelDisruptions={travelDisruptions} />);

    await waitFor(() => {

      expect(getByText('Where would you like to go?')).toBeDefined();
      expect(getByText('Tuesday')).toBeDefined();

    });

  });

  test('should render travel routes', async () => {

    const travelPreferences: TravelPreference[] = [
      {
        travelMode: 'Bus',
        daysOfWeek: [ 'Tuesday', 'Wednesday' ],
      },
    ];

    const { getByText, getByLabelText } = render(<Itinerary
      travelPreferences={travelPreferences}
      travelDisruptions={travelDisruptions} />);

    await waitFor(() => {

      expect(getByText('Where would you like to go?')).toBeDefined();
      expect(getByText('Tuesday')).toBeDefined();

    });

    fireEvent.change(getByLabelText('From'), { target: { value: 'Antwerp' } });
    fireEvent.change(getByLabelText('to'), { target: { value: 'Brussels' } });
    fireEvent.change(getByLabelText('on'), { target: { value: 'Tuesday' } });

    await waitFor(() => {

      expect(getByText('Line 234')).toBeDefined();

    });

  });

  test('should render travel routes', async () => {

    const travelPreferences: TravelPreference[] = [
      {
        travelMode: 'Bus',
        daysOfWeek: [ 'Tuesday', 'Thursday' ],
      },
    ];

    const { getByText, getByLabelText, queryByText } = render(<Itinerary
      travelPreferences={travelPreferences}
      travelDisruptions={travelDisruptions} />);

    await waitFor(() => {

      expect(getByText('Where would you like to go?')).toBeDefined();
      expect(getByText('Thursday')).toBeDefined();

    });

    fireEvent.change(getByLabelText('From'), { target: { value: 'Antwerp' } });
    fireEvent.change(getByLabelText('to'), { target: { value: 'Brussels' } });
    fireEvent.change(getByLabelText('on'), { target: { value: 'Thursday' } });

    await waitFor(() => {

      expect(queryByText('Line 234')).toBeNull();

    });

  });

  test('should render travel routes', async () => {

    const travelPreferences: TravelPreference[] = [
      {
        travelMode: 'Bus',
        daysOfWeek: [ 'Tuesday', 'Thursday' ],
      },
    ];

    const { getByText, getByLabelText } = render(<Itinerary
      travelPreferences={travelPreferences}
      travelDisruptions={travelDisruptions} />);

    await waitFor(() => {

      expect(getByText('Where would you like to go?')).toBeDefined();
      expect(getByText('Thursday')).toBeDefined();

    });

    fireEvent.change(getByLabelText('From'), { target: { value: 'Ghent' } });
    fireEvent.change(getByLabelText('to'), { target: { value: 'Brussels' } });
    fireEvent.change(getByLabelText('on'), { target: { value: 'Thursday' } });

    await waitFor(() => {

      expect(getByText('Line 380')).toBeDefined();

    });

  });

});
