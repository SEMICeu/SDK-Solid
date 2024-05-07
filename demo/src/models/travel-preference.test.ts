import { describe, expect, test } from 'vitest';
import { parseTravelPreference } from './travel-preference';

describe('parseTravelPreference', () => {

  test('should correctly parse a travel preference', () => {

    expect(parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] })))
      .toStrictEqual({ uri: 'https://pods.use.id/foo', travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ] });

  });

  test('should throw when daysOfWeek is not set', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ travelMode: 'Bus' }))).toThrow();

  });

  test('should throw when daysOfWeek is not an array', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ travelMode: 'Bus', daysOfWeek: 'bla' }))).toThrow();

  });

  test('should throw when travelMode is not set', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ travelMode123: 'Bus' }))).toThrow();

  });

  test('should throw when travelMode is not a string', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ travelMode: 123 }))).toThrow();

  });

  test('should throw when data is not an object', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', 'bla')).toThrow();

  });

});

