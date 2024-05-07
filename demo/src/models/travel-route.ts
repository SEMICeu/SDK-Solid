import { TravelMode } from './travel-mode';

/**
 * List of all cities that are supported in the demo.
 */
export const cities = [ 'Brussels', 'Antwerp', 'Ghent' ];

/**
 * Type that defines a city.
 */
export type City = typeof cities[number];

/**
 * A route between two cities for a given mode of transportation.
 */
export interface TravelRoute {
  /**
   * Label that describes the travel route.
   */
  label: string;
  /**
   * The city where the route departs from.
   */
  from: City;
  /**
   * The city where the route arrives.
   */
  to: City;
  /**
   * The mode of transportation used on the route.
   */
  travelMode: TravelMode;
}

/**
 * List of travel routes.
 */
export const travelRoutes: TravelRoute[] = [
  {
    label: 'E19',
    from: 'Antwerp',
    to: 'Brussels',
    travelMode: 'Car',
  },
  {
    label: 'Line 234',
    from: 'Antwerp',
    to: 'Brussels',
    travelMode: 'Bus',
  },
  {
    label: 'IC12',
    from: 'Antwerp',
    to: 'Brussels',
    travelMode: 'Train',
  },
  {
    label: 'E43',
    from: 'Ghent',
    to: 'Brussels',
    travelMode: 'Car',
  },
  {
    label: 'Line 380',
    from: 'Ghent',
    to: 'Brussels',
    travelMode: 'Bus',
  },
  {
    label: 'IC45',
    from: 'Ghent',
    to: 'Brussels',
    travelMode: 'Train',
  },
];
