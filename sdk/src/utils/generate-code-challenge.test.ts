import { describe, expect, test } from 'vitest';
import { generateCodeChallenge } from './generate-code-challenge';

describe('generateCodeChallenge', () => {

  test('should conform to PoC', async () => {

    await expect(generateCodeChallenge('zo6yP8H9te4I0lk2Uclcry47yPbTT9jRbdnIZPdMUfazH5iD8vkNw')).resolves.toEqual('hjooUY_1tBlE_dBuCKGUK8XuSRrc_zNByH-roC5sIXA');

  });

  test('should throw when code verifier is an empty string', async () => {

    await expect(generateCodeChallenge('')).rejects.toThrow();

  });

});

