import { describe, expect, test } from 'vitest';
import { parseTravelPreference } from './travel-preference';

describe('parseTravelPreference', () => {

  test('should correctly parse a travel preference', () => {

    expect(parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ modeOfTransportation: 'Foo bar' })))
      .toStrictEqual({ uri: 'https://pods.use.id/foo', modeOfTransportation: 'Foo bar' });

  });

  test('should throw when modeOfTransportation is not set', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ modeOfTransportation123: 'Foo bar' }))).toThrow();

  });

  test('should throw when modeOfTransportation is not a string', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', JSON.stringify({ modeOfTransportation: 123 }))).toThrow();

  });

  test('should throw when data is not an object', () => {

    expect(() => parseTravelPreference('https://pods.use.id/foo', 'bla')).toThrow();

  });

});

