import { describe, expect, test } from 'vitest';
import { parseTravelDisruption } from './travel-disruption';

describe('parseTravelDisruption', () => {

  test('should correctly parse a travel disruption', () => {

    expect(parseTravelDisruption('https://pods.use.id/foo', JSON.stringify({ travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ], label: 'Foo bar', from: 'Antwerp', to: 'Brussels' })))
      .toStrictEqual({ uri: 'https://pods.use.id/foo', travelMode: 'Bus', daysOfWeek: [ 'Tuesday', 'Wednesday' ], label: 'Foo bar', from: 'Antwerp', to: 'Brussels' });

  });

  test('should throw when daysOfWeek is not set', () => {

    expect(() => parseTravelDisruption('https://pods.use.id/foo', JSON.stringify({ travelMode: 'Bus', label: 'Foo bar', from: 'Antwerp', to: 'Brussels' }))).toThrow();

  });

  test('should throw when daysOfWeek is not an array', () => {

    expect(() => parseTravelDisruption('https://pods.use.id/foo', JSON.stringify({ travelMode: 'Bus', daysOfWeek: 'bla', label: 'Foo bar', from: 'Antwerp', to: 'Brussels' }))).toThrow();

  });

  test('should throw when travelMode is not set', () => {

    expect(() => parseTravelDisruption('https://pods.use.id/foo', JSON.stringify({ travelMode123: 'Bus', label: 'Foo bar', from: 'Antwerp', to: 'Brussels' }))).toThrow();

  });

  test('should throw when travelMode is not a string', () => {

    expect(() => parseTravelDisruption('https://pods.use.id/foo', JSON.stringify({ travelMode: 123, label: 'Foo bar', from: 'Antwerp', to: 'Brussels' }))).toThrow();

  });

  test('should throw when data is not an object', () => {

    expect(() => parseTravelDisruption('https://pods.use.id/foo', 'bla')).toThrow();

  });

});

