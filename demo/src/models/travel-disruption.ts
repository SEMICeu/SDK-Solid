import { DayOfWeek } from './days-of-week';
import { TravelMode, travelModes } from './travel-mode';
import { City, cities } from './travel-route';

/**
 * Represents a travel disruption.
 */
export interface TravelDisruption {
  /**
   * URI that uniquely identifies the travel disruption.
   */
  uri?: string;
  /**
   * Label that explains the nature of the travel disruption.
   */
  label: string;
  /**
   * The mode of transportation impacted by the travel disruption.
   */
  travelMode: TravelMode;
  /**
   * The city from which the disruption starts.
   */
  from: City;
  /**
   * The city until which the disruption ends.
   */
  to: City;
  /**
   * Days of the week on which the given mode of transportation is disrupted.
   */
  daysOfWeek: DayOfWeek[];
}

/**
 * Parses a string representation of a travel disruption.
 *
 * @param uri - URI that uniquely identifies the given disruption.
 * @param data - The string representation of the travel disruption.
 * @returns - A parsed travel disruption.
 */
export const parseTravelDisruption = (uri: string, data: string): TravelDisruption => {

  const content = JSON.parse(data.split('//# sourceMappingURL=')[0]) as object;

  if(
    !('travelMode' in content) ||
    !('to' in content) ||
    !('from' in content) ||
    !('label' in content) ||
    !('daysOfWeek' in content)
  ) {

    throw new Error('Data is missing arguments');

  }

  const { daysOfWeek, travelMode, label, to, from } = content;

  if(
    typeof label !== 'string' ||
    typeof travelMode !== 'string' ||
    !travelModes.includes(travelMode) ||
    typeof from !== 'string' ||
    !cities.includes(from) ||
    typeof to !== 'string' ||
    !cities.includes(to) ||
    !Array.isArray(daysOfWeek)
  ) {

    throw new Error('Data is missing arguments');

  }

  return {
    uri,
    label,
    from,
    to,
    travelMode,
    daysOfWeek,
  };

};
