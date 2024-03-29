import { describe, expect, test } from 'vitest';
import { decodeIDToken } from './decode-id-token';

describe('decodeIDToken()', () => {

  test('should decode a valid token', () => {

    const result = decodeIDToken('eyJhbGciOiJFUzI1NiIsImtpZCI6ImQ3NGMxZGZlLTFhNDEtNGEyMC1hNDJkLWZmYzBmMmJkZGE5OCIsInR5cCI6IkpXVCJ9.eyJodHRwczovL3NhbmRib3gudXNlLmlkL3dlYmlkIjoiaHR0cHM6Ly9zYW5kYm94LnVzZS5pZC90ZXN0LTA2MDMtMSIsImlzcyI6Imh0dHBzOi8vc2FuZGJveC5pZHAudXNlLmlkLyIsImF1ZCI6Imh0dHBzOi8vc2FuZGJveC53ZWJpZC5jdWx0dXVycHJvZmllbC5iZS8ud2VsbC1rbm93bi9vYXV0aC1jbGllbnQiLCJpYXQiOjE3MDk3MDU2MjQsImV4cCI6MTcwOTc0MTYyNCwic3ViIjoiZW1haWx8NjVlODA5NzA1OGRlYWUxYjhhMmIxNjRmIiwic2lkIjoiZDFZb3M1QU00RENYRFRldGNiNTRBUnJjSUZ5UFNyeUMiLCJ3ZWJpZCI6Imh0dHBzOi8vc2FuZGJveC51c2UuaWQvdGVzdC0wNjAzLTEiLCJqdGkiOiI5OWNjNTA5Ni05MjY4LTQ2NWEtOTM2My0xYTY2YzhjZDk1ZjIifQ.NM8z2kbe7u4zUF1A7dvHgPBN3ZZc3-UPDygGMlbvAPGIRUKR06yR-sRkuwL9dZzfg_ykOJpznGD67U0dm0p1Sw');
    expect(result).toBeDefined();
    expect(result.payload.webid).toBe('https://sandbox.use.id/test-0603-1');
    expect(result.payload.iss).toBe('https://sandbox.idp.use.id/');

  });

  test('should throw error when decoding an invalid token without three sections', () => {

    expect(() => decodeIDToken('abcsddg')).toThrow();

  });

  test('should throw error when decoding an invalid token with three sections', () => {

    expect(() => decodeIDToken('abcs.ddg.sdfsd')).toThrow();

  });

  test('should throw error when a valid token does not contain a webid', () => {

    expect(() => decodeIDToken('eyJhbGciOiJFUzI1NiIsInR5cCI6ImRwb3Arand0IiwiandrIjp7ImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ4IjoieDdKcU1aQnJSN2N6eUUzYmp1dXBCUGs1NjhJY1I2aTdhdHR1VFdqR0lZTSIsInkiOiJJN3BRTFYtcVRnUWpvOWJlV2hHbXFZSEcyU0RVLUlsQ0NXYTZMbS13S3RnIiwiYWxnIjoiRVMyNTYifX0.eyJodG0iOiJQT1NUIiwiaHR1IjoiaHR0cHM6Ly9pZHAuc2FuZGJveC11c2UuaWQvb2F1dGgvdG9rZW4iLCJqdGkiOiI0Mjk4ZTNiYy05ZjhmLTRkY2EtOWY5Zi0zNzdkYzA2NDc1NjMiLCJpYXQiOjE3MDk3MDY1NTZ9.hUMPXmkgXt5PE9CdVZsmVQ9zKQtc8QVYWDGMf5X0pR2OJ0hxTKkPdxMX33J-3-_GgAsH63C8iyR-OQw0ofepYQ')).toThrow();

  });

  test('should throw error when a valid token does not contain a iss', () => {

    expect(() => decodeIDToken('eyJhbGciOiJFUzI1NiIsImtpZCI6ImQ3NGMxZGZlLTFhNDEtNGEyMC1hNDJkLWZmYzBmMmJkZGE5OCIsInR5cCI6IkpXVCJ9.eyJodHRwczovL3NhbmRib3gudXNlLmlkL3dlYmlkIjoiaHR0cHM6Ly9zYW5kYm94LnVzZS5pZC90ZXN0LTA2MDMtMSIsImF1ZCI6Imh0dHBzOi8vc2FuZGJveC53ZWJpZC5jdWx0dXVycHJvZmllbC5iZS8ud2VsbC1rbm93bi9vYXV0aC1jbGllbnQiLCJpYXQiOjE3MDk3MDU2MjQsImV4cCI6MTcwOTc0MTYyNCwic3ViIjoiZW1haWx8NjVlODA5NzA1OGRlYWUxYjhhMmIxNjRmIiwic2lkIjoiZDFZb3M1QU00RENYRFRldGNiNTRBUnJjSUZ5UFNyeUMiLCJ3ZWJpZCI6Imh0dHBzOi8vc2FuZGJveC51c2UuaWQvdGVzdC0wNjAzLTEiLCJqdGkiOiI5OWNjNTA5Ni05MjY4LTQ2NWEtOTM2My0xYTY2YzhjZDk1ZjIifQ.Ha-WgHhGC383Md5O8N4eeUJVB987m-MhOiLPMlgIHX1iP7bJH3PEDhy1LCSstaV7ZWVc2gJbUxWb5RqXS40TDA')).toThrow();

  });

});
