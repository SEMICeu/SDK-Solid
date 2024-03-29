import { expect, test } from 'vitest';
import { log } from './log';

test('log should not throw', () => {

  expect(log).not.toThrow();

});
