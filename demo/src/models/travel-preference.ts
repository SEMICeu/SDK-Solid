import { DayOfWeek } from './days-of-week';
import { TravelMode, travelModes } from './travel-mode';

/**
 * A travel preference describes a commuter's preferred mode of transportation on a given day of the week.
 */
export interface TravelPreference {
  /**
   * URI that uniquely identifies the travel preference.
   */
  uri?: string;
  /**
   * The preferred mode of transportation.
   */
  travelMode: TravelMode;
  /**
   * A list of days of the week.
   */
  daysOfWeek: DayOfWeek[];
}

/**
 * Parses a string representation of a travel preference to an object.
 *
 * @param uri - The URI of the preference.
 * @param data - The string representation of the travel preference.
 * @returns The parsed travel preference object.
 */
export const parseTravelPreference = (uri: string, data: string): TravelPreference => {

  const content = JSON.parse(data) as object;

  if(
    !('travelMode' in content) ||
    !('daysOfWeek' in content)
  ) {

    throw new Error('Data is missing arguments');

  }

  const { daysOfWeek, travelMode } = content;

  if(
    typeof travelMode !== 'string' ||
    !travelModes.includes(travelMode) ||
    !Array.isArray(daysOfWeek)
  ) {

    throw new Error('Data is missing arguments');

  }

  return {
    uri,
    travelMode,
    daysOfWeek,
  };

};
